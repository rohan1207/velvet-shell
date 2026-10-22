'use client';

import Link from 'next/link';
import ResponsiveBannerImage from '@/components/ResponsiveBannerImage';
import {
  BANNER_INTERVAL_MS,
  BANNER_TRANSITION_MS,
  buildClonedSlides,
  useInfiniteCarousel,
} from '@/lib/use-infinite-carousel';

import { shopCategoryHref } from '@/lib/shop-links';

const slides = [
  {
    id: 'necklaces',
    image: '/images/banners/home-hero/garden.jpg',
    title: 'Shop necklaces',
    body: 'Pendants and chains in silver and gold.',
    cta: 'Shop necklaces',
    href: shopCategoryHref('necklaces'),
    align: 'center',
  },
  {
    id: 'bracelets',
    image: '/images/banners/home-hero/lotus.jpg',
    title: 'Shop bracelets',
    body: 'Soft forms for the wrist.',
    cta: 'Shop bracelets',
    href: shopCategoryHref('bracelets'),
    align: 'left',
  },
  {
    id: 'earrings',
    image: '/images/banners/home-hero/honeybee.jpg',
    title: 'Shop earrings',
    body: 'Drops, hoops, and studs for every day.',
    cta: 'Shop earrings',
    href: shopCategoryHref('earrings'),
    align: 'right',
  },
  {
    id: 'rings',
    image: '/images/banners/home-hero/calla.jpg',
    title: 'Shop rings',
    body: 'Sculptural forms made to be worn and kept.',
    cta: 'Shop rings',
    href: shopCategoryHref('rings'),
    align: 'center',
  },
];

const trackSlides = buildClonedSlides(slides, (s) => s.id);

export default function HeroNatureStory() {
  const count = slides.length;
  const { rootRef, trackStyle, logicalIndex, goNext, goPrev, goTo } = useInfiniteCarousel({
    count,
    intervalMs: BANNER_INTERVAL_MS,
    transitionMs: BANNER_TRANSITION_MS,
  });

  const slide = slides[logicalIndex];

  const alignClass =
    slide.align === 'left'
      ? 'items-start text-left md:pl-6 lg:pl-10'
      : slide.align === 'right'
        ? 'items-end text-right md:pr-6 lg:pr-10'
        : 'items-center text-center';

  return (
    <section
      ref={rootRef}
      className="relative box-border h-[100svh] w-full overflow-hidden bg-[#0f2a1f] pt-[6.25rem] md:pt-[7.1rem]"
      aria-roledescription="carousel"
      aria-label="Nature storytelling hero"
    >
      <div className="relative h-full w-full overflow-hidden">
        <div className="flex h-full w-full will-change-transform" style={trackStyle}>
          {trackSlides.map((item) => (
            <article
              key={item.__key}
              className="relative h-full w-full min-w-full shrink-0 basis-full"
              aria-hidden={item.__clone || item.id !== slide.id}
            >
              <ResponsiveBannerImage
                src={item.image}
                alt=""
                priority={item.__key === slides[0].id}
                className="object-cover object-center"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/25 to-black/20"
                aria-hidden
              />
            </article>
          ))}
        </div>

        <div
          className={`pointer-events-none absolute inset-0 z-10 flex ${alignClass} justify-center px-6 pb-20 pt-10 md:px-12 md:pb-24 md:pt-14`}
        >
          <div
            key={slide.id}
            className="pointer-events-auto max-w-xl animate-[fade-up_0.9s_var(--ease-luxe)_both] md:max-w-2xl"
          >
            <h1 className="font-display whitespace-pre-line text-[clamp(2.4rem,6.5vw,4.6rem)] leading-[1.05] tracking-[-0.02em] text-ivory">
              {slide.title}
            </h1>
            <p className="mt-5 max-w-md text-[14px] font-light leading-relaxed text-ivory/85 md:text-[15px] md:leading-[1.75]">
              {slide.body}
            </p>
            <Link
              href={slide.href}
              className="mt-8 inline-flex items-center justify-center border border-ivory/85 px-7 py-3 font-label text-[10px] tracking-[0.22em] text-ivory uppercase transition-colors duration-500 hover:bg-ivory hover:text-ink md:text-[11px]"
            >
              {slide.cta}
            </Link>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-y-0 right-4 z-20 flex items-center md:right-7">
          <div className="pointer-events-auto flex flex-col gap-2">
            <button
              type="button"
              aria-label="Previous slide"
              onClick={goPrev}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/20 text-ivory backdrop-blur-sm transition-colors hover:bg-black/40"
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
              aria-label="Next slide"
              onClick={goNext}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/20 text-ivory backdrop-blur-sm transition-colors hover:bg-black/40"
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

        <div className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
          {slides.map((item, i) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === logicalIndex}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === logicalIndex ? 'w-8 bg-ivory' : 'w-1.5 bg-ivory/40 hover:bg-ivory/70'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
