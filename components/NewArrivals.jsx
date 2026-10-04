'use client';

import { useMemo } from 'react';
import { getProduct, products } from '@/lib/products';
import PinnedProductStrip from '@/components/PinnedProductStrip';

const PREFERRED = [
  'dripping-honey-bee-earrings',
  'crystal-flower-in-rain-ring',
  'fresh-redbud-bell-necklace',
  'flying-swallow-ring',
  'lilac-designer-drop-earrings',
  'pencil-shaving-ring-gold',
  'nandina-flower-brooch',
  'tulip-blossom-dangle-earrings',
  'bamboo-charm-necklace-gold',
  'curved-branch-asymmetric-earrings',
  'bees-kissing-roses-ring',
  'wild-rose-stud-earrings',
];

export default function NewArrivals() {
  const picks = useMemo(() => {
    const chosen = PREFERRED.map((slug) => getProduct(slug)).filter(Boolean);
    if (chosen.length >= 8) return chosen;
    const extras = products.filter((p) => !chosen.some((c) => c.slug === p.slug));
    return [...chosen, ...extras].slice(0, 12);
  }, []);

  return (
    <PinnedProductStrip
      eyebrow="Just in"
      title="New Arrivals"
      line="Fresh from the atelier — new blooms, metals and forms to wear first."
      ctaHref="/shop"
      ctaLabel="Shop new"
      products={picks}
      bgClass="bg-pearl"
    />
  );
}
