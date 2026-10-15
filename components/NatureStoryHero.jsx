'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const INTERVAL_MS = 6000;
const TRANSITION_MS = 1100;

const slides = [
  {
    id: 'pomegranate',
    image: '/images/banners/home-hero/pomegranate-story.jpg',
    alt: 'Pomegranate pendant necklace hanging from a fruiting branch at golden hour',
    eyebrow: 'Velvet Shell',
    title: 'Held in the golden hour.',
    line: 'A quiet pendant among ripening fruit — silver and gold, worn like a soft reveal.',
    cta: 'Shop necklaces',
    href: '/shop?category=necklaces',
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
    cta: 'Shop the meadow',
    href: '/shop?category=rings',
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
    cta: 'Shop the ring',
    href: '/shop/aquamarine-butterfly-ring',
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
    cta: 'Discover lotuses',
    href: '/shop?category=bracelets',
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
    href: '/shop?category=earrings',
    tone: 'dark',
    overlay: 'soft',
  },
];

const FIRST = 1;
const LAST = slides.length; // track index of last real slide
const CLONE_END = slides.length + 1;
const CLONE_START = 0;

const trackSlides = [
  { ...slides[slides.length - 1], key: 'clone-start' },
  ...slides.map((s) => ({ ...s, key: s.id })),
  { ...slides[0], key: 'clone-end' },
];

export default function NatureStoryHero() {
  const count = slides.length;
  const [trackIndex, setTrackIndex] = useState(FIRST);
  const [withTransition, setWithTransition] = useState(true);
  const [hoverPaused, setHoverPaused] = useState(false);
  const locked = useRef(false);
  const wrapTimer = useRef(null);
  const autoTimer = useRef(null);

  const logicalIndex = Math.min(Math.max(trackIndex - 1, 0), count - 1);
  const slide = slides[logicalIndex];
  const isDark = slide.tone === 'dark';
  const softOverlay = slide.overlay === 'soft';

  const clearWrapTimer = () => {
    if (wrapTimer.current) {
      window.clearTimeout(wrapTimer.current);
      wrapTimer.current = null;
    }
  };

  const afterMove = useCallback((nextIndex) => {
    clearWrapTimer();
    wrapTimer.current = window.setTimeout(() => {
      if (nextIndex === CLONE_END || nextIndex === CLONE_START) {
        setWithTransition(false);
        setTrackIndex(nextIndex === CLONE_END ? FIRST : LAST);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setWithTransition(true);
            locked.current = false;
          });
        });
      } else {
        locked.current = false;
      }
    }, TRANSITION_MS);
  }, []);

  const goNext = useCallback(() => {
    if (locked.current) return;
    locked.current = true;
    setWithTransition(true);
    setTrackIndex((i) => {
      const next = i + 1;
      afterMove(next);
      return next;
    });
  }, [afterMove]);

  const goPrev = useCallback(() => {
    if (locked.current) return;
    locked.current = true;
    setWithTransition(true);
    setTrackIndex((i) => {
      const next = i - 1;
      afterMove(next);
      return next;
    });
  }, [afterMove]);

  const goTo = useCallback(
    (i) => {
      if (locked.current) return;
      const target = i + 1;
      if (target === trackIndex) return;
      locked.current = true;
      setWithTransition(true);
      setTrackIndex(target);
      afterMove(target);
    },
    [trackIndex, afterMove],
  );

  // Autoplay — stable interval; never advances while locked (clone wrap)
  useEffect(() => {
    if (hoverPaused) return undefined;
    autoTimer.current = window.setInterval(() => {
      if (!locked.current) goNext();
    }, INTERVAL_MS);
    return () => {
      if (autoTimer.current) window.clearInterval(autoTimer.current);
    };
  }, [goNext, hoverPaused]);

  useEffect(() => () => clearWrapTimer(), []);

  return (
    <section
      className="relative box-border h-[100svh] w-full overflow-hidden bg-ink"
      aria-roledescription="carousel"
      aria-label="Nature storytelling hero"
      onMouseEnter={() => setHoverPaused(true)}
      onMouseLeave={() => setHoverPaused(false)}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="flex h-full w-full will-change-transform"
          style={{
            transform: `translate3d(-${trackIndex * 100}%, 0, 0)`,
            transition: withTransition
              ? `transform ${TRANSITION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`
              : 'none',
          }}
        >
          {trackSlides.map((item) => (
            <article
              key={item.key}
              className="relative h-full w-full min-w-full shrink-0 basis-full"
            >
              <Image
                src={item.image}
                alt={item.alt}
                fill
                priority
                quality={90}
                sizes="100vw"
                className="object-cover object-center"
              />
            </article>
          ))}
        </div>

        <div
          className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${
            isDark
              ? softOverlay
                ? 'bg-gradient-to-r from-ivory/45 via-ivory/10 to-transparent'
                : 'bg-gradient-to-r from-ivory/70 via-ivory/25 to-transparent'
              : softOverlay
                ? 'bg-gradient-to-r from-ink/25 via-ink/8 to-transparent'
                : 'bg-gradient-to-r from-ink/50 via-ink/20 to-transparent'
          }`}
          aria-hidden
        />
      </div>

      <div className="pt-site-chrome relative z-10 flex h-full items-center">
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
