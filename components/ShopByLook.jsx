'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { getProduct } from '@/lib/products';
import { money } from '@/lib/format';

const looks = [
  {
    id: 'collar-edit',
    title: 'The Collar Edit',
    line: 'Necklace + earrings, worn as one thought.',
    image: '/images/look-neck-ears.png',
    alt: 'Model wearing coordinated necklace and earrings',
    hotspots: [
      { id: 'necklace', productSlug: 'nacre-collar', x: 52, y: 48 },
      { id: 'earrings', productSlug: 'tide-drops', x: 68, y: 28 },
    ],
  },
  {
    id: 'wrist-edit',
    title: 'The Wrist Edit',
    line: 'Bracelet + ring, a quiet conversation.',
    image: '/images/look-wrist-ring.png',
    alt: 'Model wearing coordinated bracelet and ring',
    hotspots: [
      { id: 'bracelet', productSlug: 'velvet-cuff', x: 48, y: 52 },
      { id: 'ring', productSlug: 'abalone-signet', x: 62, y: 38 },
    ],
  },
];

function Hotspot({ spot, active, onEnter, onLeave, flip = false }) {
  const product = getProduct(spot.productSlug);
  if (!product) return null;

  return (
    <div
      className="absolute z-20"
      style={{ left: `${spot.x}%`, top: `${spot.y}%`, transform: 'translate(-50%, -50%)' }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span className="absolute h-10 w-10 rounded-full bg-white/25 blur-[2px]" />
        <span className="shop-dot-ping absolute h-8 w-8 rounded-full border border-white/50" />
        <span className="shop-dot-ping-delay absolute h-12 w-12 rounded-full border border-white/25" />
      </span>

      <button
        type="button"
        aria-label={product.name}
        className={`relative flex h-3.5 w-3.5 items-center justify-center rounded-full transition-transform duration-500 ${
          active ? 'scale-125' : 'hover:scale-110'
        }`}
      >
        <span className="absolute h-3.5 w-3.5 rounded-full bg-white/90 shadow-[0_0_18px_rgba(255,255,255,0.85)]" />
        <span className="absolute h-1.5 w-1.5 rounded-full bg-burgundy" />
      </button>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, x: flip ? 12 : -12, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: flip ? 8 : -8, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute top-1/2 z-30 -translate-y-1/2 ${
              flip ? 'right-[calc(100%+14px)]' : 'left-[calc(100%+14px)]'
            }`}
          >
            <div className="flex min-w-[200px] items-center gap-3 rounded-full border border-white/40 bg-ivory/95 py-2 pr-5 pl-2 shadow-[0_12px_40px_rgba(20,18,16,0.18)] backdrop-blur-md">
              <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-cream ring-1 ring-ink/5">
                <Image src={product.image} alt="" fill className="object-cover" sizes="40px" />
              </span>
              <div className="min-w-0 pr-1">
                <p className="truncate text-[13px] font-medium tracking-[-0.01em] text-ink">{product.name}</p>
                <p className="mt-0.5 text-[11px] tracking-[0.04em] text-stone">{money(product.price)}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LookCard({ look, flipPills = false }) {
  const [activeId, setActiveId] = useState(null);

  return (
    <article className="group relative h-full min-h-0 overflow-hidden rounded-[1.25rem] md:rounded-[1.5rem]">
      <div className="relative h-full min-h-0 overflow-hidden bg-cream">
        <Image
          src={look.image}
          alt={look.alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />

        {look.hotspots.map((spot) => (
          <Hotspot
            key={spot.id}
            spot={spot}
            flip={flipPills || spot.x > 58}
            active={activeId === spot.id}
            onEnter={() => setActiveId(spot.id)}
            onLeave={() => setActiveId(null)}
          />
        ))}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 md:p-7">
          <p className="font-label text-[10px] text-ivory/70">Shop by look</p>
          <h3 className="font-display mt-1.5 text-2xl text-ivory md:text-3xl lg:text-4xl">{look.title}</h3>
          <p className="mt-1.5 max-w-xs text-sm text-ivory/70">{look.line}</p>
        </div>
      </div>
    </article>
  );
}

export default function ShopByLook() {
  return (
    <section className="box-border flex h-[100svh] flex-col bg-ivory px-5 py-5 md:px-10 md:py-6">
      <div className="mx-auto flex min-h-0 w-full max-w-[1600px] flex-1 flex-col">
        <div className="mb-4 flex shrink-0 flex-col justify-between gap-3 md:mb-5 md:flex-row md:items-end">
          <div>
            <p className="font-label text-gold">Shop by look</p>
            <h2 className="font-display mt-2 max-w-2xl text-3xl leading-[1.08] text-ink md:text-5xl">
              How the pieces live together.
            </h2>
          </div>
          <p className="max-w-sm text-sm font-light leading-relaxed text-ink/50">
            Hover the soft lights on each look. A quiet note appears for the piece.
          </p>
        </div>

        <div className="grid min-h-0 flex-1 grid-rows-2 gap-3 md:grid-cols-2 md:grid-rows-1 md:gap-4">
          {looks.map((look, i) => (
            <LookCard key={look.id} look={look} flipPills={i === 1} />
          ))}
        </div>

        <div className="mt-4 flex shrink-0 justify-center md:mt-5">
          <Link
            href="/lookbook"
            className="inline-flex items-center rounded-full border border-ink/12 px-6 py-2.5 font-label text-[11px] text-ink transition-colors hover:border-ink/30"
          >
            View lookbook
          </Link>
        </div>
      </div>
    </section>
  );
}
