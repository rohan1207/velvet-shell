'use client';

import { useMemo } from 'react';
import ResponsiveBannerImage from '@/components/ResponsiveBannerImage';
import {
  BANNER_INTERVAL_MS,
  BANNER_TRANSITION_MS,
  buildClonedSlides,
  useInfiniteCarousel,
} from '@/lib/use-infinite-carousel';

export default function CategoryHeroSlider({ slides = [], label = 'Category banners' }) {
  const count = slides.length;
  const trackSlides = useMemo(
    () => buildClonedSlides(slides, (s, i) => s.src || i),
    [slides],
  );

  const { rootRef, trackStyle, logicalIndex, goNext, goPrev, goTo, hasLoop } = useInfiniteCarousel({
    count,
    intervalMs: BANNER_INTERVAL_MS,
    transitionMs: BANNER_TRANSITION_MS,
  });

  if (!count) return null;

  return (
    <section
      ref={rootRef}
      className="relative h-[100svh] w-full overflow-hidden bg-ink"
      aria-roledescription="carousel"
      aria-label={label}
    >
      <div className="flex h-full w-full will-change-transform" style={trackStyle}>
        {trackSlides.map((slide) => (
          <article
            key={slide.__key}
            className="relative h-full w-full min-w-full shrink-0 basis-full"
            aria-hidden={slide.__clone || slide.src !== slides[logicalIndex]?.src}
          >
            <ResponsiveBannerImage
              src={slide.src}
              alt={slide.alt || ''}
              priority={!slide.__clone && slide.src === slides[0]?.src}
              className="object-cover object-center"
            />
          </article>
        ))}
      </div>

      {hasLoop ? (
        <>
          <div className="pointer-events-none absolute inset-y-0 right-4 z-10 flex items-center md:right-7">
            <div className="pointer-events-auto flex flex-col gap-2">
              <button
                type="button"
                aria-label="Previous banner"
                onClick={goPrev}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/20 text-white backdrop-blur-sm transition-colors duration-400 hover:bg-black/35"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
                  <path
                    d="M14.5 6.5 9 12l5.5 5.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                aria-label="Next banner"
                onClick={goNext}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/20 text-white backdrop-blur-sm transition-colors duration-400 hover:bg-black/35"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
                  <path
                    d="M9.5 6.5 15 12l-5.5 5.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
            {slides.map((slide, i) => (
              <button
                key={slide.src}
                type="button"
                aria-label={`Go to banner ${i + 1}`}
                aria-current={i === logicalIndex}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === logicalIndex ? 'w-7 bg-ivory' : 'w-1.5 bg-ivory/45 hover:bg-ivory/70'
                }`}
              />
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
