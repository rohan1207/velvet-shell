'use client';

import { useMemo, useState } from 'react';
import AppImage from '@/components/AppImage';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '@/context/StoreContext';
import { money } from '@/lib/format';

export default function SearchModal() {
  const { searchOpen, setSearchOpen, catalog } = useStore();
  const [query, setQuery] = useState('');
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const pool = catalog.products?.length ? catalog.products : [];
    return pool
      .filter((item) =>
        [item.name, item.description, item.category, item.collection]
          .join(' ')
          .toLowerCase()
          .includes(q)
      )
      .slice(0, 6);
  }, [query, catalog.products]);

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] bg-ivory/95 backdrop-blur-md"
        >
          <div className="mx-auto flex max-w-3xl flex-col px-6 pt-28">
            <div className="flex items-center justify-between">
              <p className="text-[11px] tracking-[0.28em] uppercase">Search the house</p>
              <button type="button" onClick={() => setSearchOpen(false)} className="text-[11px] tracking-[0.28em] uppercase">
                Close
              </button>
            </div>
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Nacre, cuff, pearl…"
              className="font-display mt-8 w-full border-b border-ink/15 bg-transparent pb-4 text-4xl outline-none placeholder:text-ink/20 md:text-6xl"
            />
            <ul className="mt-10 space-y-4">
              {results.map((product) => (
                <li key={product.slug}>
                  <Link
                    href={`/shop/${product.slug}`}
                    onClick={() => setSearchOpen(false)}
                    className="flex items-center gap-4 py-2"
                  >
                    <span className="relative h-16 w-14 overflow-hidden bg-cream">
                      <AppImage src={product.image} alt="" fill className="object-cover" sizes="56px" />
                    </span>
                    <span className="font-display text-2xl">{product.name}</span>
                    <span className="font-num ml-auto text-sm text-ink/85">{money(product.price)}</span>
                  </Link>
                </li>
              ))}
              {query && results.length === 0 && <p className="text-stone">Nothing found in this season.</p>}
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
