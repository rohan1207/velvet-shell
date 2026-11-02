'use client';

import { useEffect, useRef, useState } from 'react';
import AppImage from '@/components/AppImage';
import Link from 'next/link';
import { giftingHref, shopCategoryHref } from '@/lib/shop-links';
import HeroEarringReel from './HeroEarringReel';
import HeroFlowerFrames from './HeroFlowerFrames';
import ResponsiveBannerImage from '@/components/ResponsiveBannerImage';

function ArrowCircle({ className = '', iconClassName = 'h-3.5 w-3.5' }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full border border-ink/10 bg-white text-burgundy ${className}`}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className={iconClassName} fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M7 17L17 7M10 7h7v7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function useIsDesktop() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return desktop;
}

export default function Hero3() {
  const sectionRef = useRef(null);
  const isDesktop = useIsDesktop();

  return (
    <section
      ref={sectionRef}
      className="relative z-[1] box-border flex flex-col bg-ivory pt-3 pb-3 md:pt-4 md:pb-4"
    >
      <div className="mx-auto flex w-full max-w-[1600px] flex-col px-3 md:px-4">
        {/* Desktop / tablet bento — scroll-scrub flower only mounts here */}
        {isDesktop ? (
          <div className="grid h-[calc(100svh-var(--site-promo-h)-var(--site-nav-h)-1.25rem)] min-h-[36rem] grid-cols-[minmax(0,1fr)_auto] gap-3 lg:gap-3.5">
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
                    src="/images/hero-gifting-brand.png"
                    alt="Velvet Shell — A treasure in every reveal"
                    sizes="28vw"
                    className="object-contain object-center transition-transform duration-[1.15s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                  />
                  <span className="bg-velvet-texture absolute bottom-3 left-3 z-10 inline-flex items-center gap-2 rounded-full py-2 pr-2 pl-3.5 shadow-sm">
                    <span className="text-[9px] font-semibold tracking-[0.14em] text-ivory uppercase">
                      Gifting
                    </span>
                    <ArrowCircle className="h-8 w-8 border-gold/40 bg-ivory text-burgundy" />
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
        ) : (
          /* Phone: 4-card bento — shared 2-col grid so right edges align */
          <div className="grid grid-cols-2 gap-2.5">
            <div className="relative flex min-h-[12rem] flex-col justify-center overflow-hidden rounded-[1.25rem] bg-pearl px-3.5 py-4 sm:min-h-[13rem] sm:px-4 sm:py-5">
              <span className="pointer-events-none absolute top-0 left-0 z-10 h-full w-1 bg-burgundy" />
              <h1 className="font-bodoni text-[1.35rem] leading-[1.08] tracking-[0.01em] text-ink sm:text-[1.55rem]">
                The Beauty Of Becoming
              </h1>
              <span className="mt-2 block h-px w-10 bg-gradient-to-r from-gold via-gold to-transparent" />
              <p className="mt-2.5 text-[11px] leading-[1.5] text-ink/80 sm:text-[12px] sm:leading-[1.6]">
                Jewellery, gifting and lifestyle — considered design, made to be worn, given, and kept.
              </p>
            </div>

            <div className="relative min-h-[12rem] overflow-hidden rounded-[1.25rem] bg-pearl sm:min-h-[13rem]">
              <AppImage
                src="/hero/floral_ring.png"
                alt="Velvet Shell floral rings"
                fill
                sizes="50vw"
                className="object-cover object-[center_18%]"
                priority
              />
            </div>

            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem]">
              <HeroEarringReel compact />
            </div>

            <Link
              href={giftingHref()}
              className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-[#ebe6df]"
            >
              <ResponsiveBannerImage
                src="/images/hero-gifting-brand.png"
                alt="Velvet Shell — A treasure in every reveal"
                sizes="50vw"
                className="object-contain object-center"
              />
              <span className="bg-velvet-texture absolute bottom-2 left-2 z-10 inline-flex items-center gap-1 rounded-full py-1 pr-1 pl-2.5 shadow-sm">
                <span className="text-[8px] font-semibold tracking-[0.12em] text-ivory uppercase">
                  Gifting
                </span>
                <ArrowCircle
                  className="h-5 w-5 border-gold/40 bg-ivory text-burgundy"
                  iconClassName="h-2.5 w-2.5"
                />
              </span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
