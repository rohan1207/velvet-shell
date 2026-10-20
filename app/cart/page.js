'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { getProduct } from '@/lib/products';
import { money } from '@/lib/format';

export default function CartPage() {
  const { cart, updateQty, removeFromCart, cartTotal } = useStore();

  return (
    <div className="bg-ivory pt-28 pb-24 md:pt-36">
      <div className="mx-auto max-w-4xl px-5">
        <h1 className="font-display text-4xl tracking-[-0.03em] md:text-7xl">Bag</h1>
        {cart.length === 0 ? (
          <div className="mt-16">
            <p className="text-stone">Nothing here yet.</p>
            <Link href="/shop" className="mt-6 inline-block text-[11px] tracking-[0.28em] uppercase">
              Enter the shop
            </Link>
          </div>
        ) : (
          <>
            <ul className="mt-12 divide-y divide-cream border-y border-cream">
              {cart.map((item) => {
                const product = getProduct(item.slug);
                if (!product) return null;
                return (
                  <li key={item.id} className="flex gap-4 py-6 md:gap-6 md:py-8">
                    <Link href={`/shop/${product.slug}`} className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-cream md:h-32 md:w-24 md:rounded-none">
                      <Image src={product.image} alt={product.name} fill className="object-cover" sizes="96px" />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-display text-lg leading-snug md:text-2xl">{product.name}</p>
                          <p className="mt-1.5 text-xs text-stone md:mt-2">
                            {item.metal} · {item.size}
                          </p>
                        </div>
                        <p className="font-num shrink-0 text-sm md:text-base">{money(product.price * item.qty)}</p>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-4">
                        <div className="flex items-center gap-4">
                          <button type="button" onClick={() => updateQty(item.id, item.qty - 1)}>
                            −
                          </button>
                          <span>{item.qty}</span>
                          <button type="button" onClick={() => updateQty(item.id, item.qty + 1)}>
                            +
                          </button>
                        </div>
                        <button type="button" onClick={() => removeFromCart(item.id)} className="text-[10px] tracking-[0.2em] uppercase text-stone">
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="mt-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm text-stone">Subtotal</p>
                <p className="font-num text-3xl text-ink md:text-4xl">{money(cartTotal)}</p>
              </div>
              <Link href="/checkout" className="flex h-12 items-center rounded-full bg-ink px-10 text-[11px] tracking-[0.28em] text-ivory uppercase">
                Checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
