'use client';

import Image from 'next/image';
import Link from 'next/link';

const categories = [
  {
    label: 'Earrings',
    href: '/shop?category=earrings',
    image: '/categories/earrings.png',
  },
  {
    label: 'Ring',
    href: '/shop?category=rings',
    image: '/categories/ring.png',
  },
  {
    label: 'Necklace',
    href: '/shop?category=necklaces',
    image: '/categories/necklace.png',
  },
  {
    label: 'Pendant',
    href: '/shop?category=necklaces',
    image: '/categories/pendant.png',
  },
  {
    label: 'Chain',
    href: '/shop?category=necklaces',
    image: '/categories/chain.png',
  },
  {
    label: 'Choker',
    href: '/shop?category=necklaces',
    image: '/categories/choker.png',
  },
  {
    label: 'Bracelet',
    href: '/shop?category=bracelets',
    image: '/categories/bracelate.png',
  },
  {
    label: 'Brooch',
    href: '/shop?category=cuffs',
    image: '/categories/brooch.png',
  },
];

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
            className="bg-velvet-texture inline-flex items-center rounded-full px-5 py-2.5 font-label text-[11px] text-ivory transition-opacity hover:opacity-90"
          >
            View all
          </Link>
        </div>

        <ul className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-4 lg:grid-cols-8 lg:gap-x-4 lg:gap-y-8">
          {categories.map((category) => (
            <li key={category.label} className="flex justify-center">
              <Link
                href={category.href}
                className="group flex w-full max-w-[10.5rem] flex-col items-center text-center outline-none"
              >
                <span className="relative block aspect-square w-full overflow-hidden transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] group-active:scale-[0.98]">
                  <Image
                    src={category.image}
                    alt={category.label}
                    fill
                    sizes="168px"
                    className="object-contain object-center"
                  />
                </span>

                <span className="mt-4 font-label text-[10px] tracking-[0.16em] text-ink/80 transition-colors duration-500 group-hover:text-burgundy lg:text-[11px]">
                  {category.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
