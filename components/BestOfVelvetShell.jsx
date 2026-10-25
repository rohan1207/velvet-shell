'use client';

import { useEffect, useMemo, useState } from 'react';
import PinnedProductStrip from '@/components/PinnedProductStrip';
import { ProductStripSkeleton } from '@/components/ProductCardSkeleton';
import { useStore } from '@/context/StoreContext';

export default function BestOfVelvetShell() {
  const { catalog } = useStore();
  const [curation, setCuration] = useState(null);
  const [curationLoading, setCurationLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/curations/best-sellers')
      .then((r) => r.json())
      .then((c) => {
        if (!cancelled && c.curation) setCuration(c.curation);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setCurationLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const products = catalog.products || [];
  const catalogProducts = catalog.allProducts || products;
  const colorFamilies = catalog.colorFamilies || [];
  const catalogLoading = !products.length;

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

  if (catalogLoading || curationLoading) {
    return (
      <ProductStripSkeleton
        count={4}
        eyebrow="Best sellers"
        title="Best of Velvet Shell"
        line="Gathering the house favourites…"
        bgClass="bg-ivory"
      />
    );
  }

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
      catalogProducts={catalogProducts}
      bgClass="bg-ivory"
    />
  );
}
