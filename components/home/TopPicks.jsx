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
      if (pin && track && window.innerWidth > 900) {
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
    <section ref={root} className="picks-pin relative box-border flex h-[100svh] flex-col overflow-hidden bg-ivory">
      <div className="shrink-0 px-5 pt-5 md:px-10 md:pt-6">
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

      <div className="min-h-0 flex-1 overflow-x-auto md:overflow-hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="picks-track flex h-full w-max items-stretch gap-4 px-5 py-4 md:gap-6 md:px-10 md:py-5">
          {picks.map((product, index) => (
            <ProductCard
              key={product.slug}
              product={product}
              index={index}
              className="flex h-full w-[72vw] shrink-0 flex-col sm:w-[40vw] lg:w-[22vw]"
              sizes="(max-width: 768px) 72vw, 22vw"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
