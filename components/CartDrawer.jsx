'use client';

import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '@/context/StoreContext';
import { getProduct } from '@/lib/products';
import { money } from '@/lib/format';

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, updateQty, removeFromCart, cartTotal } = useStore();

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
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 z-[70] flex h-full w-full max-w-md flex-col bg-pearl"
          >
            <div className="flex items-center justify-between px-6 py-6">
              <p className="text-[11px] tracking-[0.28em] uppercase">Bag</p>
              <button type="button" onClick={() => setCartOpen(false)} className="text-[11px] tracking-[0.28em] uppercase">
                Close
              </button>
            </div>

            <div className="flex-1 overflow-auto px-6">
              {cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <p className="font-display text-3xl">Your bag is quiet.</p>
                  <Link
                    href="/shop"
                    onClick={() => setCartOpen(false)}
                    className="mt-6 text-[11px] tracking-[0.28em] uppercase text-gold"
                  >
                    Enter the shop
                  </Link>
                </div>
              ) : (
                <ul className="space-y-8 pb-8">
                  {cart.map((item) => {
                    const product = getProduct(item.slug);
                    if (!product) return null;
                    return (
                      <li key={item.id} className="flex gap-4">
                        <Link href={`/shop/${product.slug}`} onClick={() => setCartOpen(false)} className="relative h-28 w-24 shrink-0 overflow-hidden bg-cream">
                          <Image src={product.image} alt={product.name} fill className="object-cover" sizes="96px" />
                        </Link>
                        <div className="flex flex-1 flex-col">
                          <div className="flex justify-between gap-3">
                            <div>
                              <p className="font-display text-xl leading-none">{product.name}</p>
                              <p className="mt-2 text-xs text-stone">
                                {item.metal} · {item.size}
                              </p>
                            </div>
                            <p className="text-sm">{money(product.price)}</p>
                          </div>
                          <div className="mt-auto flex items-center justify-between pt-4">
                            <div className="flex items-center gap-4 text-sm">
                              <button type="button" onClick={() => updateQty(item.id, item.qty - 1)}>
                                −
                              </button>
                              <span>{item.qty}</span>
                              <button type="button" onClick={() => updateQty(item.id, item.qty + 1)}>
                                +
                              </button>
                            </div>
                            <button type="button" onClick={() => removeFromCart(item.id)} className="text-[10px] tracking-[0.2em] text-stone uppercase">
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
              <div className="border-t border-cream px-6 py-6">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{money(cartTotal)}</span>
                </div>
                <p className="mt-2 text-xs text-stone">Duties and shipping calculated at checkout.</p>
                <Link
                  href="/checkout"
                  onClick={() => setCartOpen(false)}
                  className="mt-6 flex h-12 items-center justify-center bg-ink text-[11px] tracking-[0.28em] text-ivory uppercase"
                >
                  Checkout
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
