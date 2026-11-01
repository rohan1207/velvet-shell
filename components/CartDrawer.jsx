'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '@/context/StoreContext';
import { money } from '@/lib/format';
import ProductThumb from '@/components/ProductThumb';
import PromoCodeField from '@/components/PromoCodeField';
import GiftOptions from '@/components/GiftOptions';

export default function CartDrawer() {
  const {
    cart,
    cartOpen,
    setCartOpen,
    updateQty,
    removeFromCart,
    cartTotal,
    cartShippingFee,
    cartPayable,
    cartGiftWrapFee,
    discountAmount,
    promo,
    cartCount,
    getProduct,
  } = useStore();
  const listRef = useRef(null);

  useEffect(() => {
    if (!cartOpen) return undefined;
    const el = listRef.current;
    if (!el) return undefined;

    const onWheel = (event) => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const atTop = scrollTop <= 0;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 1;
      if ((event.deltaY < 0 && atTop) || (event.deltaY > 0 && atBottom)) {
        event.preventDefault();
      }
      event.stopPropagation();
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [cartOpen, cart.length]);

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
            onWheel={(e) => e.preventDefault()}
            className="fixed inset-0 z-[60] bg-ink/35"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-[70] flex h-dvh max-h-dvh w-full max-w-[22.5rem] flex-col overflow-hidden overscroll-none bg-[#faf7f3] pt-[env(safe-area-inset-top)] shadow-[-16px_0_40px_rgba(40,20,24,0.14)] sm:max-w-md"
            onWheel={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-ink/8 px-4 py-3 sm:px-5 sm:py-3.5">
              <div className="min-w-0">
                <p className="font-label text-[10px] tracking-[0.2em] text-ink uppercase">Bag</p>
                <p className="mt-0.5 text-[11px] font-light text-ink/60">
                  {cartCount} {cartCount === 1 ? 'piece' : 'pieces'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink/55 transition-colors hover:bg-ink/5 hover:text-burgundy"
                aria-label="Close bag"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            {/* Scrollable items — scrollbar hidden */}
            <div
              ref={listRef}
              className="cart-drawer-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 touch-pan-y sm:px-5"
            >
              {cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center px-2 text-center">
                  <p className="font-display text-[1.5rem] text-ink">Your bag is quiet.</p>
                  <Link
                    href="/shop"
                    onClick={() => setCartOpen(false)}
                    className="mt-5 font-label text-[10px] tracking-[0.18em] text-gold uppercase"
                  >
                    Enter the shop
                  </Link>
                </div>
              ) : (
                <div className="py-3.5 sm:py-4">
                  <ul className="divide-y divide-ink/8">
                    {cart.map((item) => {
                      const product = getProduct(item.slug);
                      const name = product?.name || item.name || item.slug;
                      const price = product?.price ?? item.price ?? 0;
                      const line = price * item.qty;
                      const href = `/shop/${product?.slug || item.slug}`;
                      return (
                        <li key={item.id} className="flex gap-3 py-3.5 first:pt-0 last:pb-0 sm:gap-3.5">
                          <Link
                            href={href}
                            onClick={() => setCartOpen(false)}
                            className="relative h-[4.5rem] w-[3.65rem] shrink-0 overflow-hidden rounded-md bg-pearl ring-1 ring-ink/6 sm:h-20 sm:w-16"
                          >
                            <ProductThumb
                              product={product}
                              item={item}
                              alt={name}
                              sizes="72px"
                              className="object-cover object-center"
                            />
                          </Link>
                          <div className="flex min-w-0 flex-1 flex-col">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <Link
                                  href={href}
                                  onClick={() => setCartOpen(false)}
                                  className="block"
                                >
                                  <p className="line-clamp-2 font-display text-[15px] leading-snug text-ink sm:text-base">
                                    {name}
                                  </p>
                                </Link>
                                <p className="mt-0.5 text-[11px] font-light text-ink/55">
                                  {item.metal} · {item.size}
                                </p>
                                {Array.isArray(item.customization) && item.customization.length > 0 ? (
                                  <ul className="mt-1 space-y-0.5 text-[10px] text-ink/55">
                                    {item.customization.map((entry, i) => (
                                      <li
                                        key={`${entry.id || entry.label}-${i}`}
                                        className="truncate"
                                      >
                                        {entry.label}: {entry.value}
                                      </li>
                                    ))}
                                  </ul>
                                ) : null}
                              </div>
                              <p className="font-num shrink-0 text-[13px] text-ink">{money(line)}</p>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between gap-2">
                              <div className="inline-flex h-8 items-center rounded-full border border-ink/10 bg-white/70">
                                <button
                                  type="button"
                                  aria-label="Decrease quantity"
                                  onClick={() => updateQty(item.id, item.qty - 1)}
                                  className="flex h-8 w-8 items-center justify-center text-sm text-ink/70"
                                >
                                  −
                                </button>
                                <span className="font-num min-w-[1.1rem] text-center text-[12px]">
                                  {item.qty}
                                </span>
                                <button
                                  type="button"
                                  aria-label="Increase quantity"
                                  onClick={() => updateQty(item.id, item.qty + 1)}
                                  className="flex h-8 w-8 items-center justify-center text-sm text-ink/70"
                                >
                                  +
                                </button>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFromCart(item.id)}
                                className="font-label px-1 text-[9px] tracking-[0.14em] text-ink/45 uppercase hover:text-burgundy"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>

            {/* Sticky footer — gift + coupon + totals */}
            {cart.length > 0 && (
              <div className="shrink-0 border-t border-ink/8 bg-[#faf7f3] px-4 pt-2.5 pb-[calc(0.65rem+env(safe-area-inset-bottom))] sm:px-5">
                <div className="space-y-2">
                  <GiftOptions compact />
                  <PromoCodeField compact />
                </div>
                <div className="mt-2.5 space-y-0.5 text-[11px] sm:text-[12px]">
                  <div className="flex justify-between gap-3">
                    <span className="text-ink/55">Subtotal</span>
                    <span className="font-num text-ink">{money(cartTotal)}</span>
                  </div>
                  {discountAmount > 0 ? (
                    <div className="flex justify-between gap-3 text-emerald-800">
                      <span className="min-w-0 truncate">
                        Discount{promo?.code ? ` (${promo.code})` : ''}
                      </span>
                      <span className="font-num shrink-0">−{money(discountAmount)}</span>
                    </div>
                  ) : null}
                  {cartGiftWrapFee > 0 ? (
                    <div className="flex justify-between gap-3">
                      <span className="text-ink/55">Gift wrap</span>
                      <span className="font-num text-ink">{money(cartGiftWrapFee)}</span>
                    </div>
                  ) : null}
                  <div className="flex justify-between gap-3">
                    <span className="text-ink/55">Shipping</span>
                    <span className="font-num text-ink">
                      {cartShippingFee > 0 ? money(cartShippingFee) : 'Free'}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between gap-3 pt-0.5">
                    <span className="font-label text-[9px] tracking-[0.14em] text-ink/45 uppercase">
                      Total
                    </span>
                    <span className="font-num text-base text-burgundy sm:text-lg">
                      {money(cartPayable)}
                    </span>
                  </div>
                </div>
                <Link
                  href="/checkout"
                  onClick={() => setCartOpen(false)}
                  className="bg-velvet-texture mt-2.5 flex h-10 items-center justify-center gap-1.5 rounded-full font-label text-[10px] tracking-[0.18em] text-ivory sm:h-11"
                >
                  Checkout · <span className="font-num">{money(cartPayable)}</span>
                </Link>
                <Link
                  href="/cart"
                  onClick={() => setCartOpen(false)}
                  className="mt-1 block py-1 text-center font-label text-[9px] tracking-[0.14em] text-ink/45 uppercase hover:text-burgundy"
                >
                  View full bag
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
