'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import { ProductGridSkeleton } from '@/components/ProductCardSkeleton';
import { useStore } from '@/context/StoreContext';

export default function ShopNow() {
  const { catalog } = useStore();
  const [activeTab, setActiveTab] = useState('all');

  const products = catalog.products || [];
  const categories = catalog.categories || [];
  const colorFamilies = catalog.colorFamilies || [];
  const allProducts = catalog.allProducts || products;
  const loading = !products.length;

  const tabs = useMemo(
    () => [{ slug: 'all', name: 'All' }, ...categories.map((c) => ({ slug: c.slug, name: c.name }))],
    [categories],
  );

  const filtered = useMemo(() => {
    if (activeTab === 'all') return products.slice(0, 8);
    return products.filter((product) => product.category === activeTab).slice(0, 8);
  }, [activeTab, products]);

  return (
    <section className="bg-pearl">
      <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-5 sm:py-10 md:px-10 md:py-12">
        <div className="flex flex-col gap-4 sm:gap-5">
          <div>
            <p className="font-label text-[10px] tracking-[0.18em] text-gold uppercase">Shop now</p>
            <h2 className="font-display mt-2 text-[1.75rem] leading-[1.1] text-ink sm:text-3xl md:text-5xl">
              The collection, edited.
            </h2>
          </div>

          <div className="chip-scroll-wrap">
            <div className="chip-scroll md:justify-end">
              {tabs.map((tab) => {
                const active = activeTab === tab.slug;
                return (
                  <button
                    key={tab.slug}
                    type="button"
                    onClick={() => setActiveTab(tab.slug)}
                    className={`shrink-0 rounded-full px-3 py-2 font-label text-[10px] tracking-[0.1em] uppercase transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-3 sm:py-1.5 sm:tracking-[0.12em] xl:px-4 xl:py-2 xl:tracking-[0.14em] ${
                      active
                        ? 'bg-velvet-texture text-ivory'
                        : 'bg-transparent text-ink/80 hover:bg-ivory hover:text-ink'
                    }`}
                  >
                    {tab.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="relative mt-6 min-h-[22rem] sm:mt-8 sm:min-h-[28rem]">
          {loading ? (
            <ProductGridSkeleton count={8} className="gap-y-8 md:gap-y-10" />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-2 gap-x-2.5 gap-y-6 sm:gap-x-3 sm:gap-y-7 md:gap-x-6 md:gap-y-10 lg:grid-cols-4"
              >
                {filtered.map((product, index) => (
                  <ProductCard
                    key={product.slug}
                    product={product}
                    index={index}
                    colorFamilies={colorFamilies}
                    catalogProducts={allProducts}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {!loading && filtered.length === 0 && (
            <p className="py-20 text-center text-sm font-light text-ink/80">
              Nothing in this edit just now.
            </p>
          )}
        </div>

        <div className="mt-10 flex justify-center md:mt-12">
          <Link
            href={activeTab === 'all' ? '/shop' : `/shop?category=${activeTab}`}
            className="bg-velvet-texture inline-flex items-center rounded-full px-8 py-3.5 font-label text-[11px] text-ivory transition-opacity hover:opacity-90"
          >
            View all
          </Link>
        </div>
      </div>
    </section>
  );
}
