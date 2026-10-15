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
    label: 'Bracelets',
    href: '/shop?category=bracelets',
    image: '/categories/bracelate.png',
  },
  {
    label: 'Necklaces',
    href: '/shop?category=necklaces',
    image: '/categories/necklace.png',
  },
  {
    label: 'Rings',
    href: '/shop?category=rings',
    image: '/categories/ring.png',
  },
  {
    label: 'Anklets',
    href: '/shop?category=anklets',
    image: '/categories/anklet.png',
  },
  {
    label: 'Sets',
    href: '/shop?category=sets',
    image: '/categories/necklace.png',
  },
];

export default function CategoryCircles() {
  return (
    <section className="border-b border-ink/6 bg-ivory">
      <div className="mx-auto max-w-[1600px] px-5 py-10 md:px-10 md:py-12">
        <div className="mb-7 flex flex-col items-start justify-between gap-3 md:mb-8 md:flex-row md:items-end">
          <div>
            <p className="font-label text-gold">Shop by category</p>
            <h2 className="font-display mt-2 text-3xl text-ink md:text-4xl">Find your piece.</h2>
          </div>
          <Link
            href="/shop"
            className="bg-velvet-texture inline-flex items-center rounded-full px-5 py-2.5 font-label text-[11px] text-ivory transition-opacity hover:opacity-90"
          >
            View all
          </Link>
        </div>

        <ul className="grid grid-cols-2 gap-x-5 gap-y-7 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-4 lg:gap-y-6">
          {categories.map((category) => (
            <li key={category.label} className="flex justify-center">
              <Link
                href={category.href}
                className="group flex w-full max-w-[11.5rem] flex-col items-center text-center outline-none"
              >
                <span className="relative block aspect-[5/6] w-full overflow-visible transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] group-active:scale-[0.98]">
                  <Image
                    src={category.image}
                    alt={category.label}
                    fill
                    sizes="184px"
                    className="object-contain object-center scale-[1.14]"
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
