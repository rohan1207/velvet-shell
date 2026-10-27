'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '@/context/StoreContext';
import { money } from '@/lib/format';
import ProductThumb from '@/components/ProductThumb';
import PromoCodeField from '@/components/PromoCodeField';

export default function CartDrawer() {
  const {
    cart,
    cartOpen,
    setCartOpen,
    updateQty,
    removeFromCart,
    cartTotal,
    cartPayable,
    discountAmount,
    promo,
    cartCount,
    getProduct,
  } = useStore();

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.button
            type="button"
            aria-label="Close bag"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 z-[60] bg-ink/40"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 z-[70] flex h-full w-full max-w-md flex-col bg-ivory pt-[env(safe-area-inset-top)] shadow-[-24px_0_60px_rgba(40,20,24,0.18)]"
          >
            <div className="flex items-center justify-between border-b border-ink/8 px-4 py-4 sm:px-6 sm:py-5">
              <div>
                <p className="font-label text-[11px] tracking-[0.22em] text-ink">Bag</p>
                <p className="mt-1 text-xs font-light text-ink/80">
                  {cartCount} {cartCount === 1 ? 'piece' : 'pieces'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="font-label text-[11px] tracking-[0.18em] text-ink/80 hover:text-burgundy"
              >
                Close
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 sm:px-6">
              {cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center px-2 text-center">
                  <p className="font-display text-[1.75rem] text-ink sm:text-3xl">Your bag is quiet.</p>
                  <Link
                    href="/shop"
                    onClick={() => setCartOpen(false)}
                    className="mt-6 font-label text-[11px] tracking-[0.2em] text-gold"
                  >
                    Enter the shop
                  </Link>
                </div>
              ) : (
                <ul className="space-y-7 py-6">
                  {cart.map((item) => {
                    const product = getProduct(item.slug);
                    const name = product?.name || item.name || item.slug;
                    const price = product?.price ?? item.price ?? 0;
                    const line = price * item.qty;
                    const href = `/shop/${product?.slug || item.slug}`;
                    return (
                      <li key={item.id} className="flex gap-4">
                        <Link
                          href={href}
                          onClick={() => setCartOpen(false)}
                          className="relative h-28 w-24 shrink-0 overflow-hidden rounded-lg bg-pearl ring-1 ring-ink/6"
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
                              <p className="font-display text-xl leading-tight text-ink">{name}</p>
                              <p className="mt-1.5 text-xs font-light text-ink/85">
                                {item.metal} · {item.size}
                              </p>
                              {Array.isArray(item.customization) && item.customization.length > 0 ? (
                                <ul className="mt-2 space-y-1 text-[11px] text-ink/70">
                                  {item.customization.map((entry, i) => (
                                    <li key={`${entry.id || entry.label}-${i}`}>
                                      <span className="text-ink/50">{entry.label}:</span> {entry.value}
                                    </li>
                                  ))}
                                </ul>
                              ) : null}
                              <p className="mt-1 text-xs font-light text-ink/85">
                                <span className="font-num">{money(price)}</span> each
                              </p>
                            </div>
                            <p className="font-num shrink-0 text-sm text-ink">{money(line)}</p>
                          </div>
                          <div className="mt-auto flex items-center justify-between pt-4">
                            <div className="inline-flex items-center rounded-full border border-ink/10 px-1.5 text-sm">
                              <button
                                type="button"
                                aria-label="Decrease quantity"
                                onClick={() => updateQty(item.id, item.qty - 1)}
                                className="flex h-11 w-11 items-center justify-center"
                              >
                                −
                              </button>
                              <span className="min-w-5 text-center">{item.qty}</span>
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
                              className="font-label min-h-11 px-2 text-[10px] tracking-[0.16em] text-ink/80 uppercase hover:text-burgundy"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {cart.length > 0 && (
              <div className="shrink-0 border-t border-ink/8 px-6 pt-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
                <PromoCodeField compact />
                <div className="mt-4 space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-ink/85">Subtotal</span>
                    <span className="font-num text-ink">{money(cartTotal)}</span>
                  </div>
                  {discountAmount > 0 ? (
                    <div className="flex justify-between text-emerald-800">
                      <span>
                        Discount{promo?.code ? ` (${promo.code})` : ''}
                      </span>
                      <span className="font-num">−{money(discountAmount)}</span>
                    </div>
                  ) : null}
                  <div className="flex justify-between font-medium">
                    <span className="text-ink">Total</span>
                    <span className="font-num text-ink">{money(cartPayable)}</span>
                  </div>
                </div>
                <p className="mt-2 text-xs font-light text-ink/80">
                  Shipping calculated at checkout. Payments via Razorpay.
                </p>
                <Link
                  href="/checkout"
                  onClick={() => setCartOpen(false)}
                  className="bg-velvet-texture mt-5 flex h-12 items-center justify-center rounded-full font-label text-[11px] tracking-[0.2em] text-ivory"
                >
                  Checkout · <span className="font-num">{money(cartPayable)}</span>
                </Link>
                <Link
                  href="/cart"
                  onClick={() => setCartOpen(false)}
                  className="mt-3 block py-2 text-center font-label text-[11px] tracking-[0.16em] text-ink/85 hover:text-burgundy"
                >
                  View bag
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
