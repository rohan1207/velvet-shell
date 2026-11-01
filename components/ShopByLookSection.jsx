import ShopByLook from '@/components/ShopByLook';
import { listActiveSets } from '@/lib/sets';

/** Pearl (S01) + Daisy chain (S02) — same cards as the Sets shop grid. */
const FEATURED_SLUGS = [
  'fairy-like-fringed-collarbone-chain-bracelet-with-heart-shaped-pearl-bea',
  'daisy-necklace-ring-bracelet-set-with-fine-chain-links-s02',
];

/**
 * Server wrapper — loads live set prices (full-set / price_override) like the shop sets grid.
 */
export default async function ShopByLookSection() {
  let featuredSets = [];
  try {
    const sets = await listActiveSets();
    const bySlug = new Map((sets || []).map((s) => [s.slug, s]));
    featuredSets = FEATURED_SLUGS.map((slug) => bySlug.get(slug))
      .filter(Boolean)
      .map((set) => ({
        slug: set.slug,
        name: set.name,
        // Full set price: price_override when set, otherwise sum of members (same as sets page)
        price: set.price,
        image: set.image,
        href: `/sets/${set.slug}`,
        pieceCount: Array.isArray(set.members) ? set.members.length : 0,
        badge: set.badge || '',
        outOfStock: set.outOfStock,
        members: (set.members || []).map((m) => ({
          slug: m.slug,
          name: m.name,
          price: m.price,
          image: m.image,
        })),
      }));
  } catch {
    featuredSets = [];
  }

  return <ShopByLook featuredSets={featuredSets} />;
}
