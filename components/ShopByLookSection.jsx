import ShopByLook from '@/components/ShopByLook';
import { listActiveSets } from '@/lib/sets';

const FEATURED_SLUGS = [
  'daisy-flower-jewellery-set-s07',
  'dolphin-jewellery-set-s06',
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
        line: 'Complete set',
        outOfStock: set.outOfStock,
      }));
  } catch {
    featuredSets = [];
  }

  return <ShopByLook featuredSets={featuredSets} />;
}
