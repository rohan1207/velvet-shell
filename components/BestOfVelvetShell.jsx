'use client';

import { useEffect, useMemo, useState } from 'react';
import PinnedProductStrip from '@/components/PinnedProductStrip';

export default function BestOfVelvetShell() {
  const [products, setProducts] = useState([]);
  const [colorFamilies, setColorFamilies] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [curation, setCuration] = useState(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch('/api/catalog').then((r) => r.json()),
      fetch('/api/curations/best-sellers').then((r) => r.json()),
    ])
      .then(([d, c]) => {
        if (cancelled) return;
        if (d.products?.length) {
          setProducts(d.products);
          setAllProducts(d.allProducts || d.products);
          setColorFamilies(d.colorFamilies || []);
        }
        if (c.curation) setCuration(c.curation);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const picks = useMemo(() => {
    if (!products.length || !curation?.productSlugs?.length) return [];
    const bySlug = new Map(products.map((p) => [p.slug, p]));
    const byFamily = new Map(products.map((p) => [p.familySlug, p]));
    const chosen = [];
    const seen = new Set();
    for (const slug of curation.productSlugs) {
      const p = bySlug.get(slug) || byFamily.get(slug);
      if (!p || seen.has(p.slug)) continue;
      seen.add(p.slug);
      chosen.push(p);
    }
    return chosen.slice(0, 12);
  }, [products, curation]);

  if (!picks.length) return null;

  return (
    <PinnedProductStrip
      id="best-of"
      eyebrow={curation?.eyebrow || 'Best sellers'}
      title={curation?.title || 'Best of Velvet Shell'}
      line={
        curation?.line ||
        'The pieces guests return for — a quiet house edit across form and metal.'
      }
      ctaHref="/shop"
      ctaLabel="Shop all"
      products={picks}
      colorFamilies={colorFamilies}
      catalogProducts={allProducts}
      bgClass="bg-ivory"
    />
  );
}
