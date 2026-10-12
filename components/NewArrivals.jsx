'use client';

import { useEffect, useMemo, useState } from 'react';
import PinnedProductStrip from '@/components/PinnedProductStrip';

const PREFERRED = [
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
];

export default function NewArrivals() {
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
      id="festive-edit"
      eyebrow="Seasonal"
      title="Festive Edit"
      line="A celebratory selection — blooms, metals and forms for the season’s quiet shine."
      ctaHref="/shop"
      ctaLabel="Shop the edit"
      products={picks}
      colorFamilies={colorFamilies}
      catalogProducts={allProducts}
      bgClass="bg-pearl"
    />
  );
}
