'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { collectionName } from '@/lib/products';
import { money } from '@/lib/format';
import { useStore } from '@/context/StoreContext';
import ProductCard from './ProductCard';

export default function ProductExperience({ product, related }) {
  const { addToCart, wishlist, toggleWishlist } = useStore();
  const [active, setActive] = useState(0);
  const [size, setSize] = useState(product.sizes[0]);
  const [open, setOpen] = useState('story');

  return (
    <div className="bg-ivory pt-24 md:pt-28">
      <div className="mx-auto grid max-w-[1600px] gap-10 px-5 pb-24 md:px-10 lg:grid-cols-12 lg:gap-16">
        <div className="order-2 lg:order-1 lg:col-span-7">
          <div className="relative aspect-[4/5] overflow-hidden bg-cream">
            <Image
              src={product.gallery[active]}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
          </div>
          <div className="mt-3 grid grid-cols-4 gap-3">
            {product.gallery.map((src, index) => (
              <button
                key={src}
                type="button"
                onClick={() => setActive(index)}
                aria-label={`View image ${index + 1}`}
                className={`relative aspect-square overflow-hidden bg-cream ${active === index ? 'ring-1 ring-ink' : 'opacity-70 hover:opacity-100'}`}
              >
                <Image src={src} alt="" fill className="object-cover" sizes="120px" />
              </button>
            ))}
          </div>
        </div>

        <div className="order-1 lg:sticky lg:top-32 lg:order-2 lg:col-span-5 lg:self-start">
          <p className="text-[11px] tracking-[0.28em] text-gold uppercase">{collectionName(product.collection)}</p>
          <h1 className="font-display mt-3 text-5xl md:text-6xl">{product.name}</h1>
          <p className="mt-4 text-lg">{money(product.price)}</p>
          <p className="mt-8 max-w-md text-base leading-relaxed text-stone">{product.description}</p>

          <div className="mt-10">
            <p className="text-[10px] tracking-[0.28em] uppercase">Measure</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.sizes.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setSize(option)}
                  className={`min-w-16 px-4 py-2 text-[11px] tracking-[0.16em] uppercase ${
                    size === option ? 'bg-ink text-ivory' : 'border border-cream text-stone'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 flex gap-3">
            <button
              type="button"
              onClick={() => addToCart(product.slug, { size, metal: product.metal[0] })}
              className="flex h-13 flex-1 items-center justify-center bg-ink text-[11px] tracking-[0.28em] text-ivory uppercase"
              style={{ height: 52 }}
            >
              Add to bag
            </button>
            <button
              type="button"
              onClick={() => toggleWishlist(product.slug)}
              className="flex h-[52px] w-[52px] items-center justify-center border border-cream text-lg"
              aria-label="Save"
            >
              {wishlist.includes(product.slug) ? '♥' : '♡'}
            </button>
          </div>
          {product.madeToOrder && (
            <p className="mt-4 text-xs text-stone">Made to order. Allow two to three weeks in the atelier.</p>
          )}

          <div className="mt-12 divide-y divide-cream border-y border-cream">
            {[
              ['story', 'The piece', product.story],
              ['details', 'Details', product.details.join(' · ')],
              ['care', 'Care', product.care],
            ].map(([id, label, copy]) => (
              <button key={id} type="button" onClick={() => setOpen(open === id ? '' : id)} className="w-full py-5 text-left">
                <div className="flex items-center justify-between text-[11px] tracking-[0.24em] uppercase">
                  <span>{label}</span>
                  <span>{open === id ? '–' : '+'}</span>
                </div>
                {open === id && <p className="mt-4 text-sm leading-relaxed text-stone">{copy}</p>}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] px-5 pb-28 md:px-10">
        <div className="mb-10 flex items-end justify-between">
          <h2 className="font-display text-4xl">Worn with</h2>
          <Link href="/shop" className="text-[11px] tracking-[0.28em] uppercase">
            The shop
          </Link>
        </div>
        <div className="grid gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item, index) => (
            <ProductCard key={item.slug} product={item} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
