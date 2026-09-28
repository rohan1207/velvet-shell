'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { categories, collections, products } from '@/lib/products';
import ProductCard from '@/components/ProductCard';

export default function ShopExperience() {
  const params = useSearchParams();
  const [collection, setCollection] = useState(params.get('collection') || 'all');
  const [category, setCategory] = useState(params.get('category') || 'all');
  const [sort, setSort] = useState('featured');

  useEffect(() => {
    setCollection(params.get('collection') || 'all');
    setCategory(params.get('category') || 'all');
  }, [params]);

  const list = useMemo(() => {
    let next = products.filter((item) => {
      const colOk = collection === 'all' || item.collection === collection;
      const catOk = category === 'all' || item.category === category;
      return colOk && catOk;
    });
    if (sort === 'price-asc') next = [...next].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') next = [...next].sort((a, b) => b.price - a.price);
    if (sort === 'name') next = [...next].sort((a, b) => a.name.localeCompare(b.name));
    return next;
  }, [collection, category, sort]);

  return (
    <div className="bg-ivory pt-28 pb-24 md:pt-36">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <p className="text-[11px] tracking-[0.28em] text-gold uppercase">The shop</p>
        <h1 className="font-display mt-4 text-5xl md:text-8xl">The collection</h1>
        <p className="mt-6 max-w-xl text-stone">Fourteen pieces. Small numbers. Nothing hurried.</p>

        <div className="mt-12 flex flex-col gap-6 border-y border-cream py-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <FilterChip active={collection === 'all'} onClick={() => setCollection('all')}>
              All
            </FilterChip>
            {collections.map((item) => (
              <FilterChip key={item.slug} active={collection === item.slug} onClick={() => setCollection(item.slug)}>
                {item.name}
              </FilterChip>
            ))}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <FilterChip active={category === 'all'} onClick={() => setCategory('all')}>
              Every form
            </FilterChip>
            {categories.map((item) => (
              <FilterChip key={item.slug} active={category === item.slug} onClick={() => setCategory(item.slug)}>
                {item.name}
              </FilterChip>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between text-[11px] tracking-[0.2em] text-stone uppercase">
          <span>{list.length} pieces</span>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="bg-transparent text-[11px] tracking-[0.2em] uppercase outline-none"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price, rising</option>
            <option value="price-desc">Price, descending</option>
            <option value="name">Name</option>
          </select>
        </div>

        <div className="mt-12 grid gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((product, index) => (
            <ProductCard key={product.slug} product={product} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

function FilterChip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 px-4 py-2 text-[10px] tracking-[0.22em] uppercase ${
        active ? 'bg-ink text-ivory' : 'text-stone hover:text-ink'
      }`}
    >
      {children}
    </button>
  );
}
