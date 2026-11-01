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
    id: 'daisy-garden-set',
    image: '/images/look-daisy-garden.jpg',
    alt: 'Indian model in a daisy meadow wearing the Daisy Flower jewellery set — hoop earrings and pendant necklace',
    hotspots: [
      { id: 'earrings', productSlug: 'daisy-hoop-earrings-ywje0091', x: 20, y: 40 },
      { id: 'necklace', productSlug: 'daisy-pendant-necklace-ywje0092', x: 46, y: 66 },
    ],
  },
  {
    id: 'dolphin-waterside-set',
    image: '/images/look-dolphin-waterside.jpg',
    alt: 'Indian model by the water wearing the Dolphin jewellery set — stud earrings and pendant necklace',
    hotspots: [
      { id: 'earrings', productSlug: 'dolphin-stud-earrings-ywje0088-er', x: 72, y: 40 },
      { id: 'necklace', productSlug: 'dolphin-pendant-necklace-ywje0088-nk', x: 52, y: 68 },
    ],
  },
];

/** Fallback only if live set data is unavailable — prices match set price_override (full set). */
const FALLBACK_SETS = [
  {
    slug: 'daisy-flower-jewellery-set-s07',
    name: 'Daisy Flower Jewellery Set',
    image: '/products/sets/daisy-flower-jewellery-set-s07/03.png',
    price: 1999,
    pieceCount: 2,
    line: 'Complete set',
  },
  {
    slug: 'dolphin-jewellery-set-s06',
    name: 'Dolphin Jewellery Set',
    image: '/products/sets/dolphin-jewellery-set-s06/01.png',
    price: 1699,
    pieceCount: 2,
    line: 'Complete set',
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
        className="object-contain object-center transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
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

function SetPromoCard({ set }) {
  const href = set.href || `/sets/${set.slug}`;
  const pieceCount =
    set.pieceCount ??
    (Array.isArray(set.members) ? set.members.length : 0);

  return (
    <Link
      href={href}
      className="group flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.15rem] bg-white ring-1 ring-ink/8 transition-shadow duration-500 hover:shadow-[0_16px_40px_rgba(40,20,24,0.08)] sm:rounded-[1.35rem]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-pearl sm:aspect-[5/4] lg:aspect-auto lg:min-h-0 lg:flex-1">
        <AppImage
          src={set.image}
          alt={set.name}
          fill
          sizes="(max-width:1024px) 100vw, 30vw"
          className="object-contain object-center p-2 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] sm:p-3"
        />
      </div>
      <div className="flex shrink-0 flex-col justify-center px-3.5 py-3 sm:px-4 sm:py-3.5">
        <p className="font-label text-[9px] tracking-[0.16em] text-gold uppercase">Jewellery set</p>
        <p className="font-display mt-1 line-clamp-2 text-[1.05rem] leading-snug tracking-[-0.02em] text-ink sm:text-[1.15rem]">
          {set.name}
        </p>
        {set.line ? (
          <p className="mt-1 truncate text-[11px] font-light text-ink/55">{set.line}</p>
        ) : null}
        <div className="mt-2 flex items-center justify-between gap-2">
          <p className="font-num text-[13px] text-burgundy">
            {money(set.price)}
            {pieceCount > 0 ? (
              <span className="ml-1.5 text-[11px] font-light tracking-normal text-ink/45">
                · {pieceCount} pcs
              </span>
            ) : null}
          </p>
          <span className="font-label text-[9px] tracking-[0.14em] text-ink/40 uppercase transition-colors group-hover:text-burgundy">
            View set →
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function ShopByLook({ featuredSets }) {
  const setsHref = shopCategoryHref('sets');
  const setCards =
    Array.isArray(featuredSets) && featuredSets.length > 0 ? featuredSets : FALLBACK_SETS;

  return (
    <section className="box-border flex min-h-[100svh] flex-col bg-ivory px-4 py-6 sm:px-5 sm:py-8 md:px-10 md:py-9">
      <div className="mx-auto flex min-h-0 w-full max-w-[1600px] flex-1 flex-col">
        <div className="mb-4 flex shrink-0 flex-col gap-2 sm:mb-5 md:flex-row md:items-end md:justify-between">
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

        <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[minmax(0,1.4fr)_minmax(16rem,0.85fr)] lg:gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(18rem,0.8fr)]">
          {/* Left: two vertical look cards side by side */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:h-full lg:min-h-[min(72svh,40rem)]">
            {looks.map((look) => (
              <LookCard key={look.id} look={look} />
            ))}
          </div>

          {/* Right: two set cards stacked (side-by-side on small tablets) */}
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 lg:grid-cols-1 lg:grid-rows-2 lg:gap-4 lg:h-full lg:min-h-[min(72svh,40rem)]">
            {setCards.map((set) => (
              <SetPromoCard key={set.slug} set={set} />
            ))}
          </div>
        </div>

        <div className="mt-5 flex shrink-0 justify-center sm:mt-6">
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
