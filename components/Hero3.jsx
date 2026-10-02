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
            <div className="relative flex shrink-0 flex-col items-center justify-center overflow-hidden rounded-[1.5rem] bg-pearl px-8 py-8 text-center lg:rounded-[1.75rem] lg:px-12 lg:py-10 xl:py-11">
              <span className="pointer-events-none absolute top-0 left-0 h-full w-1.5 bg-burgundy" />
              <span className="pointer-events-none absolute top-5 right-6 h-1.5 w-1.5 rounded-full bg-gold" />
              <Image
                src="/images/hero-floral.png"
                alt=""
                width={220}
                height={220}
                className="pointer-events-none absolute -right-6 -bottom-8 w-[42%] max-w-[220px] select-none opacity-[0.92] drop-shadow-[0_12px_28px_rgba(94,6,42,0.12)] lg:-right-4 lg:-bottom-6 lg:w-[38%]"
                aria-hidden
              />

              <h1 className="relative z-10 font-bodoni text-[clamp(2.4rem,4.6vw,4.6rem)] leading-[0.92] tracking-[0.05em] text-ink uppercase">
                Velvet Shell
              </h1>
              <p className="font-script relative z-10 mt-1 text-[clamp(1.45rem,2.4vw,2.35rem)] leading-none text-burgundy">
                A treasure in every reveal
              </p>
              <span className="relative z-10 mt-4 h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent" />
              <p className="relative z-10 mt-4 max-w-md text-[13px] leading-[1.65] font-normal tracking-[-0.01em] text-ink/65 lg:text-[14px]">
                Each jewellery piece is designed to inspire confidence and celebrate your unique style —
                a little mystery, a precious reveal.
              </p>
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
                <span className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full bg-burgundy py-2 pr-2 pl-3.5 shadow-sm">
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
          <div className="relative shrink-0 overflow-hidden rounded-[1.35rem] bg-pearl px-5 py-7 text-center">
            <span className="absolute top-0 left-0 h-full w-1 bg-burgundy" />
            <Image
              src="/images/hero-floral.png"
              alt=""
              width={140}
              height={140}
              className="pointer-events-none absolute -right-5 -bottom-6 w-[38%] max-w-[140px] select-none opacity-90"
              aria-hidden
            />
            <h1 className="relative z-10 font-bodoni text-[2.15rem] leading-[0.92] tracking-[0.04em] text-ink uppercase">
              Velvet Shell
            </h1>
            <p className="font-script relative z-10 mt-1 text-[1.45rem] leading-none text-burgundy">
              A treasure in every reveal
            </p>
            <p className="relative z-10 mt-3 text-[12px] leading-relaxed text-ink/60">
              A little mystery, a precious reveal.
            </p>
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
