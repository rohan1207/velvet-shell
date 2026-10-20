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
    id: 'pomegranate',
    image: '/images/banners/home-hero/pomegranate-story.jpg',
    alt: 'Pomegranate pendant necklace hanging from a fruiting branch at golden hour',
    eyebrow: 'Velvet Shell',
    title: 'Held in the golden hour.',
    line: 'A quiet pendant among ripening fruit — silver and gold, worn like a soft reveal.',
    cta: 'Shop necklaces',
    href: shopCategoryHref('necklaces'),
    tone: 'dark',
    overlay: 'soft',
  },
  {
    id: 'honeybee',
    image: '/images/banners/home-hero/honeybee-story.jpg',
    alt: 'Honeybee ring on honeycomb among golden wildflowers',
    eyebrow: 'Velvet Shell',
    title: 'Where sweetness finds form.',
    line: 'Jewellery drawn from the meadow — made to be worn and kept.',
    cta: 'Shop rings',
    href: shopCategoryHref('rings'),
    tone: 'light',
    overlay: 'soft',
  },
  {
    id: 'butterfly-stream',
    image: '/images/banners/home-hero/butterfly-stream-story.jpg',
    alt: 'Aquamarine butterfly ring on moss beside a forest stream',
    eyebrow: 'Velvet Shell',
    title: 'Wings over still water.',
    line: 'An icy blue stone, a golden butterfly — jewellery that feels found in the forest.',
    cta: 'Shop rings',
    href: shopCategoryHref('rings'),
    tone: 'light',
    overlay: 'soft',
  },
  {
    id: 'lotus',
    image: '/images/banners/home-hero/lotus-story.jpg',
    alt: 'Lotus whisper bracelet on a dewy lily pad',
    eyebrow: 'Velvet Shell',
    title: 'Bloom where you are held.',
    line: 'Lotus light on the wrist — silver, soft stone, and morning stillness.',
    cta: 'Shop bracelets',
    href: shopCategoryHref('bracelets'),
    tone: 'light',
    overlay: 'soft',
  },
  {
    id: 'orchid',
    image: '/images/banners/home-hero/orchid-story.jpg',
    alt: 'Phalaenopsis orchid hoop earrings among white orchids',
    eyebrow: 'Velvet Shell',
    title: 'Petals that never fade.',
    line: 'Orchid forms in silver — quiet elegance for softly luminous days.',
    cta: 'Shop earrings',
    href: shopCategoryHref('earrings'),
    tone: 'dark',
    overlay: 'soft',
  },
];

const trackSlides = buildClonedSlides(slides, (s) => s.id);

export default function NatureStoryHero() {
  const count = slides.length;
  const { rootRef, trackStyle, logicalIndex, goNext, goPrev, goTo } = useInfiniteCarousel({
    count,
    intervalMs: BANNER_INTERVAL_MS,
    transitionMs: BANNER_TRANSITION_MS,
  });

  const slide = slides[logicalIndex];
  const isDark = slide.tone === 'dark';
  const softOverlay = slide.overlay === 'soft';

  return (
    <section
      ref={rootRef}
      className="relative box-border h-[100svh] w-full overflow-hidden bg-ink"
      aria-roledescription="carousel"
      aria-label="Nature storytelling hero"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="flex h-full w-full will-change-transform" style={trackStyle}>
          {trackSlides.map((item) => (
            <article
              key={item.__key}
              className="relative h-full w-full min-w-full shrink-0 basis-full"
            >
              <ResponsiveBannerImage
                src={item.image}
                alt={item.alt}
                priority
                quality={90}
                className="object-cover object-center"
              />
            </article>
          ))}
        </div>

        <div
          className={`pointer-events-none absolute inset-0 transition-opacity duration-700 max-md:bg-gradient-to-t max-md:from-ink/55 max-md:via-ink/15 max-md:to-transparent ${
            isDark
              ? softOverlay
                ? 'md:bg-gradient-to-r md:from-ivory/45 md:via-ivory/10 md:to-transparent'
                : 'md:bg-gradient-to-r md:from-ivory/70 md:via-ivory/25 md:to-transparent'
              : softOverlay
                ? 'md:bg-gradient-to-r md:from-ink/25 md:via-ink/8 md:to-transparent'
                : 'md:bg-gradient-to-r md:from-ink/50 md:via-ink/20 md:to-transparent'
          }`}
          aria-hidden
        />
      </div>

      <div className="pt-site-chrome relative z-10 flex h-full items-end pb-16 md:items-center md:pb-0">
        <div className="mx-auto w-full max-w-[1600px] px-5 md:px-10 lg:px-14">
          <div
            key={slide.id}
            className="flex max-w-lg flex-col items-start text-left animate-[fade-up_0.9s_var(--ease-luxe)_both]"
          >
            <p
              className={`font-label text-[10px] tracking-[0.28em] uppercase ${
                isDark ? 'text-burgundy' : 'text-ivory/85'
              }`}
            >
              {slide.eyebrow}
            </p>
            <h1
              className={`font-display mt-3 text-[clamp(2.4rem,5.2vw,3.85rem)] leading-[1.05] tracking-[-0.02em] ${
                isDark ? 'text-ink' : 'text-ivory'
              }`}
            >
              {slide.title}
            </h1>
            <p
              className={`mt-4 max-w-md text-[14px] font-light leading-relaxed md:text-[15px] ${
                isDark ? 'text-ink/75' : 'text-ivory/88'
              }`}
            >
              {slide.line}
            </p>
            <Link
              href={slide.href}
              className={`mt-7 inline-flex items-center rounded-full px-7 py-3 font-label text-[10px] tracking-[0.2em] uppercase transition-all duration-500 ${
                isDark
                  ? 'border border-ink/40 bg-transparent text-ink hover:bg-ink hover:text-ivory'
                  : 'border border-ivory/85 bg-transparent text-ivory hover:bg-ivory hover:text-ink'
              }`}
            >
              {slide.cta}
            </Link>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-y-0 right-4 z-20 flex items-center md:right-7">
        <div className="pointer-events-auto flex flex-col gap-2">
          <button
            type="button"
            aria-label="Previous banner"
            onClick={goPrev}
            className={`flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-sm transition-colors ${
              isDark
                ? 'border-ink/20 bg-ivory/70 text-ink hover:bg-ivory'
                : 'border-ivory/30 bg-ink/25 text-ivory hover:bg-ink/40'
            }`}
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
            className={`flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-sm transition-colors ${
              isDark
                ? 'border-ink/20 bg-ivory/70 text-ink hover:bg-ivory'
                : 'border-ivory/30 bg-ink/25 text-ivory hover:bg-ink/40'
            }`}
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

      <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 md:bottom-7">
        {slides.map((item, i) => (
          <button
            key={item.id}
            type="button"
            aria-label={`Go to banner ${i + 1}`}
            aria-current={i === logicalIndex}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === logicalIndex
                ? isDark
                  ? 'w-8 bg-burgundy'
                  : 'w-8 bg-ivory'
                : isDark
                  ? 'w-1.5 bg-ink/30 hover:bg-ink/55'
                  : 'w-1.5 bg-ivory/40 hover:bg-ivory/70'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
