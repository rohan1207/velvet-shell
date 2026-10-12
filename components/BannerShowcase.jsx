'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HOME_BANNER_SLIDES } from '@/lib/home-banner-slides';

const INTERVAL_MS = 4000;
const slides = HOME_BANNER_SLIDES;

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
      className="relative box-border h-[calc(100svh-6.25rem)] w-full scroll-mt-[6.25rem] overflow-hidden bg-ivory md:h-[calc(100svh-7.1rem)] md:scroll-mt-[7.1rem]"
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
            <Link href={slide.href} className="absolute inset-0 block" aria-label={slide.alt}>
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover object-center"
              />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
