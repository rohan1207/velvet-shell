'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';

const INTERVAL_MS = 4500;

export default function CategoryHeroSlider({ slides = [], label = 'Category banners' }) {
  const [index, setIndex] = useState(0);
  const count = slides.length;

  const go = useCallback(
    (next) => {
      if (!count) return;
      setIndex(((next % count) + count) % count);
    },
    [count],
  );

  useEffect(() => {
    setIndex(0);
  }, [slides]);

  useEffect(() => {
    if (count < 2) return undefined;
    const id = setInterval(() => go(index + 1), INTERVAL_MS);
    return () => clearInterval(id);
  }, [index, go, count]);

  if (!count) return null;

  return (
    <section
      className="relative h-[100svh] w-full overflow-hidden bg-ink"
      aria-roledescription="carousel"
      aria-label={label}
    >
      <div
        className="flex h-full w-full will-change-transform"
        style={{
          transform: `translate3d(-${index * 100}%, 0, 0)`,
          transition: 'transform 1.15s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {slides.map((slide, i) => (
          <article
            key={slide.src}
            className="relative h-full w-full min-w-full shrink-0 basis-full"
            aria-hidden={i !== index}
          >
            <Image
              src={slide.src}
              alt={slide.alt || ''}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover object-center"
            />
          </article>
        ))}
      </div>

      {count > 1 ? (
        <>
          <div className="pointer-events-none absolute inset-y-0 right-4 z-10 flex items-center md:right-7">
            <div className="pointer-events-auto flex flex-col gap-2">
              <button
                type="button"
                aria-label="Previous banner"
                onClick={() => go(index - 1)}
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
                onClick={() => go(index + 1)}
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
                aria-current={i === index}
                onClick={() => go(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === index ? 'w-7 bg-ivory' : 'w-1.5 bg-ivory/45 hover:bg-ivory/70'
                }`}
              />
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
