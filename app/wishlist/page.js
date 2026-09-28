'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { products } from '@/lib/products';
import { money } from '@/lib/format';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useStore();
  const saved = products.filter((item) => wishlist.includes(item.slug));

  return (
    <div className="bg-ivory pt-28 pb-24 md:pt-36">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <h1 className="font-display text-5xl md:text-7xl">Saved</h1>
        {saved.length === 0 ? (
          <p className="mt-10 text-stone">Nothing kept yet. The heart on a piece will hold it here.</p>
        ) : (
          <ul className="mt-12 divide-y divide-cream border-y border-cream">
            {saved.map((product) => (
              <li key={product.slug} className="flex flex-col gap-6 py-8 sm:flex-row sm:items-center">
                <Link href={`/shop/${product.slug}`} className="relative h-32 w-24 shrink-0 overflow-hidden bg-cream">
                  <Image src={product.image} alt={product.name} fill className="object-cover" sizes="96px" />
                </Link>
                <div className="flex-1">
                  <p className="font-display text-2xl">{product.name}</p>
                  <p className="mt-1 text-sm text-stone">{money(product.price)}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => addToCart(product.slug, { size: product.sizes[0], metal: product.metal[0] })}
                    className="h-11 bg-ink px-6 text-[10px] tracking-[0.24em] text-ivory uppercase"
                  >
                    Add to bag
                  </button>
                  <button type="button" onClick={() => toggleWishlist(product.slug)} className="text-[10px] tracking-[0.24em] uppercase">
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
