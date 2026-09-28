'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';

const INTERVAL_MS = 4000;

const slides = [
  {
    id: 'unique',
    image: '/images/banner-slide-unique.png',
    alt: 'What sets us apart — silver that meets eighteen-karat gold',
  },
  {
    id: 'atelier',
    image: '/images/banner-slide-atelier.png',
    alt: 'The design — quiet lines, lasting weight',
  },
  {
    id: 'offer',
    image: '/images/banner-slide-offer.png',
    alt: 'Private note — complimentary shipping worldwide',
  },
];

function Arrow({ dir, onClick, label }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/10 bg-ivory/85 text-ink transition-colors duration-500 hover:border-ink/20 hover:bg-ivory"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
        {dir === 'prev' ? (
          <path d="M14.5 6.5 9 12l5.5 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d="M9.5 6.5 15 12l-5.5 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    </button>
  );
}

export default function BannerShowcase() {
  const [index, setIndex] = useState(0);
  const count = slides.length;

  const go = useCallback(
    (next) => {
      setIndex(((next % count) + count) % count);
    },
    [count],
  );

  useEffect(() => {
    const id = setInterval(() => go(index + 1), INTERVAL_MS);
    return () => clearInterval(id);
  }, [index, go]);

  return (
    <section
      className="relative box-border h-[100svh] w-full overflow-hidden bg-ivory"
      aria-roledescription="carousel"
      aria-label="Featured banners"
    >
      <div
        className="flex h-full w-full will-change-transform"
        style={{
          transform: `translate3d(-${index * 100}%, 0, 0)`,
          transition: 'transform 1.2s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {slides.map((slide, i) => (
          <article
            key={slide.id}
            className="relative h-full w-full min-w-full shrink-0 basis-full"
            aria-hidden={i !== index}
          >
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover object-center"
            />
          </article>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-y-0 right-5 z-10 flex items-center md:right-8">
        <div className="pointer-events-auto flex flex-col gap-2">
          <Arrow dir="prev" label="Previous banner" onClick={() => go(index - 1)} />
          <Arrow dir="next" label="Next banner" onClick={() => go(index + 1)} />
        </div>
      </div>
    </section>
  );
}
