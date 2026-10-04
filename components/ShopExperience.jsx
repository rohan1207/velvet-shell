'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { categories, collections, products, shopHero } from '@/lib/products';
import ProductCard from '@/components/ProductCard';

function buildShopHref({ category = 'all', collection = 'all' } = {}) {
  const next = new URLSearchParams();
  if (collection !== 'all') next.set('collection', collection);
  if (category !== 'all') next.set('category', category);
  const q = next.toString();
  return q ? `/shop?${q}` : '/shop';
}

export default function ShopExperience() {
  const params = useSearchParams();
  const router = useRouter();
  const [collection, setCollection] = useState(params.get('collection') || 'all');
  const [category, setCategory] = useState(params.get('category') || 'all');
  const [sort, setSort] = useState('featured');

  useEffect(() => {
    setCollection(params.get('collection') || 'all');
    setCategory(params.get('category') || 'all');
  }, [params]);

  const activeCategory = categories.find((item) => item.slug === category) ?? null;
  const hero = activeCategory
    ? {
        name: activeCategory.name,
        line: activeCategory.line,
        banner: activeCategory.banner,
      }
    : shopHero;

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

  const updateFilters = (nextCategory, nextCollection) => {
    setCategory(nextCategory);
    setCollection(nextCollection);
    router.replace(buildShopHref({ category: nextCategory, collection: nextCollection }), { scroll: false });
  };

  const scrollToEdit = () => {
    document.getElementById('shop-edit')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="bg-ivory">
      <section className="relative h-[100svh] w-full overflow-hidden bg-ink">
        <Image
          key={hero.banner}
          src={hero.banner}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center animate-[fade-up_1.1s_var(--ease-luxe)_both]"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-ink/45 via-ink/10 to-transparent md:from-ink/40"
          aria-hidden
        />
        <div
          className="absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-ink/35 to-transparent"
          aria-hidden
        />

        <div className="relative z-10 flex h-full items-end pb-20 pt-28 md:items-center md:pb-0 md:pt-24">
          <div className="mx-auto w-full max-w-[1600px] px-5 md:px-10">
            <div className="max-w-xl animate-[fade-up_1.2s_var(--ease-luxe)_both]">
              <p className="font-label text-[11px] tracking-[0.28em] text-gold">Velvet Shell</p>
              <h1 className="font-display mt-4 text-[clamp(3.2rem,8vw,6.5rem)] leading-[0.92] tracking-[-0.03em] text-ivory drop-shadow-[0_2px_24px_rgba(0,0,0,0.35)]">
                {hero.name}
              </h1>
              <p className="mt-5 max-w-md text-[15px] font-light leading-relaxed text-ivory/85 md:text-base">
                {hero.line}
              </p>
              <button
                type="button"
                onClick={scrollToEdit}
                className="mt-8 inline-flex items-center gap-3 font-label text-[11px] tracking-[0.22em] text-ivory transition-colors duration-500 hover:text-gold"
              >
                Explore the edit
                <span aria-hidden className="text-gold">
                  →
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="shop-edit" className="scroll-mt-4 bg-pearl pb-24 pt-14 md:pt-20">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <div>
              <p className="font-label text-gold">Shop now</p>
              <h2 className="font-display mt-3 text-4xl text-ink md:text-5xl">
                {activeCategory ? activeCategory.name : 'The collection, edited.'}
              </h2>
              <p className="mt-3 max-w-md text-sm font-light leading-relaxed text-ink/85">
                {activeCategory
                  ? activeCategory.line
                  : 'Nature-inspired jewellery in silver and gold — selected for softness, detail, and presence.'}
              </p>
            </div>

            <div className="flex w-full max-w-xl flex-wrap gap-1.5 md:justify-end">
              <FilterPill
                href={buildShopHref({ category: 'all', collection })}
                active={category === 'all'}
                onNavigate={() => updateFilters('all', collection)}
              >
                All
              </FilterPill>
              {categories.map((item) => (
                <FilterPill
                  key={item.slug}
                  href={buildShopHref({ category: item.slug, collection })}
                  active={category === item.slug}
                  onNavigate={() => updateFilters(item.slug, collection)}
                >
                  {item.name}
                </FilterPill>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-1.5">
              <FilterPill
                href={buildShopHref({ category, collection: 'all' })}
                active={collection === 'all'}
                onNavigate={() => updateFilters(category, 'all')}
              >
                All collections
              </FilterPill>
              {collections.map((item) => (
                <FilterPill
                  key={item.slug}
                  href={buildShopHref({ category, collection: item.slug })}
                  active={collection === item.slug}
                  onNavigate={() => updateFilters(category, item.slug)}
                >
                  {item.name}
                </FilterPill>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <p className="font-label text-[10px] text-ink/80">
                {list.length} {list.length === 1 ? 'piece' : 'pieces'}
              </p>
              <label className="flex items-center gap-3 font-label text-[10px] text-ink/80">
                <span className="sr-only">Sort</span>
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  className="rounded-full border border-ink/10 bg-ivory px-3 py-2 text-[10px] tracking-[0.14em] text-ink/85 uppercase outline-none"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price, rising</option>
                  <option value="price-desc">Price, descending</option>
                  <option value="name">Name</option>
                </select>
              </label>
            </div>
          </div>

          {list.length === 0 ? (
            <div className="mt-20 text-center">
              <p className="font-display text-3xl text-ink">Nothing in this edit yet.</p>
              <Link href="/shop" className="mt-4 inline-block font-label text-[11px] text-burgundy">
                View the full collection →
              </Link>
            </div>
          ) : (
            <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12 lg:grid-cols-4">
              {list.map((product, index) => (
                <ProductCard key={product.slug} product={product} index={index} />
              ))}
            </div>
          )}

          <PairUpWith
            currentCategory={category}
            onSelect={(slug) => updateFilters(slug, 'all')}
          />
        </div>
      </section>
    </div>
  );
}

function PairUpWith({ currentCategory, onSelect }) {
  const others = categories.filter((item) => item.slug !== currentCategory);
  if (others.length === 0) return null;

  return (
    <div className="mt-20 md:mt-24">
      <div className="mb-6 flex items-end justify-between gap-4 md:mb-8">
        <div>
          <p className="font-label text-gold">Complete the edit</p>
          <h3 className="font-display mt-2 text-3xl text-ink md:text-4xl">Pair up with</h3>
        </div>
        <p className="hidden text-sm font-light text-ink/80 sm:block">Scroll for more →</p>
      </div>

      <div
        className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-2 snap-x snap-mandatory scroll-smooth md:-mx-10 md:gap-4 md:px-10 [scrollbar-width:thin]"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {others.map((item) => (
          <Link
            key={item.slug}
            href={buildShopHref({ category: item.slug, collection: 'all' })}
            onClick={() => onSelect(item.slug)}
            className="group relative aspect-[4/5] w-[min(68vw,15.5rem)] shrink-0 snap-start overflow-hidden rounded-[1.25rem] md:w-[17.5rem]"
          >
            <Image
              src={item.banner}
              alt=""
              fill
              sizes="280px"
              className="object-cover transition-transform duration-[1.1s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/15 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
              <p className="font-label text-[10px] text-gold">Shop</p>
              <p className="font-display mt-1.5 text-2xl text-ivory md:text-[1.75rem]">{item.name}</p>
              <p className="mt-1.5 line-clamp-2 text-sm font-light text-ivory/80">{item.line}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function FilterPill({ href, active, onNavigate, children }) {
  return (
    <Link
      href={href}
      scroll={false}
      onClick={(event) => {
        event.preventDefault();
        onNavigate();
      }}
      className={`rounded-full px-4 py-2 font-label text-[10px] tracking-[0.14em] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        active
          ? 'bg-velvet-texture text-ivory'
          : 'bg-transparent text-ink/80 hover:bg-ivory hover:text-ink'
      }`}
      aria-current={active ? 'page' : undefined}
    >
      {children}
    </Link>
  );
}
