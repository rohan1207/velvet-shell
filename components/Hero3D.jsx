'use client';

/**
 * LEGACY 3D HERO — kept for future use.
 * To restore: import Hero3D from './Hero3D' and render <Hero3D /> instead of <HeroBanners />.
 */

import Link from 'next/link';
import Magnetic from './Magnetic';
import HeroModelViewer from './HeroModelViewer';

export default function Hero3D() {
  return (
    <section className="hero relative min-h-[100svh] overflow-hidden bg-ivory">
      <div className="relative z-10 mx-auto grid min-h-[100svh] max-w-[1600px] items-center gap-10 px-5 pt-32 pb-16 md:grid-cols-12 md:gap-6 md:px-10 md:pt-28 md:pb-12">
        <div className="hero-copy order-2 flex flex-col justify-center md:order-1 md:col-span-5 lg:col-span-5">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-cream bg-pearl px-3.5 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            <span className="text-[11px] font-medium tracking-[0.18em] text-ink/70 uppercase">
              New season · Autumn 2027
            </span>
          </div>

          <h1 className="font-display mt-7 max-w-lg text-[2.85rem] leading-[1.08] tracking-[-0.04em] text-ink sm:text-5xl md:text-[3.15rem] lg:text-[3.6rem]">
            Wear the quiet
            <br />
            of a found shell.
          </h1>

          <p className="mt-6 max-w-md text-[15px] leading-[1.75] text-stone md:text-[16px]">
            Sculptural jewelry in nacre and champagne gold — made slowly in Jaipur, finished for the body, never for a tray.
          </p>
          <p className="mt-3 max-w-md text-[14px] leading-[1.7] text-stone/80 md:text-[15px]">
            Drag the piece to turn it in light. Then choose how you enter the house.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Magnetic>
              <Link
                href="/shop"
                data-cursor="Enter"
                className="inline-flex items-center rounded-full bg-[#5E062A] px-7 py-3.5 text-[13px] font-semibold tracking-[0.04em] text-white transition-transform hover:scale-[1.02]"
              >
                Shop the edit
              </Link>
            </Magnetic>
            <Link
              href="/lookbook"
              className="inline-flex items-center rounded-full border border-ink/15 bg-white/60 px-6 py-3.5 text-[13px] font-medium tracking-[0.04em] text-ink transition-colors hover:border-ink/30 hover:bg-white"
            >
              View lookbook
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-full border border-transparent px-5 py-3.5 text-[13px] font-medium tracking-[0.04em] text-stone transition-colors hover:text-ink"
            >
              Book a viewing
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-2.5">
            {[
              { href: '/shop?category=rings', label: 'Rings' },
              { href: '/shop?category=earrings', label: 'Earrings' },
              { href: '/shop?category=necklaces', label: 'Pendants' },
              { href: '/shop?category=bracelets', label: 'Bracelets' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-cream bg-pearl px-4 py-2 text-[12px] font-medium tracking-[0.06em] text-ink/75 uppercase transition-colors hover:border-gold/40 hover:bg-white hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-cream pt-6 text-[12px] tracking-[0.08em] text-stone uppercase">
            <span>Hand-finished</span>
            <span className="hidden h-1 w-1 rounded-full bg-gold/60 sm:inline-block" />
            <span>18k gold</span>
            <span className="hidden h-1 w-1 rounded-full bg-gold/60 sm:inline-block" />
            <span>Jaipur atelier</span>
          </div>
        </div>

        <div className="hero-model order-1 h-[48vh] w-full md:order-2 md:col-span-7 md:h-[78vh] md:min-h-[560px] lg:col-span-7">
          <HeroModelViewer src="/model.glb" />
        </div>
      </div>

      <div className="absolute bottom-8 left-5 text-[10px] tracking-[0.3em] text-stone/45 uppercase md:left-10">
        Scroll
      </div>
    </section>
  );
}
