'use client';

import Link from 'next/link';
import { HOME_BANNER_SLIDES } from '@/lib/home-banner-slides';
import ResponsiveBannerImage from '@/components/ResponsiveBannerImage';
import {
  BANNER_INTERVAL_MS,
  BANNER_TRANSITION_MS,
  buildClonedSlides,
  useInfiniteCarousel,
} from '@/lib/use-infinite-carousel';

const slides = HOME_BANNER_SLIDES;
const trackSlides = buildClonedSlides(slides, (s) => s.id);

export default function BannerShowcase() {
  const count = slides.length;
  const { rootRef, trackStyle, logicalIndex } = useInfiniteCarousel({
    count,
    intervalMs: BANNER_INTERVAL_MS,
    transitionMs: BANNER_TRANSITION_MS,
  });

  if (!count) return null;

  return (
    <section
      ref={rootRef}
      className="relative box-border h-[calc(100svh-6.25rem)] w-full scroll-mt-[6.25rem] overflow-hidden bg-ivory md:h-[calc(100svh-7.1rem)] md:scroll-mt-[7.1rem]"
      aria-roledescription="carousel"
      aria-label="Shop by category"
    >
      <div className="flex h-full w-full will-change-transform" style={trackStyle}>
        {trackSlides.map((slide) => {
          const active = !slide.__clone && slide.id === slides[logicalIndex]?.id;
          return (
            <article
              key={slide.__key}
              className="relative h-full w-full min-w-full shrink-0 basis-full"
              aria-hidden={!active}
            >
              <Link
                href={slide.href}
                className="absolute inset-0 block"
                aria-label={`Shop ${slide.label}`}
              >
                <ResponsiveBannerImage
                  src={slide.image}
                  alt={slide.alt}
                  priority={slide.__key === slides[0]?.id}
                  className="object-cover object-center"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/10 to-transparent"
                  aria-hidden
                />
                <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-start px-5 pb-8 sm:px-8 sm:pb-10 md:px-12 md:pb-12">
                  <p className="font-label text-[10px] tracking-[0.22em] text-gold uppercase sm:text-[11px]">
                    Shop
                  </p>
                  <p className="font-display mt-1.5 text-[clamp(1.85rem,5vw,3.25rem)] leading-[1.05] tracking-[-0.03em] text-ivory">
                    {slide.label}
                  </p>
                  {slide.line ? (
                    <p className="mt-2 max-w-md text-[13px] font-light leading-relaxed text-ivory/80 sm:text-[14px]">
                      {slide.line}
                    </p>
                  ) : null}
                  <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-ivory/95 py-2 pr-2 pl-3.5 font-label text-[10px] tracking-[0.14em] text-ink uppercase shadow-sm sm:text-[11px]">
                    Explore {slide.label}
                    <span
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-burgundy text-ivory"
                      aria-hidden
                    >
                      →
                    </span>
                  </span>
                </div>
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
