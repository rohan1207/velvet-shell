'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { products, categories as productCategories } from '@/lib/products';
import ProductCard from '@/components/ProductCard';

const tabs = [{ slug: 'all', name: 'All' }, ...productCategories];

export default function ShopNow() {
  const [activeTab, setActiveTab] = useState('all');

  const filtered = useMemo(() => {
    if (activeTab === 'all') return products.slice(0, 8);
    // Category tabs show every piece in that form (e.g. all bracelets)
    return products.filter((product) => product.category === activeTab);
  }, [activeTab]);

  return (
    <section className="bg-pearl">
      <div className="mx-auto max-w-[1600px] px-5 py-16 md:px-10 md:py-24">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="font-label text-gold">Shop now</p>
            <h2 className="font-display mt-3 text-4xl text-ink md:text-5xl">The collection, edited.</h2>
          </div>

          <div className="flex w-full max-w-xl flex-wrap gap-1.5 md:justify-end">
            {tabs.map((tab) => {
              const active = activeTab === tab.slug;
              return (
                <button
                  key={tab.slug}
                  type="button"
                  onClick={() => setActiveTab(tab.slug)}
                  className={`rounded-full px-4 py-2 font-label text-[10px] tracking-[0.14em] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
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

        <div className="relative mt-12 min-h-[28rem]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12 lg:grid-cols-4"
            >
              {filtered.map((product, index) => (
                <ProductCard key={product.slug} product={product} index={index} />
              ))}
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <p className="py-20 text-center text-sm font-light text-ink/80">
              Nothing in this edit just now.
            </p>
          )}
        </div>

        <div className="mt-14 flex justify-center md:mt-16">
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
