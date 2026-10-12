'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '@/context/StoreContext';
import { money } from '@/lib/format';

export default function QuickViewDrawer() {
  const {
    quickViewSlug,
    closeQuickView,
    addToCart,
    toggleWishlist,
    wishlist,
    getProduct,
  } = useStore();

  const product = useMemo(
    () => (quickViewSlug ? getProduct(quickViewSlug) : null),
    [quickViewSlug, getProduct]
  );

  const [size, setSize] = useState('');
  const [metal, setMetal] = useState('');
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (!product) return;
    setSize(product.sizes?.[0] || 'One size');
    setMetal(product.metal?.[0] || 'S925 Silver');
    setQty(1);
  }, [product]);

  const wished = product ? wishlist.includes(product.slug) : false;
  const lineTotal = product ? product.price * qty : 0;

  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.button
            type="button"
            aria-label="Close quick view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeQuickView}
            className="fixed inset-0 z-[60] bg-ink/40"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 z-[70] flex h-full w-full max-w-lg flex-col bg-ivory shadow-[-24px_0_60px_rgba(40,20,24,0.18)]"
          >
            <div className="flex items-center justify-between border-b border-ink/8 px-6 py-5">
              <p className="font-label text-[11px] tracking-[0.22em] text-ink/80">Quick view</p>
              <button
                type="button"
                onClick={closeQuickView}
                className="font-label text-[11px] tracking-[0.18em] text-ink/80 hover:text-burgundy"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="relative aspect-[4/5] bg-pearl">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover object-center"
                  sizes="500px"
                  priority
                />
              </div>

              <div className="px-6 py-7">
                <p className="font-label text-gold">{product.category}</p>
                <h2 className="font-display mt-2 text-3xl tracking-[-0.02em] text-ink md:text-4xl">
                  {product.name}
                </h2>
                <p className="font-num mt-3 text-base text-ink/85">{money(product.price)}</p>
                <p className="mt-4 text-sm font-light leading-relaxed text-ink/85">
                  {product.description}
                </p>

                {product.sizes?.length > 0 && (
                  <div className="mt-8">
                    <p className="font-label text-[10px] text-ink/80">Size</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {product.sizes.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setSize(option)}
                          className={`min-w-14 rounded-full px-3 py-2 text-[11px] tracking-[0.14em] uppercase transition-colors ${
                            size === option
                              ? 'bg-ink text-ivory'
                              : 'border border-ink/12 text-ink/80 hover:border-ink/30'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {product.metal?.length > 0 && (
                  <div className="mt-6">
                    <p className="font-label text-[10px] text-ink/80">Finish</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {product.metal.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setMetal(option)}
                          className={`rounded-full px-3 py-2 text-[11px] tracking-[0.08em] transition-colors ${
                            metal === option
                              ? 'bg-ink text-ivory'
                              : 'border border-ink/12 text-ink/80 hover:border-ink/30'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6">
                  <p className="font-label text-[10px] text-ink/80">Quantity</p>
                  <div className="mt-3 inline-flex items-center gap-5 rounded-full border border-ink/12 px-5 py-2.5">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => setQty((n) => Math.max(1, n - 1))}
                      className="text-lg leading-none text-ink/80"
                    >
                      −
                    </button>
                    <span className="min-w-6 text-center text-sm">{qty}</span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => setQty((n) => Math.min(10, n + 1))}
                      className="text-lg leading-none text-ink/80"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-ink/8 px-6 py-5">
              <div className="mb-4 flex items-center justify-between text-sm">
                <span className="text-ink/80">Line total</span>
                <span className="font-num text-ink">{money(lineTotal)}</span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => addToCart(product.slug, { size, metal, qty })}
                  className="bg-velvet-texture flex h-12 flex-1 items-center justify-center rounded-full font-label text-[11px] tracking-[0.18em] text-ivory"
                >
                  Add to bag
                </button>
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.slug)}
                  aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
                  className={`flex h-12 w-12 items-center justify-center rounded-full border text-lg ${
                    wished ? 'border-burgundy bg-velvet-texture text-ivory' : 'border-ink/15 text-ink'
                  }`}
                >
                  {wished ? '♥' : '♡'}
                </button>
              </div>
              <Link
                href={`/shop/${product.slug}`}
                onClick={closeQuickView}
                className="mt-4 block text-center font-label text-[11px] tracking-[0.16em] text-ink/85 hover:text-burgundy"
              >
                View full details →
              </Link>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
