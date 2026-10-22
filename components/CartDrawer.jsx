'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '@/context/StoreContext';
import { money } from '@/lib/format';
import ProductThumb from '@/components/ProductThumb';

export default function CartDrawer() {
  const {
    cart,
    cartOpen,
    setCartOpen,
    updateQty,
    removeFromCart,
    cartTotal,
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
            className="fixed top-0 right-0 z-[70] flex h-full w-full max-w-md flex-col bg-ivory shadow-[-24px_0_60px_rgba(40,20,24,0.18)]"
          >
            <div className="flex items-center justify-between border-b border-ink/8 px-6 py-5">
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

            <div className="flex-1 overflow-auto px-6">
              {cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <p className="font-display text-3xl text-ink">Your bag is quiet.</p>
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
                              <p className="mt-1 text-xs font-light text-ink/85">
                                <span className="font-num">{money(price)}</span> each
                              </p>
                            </div>
                            <p className="font-num shrink-0 text-sm text-ink">{money(line)}</p>
                          </div>
                          <div className="mt-auto flex items-center justify-between pt-4">
                            <div className="inline-flex items-center gap-4 rounded-full border border-ink/10 px-4 py-1.5 text-sm">
                              <button
                                type="button"
                                aria-label="Decrease quantity"
                                onClick={() => updateQty(item.id, item.qty - 1)}
                              >
                                −
                              </button>
                              <span className="min-w-4 text-center">{item.qty}</span>
                              <button
                                type="button"
                                aria-label="Increase quantity"
                                onClick={() => updateQty(item.id, item.qty + 1)}
                              >
                                +
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              className="font-label text-[10px] tracking-[0.16em] text-ink/80 uppercase hover:text-burgundy"
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
              <div className="border-t border-ink/8 px-6 py-6">
                <div className="flex justify-between text-sm">
                  <span className="text-ink/85">Subtotal</span>
                  <span className="font-num text-ink">{money(cartTotal)}</span>
                </div>
                <p className="mt-2 text-xs font-light text-ink/80">
                  Shipping calculated at checkout. Payments via Razorpay.
                </p>
                <Link
                  href="/checkout"
                  onClick={() => setCartOpen(false)}
                  className="bg-velvet-texture mt-5 flex h-12 items-center justify-center rounded-full font-label text-[11px] tracking-[0.2em] text-ivory"
                >
                  Checkout · <span className="font-num">{money(cartTotal)}</span>
                </Link>
                <Link
                  href="/cart"
                  onClick={() => setCartOpen(false)}
                  className="mt-3 block text-center font-label text-[11px] tracking-[0.16em] text-ink/85 hover:text-burgundy"
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
