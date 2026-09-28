'use client';

import Image from 'next/image';
import Link from 'next/link';
import { money } from '@/lib/format';
import { collectionName } from '@/lib/products';
import { useStore } from '@/context/StoreContext';

export default function ProductCard({ product, index = 0 }) {
  const { wishlist, toggleWishlist } = useStore();
  const wished = wishlist.includes(product.slug);

  return (
    <article className="group" style={{ animationDelay: `${index * 80}ms` }}>
      <Link href={`/shop/${product.slug}`} data-cursor="View" aria-label={product.name} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-cream">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
          />
          {product.hoverImage && (
            <Image
              src={product.hoverImage}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover opacity-0 transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100"
            />
          )}
          {product.badge && (
            <span className="absolute top-4 left-4 bg-ivory/90 px-2.5 py-1 text-[10px] tracking-[0.28em] text-ink uppercase">
              {product.badge}
            </span>
          )}
        </div>
      </Link>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] tracking-[0.28em] text-stone uppercase">{collectionName(product.collection)}</p>
          <Link href={`/shop/${product.slug}`} className="font-display mt-1 block text-2xl leading-none">
            {product.name}
          </Link>
          <p className="mt-2 text-sm text-stone">{money(product.price)}</p>
        </div>
        <button
          type="button"
          aria-label={wished ? 'Remove from wishlist' : 'Save to wishlist'}
          onClick={() => toggleWishlist(product.slug)}
          className={`mt-1 text-lg leading-none ${wished ? 'text-gold' : 'text-stone hover:text-ink'}`}
        >
          {wished ? '♥' : '♡'}
        </button>
      </div>
    </article>
  );
}
