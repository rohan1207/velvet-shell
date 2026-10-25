import {
  products as dummyProducts,
  colorFamilies as dummyFamilies,
  collections as dummyCollections,
  categories as dummyCategories,
  getListingProducts as getDummyListing,
  getProduct as getDummyProduct,
  getRelated as getDummyRelated,
  getColorFamily as getDummyColorFamily,
  getProductVariants as getDummyVariants,
} from '@/lib/products';
import { getRemoteCatalogCached } from '@/lib/catalog/cached';
import {
  ensureNeckCategories,
  normalizeProducts,
} from '@/lib/catalog/normalize';
import { sortByColourPriority } from '@/lib/catalog/color-order';

function mergeCategories(remoteCategories = []) {
  const bySlug = new Map(dummyCategories.map((c) => [c.slug, c]));
  const remoteList = remoteCategories?.length ? remoteCategories : dummyCategories;
  const merged = remoteList.map((c) => {
    const local = bySlug.get(c.slug);
    return {
      slug: c.slug,
      name: c.name || local?.name || c.slug,
      line: c.line || local?.line || '',
      banner: c.banner || local?.banner || local?.banners?.[0]?.src || '',
      banners: local?.banners || (c.banner ? [{ src: c.banner, alt: c.name }] : []),
    };
  });
  // Keep any local-only categories (e.g. banners) that remote omitted
  for (const local of dummyCategories) {
    if (!merged.some((c) => c.slug === local.slug)) {
      merged.push(local);
    }
  }
  return ensureNeckCategories(merged);
}

/**
 * Prefer Supabase catalog when it has active products; else dummy `lib/products.js`.
 * Cached ~60s on the server so nav / PDP clicks are not waiting on Supabase every time.
 */
export async function loadCatalog() {
  const remote = await getRemoteCatalogCached();
  if (remote.products?.length) {
    return {
      products: normalizeProducts(remote.products),
      colorFamilies: remote.colorFamilies,
      collections: remote.collections?.length ? remote.collections : dummyCollections,
      categories: mergeCategories(remote.categories),
      source: 'supabase',
    };
  }
  return {
    products: normalizeProducts(dummyProducts),
    colorFamilies: dummyFamilies,
    collections: dummyCollections,
    categories: ensureNeckCategories(dummyCategories),
    source: remote.source === 'error' ? 'dummy' : 'dummy',
    error: remote.error,
  };
}

export function listingFromCatalog(catalog) {
  if (catalog.source === 'dummy') return getDummyListing(catalog.products);
  const hidden = new Set();
  for (const family of catalog.colorFamilies || []) {
    for (const variant of family.variants || []) {
      if (variant.slug !== family.primary) hidden.add(variant.slug);
    }
  }
  return catalog.products.filter(
    (p) => p.active !== false && !hidden.has(p.slug),
  );
}

export function productFromCatalog(catalog, slug) {
  if (catalog.source === 'dummy') return getDummyProduct(slug);
  return catalog.products.find((p) => p.slug === slug) || null;
}

export function relatedFromCatalog(catalog, slug, count = 4) {
  if (catalog.source === 'dummy') return getDummyRelated(slug, count);
  const current = productFromCatalog(catalog, slug);
  const listing = listingFromCatalog(catalog);
  if (!current) return listing.slice(0, count);
  const family = (catalog.colorFamilies || []).find(
    (f) =>
      f.primary === slug || f.variants?.some((v) => v.slug === slug)
  );
  const exclude = new Set([
    slug,
    ...(family?.variants?.map((v) => v.slug) || []),
  ]);
  const recommended = new Set(current.recommendedFamilyIds || []);
  return listing
    .filter((item) => !exclude.has(item.slug))
    .sort((a, b) => {
      const aRec = recommended.has(a.familyId) ? 3 : 0;
      const bRec = recommended.has(b.familyId) ? 3 : 0;
      const aScore =
        aRec +
        (a.collection === current.collection ? 2 : 0) +
        (a.category === current.category ? 1 : 0);
      const bScore =
        bRec +
        (b.collection === current.collection ? 2 : 0) +
        (b.category === current.category ? 1 : 0);
      return bScore - aScore;
    })
    .slice(0, count);
}

export function colorFamilyFromCatalog(catalog, slug) {
  if (catalog.source === 'dummy') return getDummyColorFamily(slug);
  return (
    (catalog.colorFamilies || []).find(
      (f) =>
        f.primary === slug || f.variants?.some((v) => v.slug === slug)
    ) || null
  );
}

export function variantsFromCatalog(catalog, slug) {
  if (catalog.source === 'dummy') return getDummyVariants(slug);
  const family = colorFamilyFromCatalog(catalog, slug);
  if (family) {
    const resolved = sortByColourPriority(
      family.variants
        .map((variant) => {
          const product = productFromCatalog(catalog, variant.slug);
          if (!product) return null;
          return { ...variant, product };
        })
        .filter(Boolean),
      (v) => v.label || v.product?.colorLabel,
    );
    if (resolved.length) return resolved;
  }

  // Fallback: group by familyId when colorFamilies missed a row (admin-added colours)
  const current = productFromCatalog(catalog, slug);
  if (!current?.familyId) return [];
  const siblings = (catalog.products || []).filter(
    (p) => p.familyId === current.familyId,
  );
  if (siblings.length < 2) return [];
  return sortByColourPriority(
    siblings.map((product) => ({
      slug: product.slug,
      label: product.colorLabel,
      swatch: product.colorSwatch,
      active: product.active !== false,
      product,
    })),
    (v) => v.label || v.product?.colorLabel,
  );
}
