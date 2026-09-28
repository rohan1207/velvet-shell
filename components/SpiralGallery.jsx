'use client';

import Link from 'next/link';
import InfiniteSpiral from './InfiniteSpiral';

const images = [
  { src: '/images/product-nacre-collar.png', alt: 'Nacre Collar', href: '/shop/nacre-collar' },
  { src: '/images/product-tide-drops.png', alt: 'Tide Drops', href: '/shop/tide-drops' },
  { src: '/images/product-abalone-signet.png', alt: 'Abalone Signet', href: '/shop/abalone-signet' },
  { src: '/images/product-velvet-cuff.png', alt: 'Velvet Cuff', href: '/shop/velvet-cuff' },
  { src: '/images/product-lumen-choker.png', alt: 'Lumen Choker', href: '/shop/lumen-choker' },
  { src: '/images/product-moonlit-strand.png', alt: 'Moonlit Strand', href: '/shop/moonlit-strand' },
  { src: '/images/look-neck-ears.png', alt: 'Collar edit look' },
  { src: '/images/look-wrist-ring.png', alt: 'Wrist edit look' },
  { src: '/images/hero-shell-reveal.png', alt: 'Shell reveal' },
  { src: '/images/banner-bracelets.png', alt: 'Bracelets campaign' },
];

export default function SpiralGallery() {
  return (
    <section className="relative overflow-hidden bg-ivory">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(94,6,42,0.05)_0%,transparent_55%)]" />

      <div className="relative mx-auto max-w-[1600px] px-5 py-16 md:px-10 md:py-20 lg:py-24">
        {/* Mobile intro */}
        <div className="mb-8 text-center lg:hidden">
          <p className="font-label text-gold">The spiral</p>
          <h2 className="font-display mt-3 text-4xl text-ink">Pieces in quiet orbit.</h2>
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(320px,1.15fr)_minmax(0,1fr)] lg:gap-6 xl:gap-10">
          {/* Left — Velvet story */}
          <aside className="relative z-10 order-2 max-w-md lg:order-1 lg:max-w-none lg:pr-2">
            <p className="font-label text-gold">Velvet</p>
            <h2 className="font-display mt-4 text-3xl leading-[1.12] text-ink md:text-4xl xl:text-[2.65rem]">
              Softness on the outside.
              <span className="font-display-italic mt-1 block text-burgundy">Strength within.</span>
            </h2>
            <p className="mt-5 text-[15px] font-light leading-[1.75] text-ink/55">
              Velvet Shell is named for that hush before a reveal — the quiet luxury of something held
              close, then opened. Every piece is made to feel considered: not loud, only lasting.
            </p>
            <ul className="mt-7 space-y-3 text-sm font-light text-ink/45">
              <li className="flex gap-3">
                <span className="mt-2 h-px w-5 shrink-0 bg-gold" />
                Anticipation before the reveal
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-px w-5 shrink-0 bg-gold" />
                Design with restraint and meaning
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-px w-5 shrink-0 bg-gold" />
                Jewellery as a kept secret
              </li>
            </ul>
            <Link
              href="/about"
              className="mt-9 inline-flex items-center gap-3 rounded-full border border-ink/12 bg-white/60 px-6 py-3 font-label text-[11px] text-ink transition-colors hover:border-ink/25 hover:bg-white"
            >
              The house
              <span aria-hidden className="text-gold">
                →
              </span>
            </Link>
          </aside>

          {/* Center — spiral */}
          <div className="relative order-1 lg:order-2">
            <p className="mb-2 hidden text-center font-label text-gold lg:block">The spiral</p>
            <div className="relative mx-auto h-[520px] w-full max-w-[420px] overflow-visible sm:h-[560px] md:h-[600px] lg:max-w-none lg:h-[620px] xl:h-[680px]">
              <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-ivory to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-ivory to-transparent" />
              <InfiniteSpiral
                items={images}
                animationMode="auto"
                speed={0.55}
                radius={150}
                cardWidth={108}
                cardHeight={108}
                verticalSpacing={56}
                perspective={1100}
                cardRadius={12}
                centerScale={1.15}
                edgeBlur={4}
                cardsPerTurn={7}
                pauseOnHover={false}
                direction="up"
                rotation={0}
                cardTilt={0}
                edgeFade={0.22}
                imageFit="cover"
                grayscale={0}
                className="!min-h-full"
              />
            </div>
            <p className="mt-3 hidden text-center text-[11px] tracking-[0.18em] text-ink/30 uppercase lg:block">
              A soft turn through the edit
            </p>
          </div>

          {/* Right — materials differentiator */}
          <aside className="relative z-10 order-3 max-w-md lg:max-w-none lg:pl-2 lg:text-right">
            <p className="font-label text-gold">Materials</p>
            <h2 className="font-display mt-4 text-3xl leading-[1.12] text-ink md:text-4xl xl:text-[2.65rem]">
              Silver that meets
              <span className="font-display-italic mt-1 block text-burgundy">eighteen-karat gold.</span>
            </h2>
            <p className="mt-5 text-[15px] font-light leading-[1.75] text-ink/55 lg:ml-auto lg:max-w-sm">
              Our pieces are not S925 alone. Where the design asks for warmth and lasting presence, we
              bring in 18k gold — a quieter alloy of light and longevity, finished for the body rather
              than for a tray.
            </p>
            <p className="mt-4 text-[14px] font-light leading-[1.7] text-ink/40 lg:ml-auto lg:max-w-sm">
              It is a small distinction that changes how a piece feels in the hand, and how it lives
              with you over time — craft over costume, substance over shine for a season.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 lg:justify-end">
              <span className="rounded-full border border-ink/12 bg-white/70 px-4 py-2 text-[10px] font-semibold tracking-[0.16em] text-ink/60 uppercase">
                S925 silver
              </span>
              <span className="rounded-full border border-gold/50 bg-gold/10 px-4 py-2 text-[10px] font-semibold tracking-[0.16em] text-burgundy uppercase">
                18k gold
              </span>
            </div>
            <Link
              href="/shop"
              className="mt-9 inline-flex items-center gap-3 rounded-full bg-burgundy px-6 py-3 font-label text-[11px] text-ivory transition-opacity hover:opacity-90 lg:ml-auto"
            >
              Shop the collection
              <span aria-hidden>→</span>
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
