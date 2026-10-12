'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const INTERVAL_MS = 5200;

const slides = [
  {
    id: 'garden',
    image: '/images/banners/home-hero/garden.jpg',
    eyebrow: 'Nature, worn close',
    title: 'Where the garden\nbecomes jewellery.',
    body: 'Floral forms drawn from living blooms — silver and gold pieces that feel discovered, not manufactured.',
    cta: 'Discover the collection',
    href: '/shop',
    align: 'center',
  },
  {
    id: 'lotus',
    image: '/images/banners/home-hero/lotus.jpg',
    eyebrow: 'The lotus edit',
    title: 'Quiet blooms\nin morning mist.',
    body: 'Lotus-inspired pieces for those who love depth, softness, and the still beauty of water and leaf.',
    cta: 'Shop lotus & florals',
    href: '/shop?category=rings',
    align: 'left',
  },
  {
    id: 'honeybee',
    image: '/images/banners/home-hero/honeybee.jpg',
    eyebrow: 'From the meadow',
    title: 'Little wonders\nof the wild.',
    body: 'Honeybee earrings and botanical charms — tiny stories of pollen, light, and golden hours.',
    cta: 'Explore earrings',
    href: '/shop?category=earrings',
    align: 'right',
  },
  {
    id: 'calla',
    image: '/images/banners/home-hero/calla.jpg',
    eyebrow: 'Botanical atelier',
    title: 'Thoughtful forms\nfrom living nature.',
    body: 'Calla lilies, ferns, and soft greens — jewellery that carries the calm of a private garden.',
    cta: 'Enter the shop',
    href: '/shop',
    align: 'center',
  },
];

export default function HeroNatureStory() {
  const [index, setIndex] = useState(0);
  const count = slides.length;
  const slide = slides[index];

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

  const alignClass =
    slide.align === 'left'
      ? 'items-start text-left md:pl-6 lg:pl-10'
      : slide.align === 'right'
        ? 'items-end text-right md:pr-6 lg:pr-10'
        : 'items-center text-center';

  return (
    <section
      className="relative box-border h-[100svh] w-full overflow-hidden bg-[#0f2a1f] pt-[6.25rem] md:pt-[7.1rem]"
      aria-roledescription="carousel"
      aria-label="Nature storytelling hero"
    >
      <div className="relative h-full w-full overflow-hidden">
      <div
        className="flex h-full w-full will-change-transform"
        style={{
          transform: `translate3d(-${index * 100}%, 0, 0)`,
          transition: 'transform 1.25s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {slides.map((item, i) => (
          <article
            key={item.id}
            className="relative h-full w-full min-w-full shrink-0 basis-full"
            aria-hidden={i !== index}
          >
            <Image
              src={item.image}
              alt=""
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover object-center"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/25 to-black/20"
              aria-hidden
            />
          </article>
        ))}
      </div>

      <div className={`pointer-events-none absolute inset-0 z-10 flex ${alignClass} justify-center px-6 pb-20 pt-10 md:px-12 md:pb-24 md:pt-14`}>
        <div
          key={slide.id}
          className="pointer-events-auto max-w-xl animate-[fade-up_0.9s_var(--ease-luxe)_both] md:max-w-2xl"
        >
          <p className="font-label text-[10px] tracking-[0.28em] text-gold uppercase md:text-[11px]">
            {slide.eyebrow}
          </p>
          <h1 className="font-display mt-4 whitespace-pre-line text-[clamp(2.4rem,6.5vw,4.6rem)] leading-[1.05] tracking-[-0.02em] text-ivory">
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
            onClick={() => go(index - 1)}
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
            onClick={() => go(index + 1)}
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
            aria-current={i === index}
            onClick={() => go(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === index ? 'w-8 bg-ivory' : 'w-1.5 bg-ivory/40 hover:bg-ivory/70'
            }`}
          />
        ))}
      </div>
      </div>
    </section>
  );
}
