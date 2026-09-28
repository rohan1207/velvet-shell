'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProduct } from '@/lib/products';
import { money } from '@/lib/format';

export default function ConfirmationPage() {
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
        <p className="text-[11px] tracking-[0.28em] text-gold uppercase">Confirmed</p>
        <h1 className="font-display mt-4 text-5xl md:text-7xl">The house has it.</h1>
        <p className="mt-6 text-stone">
          A note is on its way. Pieces made to order will leave the atelier in two to three weeks. Ready pieces ship within three days.
        </p>
        {order && (
          <div className="mt-12 border border-cream p-8">
            <p className="text-[11px] tracking-[0.28em] uppercase">Order {order.id}</p>
            <ul className="mt-6 space-y-3 text-sm">
              {order.items.map((item) => {
                const product = getProduct(item.slug);
                return (
                  <li key={item.id} className="flex justify-between">
                    <span>{product?.name ?? item.slug}</span>
                    <span>× {item.qty}</span>
                  </li>
                );
              })}
            </ul>
            <p className="font-display mt-6 text-3xl">{money(order.total)}</p>
          </div>
        )}
        <Link href="/shop" className="mt-10 inline-block text-[11px] tracking-[0.28em] uppercase">
          Continue in the shop
        </Link>
      </div>
    </div>
  );
}
