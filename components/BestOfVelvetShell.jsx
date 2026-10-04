'use client';

import { useMemo } from 'react';
import { getProduct, products } from '@/lib/products';
import PinnedProductStrip from '@/components/PinnedProductStrip';

const PREFERRED = [
  'flower-in-the-rain-pink',
  'phalaenopsis-hoop-earrings',
  'aquamarine-butterfly-ring',
  'flower-in-the-rain-necklace-pink',
  'forget-me-not-bangles',
  'calla-lily-brooch-gold',
  'lotus-whisper-pink',
  'chrysanthemum-dangle-earrings',
  'hollow-butterfly-pendant-gold',
  'flower-adjustable-ring-silver',
  'forget-me-not-hoop-earrings',
  'lotus-natural-stone-ring',
];

export default function BestOfVelvetShell() {
  const picks = useMemo(() => {
    const chosen = PREFERRED.map((slug) => getProduct(slug)).filter(Boolean);
    if (chosen.length >= 8) return chosen;
    const extras = products.filter((p) => !chosen.some((c) => c.slug === p.slug));
    return [...chosen, ...extras].slice(0, 12);
  }, []);

  return (
    <PinnedProductStrip
      eyebrow="Best sellers"
      title="Best of Velvet Shell"
      line="The pieces guests return for — a quiet house edit across form and metal."
      ctaHref="/shop"
      ctaLabel="Shop all"
      products={picks}
      bgClass="bg-ivory"
    />
  );
}
