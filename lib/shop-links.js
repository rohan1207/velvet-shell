/** Allowed shop category query values — hero/banner CTAs must use these only. */
export const SHOP_CATEGORIES = [
  'earrings',
  'bracelets',
  'necklaces',
  'pendants',
  'accessories', // brooches + chains + chokers
  // 'chokers', // under Accessories
  'chains',
  'rings',
  'brooches',
  'cuffs',
  'charms',
  'anklets',
  'sets',
];

const ALLOWED = new Set(SHOP_CATEGORIES);

/**
 * Safe category URL for banner CTAs.
 * Never returns a product PDP — only /shop or /shop?category=…
 */
export function shopCategoryHref(category) {
  const slug = String(category || '')
    .trim()
    .toLowerCase();
  if (!slug || slug === 'all' || slug === 'shop') return '/shop';
  if (!ALLOWED.has(slug)) return '/shop';
  return `/shop?category=${encodeURIComponent(slug)}`;
}

export function shopHref() {
  return '/shop';
}

export function giftingHref() {
  return '/gifting';
}
