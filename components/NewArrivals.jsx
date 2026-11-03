'use client';

import { useEffect, useMemo, useState } from 'react';
import PinnedProductStrip from '@/components/PinnedProductStrip';
import { ProductStripSkeleton } from '@/components/ProductCardSkeleton';
import { useStore } from '@/context/StoreContext';

/**
 * Homepage Festive Edit strip — product order comes from admin curation.
 */
export default function NewArrivals() {
  const { catalog } = useStore();
  const [curation, setCuration] = useState(null);
  const [curationLoading, setCurationLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/curations/festive-edit')
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
    // Preserve admin order exactly
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
        title="Festive Edit"
        line="Loading the seasonal edit…"
        count={4}
      />
    );
  }

  if (!picks.length) return null;

  return (
    <PinnedProductStrip
      id="festive-edit"
      eyebrow={curation?.eyebrow || 'Seasonal'}
      title={curation?.title || 'Festive Edit'}
      line={
        curation?.line ||
        'A celebratory selection — blooms, metals and forms for the season’s quiet shine.'
      }
      products={picks}
      catalogProducts={catalogProducts}
      colorFamilies={colorFamilies}
    />
  );
}
