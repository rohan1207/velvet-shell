'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { products, categories as productCategories } from '@/lib/products';
import { money } from '@/lib/format';
import { useStore } from '@/context/StoreContext';

const tabs = [{ slug: 'all', name: 'All' }, ...productCategories];

function IconHeart({ filled = false, className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill={filled ? 'currentColor' : 'none'} aria-hidden>
      <path
        d="M12 20s-7.2-4.35-9.2-8.2C1.3 9.1 2.7 6.2 5.6 5.5c1.7-.4 3.4.3 4.4 1.6 1-1.3 2.7-2 4.4-1.6 2.9.7 4.3 3.6 2.8 6.3C19.2 15.65 12 20 12 20Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconEye({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path
        d="M2.5 12S6.2 5.5 12 5.5 21.5 12 21.5 12 17.8 18.5 12 18.5 2.5 12 2.5 12Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function IconBag({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path
        d="M7.2 8.5h9.6l.7 11.2H6.5L7.2 8.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M9.2 8.5V7.2a2.8 2.8 0 0 1 5.6 0v1.3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconClose({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ActionButton({ label, onClick, children, active = false }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onClick?.();
      }}
      className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        active
          ? 'border-burgundy bg-burgundy text-ivory'
          : 'border-ink/8 bg-ivory/95 text-ink shadow-[0_8px_24px_rgba(45,43,43,0.08)] hover:border-burgundy/30 hover:text-burgundy'
      }`}
    >
      {children}
    </button>
  );
}

function ShopCard({ product, onQuickView }) {
  const { wishlist, toggleWishlist, addToCart } = useStore();
  const wished = wishlist.includes(product.slug);

  return (
    <article className="group">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-pearl">
        <Link href={`/shop/${product.slug}`} data-cursor="View" className="absolute inset-0 block">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-[1.1s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
          />
          {product.hoverImage && (
            <Image
              src={product.hoverImage}
              alt=""
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover opacity-0 transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100"
            />
          )}
        </Link>

        {/* Icon actions — appear on hover, stay minimal */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pb-4 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 translate-y-2">
          <div className="flex items-center gap-2 rounded-full border border-ink/6 bg-ivory/90 p-1.5 backdrop-blur-md">
            <ActionButton
              label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
              active={wished}
              onClick={() => toggleWishlist(product.slug)}
            >
              <IconHeart filled={wished} />
            </ActionButton>
            <ActionButton label="Quick view" onClick={() => onQuickView(product)}>
              <IconEye />
            </ActionButton>
            <ActionButton label="Add to bag" onClick={() => addToCart(product.slug)}>
              <IconBag />
            </ActionButton>
          </div>
        </div>
      </div>

      <div className="mt-4 px-0.5">
        <Link
          href={`/shop/${product.slug}`}
          className="font-display block text-[1.35rem] leading-tight tracking-[-0.02em] text-ink transition-colors hover:text-burgundy"
        >
          {product.name}
        </Link>
        <p className="mt-1.5 text-sm font-light text-ink/45">{money(product.price)}</p>
      </div>
    </article>
  );
}

function QuickViewModal({ product, onClose }) {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  if (!product) return null;
  const wished = wishlist.includes(product.slug);

  return (
    <motion.div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button type="button" className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]" aria-label="Close" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative grid w-full max-w-3xl overflow-hidden rounded-[1.5rem] bg-ivory shadow-[0_30px_80px_rgba(45,43,43,0.25)] md:grid-cols-2"
      >
        <div className="relative aspect-[4/5] bg-pearl md:aspect-auto md:min-h-[420px]">
          <Image src={product.image} alt={product.name} fill className="object-cover" sizes="50vw" />
        </div>
        <div className="flex flex-col justify-between p-7 md:p-9">
          <div>
            <p className="font-label text-gold">{product.category}</p>
            <h3 className="font-display mt-3 text-3xl text-ink md:text-4xl">{product.name}</h3>
            <p className="mt-3 text-base font-light text-ink/55">{money(product.price)}</p>
            <p className="mt-5 text-sm font-light leading-relaxed text-ink/60 line-clamp-4">
              {product.description}
            </p>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => addToCart(product.slug)}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-burgundy px-5 font-label text-[11px] text-ivory"
            >
              <IconBag className="h-3.5 w-3.5" />
              Add to bag
            </button>
            <button
              type="button"
              onClick={() => toggleWishlist(product.slug)}
              className={`inline-flex h-11 w-11 items-center justify-center rounded-full border ${
                wished ? 'border-burgundy bg-burgundy text-ivory' : 'border-ink/12 text-ink'
              }`}
              aria-label="Wishlist"
            >
              <IconHeart filled={wished} />
            </button>
            <Link
              href={`/shop/${product.slug}`}
              className="ml-auto font-label text-[11px] text-ink/50 hover:text-burgundy"
              onClick={onClose}
            >
              Full details →
            </Link>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-ivory/90 text-ink shadow-sm"
          aria-label="Close quick view"
        >
          <IconClose />
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function ShopNow() {
  const [activeTab, setActiveTab] = useState('all');
  const [quickView, setQuickView] = useState(null);

  const filtered = useMemo(() => {
    const list =
      activeTab === 'all' ? products : products.filter((product) => product.category === activeTab);
    return list.slice(0, 8);
  }, [activeTab]);

  return (
    <section className="bg-pearl">
      <div className="mx-auto max-w-[1600px] px-5 py-16 md:px-10 md:py-24">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="font-label text-gold">Shop now</p>
            <h2 className="font-display mt-3 text-4xl text-ink md:text-5xl">The collection, edited.</h2>
          </div>

          {/* Category tabs */}
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
                      ? 'bg-burgundy text-ivory'
                      : 'bg-transparent text-ink/40 hover:bg-ivory hover:text-ink'
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
              {filtered.map((product) => (
                <ShopCard key={product.slug} product={product} onQuickView={setQuickView} />
              ))}
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <p className="py-20 text-center text-sm font-light text-ink/40">
              Nothing in this edit just now.
            </p>
          )}
        </div>

        <div className="mt-14 flex justify-center md:mt-16">
          <Link
            href={activeTab === 'all' ? '/shop' : `/shop?category=${activeTab}`}
            className="inline-flex items-center rounded-full border border-ink/12 bg-ivory px-8 py-3.5 font-label text-[11px] text-ink transition-all duration-500 hover:border-burgundy/30 hover:text-burgundy"
          >
            View all
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {quickView && <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />}
      </AnimatePresence>
    </section>
  );
}
