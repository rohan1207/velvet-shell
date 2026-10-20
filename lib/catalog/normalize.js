/**
 * Catalog helpers: finish labels from colour, necklace sub-categories from name.
 */

const NECK_CATEGORIES = new Set(['necklaces', 'pendants', 'chokers', 'chains']);

export const NECK_CATEGORY_META = [
  {
    slug: 'necklaces',
    name: 'Necklaces',
    line: 'Floral forms worn close to the collarbone.',
    banner: '/images/banners/necklaces/bamboo.jpg',
  },
  {
    slug: 'pendants',
    name: 'Pendants',
    line: 'Motifs worn as a single quiet focus.',
    banner: '/images/banners/necklaces/pomegranate.jpg',
  },
  {
    slug: 'chokers',
    name: 'Chokers',
    line: 'Close-to-the-neck forms with a soft hold.',
    banner: '/images/banners/necklaces/flower.jpg',
  },
  {
    slug: 'chains',
    name: 'Chains',
    line: 'Fine chains for layering and everyday light.',
    banner: '/images/banners/necklaces/bamboo.jpg',
  },
];

/**
 * Client finish copy:
 * - Silver → Sterling Silver
 * - Gold → 18K Gold Plated
 */
export function finishFromColor(material = '', colorLabel = '') {
  const label = String(colorLabel || '').toLowerCase().trim();
  const mat = String(material || '').toLowerCase().trim();

  if (label && label !== 'default') {
    if (/\bgold\b/.test(label)) return '18K Gold Plated';
    if (/\bsilver\b|sterling|925|s925/.test(label)) return 'Sterling Silver';
  }

  if (/\bgold\b/.test(mat) && !/\bsilver\b|925|sterling/.test(mat)) {
    return '18K Gold Plated';
  }
  if (/sterling|s\s*925|\b925\b|s925|\bsilver\b/.test(mat)) {
    return 'Sterling Silver';
  }

  if (material) return String(material).trim();
  return '';
}

/**
 * Pendant / choker / chain from product name or slug.
 * Only applies to neck-related pieces (keeps rings/earrings untouched).
 */
export function neckCategoryFromName(name = '', slug = '', currentCategory = '') {
  const hay = `${name} ${slug}`.toLowerCase();
  const looksNeck =
    NECK_CATEGORIES.has(currentCategory) ||
    /\b(necklace|pendant|choker|chain)\b/.test(hay);

  if (!looksNeck) return currentCategory || '';

  if (/\bchoker\b/.test(hay)) return 'chokers';
  if (/\bpendant\b/.test(hay)) return 'pendants';
  if (/\bchain\b/.test(hay) && !/\bbracelet\b/.test(hay)) return 'chains';

  if (NECK_CATEGORIES.has(currentCategory) && currentCategory !== 'necklaces') {
    return currentCategory;
  }
  return 'necklaces';
}

/** Ensure pendants / chokers / chains exist in the shop category list. */
export function ensureNeckCategories(categories = []) {
  const bySlug = new Map((categories || []).map((c) => [c.slug, c]));
  for (const meta of NECK_CATEGORY_META) {
    if (!bySlug.has(meta.slug)) {
      bySlug.set(meta.slug, {
        slug: meta.slug,
        name: meta.name,
        line: meta.line,
        banner: meta.banner || '',
        banners: meta.banner ? [{ src: meta.banner, alt: meta.name }] : [],
      });
    } else {
      const existing = bySlug.get(meta.slug);
      const banner = existing.banner || meta.banner || '';
      bySlug.set(meta.slug, {
        ...existing,
        name: existing.name || meta.name,
        line: existing.line || meta.line,
        banner,
        banners:
          existing.banners?.length
            ? existing.banners
            : banner
              ? [{ src: banner, alt: existing.name || meta.name }]
              : [],
      });
    }
  }

  const preferred = [
    'earrings',
    'bracelets',
    'necklaces',
    'pendants',
    'chokers',
    'chains',
    'rings',
    'brooches',
    'anklets',
    'sets',
  ];
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

/** Apply finish + neck category normalisation across a product list. */
export function normalizeProducts(products = []) {
  return (products || []).map((p) => {
    const finish = finishFromColor(p.metal?.[0] || p.material || '', p.colorLabel);
    const category = neckCategoryFromName(p.name, p.slug, p.category);
    return {
      ...p,
      category: category || p.category,
      metal: finish ? [finish] : p.metal || [],
    };
  });
}
