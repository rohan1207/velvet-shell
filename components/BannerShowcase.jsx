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
      aria-label="Featured banners"
    >
      <div className="flex h-full w-full will-change-transform" style={trackStyle}>
        {trackSlides.map((slide) => (
          <article
            key={slide.__key}
            className="relative h-full w-full min-w-full shrink-0 basis-full"
            aria-hidden={slide.__clone || slide.id !== slides[logicalIndex]?.id}
          >
            <Link href={slide.href} className="absolute inset-0 block" aria-label={slide.alt}>
              <ResponsiveBannerImage
                src={slide.image}
                alt={slide.alt}
                priority={slide.__key === slides[0]?.id}
                className="object-cover object-center"
              />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
