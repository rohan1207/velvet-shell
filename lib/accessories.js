/** Brooches, chains, and chokers all live under Accessories. */
export const ACCESSORY_CATEGORIES = ['brooches', 'chains', 'chokers'];

export const ACCESSORY_META = {
  slug: 'accessories',
  name: 'Accessories',
  line: 'Brooches, chains, and chokers — finishing pieces with presence.',
  banner: '/images/banners/chains/gold-chain.jpg',
  banners: [
    {
      src: '/images/banners/chains/gold-chain.jpg',
      alt: 'Fine gold chain on stone with yellow blossoms',
    },
    {
      src: '/images/banners/brooches/gold-silver-flower.jpg',
      alt: 'Gold and silver flower brooch on stone among white blossoms',
    },
  ],
};

export function isAccessoryProductCategory(slug = '') {
  return ACCESSORY_CATEGORIES.includes(String(slug || '').toLowerCase());
}

export function isAccessoriesShopCategory(slug = '') {
  return String(slug || '').toLowerCase() === 'accessories';
}

/**
 * Shop filter: Accessories = brooches + chains + chokers;
 * Chains = chains + chokers (same family); Brooches = brooches alone.
 */
export function productMatchesShopCategory(productCategory, shopCategory) {
  const shop = String(shopCategory || '').toLowerCase();
  const product = String(productCategory || '').toLowerCase();
  if (!shop || shop === 'all') return true;
  if (shop === 'accessories') return isAccessoryProductCategory(product);
  // Chains page includes chokers — they are the same family in this shop
  if (shop === 'chains') return product === 'chains' || product === 'chokers';
  return product === shop;
}

/** Admin / UI label for accessory product categories. */
export function accessoryDisplayLabel(slug = '') {
  const s = String(slug || '').toLowerCase();
  if (s === 'brooches') return 'Accessories · Brooches';
  if (s === 'chains') return 'Accessories · Chains & Chokers';
  if (s === 'chokers') return 'Accessories · Chains & Chokers';
  if (s === 'accessories') return 'Accessories';
  return '';
}

/**
 * Shop category pills: one Accessories entry; keep Chains / Brooches for
 * explicit filters; hide standalone Chokers (included under Accessories).
 */
export function withAccessoriesShopCategories(categories = []) {
  const list = (categories || []).filter(
    (c) => c?.slug && c.slug !== 'chokers',
  );
  const withoutPieces = list.filter(
    (c) => c.slug !== 'brooches' && c.slug !== 'chains',
  );
  const hasAccessoryProducts =
    list.some((c) => c.slug === 'brooches' || c.slug === 'chains') ||
    (categories || []).some((c) => c.slug === 'chokers');

  if (!hasAccessoryProducts && !list.some((c) => c.slug === 'accessories')) {
    return list;
  }

  // Always use the curated Accessories banners (chains + brooches)
  const accessories = { ...ACCESSORY_META };
  const chains = list.find((c) => c.slug === 'chains');
  const brooches = list.find((c) => c.slug === 'brooches');

  const preferred = [
    'earrings',
    'bracelets',
    'necklaces',
    'pendants',
    'accessories',
    'chains',
    'brooches',
    'rings',
    'anklets',
    'sets',
  ];
  const bySlug = new Map(withoutPieces.map((c) => [c.slug, c]));
  bySlug.set('accessories', accessories);
  if (chains) bySlug.set('chains', chains);
  if (brooches) bySlug.set('brooches', brooches);

  const ordered = [];
  const seen = new Set();
  for (const slug of preferred) {
    if (bySlug.has(slug)) {
      ordered.push(bySlug.get(slug));
      seen.add(slug);
    }
  }
  for (const [slug, cat] of bySlug) {
    if (!seen.has(slug)) ordered.push(cat);
  }
  return ordered;
}
