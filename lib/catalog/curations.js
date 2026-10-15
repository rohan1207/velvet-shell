import { createAdminSupabase } from '@/lib/supabase/admin';
import { allowInsecureTlsIfConfigured } from '@/lib/supabase/tls';

const FALLBACK = {
  'festive-edit': {
    slug: 'festive-edit',
    eyebrow: 'Seasonal',
    title: 'Festive Edit',
    line: 'A celebratory selection — blooms, metals and forms for the season’s quiet shine.',
    productSlugs: [
      'glitter-pearl-bracelet',
      'fairy-fringe-necklace',
      'starry-mermaid-pearl-choker',
      'pearl-zircon-clavicle',
      'double-pearl-clip-ons',
      'palace-bell-anklet',
      'green-leaves-set',
      'sweet-flower-set',
      'frost-bloom',
      'snowflake-jewellery-set',
      'butterfly-jewellery-set',
      'shell-hoop-earrings',
    ],
  },
  'best-sellers': {
    slug: 'best-sellers',
    eyebrow: 'Best sellers',
    title: 'Best of Velvet Shell',
    line: 'The pieces guests return for — a quiet house edit across form and metal.',
    productSlugs: [
      'soft-rain-floral-drops',
      'freshwater-pearl-studs',
      'lotus-chain-necklace',
      'daisy-day-studs',
      'clover-pearl-studs',
      'honeybee-studs',
      'mermaid-double-pearl-ring',
      'birds-on-branch-bracelet',
      'pearl-pendant-necklace',
      'chrysanthemum-open-ring',
      'bamboo-knot-bracelet',
      'butterfly-layered-necklace',
    ],
  },
};

/**
 * Load a homepage curation strip. Falls back to legacy hardcoded lists if the table is missing.
 */
export async function fetchCuration(slug) {
  const fallback = FALLBACK[slug] || { slug, eyebrow: '', title: '', line: '', productSlugs: [] };
  allowInsecureTlsIfConfigured();
  try {
    const db = createAdminSupabase();
    const { data, error } = await db
      .from('homepage_curations')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();
    if (error) throw error;
    if (!data) return fallback;
    return {
      slug: data.slug,
      eyebrow: data.eyebrow || fallback.eyebrow,
      title: data.title || fallback.title,
      line: data.line || fallback.line,
      productSlugs: Array.isArray(data.product_slugs) ? data.product_slugs.map(String) : [],
    };
  } catch (err) {
    console.error('[curations]', err.message || err);
    return fallback;
  }
}

/**
 * Resolve curation product_slugs against live catalog (family slug or variant slug).
 */
export function resolveCurationProducts(products, productSlugs, limit = 12) {
  if (!products?.length) return [];
  const bySlug = new Map(products.map((p) => [p.slug, p]));
  const byFamily = new Map(products.map((p) => [p.familySlug, p]));
  const chosen = (productSlugs || [])
    .map((s) => bySlug.get(s) || byFamily.get(s))
    .filter(Boolean);
  // Dedupe by slug while keeping order
  const seen = new Set();
  const ordered = [];
  for (const p of chosen) {
    if (seen.has(p.slug)) continue;
    seen.add(p.slug);
    ordered.push(p);
  }
  return ordered.slice(0, limit);
}
