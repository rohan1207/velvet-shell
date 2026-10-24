'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { shopHero as defaultShopHero } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import { ProductGridSkeleton } from '@/components/ProductCardSkeleton';
import CategoryHeroSlider from '@/components/CategoryHeroSlider';
import ResponsiveBannerImage from '@/components/ResponsiveBannerImage';
import ShopFilters, {
  colorKey,
  emptyFilterState,
  filtersEqual,
  normalizeMaterialTags,
} from '@/components/ShopFilters';

function buildShopHref({ category = 'all', collection = 'all', q = '' } = {}) {
  const next = new URLSearchParams();
  if (collection !== 'all') next.set('collection', collection);
  if (category !== 'all') next.set('category', category);
  if (q.trim()) next.set('q', q.trim());
  const query = next.toString();
  return query ? `/shop?${query}` : '/shop';
}

function IconSearch({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="11" cy="11" r="6.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16.2 16.2L20 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconFilters({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M4 7h16M7 12h10M10 17h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function ShopExperience({
  initialProducts = [],
  initialAllProducts = [],
  initialCollections = [],
  initialCategories = [],
  initialColorFamilies = [],
  shopHeroData = defaultShopHero,
  catalogSource = 'dummy',
} = {}) {
  const params = useSearchParams();
  const router = useRouter();
  const [category, setCategory] = useState(params.get('category') || 'all');
  const [sort, setSort] = useState('featured');
  const [query, setQuery] = useState(params.get('q') || '');
  const [products, setProducts] = useState(initialProducts);
  const [allProducts, setAllProducts] = useState(
    initialAllProducts.length ? initialAllProducts : initialProducts,
  );
  const [collections, setCollections] = useState(initialCollections);
  const [categories, setCategories] = useState(initialCategories);
  const [colorFamilies, setColorFamilies] = useState(initialColorFamilies);
  const [source, setSource] = useState(catalogSource);
  const [catalogLoading, setCatalogLoading] = useState(!initialProducts?.length);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [draft, setDraft] = useState(() => emptyFilterState());
  const [applied, setApplied] = useState(() => emptyFilterState());

  useEffect(() => {
    setCategory(params.get('category') || 'all');
    setQuery(params.get('q') || '');
  }, [params]);

  useEffect(() => {
    setProducts(initialProducts);
    setAllProducts(initialAllProducts.length ? initialAllProducts : initialProducts);
    setCollections(initialCollections);
    setCategories(initialCategories);
    setColorFamilies(initialColorFamilies);
    setSource(catalogSource);
    if (initialProducts?.length) setCatalogLoading(false);
  }, [
    initialProducts,
    initialAllProducts,
    initialCollections,
    initialCategories,
    initialColorFamilies,
    catalogSource,
  ]);

  useEffect(() => {
    let cancelled = false;
    if (!initialProducts?.length) setCatalogLoading(true);
    fetch('/api/catalog')
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        if (d.products?.length) {
          setProducts(d.products);
          setAllProducts(d.allProducts?.length ? d.allProducts : d.products);
          if (d.collections?.length) setCollections(d.collections);
          if (d.categories?.length) setCategories(d.categories);
          if (d.colorFamilies) setColorFamilies(d.colorFamilies);
          setSource(d.source || 'supabase');
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setCatalogLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [initialProducts?.length]);

  const shopHero = shopHeroData || defaultShopHero;
  const activeCategory = categories.find((item) => item.slug === category) ?? null;
  const heroSlides = useMemo(() => {
    if (activeCategory?.banners?.length) return activeCategory.banners;
    if (activeCategory?.banner) {
      return [{ src: activeCategory.banner, alt: activeCategory.name }];
    }
    if (shopHero.banners?.length) return shopHero.banners;
    return [{ src: shopHero.banner, alt: shopHero.name }];
  }, [activeCategory, shopHero]);

  const hero = activeCategory
    ? {
        name: activeCategory.name,
        line: activeCategory.line,
        banner: activeCategory.banner,
      }
    : shopHero;

  /** Products in the active category (basis for filter options). */
  const categoryProducts = useMemo(() => {
    if (category === 'all') return products;
    return products.filter((p) => p.category === category);
  }, [products, category]);

  const priceBounds = useMemo(() => {
    const prices = categoryProducts.map((p) => Number(p.price) || 0).filter((n) => n > 0);
    if (!prices.length) return { min: 0, max: 10000 };
    const min = Math.floor(Math.min(...prices) / 50) * 50;
    const max = Math.ceil(Math.max(...prices) / 50) * 50;
    return { min, max: Math.max(max, min + 50) };
  }, [categoryProducts]);

  const filterOptions = useMemo(() => {
    const collectionCounts = new Map();
    const materialCounts = new Map();
    const colorCounts = new Map();
    const colorSwatches = new Map();

    for (const p of categoryProducts) {
      if (p.collection) {
        collectionCounts.set(p.collection, (collectionCounts.get(p.collection) || 0) + 1);
      }
      const mats = [
        ...normalizeMaterialTags(p.metal?.[0] || p.material || ''),
        ...(Array.isArray(p.metal)
          ? p.metal.flatMap((m) => normalizeMaterialTags(m))
          : []),
      ];
      for (const tag of [...new Set(mats)]) {
        materialCounts.set(tag, (materialCounts.get(tag) || 0) + 1);
      }
      const ck = colorKey(p);
      colorCounts.set(ck, (colorCounts.get(ck) || 0) + 1);
      if (p.colorSwatch && !colorSwatches.has(ck)) colorSwatches.set(ck, p.colorSwatch);
    }

    const collectionMeta = new Map(collections.map((c) => [c.slug, c]));
    const collectionOptions = [...collectionCounts.entries()]
      .map(([slug, count]) => ({
        slug,
        name: collectionMeta.get(slug)?.name || slug.replace(/-/g, ' '),
        count,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    const materials = [...materialCounts.entries()]
      .map(([key, count]) => ({ key, count }))
      .sort((a, b) => a.key.localeCompare(b.key));

    const colors = [...colorCounts.entries()]
      .map(([key, count]) => ({
        key,
        count,
        swatch: colorSwatches.get(key) || '#C5C5C5',
      }))
      .sort((a, b) => a.key.localeCompare(b.key));

    const { min, max } = priceBounds;
    const mid = Math.round((min + max) / 2 / 50) * 50;
    const pricePresets = [
      { label: 'All', min, max },
      { label: `Under ${Math.round((min + mid) / 2 / 100) * 100 || min + 500}`, min, max: Math.max(min + 500, mid) },
      { label: 'Mid range', min: Math.max(min, mid - 500), max: Math.min(max, mid + 1000) },
      { label: 'Premium', min: mid, max },
    ];

    return { collections: collectionOptions, materials, colors, pricePresets };
  }, [categoryProducts, collections, priceBounds]);

  // When category / price bounds change, reset filters to sensible defaults
  useEffect(() => {
    const next = emptyFilterState(priceBounds);
    const urlCollection = params.get('collection');
    if (
      urlCollection &&
      urlCollection !== 'all' &&
      filterOptions.collections.some((c) => c.slug === urlCollection)
    ) {
      next.collections = [urlCollection];
    }
    setDraft(next);
    setApplied(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, priceBounds.min, priceBounds.max, filterOptions.collections.map((c) => c.slug).join(',')]);

  const dirty = !filtersEqual(draft, applied);
  const hasActive = useMemo(() => {
    const base = emptyFilterState(priceBounds);
    return !filtersEqual(applied, base);
  }, [applied, priceBounds]);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    let next = categoryProducts.filter((item) => {
      if (applied.collections.length && !applied.collections.includes(item.collection)) {
        return false;
      }
      if (applied.colors.length && !applied.colors.includes(colorKey(item))) {
        return false;
      }
      if (applied.materials.length) {
        const tags = [
          ...normalizeMaterialTags(item.metal?.[0] || item.material || ''),
          ...(Array.isArray(item.metal)
            ? item.metal.flatMap((m) => normalizeMaterialTags(m))
            : []),
        ];
        if (!applied.materials.some((m) => tags.includes(m))) return false;
      }
      const price = Number(item.price) || 0;
      const priceMax = applied.priceMax > 0 ? applied.priceMax : Number.POSITIVE_INFINITY;
      if (price < applied.priceMin || price > priceMax) return false;
      if (q) {
        const hay = [item.name, item.description, item.collection, item.category, item.metal?.join(' ')]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    if (sort === 'price-asc') next = [...next].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') next = [...next].sort((a, b) => b.price - a.price);
    if (sort === 'name') next = [...next].sort((a, b) => a.name.localeCompare(b.name));
    return next;
  }, [categoryProducts, applied, query, sort]);

  const updateCategory = (nextCategory) => {
    setCategory(nextCategory);
    // Clear filters immediately so the new category isn’t stuck on stale price/colour cuts
    const next = emptyFilterState({ min: 0, max: 100000 });
    setDraft(next);
    setApplied(next);
    setMobileFiltersOpen(false);
    router.replace(buildShopHref({ category: nextCategory, q: query }), { scroll: false });
  };

  const applyFilters = () => {
    setApplied({ ...draft, collections: [...draft.collections], materials: [...draft.materials], colors: [...draft.colors] });
    const primaryCollection =
      draft.collections.length === 1 ? draft.collections[0] : 'all';
    router.replace(
      buildShopHref({ category, collection: primaryCollection, q: query }),
      { scroll: false },
    );
    setMobileFiltersOpen(false);
  };

  const clearFilters = () => {
    const next = emptyFilterState(priceBounds);
    setDraft(next);
    setApplied(next);
    router.replace(buildShopHref({ category, q: query }), { scroll: false });
    setMobileFiltersOpen(false);
  };

  const onSearchChange = (value) => {
    setQuery(value);
  };

  const commitSearch = () => {
    const primaryCollection =
      applied.collections.length === 1 ? applied.collections[0] : 'all';
    router.replace(
      buildShopHref({ category, collection: primaryCollection, q: query }),
      { scroll: false },
    );
  };

  return (
    <div className="bg-white">
      <CategoryHeroSlider
        key={activeCategory?.slug || 'shop'}
        slides={heroSlides}
        label={`${hero.name} banners`}
      />

      <section id="shop-edit" className="scroll-mt-4 bg-white pb-20 pt-8 md:pb-24 md:pt-16">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-5 md:px-10">
          {/* Title + single-line category pills (never wrap) */}
          <div className="flex flex-col gap-4 md:gap-6">
            <div>
              <p className="font-label text-[10px] tracking-[0.18em] text-gold uppercase md:text-[11px]">
                Shop now
              </p>
              <h2 className="font-display mt-2 text-[1.85rem] leading-[1.1] text-ink sm:text-4xl md:mt-3 md:text-5xl">
                {activeCategory ? activeCategory.name : 'The collection, edited.'}
              </h2>
              <p className="mt-2 max-w-md text-[13px] font-light leading-relaxed text-ink/80 sm:mt-3 sm:text-sm md:text-ink/85">
                {activeCategory
                  ? activeCategory.line
                  : 'Nature-inspired jewellery in silver and gold — selected for softness, detail, and presence.'}
              </p>
            </div>

            <div className="chip-scroll-wrap">
              <div className="chip-scroll md:justify-end">
                <CategoryPill active={category === 'all'} onClick={() => updateCategory('all')}>
                  All
                </CategoryPill>
                {categories.map((item) => (
                  <CategoryPill
                    key={item.slug}
                    active={category === item.slug}
                    onClick={() => updateCategory(item.slug)}
                  >
                    {item.name}
                  </CategoryPill>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky strip: filters · search · count — sits under fixed site header */}
          <div
            className="sticky z-30 mt-5 border-b border-ink/8 bg-white/95 py-2.5 backdrop-blur-md supports-[backdrop-filter]:bg-white/90 sm:mt-8 sm:py-3"
            style={{ top: 'calc(var(--site-promo-h) + var(--site-nav-h))' }}
          >
            <div className="flex flex-col gap-2 md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_minmax(0,1fr)] md:items-center md:gap-4">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 md:justify-start">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  className={`hidden items-center gap-2 rounded-full border px-3.5 py-2 font-label text-[10px] tracking-[0.14em] uppercase transition-all lg:inline-flex ${
                    sidebarOpen
                      ? 'pointer-events-none border-transparent text-ink/30'
                      : 'border-ink/12 text-ink/75 hover:border-burgundy/30 hover:text-burgundy'
                  }`}
                >
                  <IconFilters />
                  Show filters
                </button>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(true)}
                  className="inline-flex min-h-9 items-center gap-2 rounded-full border border-ink/12 px-3 py-1.5 font-label text-[10px] tracking-[0.14em] text-ink/75 uppercase lg:hidden"
                >
                  <IconFilters />
                  Filters
                  {hasActive ? (
                    <span className="ml-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-burgundy px-1 text-[9px] text-ivory">
                      •
                    </span>
                  ) : null}
                </button>
                {hasActive ? (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="min-h-11 rounded-full border border-ink/10 px-3.5 py-2 font-label text-[10px] tracking-[0.14em] text-ink/65 uppercase transition-colors hover:border-burgundy/25 hover:text-burgundy"
                  >
                    Clear
                  </button>
                ) : null}
                {dirty ? (
                  <button
                    type="button"
                    onClick={applyFilters}
                    className="bg-velvet-texture min-h-11 rounded-full px-3.5 py-2 font-label text-[10px] tracking-[0.14em] text-ivory uppercase"
                  >
                    Apply
                  </button>
                ) : null}
                <div className="ml-auto flex items-center gap-2 md:hidden">
                  <p className="font-label text-[10px] tracking-[0.12em] text-ink/70 uppercase">
                    {catalogLoading
                      ? '…'
                      : `${list.length}`}
                  </p>
                  <label className="flex items-center">
                    <span className="sr-only">Sort</span>
                    <select
                      value={sort}
                      onChange={(event) => setSort(event.target.value)}
                      className="max-w-[8.5rem] rounded-full border border-ink/10 bg-ivory px-2.5 py-2 text-[10px] tracking-[0.12em] text-ink/85 uppercase outline-none"
                    >
                      <option value="featured">Featured</option>
                      <option value="price-asc">Price ↑</option>
                      <option value="price-desc">Price ↓</option>
                      <option value="name">Name</option>
                    </select>
                  </label>
                </div>
              </div>

              <label className="relative mx-auto block w-full max-w-md md:mx-0 md:max-w-none">
                <span className="sr-only">Search products</span>
                <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-ink/35">
                  <IconSearch />
                </span>
                <input
                  type="search"
                  value={query}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') commitSearch();
                  }}
                  placeholder="Search — lotus, bee, silver…"
                  className="w-full rounded-full border border-ink/10 bg-ivory/80 py-2.5 pr-4 pl-10 text-sm text-ink outline-none transition-[border-color,box-shadow] placeholder:text-ink/35 focus:border-burgundy/30 focus:bg-white focus:shadow-[0_8px_24px_rgba(94,6,42,0.06)]"
                />
              </label>

              <div className="hidden items-center justify-between gap-3 md:flex md:justify-end">
                <p className="font-label text-[10px] tracking-[0.12em] text-ink/70 uppercase">
                  {catalogLoading
                    ? 'Loading…'
                    : `${list.length} ${list.length === 1 ? 'piece' : 'pieces'}`}
                </p>
                <label className="flex items-center gap-2 font-label text-[10px] tracking-[0.12em] text-ink/70 uppercase">
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
          </div>

          {/* Sidebar + grid — stretch so sticky sidebar has a tall containing block */}
          <div className="mt-6 flex items-stretch gap-6 xl:gap-8">
            <ShopFilters
              draft={draft}
              onDraftChange={setDraft}
              options={filterOptions}
              priceBounds={priceBounds}
              onApply={applyFilters}
              onClear={clearFilters}
              dirty={dirty}
              hasActive={hasActive}
              collapsed={!sidebarOpen}
              onToggleCollapsed={() => setSidebarOpen(false)}
              mobileOpen={mobileFiltersOpen}
              onCloseMobile={() => setMobileFiltersOpen(false)}
            />

            <div className="min-w-0 flex-1 self-start">
              {catalogLoading ? (
                <ProductGridSkeleton
                  count={sidebarOpen ? 6 : 8}
                  className={
                    sidebarOpen
                      ? 'lg:grid-cols-3'
                      : 'lg:grid-cols-4'
                  }
                />
              ) : list.length === 0 ? (
                <div className="rounded-[1.25rem] border border-ink/8 bg-ivory/40 px-6 py-20 text-center">
                  <p className="font-display text-3xl text-ink">Nothing matches this edit.</p>
                  <p className="mx-auto mt-3 max-w-sm text-sm font-light text-ink/70">
                    Try clearing filters or searching a different note from the garden.
                  </p>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="bg-velvet-texture mt-6 inline-flex rounded-full px-5 py-2.5 font-label text-[11px] text-ivory"
                  >
                    Clear
                  </button>
                </div>
              ) : (
                <div
                  className={`grid grid-cols-2 gap-x-2.5 gap-y-6 transition-[grid-template-columns] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:gap-x-3 sm:gap-y-7 md:gap-x-6 md:gap-y-12 ${
                    sidebarOpen ? 'lg:grid-cols-3' : 'lg:grid-cols-4'
                  }`}
                >
                  {list.map((product, index) => (
                    <ProductCard
                      key={product.slug}
                      product={product}
                      index={index}
                      colorFamilies={colorFamilies}
                      catalogProducts={allProducts}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <p className="sr-only" data-catalog-source={source}>
            Catalog source {source}
          </p>

          <PairUpWith
            categories={categories}
            currentCategory={category}
            onSelect={(slug) => updateCategory(slug)}
          />
        </div>
      </section>
    </div>
  );
}

function PairUpWith({ categories = [], currentCategory, onSelect }) {
  const others = categories.filter((item) => item.slug !== currentCategory && item.banner);
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

      {/* Phone: 2-col category cards */}
      <div className="grid grid-cols-2 gap-3 md:hidden">
        {others.map((item) => (
          <Link
            key={item.slug}
            href={buildShopHref({ category: item.slug })}
            onClick={() => onSelect(item.slug)}
            className="group relative aspect-[4/5] overflow-hidden rounded-xl"
          >
            <ResponsiveBannerImage
              src={item.banner}
              alt=""
              sizes="50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/65 via-ink/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-3">
              <p className="font-label text-[9px] tracking-[0.14em] text-gold uppercase">Shop</p>
              <p className="font-display mt-1 text-lg leading-tight text-ivory">{item.name}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Tablet+: horizontal snap rail */}
      <div
        className="-mx-10 hidden gap-4 overflow-x-auto px-10 pb-2 snap-x snap-mandatory scroll-smooth md:flex [scrollbar-width:thin]"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {others.map((item) => (
          <Link
            key={item.slug}
            href={buildShopHref({ category: item.slug })}
            onClick={() => onSelect(item.slug)}
            className="group relative aspect-[4/5] w-[17.5rem] shrink-0 snap-start overflow-hidden rounded-[1.25rem]"
          >
            <ResponsiveBannerImage
              src={item.banner}
              alt=""
              sizes="280px"
              className="object-cover transition-transform duration-[1.1s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/15 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <p className="font-label text-[10px] text-gold">Shop</p>
              <p className="font-display mt-1.5 text-[1.75rem] text-ivory">{item.name}</p>
              <p className="mt-1.5 line-clamp-2 text-sm font-light text-ivory/80">{item.line}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function CategoryPill({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full px-3 py-2 font-label text-[10px] tracking-[0.1em] uppercase transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-3 sm:py-1.5 sm:text-[10px] sm:tracking-[0.12em] xl:px-4 xl:py-2 xl:tracking-[0.14em] ${
        active
          ? 'bg-velvet-texture text-ivory'
          : 'bg-transparent text-ink/80 hover:bg-ivory hover:text-ink'
      }`}
      aria-current={active ? 'page' : undefined}
    >
      {children}
    </button>
  );
}
