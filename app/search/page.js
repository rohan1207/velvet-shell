'use client';

import { useMemo, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { searchProducts } from '@/lib/products';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const results = useMemo(() => searchProducts(query), [query]);

  return (
    <div className="bg-ivory pt-28 pb-24 md:pt-36">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <h1 className="font-display text-5xl md:text-7xl">Search</h1>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Nacre, cuff, pearl…"
          className="font-display mt-10 w-full border-b border-cream bg-transparent pb-4 text-3xl outline-none placeholder:text-ink/20"
        />
        <div className="mt-12 grid gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((product, index) => (
            <ProductCard key={product.slug} product={product} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
