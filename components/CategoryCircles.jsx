'use client';

import Image from 'next/image';
import Link from 'next/link';

const categories = [
  {
    label: 'Earrings',
    href: '/shop?category=earrings',
    image: '/images/product-whisper-hoops.png',
    alt: 'Champagne-gold earrings',
  },
  {
    label: 'Ring',
    href: '/shop?category=rings',
    image: '/images/product-abalone-signet.png',
    alt: 'Champagne-gold ring',
  },
  {
    label: 'Necklace',
    href: '/shop?category=necklaces',
    image: '/images/product-nacre-collar.png',
    alt: 'Champagne-gold necklace',
  },
  {
    label: 'Pendant',
    href: '/shop?category=necklaces',
    image: '/images/cat-pendant.png',
    alt: 'Pendant without chain',
    note: 'Without chain',
  },
  {
    label: 'Chain',
    href: '/shop?category=necklaces',
    image: '/images/cat-chain.png',
    alt: 'Fine gold chain',
  },
  {
    label: 'Choker',
    href: '/shop?category=necklaces',
    image: '/images/cat-choker.png',
    alt: 'Choker chain',
    note: 'Choker chain',
  },
  {
    label: 'Bracelet',
    href: '/shop?category=bracelets',
    image: '/images/product-foam-bracelet.png',
    alt: 'Champagne-gold bracelet',
  },
  {
    label: 'Brooch',
    href: '/shop?category=cuffs',
    image: '/images/cat-brooch.png',
    alt: 'Champagne-gold brooch',
  },
];

/** Six soft petals + center — viewBox 0 0 100 100 */
const PETALS = [
  [50, 26],
  [74, 38],
  [74, 62],
  [50, 74],
  [26, 62],
  [26, 38],
];

function FlowerShape({ className = '' }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden fill="currentColor">
      {PETALS.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={27} />
      ))}
      <circle cx="50" cy="50" r={31} />
    </svg>
  );
}

export default function CategoryCircles() {
  return (
    <section className="border-b border-ink/6 bg-ivory">
      {/* Shared clip for product images */}
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <clipPath id="category-flower-clip" clipPathUnits="objectBoundingBox">
            <circle cx="0.5" cy="0.26" r="0.27" />
            <circle cx="0.74" cy="0.38" r="0.27" />
            <circle cx="0.74" cy="0.62" r="0.27" />
            <circle cx="0.5" cy="0.74" r="0.27" />
            <circle cx="0.26" cy="0.62" r="0.27" />
            <circle cx="0.26" cy="0.38" r="0.27" />
            <circle cx="0.5" cy="0.5" r="0.31" />
          </clipPath>
        </defs>
      </svg>

      <div className="mx-auto max-w-[1600px] px-5 py-14 md:px-10 md:py-16 lg:py-20">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 md:mb-12 md:flex-row md:items-end">
          <div>
            <p className="font-label text-gold">Shop by category</p>
            <h2 className="font-display mt-3 text-3xl text-ink md:text-4xl">Find your piece.</h2>
          </div>
          <Link
            href="/shop"
            className="font-label text-[11px] text-ink/45 transition-colors hover:text-burgundy"
          >
            View all →
          </Link>
        </div>

        <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-4 lg:grid-cols-8 lg:gap-x-3 lg:gap-y-8">
          {categories.map((category) => (
            <li key={category.label} className="flex justify-center">
              <Link
                href={category.href}
                data-cursor="Shop"
                className="group flex w-full max-w-[9.5rem] flex-col items-center text-center outline-none"
              >
                <span className="relative block aspect-square w-full max-w-[7.75rem] lg:max-w-[8.5rem]">
                  {/* Soft gold rim */}
                  <FlowerShape className="absolute inset-0 scale-[1.07] text-gold/30 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.11] group-hover:text-gold/55" />

                  {/* Pearl flower body */}
                  <FlowerShape className="absolute inset-0 text-pearl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] group-active:scale-[0.97]" />

                  {/* Product clipped to flower */}
                  <span
                    className="absolute inset-[9%] overflow-hidden transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                    style={{ clipPath: 'url(#category-flower-clip)' }}
                  >
                    <Image
                      src={category.image}
                      alt={category.alt}
                      fill
                      sizes="136px"
                      className="object-cover"
                    />
                  </span>
                </span>

                <span className="mt-4 font-label text-[10px] tracking-[0.16em] text-ink/70 transition-colors duration-500 group-hover:text-burgundy lg:text-[11px]">
                  {category.label}
                </span>
                {category.note ? (
                  <span className="mt-1 text-[10px] font-light tracking-[0.04em] text-ink/35">
                    {category.note}
                  </span>
                ) : (
                  <span className="mt-1 h-[15px]" aria-hidden />
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
