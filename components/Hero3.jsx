'use client';

import { useRef } from 'react';
import AppImage from '@/components/AppImage';
import Link from 'next/link';
import { giftingHref, shopCategoryHref } from '@/lib/shop-links';
import HeroEarringReel from './HeroEarringReel';
import HeroFlowerFrames from './HeroFlowerFrames';
import ResponsiveBannerImage from '@/components/ResponsiveBannerImage';

function ArrowCircle({ className = '' }) {
  return (
    <span
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ink/10 bg-white text-burgundy ${className}`}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M7 17L17 7M10 7h7v7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export default function Hero3() {
  const sectionRef = useRef(null);

  return (
    <section
      ref={sectionRef}
      className="relative z-[1] box-border flex flex-col bg-ivory pt-3 pb-3 md:pt-4 md:pb-4"
    >
      <div className="mx-auto flex w-full max-w-[1600px] flex-col px-3 md:px-4">
        {/* Desktop / tablet bento — height fills pinned viewport under chrome */}
        <div className="hidden gap-3 md:grid md:h-[calc(100svh-var(--site-promo-h)-var(--site-nav-h)-1.25rem)] md:min-h-[36rem] md:grid-cols-[minmax(0,1fr)_auto] lg:gap-3.5">
          <div className="flex min-h-0 flex-col gap-3 lg:gap-3.5">
            <div className="relative grid min-h-0 flex-[1.15] grid-cols-[minmax(0,1fr)_minmax(240px,42%)] items-stretch overflow-hidden rounded-[1.5rem] bg-pearl lg:rounded-[1.75rem] xl:grid-cols-[minmax(0,1fr)_minmax(280px,44%)]">
              <span className="pointer-events-none absolute top-0 left-0 z-10 h-full w-1.5 bg-burgundy" />
              <span className="pointer-events-none absolute top-5 right-5 z-10 h-1.5 w-1.5 rounded-full bg-gold" />

              <div className="relative z-10 flex flex-col justify-center px-8 py-7 pr-4 md:px-9 md:py-8 lg:px-12 lg:py-9 xl:px-14">
                <h1 className="font-bodoni text-[clamp(2rem,3.2vw,3.1rem)] leading-[1.08] tracking-[0.01em] text-ink">
                  The Beauty Of Becoming
                </h1>
                <span className="mt-4 block h-px w-16 bg-gradient-to-r from-gold via-gold to-transparent" />
                <p className="mt-5 max-w-2xl text-[13.5px] leading-[1.75] font-normal tracking-[-0.01em] text-ink/80 lg:text-[14.5px] lg:leading-[1.8]">
                  Velvet Shell is a contemporary house of jewellery, gifting and lifestyle creations.
                  Every piece begins with considered design and ends with a moment of discovery -
                  something to wear, to give, to keep and to remember.
                </p>
                <p className="mt-4 max-w-2xl text-[13.5px] leading-[1.75] font-normal tracking-[-0.01em] text-ink/80 lg:text-[14.5px] lg:leading-[1.8]">
                  And in every becoming - of self, of a bond, of a moment, there is something beautiful
                  waiting to unwrap.
                </p>
              </div>

              <div className="relative min-h-[14rem] self-stretch overflow-hidden lg:min-h-0">
                <HeroFlowerFrames scrollRoot={sectionRef} />
              </div>
            </div>

            <div className="grid min-h-0 flex-1 grid-cols-2 gap-3 lg:gap-3.5">
              <div className="relative min-h-0 overflow-hidden rounded-[1.5rem] lg:rounded-[1.75rem]">
                <HeroEarringReel />
              </div>

              <Link
                href={giftingHref()}
                data-cursor="Gift"
                className="group relative min-h-0 overflow-hidden rounded-[1.5rem] bg-[#ebe6df] lg:rounded-[1.75rem]"
              >
              <ResponsiveBannerImage
                src="/images/hero-gifting-beach.jpg"
                alt="Velvet Shell gift bag and shell boxes on the beach at sunrise — a treasure in every reveal"
                sizes="28vw"
                className="object-cover object-center transition-transform duration-[1.15s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
              />
                <span className="bg-velvet-texture absolute bottom-3 left-3 z-10 inline-flex items-center gap-2 rounded-full py-2 pr-2 pl-3.5 shadow-sm">
                  <span className="text-[9px] font-semibold tracking-[0.14em] text-ivory uppercase">
                    Gifting
                  </span>
                  <ArrowCircle className="border-gold/40 bg-ivory text-burgundy" />
                </span>
              </Link>
            </div>
          </div>

          <Link
            href={shopCategoryHref('rings')}
            data-cursor="Shop"
            className="group relative h-full min-h-0 aspect-[1073/1466] max-w-full justify-self-end overflow-hidden rounded-[1.5rem] bg-pearl lg:rounded-[1.75rem]"
          >
            <AppImage
              src="/hero/floral_ring.png"
              alt="Indian model wearing Velvet Shell floral silver rings and jewellery"
              fill
              priority
              sizes="(min-width: 768px) 38vw, 100vw"
              className="object-contain object-center transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
            />
          </Link>
        </div>

        {/* Mobile */}
        <div className="flex flex-col gap-2.5 md:hidden">
          <div className="relative shrink-0 overflow-hidden rounded-[1.35rem] bg-pearl">
            <span className="absolute top-0 left-0 z-10 h-full w-1 bg-burgundy" />
            <div className="px-5 pt-6 pr-4 pb-2">
              <h1 className="font-bodoni text-[1.85rem] leading-[1.08] tracking-[0.01em] text-ink">
                The Beauty Of Becoming
              </h1>
              <span className="mt-3 block h-px w-14 bg-gradient-to-r from-gold via-gold to-transparent" />
              <p className="mt-4 text-[12.5px] leading-[1.7] text-ink/80">
                Velvet Shell is a contemporary house of jewellery, gifting and lifestyle creations.
                Every piece begins with considered design and ends with a moment of discovery -
                something to wear, to give, to keep and to remember.
              </p>
              <p className="mt-3 text-[12.5px] leading-[1.7] text-ink/80">
                And in every becoming - of self, of a bond, of a moment, there is something beautiful
                waiting to unwrap.
              </p>
            </div>
            <div className="flex justify-end px-3 pb-2">
              <AppImage
                src="/flower-frames/ezgif-frame-030.png"
                alt=""
                width={160}
                height={160}
                className="h-auto w-[42%] max-w-[150px] object-contain"
                aria-hidden
              />
            </div>
          </div>

          <Link
            href={shopCategoryHref('rings')}
            className="relative min-h-[22rem] overflow-hidden rounded-[1.35rem] bg-pearl"
          >
            <AppImage
              src="/hero/floral_ring.png"
              alt="Indian model wearing Velvet Shell floral silver rings and jewellery"
              fill
              priority
              sizes="100vw"
              className="object-contain object-center"
            />
          </Link>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem]">
              <HeroEarringReel />
            </div>
            <Link
              href={giftingHref()}
              className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-[#ebe6df]"
            >
              <ResponsiveBannerImage
                src="/images/hero-gifting-beach.jpg"
                alt="Velvet Shell gift bag and shell boxes on the beach at sunrise"
                sizes="50vw"
                className="object-cover object-center"
              />
              <span className="bg-velvet-texture absolute bottom-2.5 left-2.5 z-10 inline-flex items-center gap-2 rounded-full py-1.5 pr-1.5 pl-3 shadow-sm">
                <span className="text-[9px] font-semibold tracking-[0.14em] text-ivory uppercase">
                  Gifting
                </span>
                <ArrowCircle className="border-gold/40 bg-ivory text-burgundy" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
