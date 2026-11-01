'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '@/context/StoreContext';
import { money } from '@/lib/format';
import { shopCategoryHref } from '@/lib/shop-links';
import AppImage from '@/components/AppImage';

const looks = [
  {
    id: 'pearl-fairy-set',
    image: '/images/look-pearl-set-v2.jpg',
    alt: 'Model wearing the Fairy-Like Fringed pearl collarbone chain and matching bracelet',
    hotspots: [
      // Silver heart charm on the pearl necklace at collarbone
      {
        id: 'necklace',
        productSlug: 'fairy-like-fringed-collarbone-chain-with-heart-shaped-pearl-bead-nck-016',
        x: 48,
        y: 58,
      },
      // Matching bracelet on the wrist at the shoulder
      {
        id: 'bracelet',
        productSlug: 'fairy-like-fringed-bracelet-with-heart-shaped-pearl-bead-brc-028',
        x: 57,
        y: 48,
      },
    ],
  },
  {
    id: 'daisy-chain-set',
    image: '/images/look-daisy-set-v2.jpg',
    alt: 'Model wearing the Daisy necklace, ring and bracelet set with fine chain links',
    hotspots: [
      // Daisy pendant on the collarbone
      {
        id: 'necklace',
        productSlug: 'daisy-necklace-with-fine-chain-links-ywje0076',
        x: 51,
        y: 45,
      },
      // Daisy ring on the raised hand
      {
        id: 'ring',
        productSlug: 'daisy-ring-with-fine-chain-links-ywje0077',
        x: 33,
        y: 52,
      },
      // Daisy bracelet on the wrist
      {
        id: 'bracelet',
        productSlug: 'daisy-bracelet-with-fine-chain-links-ywje0075',
        x: 39,
        y: 71,
      },
    ],
  },
];

/** Fallback only if live set data is unavailable — prices match live member sums. */
const FALLBACK_SETS = [
  {
    slug: 'fairy-like-fringed-collarbone-chain-bracelet-with-heart-shaped-pearl-bea',
    name: 'Fairy-Like Fringed Collarbone Chain Bracelet with Heart-Shaped Pearl Bead',
    image:
      'https://pub-0389e1de118b4372bc8e3672b0b59760.r2.dev/products/2026-10-27/f2389014-0caa-4fbd-b3df-1ad6d98f7aa9-10sl32-d.avif',
    price: 18998,
    pieceCount: 2,
    href: '/sets/fairy-like-fringed-collarbone-chain-bracelet-with-heart-shaped-pearl-bea',
  },
  {
    slug: 'daisy-necklace-ring-bracelet-set-with-fine-chain-links-s02',
    name: 'Daisy Necklace, Ring & Bracelet Set with Fine Chain Links',
    image: '/products/sets/daisy-necklace-ring-bracelet-set-with-fine-chain-links-s02/01.png',
    price: 12497,
    pieceCount: 3,
    href: '/sets/daisy-necklace-ring-bracelet-set-with-fine-chain-links-s02',
  },
];

function ProductPill({ product, href, className = '' }) {
  return (
    <Link
      href={href}
      className={`group/pill flex w-[min(220px,calc(100vw-2.5rem))] max-w-[240px] items-center gap-2.5 rounded-full border border-white/50 bg-ivory/96 py-1.5 pr-3.5 pl-1.5 shadow-[0_14px_44px_rgba(20,18,16,0.22)] backdrop-blur-md transition-transform duration-300 hover:scale-[1.02] ${className}`}
    >
      <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-cream ring-1 ring-ink/8">
        <Image src={product.image} alt="" fill className="object-cover" sizes="36px" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[12px] font-medium tracking-[-0.01em] text-ink">
          {product.name}
        </span>
        <span className="mt-0.5 flex items-center justify-between gap-2">
          <span className="font-num text-[10px] text-ink/85">{money(product.price)}</span>
          <span className="font-label text-[8px] tracking-[0.14em] text-gold uppercase">View</span>
        </span>
      </span>
    </Link>
  );
}

function Hotspot({ spot, active, onActivate, onDeactivate }) {
  const { getProduct } = useStore();
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
        <span className="absolute h-9 w-9 rounded-full bg-white/25 blur-[2px]" />
        <span className="shop-dot-ping absolute h-7 w-7 rounded-full border border-white/50" />
      </span>

      <button
        type="button"
        aria-label={`Show ${product.name}`}
        aria-expanded={active}
        onClick={(e) => {
          e.stopPropagation();
          onActivate();
        }}
        className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-transform duration-500 md:h-4 md:w-4 ${
          active ? 'scale-110 md:scale-125' : 'hover:scale-110'
        }`}
      >
        <span className="absolute h-3.5 w-3.5 rounded-full bg-white/95 shadow-[0_0_18px_rgba(255,255,255,0.85)] md:h-3 md:w-3" />
        <span className="absolute h-1.5 w-1.5 rounded-full bg-burgundy" />
      </button>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, x: flip ? 12 : -12, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: flip ? 8 : -8, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute top-1/2 z-30 hidden -translate-y-1/2 lg:block ${
              flip ? 'right-[calc(100%+10px)]' : 'left-[calc(100%+10px)]'
            }`}
            onMouseEnter={onActivate}
            onMouseLeave={onDeactivate}
          >
            <ProductPill product={product} href={href} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LookCard({ look }) {
  const { getProduct } = useStore();
  const [activeId, setActiveId] = useState(null);
  const cardRef = useRef(null);
  const leaveTimer = useRef(null);
  const uid = useId();

  const activeSpot = look.hotspots.find((s) => s.id === activeId);
  const activeProduct = activeSpot ? getProduct(activeSpot.productSlug) : null;

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
      className="group relative aspect-[3/4] h-auto w-full overflow-hidden rounded-[1.15rem] bg-pearl ring-1 ring-ink/6 sm:rounded-[1.35rem] lg:aspect-auto lg:h-full lg:min-h-0"
    >
      <Image
        src={look.image}
        alt={look.alt}
        fill
        sizes="(max-width:768px) 48vw, 28vw"
        className="object-cover object-center transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
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

      <AnimatePresence>
        {activeProduct && activeSpot ? (
          <motion.div
            key={activeSpot.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-2 bottom-2 z-30 flex justify-center lg:hidden"
          >
            <ProductPill
              product={activeProduct}
              href={`/shop/${activeProduct.slug}`}
              className="w-full max-w-none"
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </article>
  );
}

/** Square set card — same language as Sets page SetCard. */
function SetPromoCard({ set }) {
  const href = set.href || `/sets/${set.slug}`;
  const pieceCount =
    set.pieceCount ??
    (Array.isArray(set.members) ? set.members.length : 0);

  return (
    <article className="group flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1rem] bg-white shadow-[0_8px_28px_rgba(40,20,24,0.06)] ring-1 ring-ink/8 sm:rounded-[1.15rem]">
      <Link
        href={href}
        className="relative block min-h-0 flex-1"
        aria-label={`View ${set.name}`}
      >
        <div className="relative isolate h-full min-h-[7.5rem] w-full overflow-hidden bg-white sm:min-h-[8.5rem]">
          <AppImage
            src={set.image}
            alt={set.name}
            fill
            sizes="220px"
            className="object-contain object-center p-2.5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] [@media(hover:hover)]:group-hover:scale-[1.03] sm:p-3"
          />
          {set.outOfStock ? (
            <span className="absolute top-2 left-2 rounded-full bg-white/95 px-2 py-0.5 font-label text-[8px] tracking-[0.14em] text-burgundy uppercase ring-1 ring-ink/6">
              Out of stock
            </span>
          ) : (
            <span className="absolute top-2 left-2 rounded-full bg-white/95 px-2 py-0.5 font-label text-[8px] tracking-[0.14em] text-ink uppercase ring-1 ring-ink/6">
              {set.badge || 'Set'}
            </span>
          )}
        </div>
      </Link>

      <div className="relative flex shrink-0 flex-col px-2.5 py-2 sm:px-3 sm:py-2.5">
        <Link
          href={href}
          className="font-label line-clamp-2 min-h-[2.2em] w-full text-center text-[9px] leading-[1.25] tracking-[0.08em] text-ink uppercase transition-colors hover:text-burgundy sm:text-[10px]"
        >
          {set.name}
        </Link>
        <p className="font-num mt-1 text-center text-[12px] tracking-[0.04em] text-ink/75 sm:text-[13px]">
          {money(set.price)}
          {pieceCount > 0 ? (
            <span className="ml-1 text-[10px] tracking-normal text-ink/45">
              · {pieceCount} pcs
            </span>
          ) : null}
        </p>
      </div>
    </article>
  );
}

export default function ShopByLook({ featuredSets }) {
  const setsHref = shopCategoryHref('sets');
  const setCards =
    Array.isArray(featuredSets) && featuredSets.length > 0 ? featuredSets : FALLBACK_SETS;

  return (
    <section className="box-border bg-ivory px-4 py-6 sm:px-5 sm:py-8 md:px-10 md:py-9">
      <div className="mx-auto w-full max-w-[1600px]">
        <div className="mb-4 flex flex-col gap-2 sm:mb-5 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <p className="font-label text-[10px] tracking-[0.22em] text-gold uppercase">The edit</p>
            <h2 className="font-display mt-2 max-w-2xl text-[1.85rem] leading-[1.08] text-ink sm:text-3xl md:text-5xl">
              Shop by look
            </h2>
          </div>
          <p className="max-w-sm text-[13px] font-light leading-relaxed text-ink/75 sm:text-sm">
            Tap the lights on each look — then open the matching set beside it.
          </p>
        </div>

        {/* Single composition: left looks (screen-height) + right set cards */}
        <div className="flex w-full flex-col gap-3 sm:gap-4 lg:h-[min(82svh,46rem)] lg:flex-row lg:items-stretch lg:justify-between lg:gap-5 xl:gap-6">
          {/* Left-aligned model pair — fills most of the viewport height */}
          <div className="grid min-h-0 w-full grid-cols-2 gap-2.5 sm:gap-3 lg:h-full lg:min-w-0 lg:flex-1 lg:self-stretch">
            {looks.map((look) => (
              <LookCard key={look.id} look={look} />
            ))}
          </div>

          {/* Right-aligned set stack — same height as the looks */}
          <div className="ml-auto flex w-[min(100%,11.75rem)] shrink-0 flex-col gap-2.5 sm:w-[13rem] sm:gap-3 md:w-[14rem] lg:ml-0 lg:h-full lg:w-[13.25rem] xl:w-[14.5rem]">
            {setCards.map((set) => (
              <SetPromoCard key={set.slug} set={set} />
            ))}
          </div>
        </div>

        <div className="mt-5 flex justify-center sm:mt-6">
          <Link
            href={setsHref}
            className="bg-velvet-texture inline-flex h-11 items-center rounded-full px-7 font-label text-[11px] tracking-[0.18em] text-ivory transition-opacity hover:opacity-90"
          >
            Shop sets
          </Link>
        </div>
      </div>
    </section>
  );
}
