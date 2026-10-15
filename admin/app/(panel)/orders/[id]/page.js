'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getOrder, updateOrderStatus } from '@/lib/repository';
import { money } from '@/lib/format';

const STATUSES = ['pending', 'accepted', 'packed', 'dispatched', 'delivered', 'cancelled'];

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setOrder(getOrder(id));
  }, [id]);

  if (!order) {
    return (
      <div>
        <p>Order not found.</p>
        <Link href="/orders" className="btn-ghost mt-4">
          Back
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link href="/orders" className="font-label text-[10px] text-[#7a736c]">
            ← Orders
          </Link>
          <h1 className="font-display mt-2 text-4xl">{order.orderNumber}</h1>
          <p className="mt-1 text-sm text-[#7a736c]">
            {new Date(order.createdAt).toLocaleString('en-IN')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-sm text-emerald-700">Updated</span>}
          <label className="block">
            <span className="text-xs text-[#7a736c]">Status</span>
            <select
              className="input mt-1 min-w-[180px]"
              value={order.status}
              onChange={(e) => {
                const next = updateOrderStatus(order.id, e.target.value);
                setOrder(next);
                setSaved(true);
                setTimeout(() => setSaved(false), 1500);
              }}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="card p-5">
          <p className="font-label text-[10px] text-[#7a736c]">Customer</p>
          <p className="mt-3 font-medium">
            {order.customer?.firstName} {order.customer?.lastName}
          </p>
          <p className="mt-1 text-sm text-[#7a736c]">{order.email}</p>
          <p className="text-sm text-[#7a736c]">{order.customer?.phone}</p>
        </div>
        <div className="card p-5">
          <p className="font-label text-[10px] text-[#7a736c]">Shipping</p>
          <p className="mt-3 text-sm">
            {order.shipping?.address}
            <br />
            {order.shipping?.city}, {order.shipping?.state} {order.shipping?.postal}
            <br />
            {order.shipping?.country}
          </p>
          <p className="mt-3 text-xs text-[#7a736c]">
            {order.paymentMethod} · {order.paymentId}
          </p>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-[#2d2b2b]/8 px-5 py-4">
          <p className="font-label text-[10px] text-[#7a736c]">Line items</p>
        </div>
        <ul className="divide-y divide-[#2d2b2b]/6">
          {order.items.map((item, i) => (
            <li key={`${item.slug}-${i}`} className="flex gap-4 px-5 py-4">
              <span className="relative h-16 w-14 shrink-0 overflow-hidden rounded-md bg-[#ebe3da]">
                {item.image ? (
                  <Image src={item.image} alt="" fill className="object-cover" sizes="56px" unoptimized />
                ) : null}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="mt-1 text-xs text-[#7a736c]">
                  {item.metal} · {item.size} · Qty {item.qty}
                </p>
              </div>
              <p className="font-num text-sm">{money(item.lineTotal)}</p>
            </li>
          ))}
        </ul>
        <div className="flex justify-between border-t border-[#2d2b2b]/8 px-5 py-4">
          <span>Total</span>
          <span className="font-num text-2xl font-semibold tracking-tight">
            {money(order.total)}
          </span>
        </div>
      </div>
    </div>
  );
}
