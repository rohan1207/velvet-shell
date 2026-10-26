'use client';

import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { money } from '@/lib/format';
import ProductThumb from '@/components/ProductThumb';
import PromoCodeField from '@/components/PromoCodeField';

export default function CartPage() {
  const {
    cart,
    updateQty,
    removeFromCart,
    cartTotal,
    cartPayable,
    discountAmount,
    promo,
    getProduct,
  } = useStore();

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
                const name = product?.name || item.name || item.slug;
                const price = product?.price ?? item.price ?? 0;
                const href = `/shop/${product?.slug || item.slug}`;
                return (
                  <li key={item.id} className="flex gap-4 py-6 md:gap-6 md:py-8">
                    <Link
                      href={href}
                      className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-cream ring-1 ring-ink/6 md:h-32 md:w-24"
                    >
                      <ProductThumb
                        product={product}
                        item={item}
                        alt={name}
                        sizes="96px"
                        className="object-cover object-center"
                      />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-display text-lg leading-snug md:text-2xl">{name}</p>
                          <p className="mt-1.5 text-xs text-stone md:mt-2">
                            {item.metal} · {item.size}
                          </p>
                          {Array.isArray(item.customization) && item.customization.length > 0 ? (
                            <ul className="mt-2 space-y-1 text-[11px] text-ink/70">
                              {item.customization.map((entry, i) => (
                                <li key={`${entry.id || entry.label}-${i}`}>
                                  <span className="text-ink/45">{entry.label}:</span> {entry.value}
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                        <p className="font-num shrink-0 text-sm md:text-base">
                          {money(price * item.qty)}
                        </p>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-4">
                        <div className="inline-flex items-center rounded-full border border-ink/10 px-1">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() => updateQty(item.id, item.qty - 1)}
                            className="flex h-11 w-11 items-center justify-center"
                          >
                            −
                          </button>
                          <span className="min-w-5 text-center text-sm">{item.qty}</span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() => updateQty(item.id, item.qty + 1)}
                            className="flex h-11 w-11 items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="min-h-11 px-2 text-[10px] tracking-[0.2em] text-stone uppercase"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="mt-10 max-w-sm">
              <PromoCodeField />
            </div>
            <div className="mt-8 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
              <div className="space-y-1">
                <p className="text-sm text-stone">Subtotal</p>
                <p className="font-num text-xl text-ink/70">{money(cartTotal)}</p>
                {discountAmount > 0 ? (
                  <p className="text-sm text-emerald-800">
                    Discount{promo?.code ? ` (${promo.code})` : ''} −{money(discountAmount)}
                  </p>
                ) : null}
                <p className="font-num text-3xl text-ink md:text-4xl">{money(cartPayable)}</p>
              </div>
              <Link
                href="/checkout"
                className="flex h-12 items-center rounded-full bg-ink px-10 text-[11px] tracking-[0.28em] text-ivory uppercase"
              >
                Checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
