import { createAdminSupabase } from '@/lib/supabase/admin';
import { allowInsecureTlsIfConfigured } from '@/lib/supabase/tls';
import { normalizeShipping } from '@/lib/catalog/shipping';
import { finishFromColor, neckCategoryFromName } from '@/lib/catalog/normalize';

/**
 * Map Supabase catalog → storefront product shape used by ProductCard / PDP.
 */
export function mapRemoteToStorefront(families) {
  const products = [];
  const colorFamilies = [];

  for (const family of families || []) {
    const variants = (family.variants || []).filter((v) => v.active !== false);
    if (!variants.length) continue;

    const primary = variants.find((v) => v.isPrimary) || variants[0];
    const shipping = normalizeShipping(family.shipping);
    const familyCategory = neckCategoryFromName(
      family.name,
      family.slug,
      family.category,
    );

    for (const v of variants) {
      const galleryUrls = (v.gallery || [])
        .filter((g) => g?.url && g.kind !== 'video')
        .map((g) => g.url);
      const PLACEHOLDER = '/images/product-placeholder.svg';
      const hero = v.heroUrl || galleryUrls[0] || PLACEHOLDER;
      const gallery = galleryUrls.length ? galleryUrls : [hero];
      const hoverImage =
        galleryUrls.find((url) => url && url !== hero) || gallery[1] || null;
      const finish = finishFromColor(v.material, v.colorLabel);
      products.push({
        slug: v.slug,
        name:
          family.hasColorVariants && v.colorLabel && v.colorLabel !== 'Default'
            ? `${family.name} — ${v.colorLabel}`
            : family.name,
        collection: family.collection || family.collection_slug || '',
        category: familyCategory,
        price: v.price || 0,
        limited: false,
        madeToOrder: false,
        badge: family.badge || '',
        metal: finish ? [finish] : [],
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
        sku: Array.isArray(v.features)
          ? String(v.features.find((f) => /^SKU\s/i.test(f)) || '').replace(/^SKU\s+/i, '')
          : '',
        source: 'supabase',
      });
    }

    if (variants.length > 1) {
      colorFamilies.push({
        id: family.slug,
        primary: primary.slug,
        variants: variants.map((v) => ({
          slug: v.slug,
          label: v.colorLabel,
          swatch: v.colorSwatch,
        })),
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
    const { data: variants, error: vErr } = await db
      .from('product_color_variants')
      .select('*')
      .in('family_id', ids)
      .eq('active', true)
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
