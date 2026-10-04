'use client';

import Image from 'next/image';
import Link from 'next/link';
import HeroEarringReel from './HeroEarringReel';

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
  return (
    <section className="box-border flex h-[100svh] flex-col bg-ivory pt-[6.25rem] md:pt-[7.1rem]">
      <div className="mx-auto flex min-h-0 w-full max-w-[1600px] flex-1 flex-col px-3 pb-3 md:px-4 md:pb-4">
        {/* Desktop / tablet: full viewport bento */}
        <div className="hidden min-h-0 flex-1 gap-3 md:grid md:grid-cols-[minmax(0,1fr)_auto] lg:gap-3.5">
          {/* Left column */}
          <div className="flex min-h-0 flex-col gap-3 lg:gap-3.5">
            <div className="relative grid shrink-0 grid-cols-[minmax(0,1fr)_minmax(160px,32%)] items-center overflow-hidden rounded-[1.5rem] bg-pearl lg:rounded-[1.75rem] xl:grid-cols-[minmax(0,1fr)_minmax(200px,30%)]">
              <span className="pointer-events-none absolute top-0 left-0 z-10 h-full w-1.5 bg-burgundy" />
              <span className="pointer-events-none absolute top-5 right-5 z-10 h-1.5 w-1.5 rounded-full bg-gold" />

              <div className="relative z-10 px-8 py-8 pr-4 md:px-9 md:py-9 lg:px-12 lg:py-10 xl:px-14 xl:py-11">
                <h1 className="font-bodoni text-[clamp(2rem,3.2vw,3.1rem)] leading-[1.08] tracking-[0.01em] text-ink">
                  The Beauty Of Becoming
                </h1>
                <span className="mt-4 block h-px w-16 bg-gradient-to-r from-gold via-gold to-transparent" />
                <p className="mt-5 max-w-2xl text-[15px] leading-[1.75] font-normal tracking-[-0.01em] text-ink/80 lg:text-[16px] lg:leading-[1.8]">
                  Velvet Shell is a contemporary house of jewellery, gifting and lifestyle creations.
                  Every piece begins with considered design and ends with a moment of discovery -
                  something to wear, to give, to keep and to remember.
                </p>
                <p className="mt-4 max-w-2xl text-[15px] leading-[1.75] font-normal tracking-[-0.01em] text-ink/80 lg:text-[16px] lg:leading-[1.8]">
                  And in every becoming - of self, of a bond, of a moment, there is something beautiful
                  waiting to unwrap.
                </p>
              </div>

              <div className="relative flex h-full min-h-[11rem] items-end justify-center self-stretch p-3 pb-2 pr-4 md:min-h-[12.5rem] lg:min-h-[14rem] lg:p-4 lg:pr-5">
                <Image
                  src="/images/hero-floral.png"
                  alt=""
                  width={320}
                  height={320}
                  className="h-auto w-full max-w-[240px] object-contain object-bottom drop-shadow-[0_12px_28px_rgba(94,6,42,0.12)] lg:max-w-[280px]"
                  aria-hidden
                />
              </div>
            </div>

            <div className="grid min-h-0 flex-1 grid-cols-2 gap-3 lg:gap-3.5">
              <Link
                href="/shop?category=earrings"
                data-cursor="Shop"
                className="group relative min-h-0 overflow-hidden rounded-[1.5rem] lg:rounded-[1.75rem]"
              >
                <HeroEarringReel />
                <span className="absolute bottom-3 left-3 z-10 inline-flex items-center gap-2 rounded-full bg-ivory/95 py-2 pr-2 pl-3.5 shadow-sm">
                  <span className="text-[9px] font-semibold tracking-[0.14em] text-ink uppercase">
                    Earrings
                  </span>
                  <ArrowCircle />
                </span>
              </Link>

              <Link
                href="/shop"
                data-cursor="Shop"
                className="group relative min-h-0 overflow-hidden rounded-[1.5rem] lg:rounded-[1.75rem]"
              >
                <Image
                  src="/images/hero-gift.png"
                  alt="Open shell with burgundy pouch and pearl ring"
                  fill
                  sizes="28vw"
                  className="object-cover object-center transition-transform duration-[1.15s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                />
                <span className="bg-velvet-texture absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full py-2 pr-2 pl-3.5 shadow-sm">
                  <span className="text-[9px] font-semibold tracking-[0.14em] text-ivory uppercase">
                    Gifting
                  </span>
                  <ArrowCircle className="border-gold/40 bg-ivory text-burgundy" />
                </span>
              </Link>
            </div>
          </div>

          {/* Right card sized to image aspect so it fills with no crop */}
          <Link
            href="/shop?category=bracelets"
            data-cursor="Shop"
            className="group relative h-full min-h-0 aspect-[1073/1466] max-w-full justify-self-end overflow-hidden rounded-[1.5rem] bg-pearl lg:rounded-[1.75rem]"
          >
            <Image
              src="/hero/floral_ring.png"
              alt="Indian model wearing Velvet Shell floral silver necklace, bracelet, and rings"
              fill
              priority
              sizes="42vw"
              className="object-contain object-center transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
            />
          </Link>
        </div>

        {/* Mobile */}
        <div className="flex min-h-0 flex-1 flex-col gap-2.5 md:hidden">
          <div className="relative shrink-0 overflow-hidden rounded-[1.35rem] bg-pearl">
            <span className="absolute top-0 left-0 z-10 h-full w-1 bg-burgundy" />
            <div className="px-5 pt-6 pr-4 pb-2">
              <h1 className="font-bodoni text-[1.85rem] leading-[1.08] tracking-[0.01em] text-ink">
                The Beauty Of Becoming
              </h1>
              <span className="mt-3 block h-px w-14 bg-gradient-to-r from-gold via-gold to-transparent" />
              <p className="mt-4 text-[14px] leading-[1.7] text-ink/80">
                Velvet Shell is a contemporary house of jewellery, gifting and lifestyle creations.
                Every piece begins with considered design and ends with a moment of discovery -
                something to wear, to give, to keep and to remember.
              </p>
              <p className="mt-3 text-[14px] leading-[1.7] text-ink/80">
                And in every becoming - of self, of a bond, of a moment, there is something beautiful
                waiting to unwrap.
              </p>
            </div>
            <div className="flex justify-end px-3 pb-2">
              <Image
                src="/images/hero-floral.png"
                alt=""
                width={160}
                height={160}
                className="h-auto w-[42%] max-w-[150px] object-contain"
                aria-hidden
              />
            </div>
          </div>

          <Link
            href="/shop?category=bracelets"
            className="relative min-h-0 flex-[1.35] overflow-hidden rounded-[1.35rem] bg-pearl"
          >
            <Image
              src="/hero/floral_ring.png"
              alt="Indian model wearing Velvet Shell floral silver necklace, bracelet, and rings"
              fill
              priority
              sizes="100vw"
              className="object-contain object-center"
            />
          </Link>

          <div className="grid min-h-0 flex-1 grid-cols-2 gap-2.5">
            <Link href="/shop?category=earrings" className="relative min-h-0 overflow-hidden rounded-[1.25rem]">
              <HeroEarringReel />
            </Link>
            <Link href="/shop" className="relative min-h-0 overflow-hidden rounded-[1.25rem]">
              <Image
                src="/images/hero-gift.png"
                alt="Shell reveal still life"
                fill
                sizes="50vw"
                className="object-cover"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
