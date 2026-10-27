import { createAdminSupabase } from '@/lib/supabase/admin';
import { allowInsecureTlsIfConfigured } from '@/lib/supabase/tls';
import { normalizeShipping } from '@/lib/catalog/shipping';
import { finishFromColor, neckCategoryFromName } from '@/lib/catalog/normalize';
import { sortByColourPriority } from '@/lib/catalog/color-order';

/**
 * Map Supabase catalog → storefront product shape used by ProductCard / PDP.
 */
export function mapRemoteToStorefront(families) {
  const products = [];
  const colorFamilies = [];

  for (const family of families || []) {
    const allVariants = family.variants || [];
    // Shop cards / PDP media: active colours. Swatch families: every colour admin saved.
    const variants = allVariants.filter((v) => v.active !== false);
    if (!variants.length && !allVariants.length) continue;
    if (!variants.length) continue;

    const primary =
      variants.find((v) => v.isPrimary) ||
      allVariants.find((v) => v.isPrimary) ||
      variants[0] ||
      allVariants[0];
    const shipping = normalizeShipping(family.shipping);
    const familyCategory = neckCategoryFromName(
      family.name,
      family.slug,
      family.category,
    );

    function pushProduct(v, { active }) {
      const galleryUrls = (v.gallery || [])
        .map((g) => {
          if (typeof g === 'string') return g.trim();
          if (g && typeof g.url === 'string') return g.url.trim();
          return '';
        })
        .filter((url) => url && !/\.(mp4|webm|mov)(\?|$)/i.test(url));
      const PLACEHOLDER = '/images/product-placeholder.svg';
      const hero = String(v.heroUrl || '').trim() || galleryUrls[0] || PLACEHOLDER;
      const gallery = galleryUrls.length ? galleryUrls : hero !== PLACEHOLDER ? [hero] : [];
      const hoverImage =
        galleryUrls.find((url) => url && url !== hero) || gallery[1] || null;
      const finish = finishFromColor(v.material, v.colorLabel);
      products.push({
        slug: v.slug,
        name: family.name,
        collection: family.collection || family.collection_slug || '',
        category: familyCategory,
        price: v.price || 0,
        limited: false,
        madeToOrder: false,
        badge: family.badge || '',
        metal: finish ? [finish] : [],
        material: v.material || '',
        sizes: (() => {
          const tags = Array.isArray(v.sizeTags)
            ? v.sizeTags.map((t) => String(t || '').trim()).filter(Boolean)
            : [];
          if (tags.length) return [...new Set(tags)];
          if (v.length) return [v.length];
          return ['One size'];
        })(),
        image: hero,
        hoverImage,
        gallery,
        media: v.gallery || [],
        description: v.description || '',
        story: v.story || '',
        details: Array.isArray(v.features) ? v.features : [],
        care: v.care || '',
        reviews: v.reviews || { rating: 0, count: 0 },
        shipping,
        familyId: family.id,
        familySlug: family.slug,
        recommendedFamilyIds: family.recommendedFamilyIds || family.recommended_family_ids || [],
        customizationEnabled: !!family.customizationEnabled,
        customizationFields: Array.isArray(family.customizationFields)
          ? family.customizationFields
          : [],
        colorLabel: v.colorLabel,
        colorSwatch: v.colorSwatch,
        stock: Number(v.stock) || 0,
        outOfStock: !!v.outOfStock || Number(v.stock) <= 0,
        active,
        sku: Array.isArray(v.features)
          ? String(v.features.find((f) => /^SKU\s/i.test(f)) || '').replace(/^SKU\s+/i, '')
          : '',
        source: 'supabase',
      });
    }

    // Active first (shop), then inactive siblings so colour swatches can still resolve
    for (const v of variants) pushProduct(v, { active: true });
    for (const v of allVariants) {
      if (v.active !== false) continue;
      pushProduct(v, { active: false });
    }

    const swatchSource =
      allVariants.length > 1 || family.hasColorVariants ? allVariants : variants;
    if (swatchSource.length > 1) {
      const orderedVariants = sortByColourPriority(
        swatchSource.map((v) => ({
          slug: v.slug,
          label: v.colorLabel,
          swatch: v.colorSwatch,
          active: v.active !== false,
        })),
        (v) => v.label,
      );
      // Prefer Gold (then Silver) as the listing / card primary so swatches
      // and the image below cards stay Gold → Silver → rest everywhere.
      const preferredPrimary =
        orderedVariants.find((v) => v.active !== false)?.slug ||
        orderedVariants[0]?.slug ||
        primary.slug;
      colorFamilies.push({
        id: family.slug,
        primary: preferredPrimary,
        variants: orderedVariants,
      });
    }
  }

  return { products, colorFamilies };
}

export async function fetchRemoteCatalog() {
  allowInsecureTlsIfConfigured();
  try {
    const db = createAdminSupabase();
    const { data: families, error } = await db
      .from('product_families')
      .select('*')
      .eq('status', 'active')
      .eq('active', true)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    if (!families?.length) return { products: [], colorFamilies: [], source: 'empty' };

    const ids = families.map((f) => f.id);
    // Load every colour row (incl. inactive) so admin-added siblings still drive swatches
    const { data: variants, error: vErr } = await db
      .from('product_color_variants')
      .select('*')
      .in('family_id', ids)
      .order('sort_order', { ascending: true });
    if (vErr) throw vErr;

    const byFamily = new Map();
    for (const v of variants || []) {
      const list = byFamily.get(v.family_id) || [];
      list.push({
        id: v.id,
        slug: v.slug,
        colorLabel: v.color_label,
        colorSwatch: v.color_swatch,
        isPrimary: v.is_primary,
        price: v.price,
        description: v.description,
        story: v.story || '',
        care: v.care || '',
        features: v.features,
        material: v.material,
        length: v.length_label,
        sizeTags: Array.isArray(v.size_tags)
          ? v.size_tags.map((t) => String(t || '').trim()).filter(Boolean)
          : [],
        reviews: v.reviews,
        heroUrl: v.hero_url,
        gallery: v.gallery,
        stock: v.stock,
        outOfStock: v.out_of_stock,
        active: v.active,
      });
      byFamily.set(v.family_id, list);
    }

    const shaped = families.map((f) => ({
      id: f.id,
      slug: f.slug,
      name: f.name,
      category: f.category,
      collection: f.collection_slug,
      hasColorVariants: f.has_color_variants,
      customizationEnabled: !!f.customization_enabled,
      customizationFields: Array.isArray(f.customization_fields)
        ? f.customization_fields
            .map((field, index) => ({
              id: String(field?.id || `field_${index + 1}`),
              label: String(field?.label || '').trim(),
              inputType: ['text', 'number', 'textarea'].includes(field?.inputType)
                ? field.inputType
                : 'text',
              required: !!field?.required,
              placeholder: String(field?.placeholder || '').trim(),
            }))
            .filter((field) => field.label)
        : [],
      shipping: f.shipping,
      recommendedFamilyIds: f.recommended_family_ids,
      badge: f.badge,
      variants: byFamily.get(f.id) || [],
    }));

    const { data: collectionRows } = await db
      .from('collections')
      .select('slug, name, line')
      .order('name', { ascending: true });

    const { data: categoryRows } = await db
      .from('shop_categories')
      .select('slug, name, line, banner_url, sort_order')
      .eq('active', true)
      .order('sort_order', { ascending: true });

    const mapped = mapRemoteToStorefront(shaped);
    return {
      ...mapped,
      collections: collectionRows || [],
      categories: (categoryRows || []).map((c) => ({
        slug: c.slug,
        name: c.name,
        line: c.line || '',
        banner: c.banner_url || '',
      })),
      source: 'supabase',
    };
  } catch (err) {
    console.error('[catalog remote]', err.message || err);
    return {
      products: [],
      colorFamilies: [],
      collections: [],
      categories: [],
      source: 'error',
      error: err.message,
    };
  }
}
