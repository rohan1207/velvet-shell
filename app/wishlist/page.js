'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useStore } from '@/context/StoreContext';
import ProductCard from '@/components/ProductCard';

export default function WishlistPage() {
  const { wishlist, addToCart, toggleWishlist, catalog } = useStore();
  const pool = catalog?.allProducts?.length
    ? catalog.allProducts
    : catalog?.products?.length
      ? catalog.products
      : [];

  const saved = useMemo(
    () =>
      wishlist
        .map((slug) => pool.find((item) => item.slug === slug))
        .filter(Boolean),
    [wishlist, pool],
  );

  function addAllToBag() {
    saved.forEach((product) => addToCart(product.slug));
  }

  return (
    <div className="bg-ivory pt-28 pb-24 md:pt-36">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-label text-gold">Wishlist</p>
            <h1 className="font-display mt-4 text-4xl tracking-[-0.03em] md:text-7xl">Saved</h1>
            {saved.length > 0 && (
              <p className="mt-3 text-sm font-light text-ink/85">
                {saved.length} {saved.length === 1 ? 'piece' : 'pieces'}
              </p>
            )}
          </div>
          {saved.length > 0 && (
            <button
              type="button"
              onClick={addAllToBag}
              className="bg-velvet-texture inline-flex h-12 items-center rounded-full px-6 font-label text-[11px] tracking-[0.18em] text-ivory"
            >
              Add all to bag
            </button>
          )}
        </div>

        {saved.length === 0 ? (
          <div className="mt-12 max-w-md">
            <p className="text-[15px] font-light leading-relaxed text-ink/85">
              Nothing kept yet. Use the heart on a piece to hold it here.
            </p>
            <Link
              href="/shop"
              className="mt-6 inline-flex items-center gap-3 font-label text-[11px] tracking-[0.18em] text-burgundy"
            >
              Browse the shop
              <span aria-hidden>→</span>
            </Link>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12 lg:grid-cols-4">
            {saved.map((product, index) => (
              <div key={product.slug} className="relative">
                <ProductCard
                  product={product}
                  index={index}
                  colorFamilies={catalog?.colorFamilies || []}
                  catalogProducts={pool}
                />
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.slug)}
                  className="mt-2 font-label text-[10px] tracking-[0.14em] text-ink/80 hover:text-burgundy"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
