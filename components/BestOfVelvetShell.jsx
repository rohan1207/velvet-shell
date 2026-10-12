'use client';

import { useEffect, useMemo, useState } from 'react';
import PinnedProductStrip from '@/components/PinnedProductStrip';

const PREFERRED = [
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
];

export default function BestOfVelvetShell() {
  const [products, setProducts] = useState([]);
  const [colorFamilies, setColorFamilies] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/catalog')
      .then((r) => r.json())
      .then((d) => {
        if (cancelled || !d.products?.length) return;
        setProducts(d.products);
        setAllProducts(d.allProducts || d.products);
        setColorFamilies(d.colorFamilies || []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const picks = useMemo(() => {
    if (!products.length) return [];
    const bySlug = new Map(products.map((p) => [p.slug, p]));
    const byFamily = new Map(products.map((p) => [p.familySlug, p]));
    const chosen = PREFERRED.map((slug) => bySlug.get(slug) || byFamily.get(slug)).filter(Boolean);
    if (chosen.length >= 8) return chosen.slice(0, 12);
    const extras = products.filter((p) => !chosen.some((c) => c.slug === p.slug));
    return [...chosen, ...extras].slice(0, 12);
  }, [products]);

  if (!picks.length) return null;

  return (
    <PinnedProductStrip
      id="best-of"
      eyebrow="Best sellers"
      title="Best of Velvet Shell"
      line="The pieces guests return for — a quiet house edit across form and metal."
      ctaHref="/shop"
      ctaLabel="Shop all"
      products={picks}
      colorFamilies={colorFamilies}
      catalogProducts={allProducts}
      bgClass="bg-ivory"
    />
  );
}
