'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { products } from '@/lib/products';
import { money } from '@/lib/format';
import { useStore } from '@/context/StoreContext';

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
].filter(Boolean);

function IconHeart({ filled = false }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill={filled ? 'currentColor' : 'none'} aria-hidden>
      <path
        d="M12 20s-7.2-4.35-9.2-8.2C1.3 9.1 2.7 6.2 5.6 5.5c1.7-.4 3.4.3 4.4 1.6 1-1.3 2.7-2 4.4-1.6 2.9.7 4.3 3.6 2.8 6.3C19.2 15.65 12 20 12 20Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconBag() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <path d="M7.2 8.5h9.6l.7 11.2H6.5L7.2 8.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path
        d="M9.2 8.5V7.2a2.8 2.8 0 0 1 5.6 0v1.3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PickCard({ product, index }) {
  const { wishlist, toggleWishlist, addToCart } = useStore();
  const wished = wishlist.includes(product.slug);

  return (
    <article className="group relative flex h-full w-[72vw] shrink-0 flex-col sm:w-[40vw] lg:w-[26vw]">
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-[1.25rem] bg-pearl md:rounded-[1.35rem]">
        <Link href={`/shop/${product.slug}`} data-cursor="View" className="absolute inset-0 block" aria-label={product.name}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 72vw, 26vw"
            className="object-cover transition-transform duration-[1.15s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
          />
          {product.hoverImage && (
            <Image
              src={product.hoverImage}
              alt=""
              fill
              sizes="(max-width: 768px) 72vw, 26vw"
              className="object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            />
          )}
        </Link>

        <span className="pointer-events-none absolute top-4 left-4 font-label text-[10px] text-ivory/90 md:top-5 md:left-5">
          0{index + 1}
        </span>

        <div className="absolute inset-x-0 bottom-0 flex translate-y-2 items-center justify-between gap-3 p-3.5 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100 md:p-4">
          <button
            type="button"
            aria-label={wished ? 'Remove from wishlist' : 'Save to wishlist'}
            onClick={() => toggleWishlist(product.slug)}
            className={`flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md transition-colors ${
              wished ? 'bg-burgundy text-ivory' : 'bg-ivory/95 text-ink hover:text-burgundy'
            }`}
          >
            <IconHeart filled={wished} />
          </button>
          <button
            type="button"
            aria-label="Add to bag"
            onClick={() => addToCart(product.slug)}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-burgundy px-4 font-label text-[10px] text-ivory transition-opacity hover:opacity-90"
          >
            <IconBag />
            Add
          </button>
        </div>
      </div>

      <div className="mt-3 flex shrink-0 items-start justify-between gap-3 px-0.5 md:mt-4">
        <div className="min-w-0">
          <Link
            href={`/shop/${product.slug}`}
            className="font-display block truncate text-xl leading-tight tracking-[-0.02em] text-ink transition-colors hover:text-burgundy md:text-2xl"
          >
            {product.name}
          </Link>
          <p className="mt-1 text-sm font-light text-ink/45">{money(product.price)}</p>
        </div>
        <Link
          href={`/shop/${product.slug}`}
          className="mt-1 shrink-0 font-label text-[10px] text-ink/30 transition-colors hover:text-burgundy"
        >
          Shop →
        </Link>
      </div>
    </article>
  );
}

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
            <p className="mt-2 max-w-md text-sm font-light leading-relaxed text-ink/55">
              A short edit of pieces the house returns to — silver meeting gold, worn softly.
            </p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center rounded-full border border-ink/12 px-5 py-2.5 font-label text-[11px] text-ink transition-colors hover:border-burgundy/30 hover:text-burgundy"
          >
            View all picks
          </Link>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-x-auto md:overflow-hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="picks-track flex h-full w-max gap-4 px-5 py-4 md:gap-6 md:px-10 md:py-5">
          {picks.map((product, index) => (
            <PickCard key={product.slug} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
