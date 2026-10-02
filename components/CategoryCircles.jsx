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

const MASK = {
  WebkitMaskImage: "url('/images/shell-abalone-mask.svg')",
  maskImage: "url('/images/shell-abalone-mask.svg')",
  WebkitMaskSize: 'contain',
  maskSize: 'contain',
  WebkitMaskRepeat: 'no-repeat',
  maskRepeat: 'no-repeat',
  WebkitMaskPosition: 'center',
  maskPosition: 'center',
};

/** Ridge lines from the abalone SVG */
const DETAILS = [
  'M8.69 15.25 L5.5 10.99 C4.5 9.66 4.77 7.78 6.1 6.79 C6.36 6.59 6.64 6.44 6.95 6.34 L7.5 6.16 C7.88 6.03 8.27 5.92 8.65 5.83 L8.84 5.78 C8.51 6.39 8.41 7.11 8.61 7.81 L10.45 14.24',
  'M13.55 14.24 L15.39 7.81 C15.59 7.11 15.49 6.39 15.16 5.78 C15.61 5.89 16.06 6.01 16.5 6.16 L17.05 6.34 C18.62 6.86 19.47 8.56 18.95 10.14 C18.85 10.44 18.7 10.73 18.5 10.99 L15.31 15.25',
  'M10.45 14.24 L8.61 7.81 C8.26 6.56 8.84 5.24 10 4.66 C11.26 4.03 12.74 4.03 14 4.66 C15.16 5.24 15.74 6.56 15.39 7.81 L13.55 14.24',
  'M17 16.59 L17 18.5 C17 19.33 16.33 20 15.5 20 L8.5 20 C7.67 20 7 19.33 7 18.5 L7 16.59 C7.64 17.07 8.31 17.5 9 17.91 L11.95 19.63 C11.98 19.65 12.02 19.65 12.05 19.63 L15 17.91 C15.69 17.5 16.36 17.07 17 16.59 Z',
];

function CategoryShell({ category }) {
  return (
    <span className="relative block aspect-square w-full max-w-[7.75rem] lg:max-w-[8.5rem]">
      {/* Gold outline rim (slightly larger) */}
      <span
        className="absolute inset-0 scale-[1.06] bg-[#d4af64]/55 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.09] group-hover:bg-[#d4af64]/75"
        style={MASK}
        aria-hidden
      />

      {/* Visible cream shell + product */}
      <span
        className="absolute inset-0 overflow-hidden bg-[#ebe3da] shadow-[0_8px_20px_rgba(45,43,43,0.1)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] group-active:scale-[0.98]"
        style={MASK}
      >
        <Image
          src={category.image}
          alt={category.alt}
          fill
          sizes="136px"
          className="object-contain object-center p-[12%] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
        />
      </span>

      {/* Abalone ridge linework on top */}
      <svg viewBox="0 0 24 24" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
        <g fill="none" stroke="#b8935a" strokeWidth="0.5" strokeLinecap="round" opacity="0.45">
          {DETAILS.map((d) => (
            <path key={d.slice(0, 18)} d={d} />
          ))}
        </g>
      </svg>
    </span>
  );
}

export default function CategoryCircles() {
  return (
    <section className="border-b border-ink/6 bg-ivory">
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
                className="group flex w-full max-w-[9.5rem] flex-col items-center text-center outline-none"
              >
                <CategoryShell category={category} />

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
