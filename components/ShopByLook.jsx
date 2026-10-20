'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { getProduct } from '@/lib/products';
import { money } from '@/lib/format';

const looks = [
  {
    id: 'ear-wrist-edit',
    image: '/images/look-ear-wrist.jpg',
    alt: 'Indian model wearing phalaenopsis earrings, flower bracelet and floral ring',
    hotspots: [
      { id: 'earrings', productSlug: 'phalaenopsis-hoop-earrings', x: 24, y: 44 },
      { id: 'ring', productSlug: 'flower-adjustable-ring-silver', x: 58, y: 50 },
      { id: 'bracelet', productSlug: 'flower-in-the-rain-pink', x: 60, y: 82 },
    ],
  },
  {
    id: 'collar-lapel-edit',
    image: '/images/look-collar-lapel.jpg',
    alt: 'Indian model wearing pink flower necklace, calla lily brooch and floral ring',
    hotspots: [
      { id: 'necklace', productSlug: 'flower-in-the-rain-necklace-pink', x: 50, y: 52 },
      { id: 'brooch', productSlug: 'calla-lily-brooch-gold', x: 70, y: 58 },
      { id: 'ring', productSlug: 'flower-adjustable-ring', x: 78, y: 70 },
    ],
  },
];

function Hotspot({ spot, active, onActivate, onDeactivate }) {
  const product = getProduct(spot.productSlug);
  if (!product) return null;

  const flip = spot.x > 55;
  const href = `/shop/${product.slug}`;

  return (
    <div
      className="absolute z-20"
      style={{ left: `${spot.x}%`, top: `${spot.y}%`, transform: 'translate(-50%, -50%)' }}
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
      onFocus={onActivate}
      onBlur={onDeactivate}
    >
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span className="absolute h-10 w-10 rounded-full bg-white/25 blur-[2px]" />
        <span className="shop-dot-ping absolute h-8 w-8 rounded-full border border-white/50" />
        <span className="shop-dot-ping-delay absolute h-12 w-12 rounded-full border border-white/25" />
      </span>

      <button
        type="button"
        aria-label={`Show ${product.name}`}
        aria-expanded={active}
        onClick={(e) => {
          e.stopPropagation();
          onActivate();
        }}
        className={`relative flex h-4 w-4 items-center justify-center rounded-full transition-transform duration-500 ${
          active ? 'scale-125' : 'hover:scale-110'
        }`}
      >
        <span className="absolute h-3.5 w-3.5 rounded-full bg-white/95 shadow-[0_0_18px_rgba(255,255,255,0.85)]" />
        <span className="absolute h-1.5 w-1.5 rounded-full bg-burgundy" />
      </button>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, x: flip ? 12 : -12, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: flip ? 8 : -8, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute top-1/2 z-30 -translate-y-1/2 ${
              flip ? 'right-[calc(100%+12px)]' : 'left-[calc(100%+12px)]'
            }`}
            onMouseEnter={onActivate}
            onMouseLeave={onDeactivate}
          >
            <Link
              href={href}
              className="group/pill flex w-[min(220px,calc(100vw-2.5rem))] max-w-[260px] items-center gap-3 rounded-full border border-white/50 bg-ivory/96 py-2 pr-4 pl-2 shadow-[0_14px_44px_rgba(20,18,16,0.22)] backdrop-blur-md transition-transform duration-300 hover:scale-[1.02]"
            >
              <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-cream ring-1 ring-ink/8">
                <Image src={product.image} alt="" fill className="object-cover" sizes="44px" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-medium tracking-[-0.01em] text-ink">
                  {product.name}
                </span>
                <span className="mt-0.5 flex items-center justify-between gap-2">
                  <span className="font-num text-[11px] text-ink/85">{money(product.price)}</span>
                  <span className="font-label text-[9px] tracking-[0.14em] text-gold uppercase">
                    View
                  </span>
                </span>
              </span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LookCard({ look }) {
  const [activeId, setActiveId] = useState(null);
  const cardRef = useRef(null);
  const leaveTimer = useRef(null);
  const uid = useId();

  useEffect(() => {
    function onDocPointer(e) {
      if (!cardRef.current?.contains(e.target)) setActiveId(null);
    }
    document.addEventListener('pointerdown', onDocPointer);
    return () => document.removeEventListener('pointerdown', onDocPointer);
  }, []);

  function activate(id) {
    clearTimeout(leaveTimer.current);
    setActiveId(id);
  }

  function scheduleDeactivate() {
    clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(() => setActiveId(null), 120);
  }

  return (
    <article
      ref={cardRef}
      className="group relative h-full min-h-0 overflow-hidden rounded-[1.25rem] md:rounded-[1.5rem]"
    >
      <div className="relative h-full min-h-0 overflow-hidden bg-cream">
        <Image
          src={look.image}
          alt={look.alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-center transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
          priority
        />

        {look.hotspots.map((spot) => (
          <Hotspot
            key={`${uid}-${spot.id}`}
            spot={spot}
            active={activeId === spot.id}
            onActivate={() => activate(spot.id)}
            onDeactivate={scheduleDeactivate}
          />
        ))}
      </div>
    </article>
  );
}

export default function ShopByLook() {
  return (
    <section className="box-border flex min-h-[min(100svh,52rem)] flex-col bg-ivory px-5 py-8 md:min-h-[min(100svh,40rem)] md:px-10 md:py-10">
      <div className="mx-auto flex min-h-0 w-full max-w-[1600px] flex-1 flex-col">
        <div className="mb-4 flex shrink-0 flex-col justify-between gap-2 md:mb-5 md:flex-row md:items-end">
          <div>
            <p className="font-label text-gold">Shop by look</p>
            <h2 className="font-display mt-2 max-w-2xl text-3xl leading-[1.08] text-ink md:text-5xl">
              How the pieces live together.
            </h2>
          </div>
          <p className="max-w-sm text-sm font-light leading-relaxed text-ink/80">
            Tap the soft lights on each look. A pill appears with the piece — open it to shop.
          </p>
        </div>

        <div className="grid min-h-[22rem] flex-1 grid-rows-2 gap-3 md:min-h-[26rem] md:grid-cols-2 md:grid-rows-1 md:gap-4">
          {looks.map((look) => (
            <LookCard key={look.id} look={look} />
          ))}
        </div>

        <div className="mt-4 flex shrink-0 justify-center md:mt-5">
          <Link
            href="/shop"
            className="bg-velvet-texture inline-flex items-center rounded-full px-6 py-2.5 font-label text-[11px] text-ivory transition-opacity hover:opacity-90"
          >
            Shop the collection
          </Link>
        </div>
      </div>
    </section>
  );
}
