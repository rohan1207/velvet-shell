'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { money } from '@/lib/format';

export default function ConfirmationPage() {
  const { getProduct } = useStore();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    try {
      setOrder(JSON.parse(sessionStorage.getItem('vs-order') || 'null'));
    } catch {
      setOrder(null);
    }
  }, []);

  return (
    <div className="bg-ivory pt-28 pb-24 md:pt-36">
      <div className="mx-auto max-w-2xl px-5">
        <p className="font-label text-gold">Confirmed</p>
        <h1 className="font-display mt-4 text-4xl tracking-[-0.03em] text-ink md:text-7xl">The house has it.</h1>
        <p className="mt-6 text-sm font-light leading-relaxed text-ink/85">
          A note is on its way. Ready pieces ship within a few days. Made-to-order pieces leave the
          atelier in two to three weeks.
        </p>
        {order && (
          <div className="mt-12 border border-ink/10 bg-pearl px-7 py-8">
            <p className="font-label text-[11px] text-ink/80">Order {order.id}</p>
            <p className="mt-2 text-xs font-light text-ink/85">
              {order.status} · {order.paymentMethod}
              {order.paymentId ? ` · ${order.paymentId}` : ''}
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {order.items.map((item) => {
                const product = getProduct(item.slug);
                return (
                  <li key={item.id} className="flex justify-between gap-4">
                    <span>
                      {product?.name ?? item.slug}
                      <span className="mt-1 block text-xs text-ink/80">
                        {item.metal} · {item.size} · Qty {item.qty}
                      </span>
                    </span>
                    {product && <span className="font-num">{money(product.price * item.qty)}</span>}
                  </li>
                );
              })}
            </ul>
            <p className="font-num mt-6 text-3xl text-ink">{money(order.total)}</p>
          </div>
        )}
        <div className="mt-10 flex flex-wrap gap-6">
          <Link
            href="/account?tab=orders"
            className="font-label text-[11px] tracking-[0.18em] text-burgundy"
          >
            View order history
          </Link>
          <Link href="/shop" className="font-label text-[11px] tracking-[0.18em] text-ink/80">
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
