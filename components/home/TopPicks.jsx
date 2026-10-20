'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { products } from '@/lib/products';
import ProductCard from '@/components/ProductCard';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const picks = [
  products.find((p) => p.slug === 'nacre-collar'),
  products.find((p) => p.slug === 'tide-drops'),
  products.find((p) => p.slug === 'abalone-signet'),
  products.find((p) => p.slug === 'velvet-cuff'),
  products.find((p) => p.slug === 'lumen-choker'),
  products.find((p) => p.slug === 'whisper-hoops'),
  products.find((p) => p.slug === 'flower-in-the-rain-pink'),
  products.find((p) => p.slug === 'lotus-whisper-pink'),
].filter(Boolean);

export default function TopPicks() {
  const root = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const pin = root.current;
      const track = root.current?.querySelector('.picks-track');
      if (pin && track && window.matchMedia('(min-width: 768px)').matches) {
        gsap.to(track, {
          x: () => -(track.scrollWidth - window.innerWidth + 80),
          ease: 'none',
          scrollTrigger: {
            trigger: pin,
            start: 'top top',
            end: () => `+=${track.scrollWidth}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      }
    }, root);

    const refresh = setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => {
      clearTimeout(refresh);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={root}
      className="picks-pin relative box-border flex flex-col overflow-hidden bg-ivory md:h-[100svh]"
    >
      <div className="shrink-0 px-5 pt-8 pb-2 md:px-10 md:pt-6">
        <div className="flex flex-col items-start justify-between gap-3 border-b border-ink/8 pb-4 md:flex-row md:items-end md:pb-5">
          <div>
            <p className="font-label text-gold">Top picks</p>
            <h2 className="font-display mt-2 text-3xl text-ink md:text-5xl">Chosen for the reveal.</h2>
            <p className="mt-2 max-w-md text-sm font-light leading-relaxed text-ink/85">
              A short edit of pieces the house returns to — silver meeting gold, worn softly.
            </p>
          </div>
          <Link
            href="/shop"
            className="bg-velvet-texture inline-flex items-center rounded-full px-5 py-2.5 font-label text-[11px] text-ivory transition-opacity hover:opacity-90"
          >
            View all picks
          </Link>
        </div>
      </div>

      {/* Phone: 2-col grid */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-7 px-5 py-6 md:hidden">
        {picks.map((product, index) => (
          <ProductCard
            key={product.slug}
            product={product}
            index={index}
            className="h-full"
            sizes="50vw"
          />
        ))}
      </div>

      {/* Desktop: pinned horizontal track */}
      <div className="hidden min-h-0 flex-1 overflow-hidden md:block">
        <div className="picks-track flex h-full w-max items-stretch gap-6 px-10 py-5">
          {picks.map((product, index) => (
            <ProductCard
              key={product.slug}
              product={product}
              index={index}
              className="flex h-full w-[40vw] shrink-0 flex-col lg:w-[22vw]"
              sizes="22vw"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
