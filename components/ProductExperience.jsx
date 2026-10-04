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
  const [metal, setMetal] = useState(product.metal[0]);
  const [qty, setQty] = useState(1);
  const [open, setOpen] = useState('story');

  return (
    <div className="bg-ivory pt-24 md:pt-28">
      <div className="mx-auto grid max-w-[1600px] gap-10 px-5 pb-24 md:px-10 lg:grid-cols-12 lg:gap-16">
        <div className="order-2 lg:sticky lg:top-28 lg:order-1 lg:col-span-7 lg:self-start">
          <div className="flex h-[min(100svh-7.5rem,920px)] gap-2.5 md:gap-3">
            <div className="flex w-14 shrink-0 flex-col gap-2.5 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] md:w-16 lg:w-[4.5rem] [&::-webkit-scrollbar]:hidden">
              {product.gallery.map((src, index) => (
                <button
                  key={`${src}-${index}`}
                  type="button"
                  onClick={() => setActive(index)}
                  aria-label={`View image ${index + 1}`}
                  aria-current={active === index}
                  className={`relative aspect-square w-full shrink-0 overflow-hidden rounded-lg bg-cream transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    active === index ? 'z-10 scale-[1.08]' : 'scale-100 hover:scale-[1.03]'
                  }`}
                >
                  <Image src={src} alt="" fill className="object-cover" sizes="72px" />
                </button>
              ))}
            </div>

            <div className="relative min-h-0 min-w-0 flex-1 overflow-hidden rounded-[1.25rem] bg-cream md:rounded-[1.5rem]">
              <Image
                src={product.gallery[active]}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>

        <div className="order-1 lg:sticky lg:top-32 lg:order-2 lg:col-span-5 lg:self-start">
          <p className="text-[11px] tracking-[0.28em] text-gold uppercase">{collectionName(product.collection)}</p>
          <h1 className="font-display mt-3 text-5xl md:text-6xl">{product.name}</h1>
          <p className="font-num mt-4 text-lg text-ink/90">{money(product.price)}</p>
          <p className="mt-8 max-w-md text-base leading-relaxed text-stone">{product.description}</p>

          <div className="mt-10">
            <p className="text-[10px] tracking-[0.28em] uppercase">Measure</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.sizes.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setSize(option)}
                  className={`min-w-16 rounded-full px-4 py-2 text-[11px] tracking-[0.16em] uppercase ${
                    size === option ? 'bg-ink text-ivory' : 'border border-cream text-stone'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {product.metal?.length > 0 && (
            <div className="mt-8">
              <p className="text-[10px] tracking-[0.28em] uppercase">Finish</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.metal.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setMetal(option)}
                    className={`rounded-full px-4 py-2 text-[11px] tracking-[0.1em] ${
                      metal === option ? 'bg-ink text-ivory' : 'border border-cream text-stone'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8">
            <p className="text-[10px] tracking-[0.28em] uppercase">Quantity</p>
            <div className="mt-3 inline-flex items-center gap-5 rounded-full border border-cream px-5 py-2.5">
              <button type="button" onClick={() => setQty((n) => Math.max(1, n - 1))}>
                −
              </button>
              <span className="min-w-6 text-center text-sm">{qty}</span>
              <button type="button" onClick={() => setQty((n) => Math.min(10, n + 1))}>
                +
              </button>
            </div>
          </div>

          <div className="mt-10 flex gap-3">
            <button
              type="button"
              onClick={() => addToCart(product.slug, { size, metal, qty })}
              className="flex h-[52px] flex-1 items-center justify-center rounded-full bg-ink text-[11px] tracking-[0.28em] text-ivory uppercase"
            >
              Add to bag · <span className="font-num">{money(product.price * qty)}</span>
            </button>
            <button
              type="button"
              onClick={() => toggleWishlist(product.slug)}
              className="flex h-[52px] w-[52px] items-center justify-center rounded-full border border-cream text-lg"
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
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12 lg:grid-cols-4">
          {related.map((item, index) => (
            <ProductCard key={item.slug} product={item} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
