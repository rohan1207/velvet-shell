/**
 * Storefront jewellery sets (bundles of existing products).
 */
import { createAdminSupabase } from '@/lib/supabase/admin';
import { allowInsecureTlsIfConfigured } from '@/lib/supabase/tls';
import { normalizeShipping } from '@/lib/catalog/shipping';

function galleryUrls(gallery) {
  if (!Array.isArray(gallery)) return [];
  return gallery
    .map((g) => {
      if (typeof g === 'string') return g.trim();
      if (g && typeof g.url === 'string') return g.url.trim();
      return '';
    })
    .filter((url) => url && !/\.(mp4|webm|mov)(\?|$)/i.test(url));
}

function mapMember(row) {
  const family = row.product_families || {};
  const variant = row.product_color_variants || {};
  const stock = Number(variant.stock);
  const out =
    variant.out_of_stock === true || (Number.isFinite(stock) && stock <= 0);
  const g = galleryUrls(variant.gallery);
  const hero = String(variant.hero_url || '').trim() || g[0] || '';
  return {
    familyId: row.family_id,
    variantId: row.variant_id,
    slug: variant.slug || family.slug || '',
    name: family.name || '',
    category: family.category || '',
    colorLabel: variant.color_label || '',
    price: Number(variant.price) || 0,
    stock: Number.isFinite(stock) ? stock : 0,
    outOfStock: out,
    image: hero,
    gallery: g.length ? g : hero ? [hero] : [],
  };
}

function shapeSet(row, itemRows = []) {
  const members = (itemRows || []).map(mapMember).filter((m) => m.slug);
  const sum = members.reduce((s, m) => s + m.price, 0);
  const override =
    row.price_override == null ? null : Math.max(0, Number(row.price_override) || 0);
  const price = override != null ? override : sum;
  const outOfStock = members.length ? members.some((m) => m.outOfStock) : true;
  const g = galleryUrls(row.gallery);
  const hero = String(row.hero_url || '').trim() || g[0] || '/images/product-placeholder.svg';
  return {
    id: row.id,
    setCode: row.set_code || '',
    slug: row.slug,
    name: row.name,
    description: row.description || '',
    material: row.material || '',
    design: row.design || '',
    typeLabel: row.type_label || '',
    colour: row.colour || '',
    setSku: row.set_sku || '',
    badge: row.badge || '',
    price,
    membersSum: sum,
    priceOverride: override,
    image: hero,
    hoverImage: g.find((u) => u !== hero) || null,
    gallery: g.length ? g : [hero],
    shipping: normalizeShipping(row.shipping),
    outOfStock,
    members,
    category: 'sets',
    kind: 'set',
    source: 'supabase',
  };
}

async function loadItems(db, setIds) {
  if (!setIds.length) return new Map();
  const { data, error } = await db
    .from('product_set_items')
    .select(
      `*,
      product_families(id,slug,name,category),
      product_color_variants(id,slug,color_label,price,stock,out_of_stock,hero_url,gallery)`,
    )
    .in('set_id', setIds)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  const map = new Map();
  for (const row of data || []) {
    const list = map.get(row.set_id) || [];
    list.push(row);
    map.set(row.set_id, list);
  }
  return map;
}

export async function listActiveSets() {
  allowInsecureTlsIfConfigured();
  try {
    const db = createAdminSupabase();
    const { data, error } = await db
      .from('product_sets')
      .select('*')
      .eq('status', 'active')
      .eq('active', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });
    if (error) throw error;
    const ids = (data || []).map((r) => r.id);
    const items = await loadItems(db, ids);
    return (data || []).map((row) => shapeSet(row, items.get(row.id) || []));
  } catch (err) {
    console.error('[sets] listActiveSets', err.message || err);
    return [];
  }
}

export async function getSetBySlug(slug) {
  allowInsecureTlsIfConfigured();
  const db = createAdminSupabase();
  const { data: row, error } = await db
    .from('product_sets')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'active')
    .eq('active', true)
    .maybeSingle();
  if (error) throw error;
  if (!row) return null;
  const items = await loadItems(db, [row.id]);
  return shapeSet(row, items.get(row.id) || []);
}

/** Card shape compatible with ProductCard-ish listing */
export function setToListingCard(set) {
  return {
    slug: set.slug,
    name: set.name,
    category: 'sets',
    collection: '',
    price: set.price,
    image: set.image,
    hoverImage: set.hoverImage,
    gallery: set.gallery,
    badge: set.badge || (set.outOfStock ? 'Out of stock' : ''),
    outOfStock: set.outOfStock,
    kind: 'set',
    href: `/sets/${set.slug}`,
    metal: set.material ? [set.material] : [],
    sizes: ['One size'],
    description: set.description,
    source: 'set',
  };
}
