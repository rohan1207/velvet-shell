'use client';

import { useMemo, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { useStore } from '@/context/StoreContext';
import { collectionName, products as dummyProducts, searchProducts } from '@/lib/products';

function searchLiveCatalog(pool, query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return pool.filter((item) =>
    [item.name, item.description, item.category, collectionName(item.collection)]
      .join(' ')
      .toLowerCase()
      .includes(q),
  );
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const { catalog } = useStore();
  const pool = catalog?.allProducts?.length
    ? catalog.allProducts
    : catalog?.products?.length
      ? catalog.products
      : dummyProducts;

  const results = useMemo(() => {
    if (catalog?.allProducts?.length || catalog?.products?.length) {
      // Prefer primary listing rows when colour families exist (match shop)
      const families = catalog.colorFamilies || [];
      const hidden = new Set();
      for (const family of families) {
        for (const variant of family.variants || []) {
          if (variant.slug !== family.primary) hidden.add(variant.slug);
        }
      }
      const listing = pool.filter((p) => !hidden.has(p.slug));
      return searchLiveCatalog(listing, query);
    }
    return searchProducts(query);
  }, [query, catalog, pool]);

  return (
    <div className="bg-ivory pt-28 pb-24 md:pt-36">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <h1 className="font-display text-4xl tracking-[-0.03em] md:text-7xl">Search</h1>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Nacre, cuff, pearl…"
          className="font-display mt-10 w-full border-b border-cream bg-transparent pb-4 text-3xl outline-none placeholder:text-ink/20"
        />
        <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12 lg:grid-cols-4">
          {results.map((product, index) => (
            <ProductCard
              key={product.slug}
              product={product}
              index={index}
              colorFamilies={catalog?.colorFamilies || []}
              catalogProducts={pool}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
