'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { getMeta, listProducts } from '@/lib/repository';
import { labelCategory, labelCollection, money } from '@/lib/format';

function ProductsInner() {
  const searchParams = useSearchParams();
  const [q, setQ] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [collection, setCollection] = useState('');
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [stock, setStock] = useState(searchParams.get('stock') || '');
  const [meta, setMeta] = useState({ categories: [], collections: [] });
  const [rows, setRows] = useState([]);

  useEffect(() => {
    setMeta(getMeta());
  }, []);

  useEffect(() => {
    setRows(listProducts({ q, category, collection, status, stock }));
  }, [q, category, collection, status, stock]);

  const filters = useMemo(
    () => (
      <div className="flex flex-wrap items-end gap-3">
        <label className="block min-w-[180px] flex-1">
          <span className="text-xs text-[#7a736c]">Search</span>
          <input
            className="input mt-1"
            placeholder="Name or slug"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="text-xs text-[#7a736c]">Category</span>
          <select className="input mt-1" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All</option>
            {meta.categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs text-[#7a736c]">Collection</span>
          <select
            className="input mt-1"
            value={collection}
            onChange={(e) => setCollection(e.target.value)}
          >
            <option value="">All</option>
            {meta.collections.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs text-[#7a736c]">Status</span>
          <select className="input mt-1" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
          </select>
        </label>
        <label className="block">
          <span className="text-xs text-[#7a736c]">Stock</span>
          <select className="input mt-1" value={stock} onChange={(e) => setStock(e.target.value)}>
            <option value="">All</option>
            <option value="in">In stock</option>
            <option value="low">Low</option>
            <option value="out">Out</option>
          </select>
        </label>
      </div>
    ),
    [q, category, collection, status, stock, meta]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-label text-[10px] text-[#d4af64]">Catalogue</p>
          <h1 className="font-display mt-2 text-4xl">Products</h1>
          <p className="mt-1 text-sm text-[#7a736c]">{rows.length} pieces</p>
        </div>
        <Link href="/products/new" className="btn-primary">
          Add product
        </Link>
      </div>

      <div className="card p-4 md:p-5">{filters}</div>

      <div className="table-wrap">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[#2d2b2b]/8 bg-[#faf7f2] text-[10px] tracking-[0.14em] text-[#7a736c] uppercase">
            <tr>
              <th className="px-4 py-3 font-semibold">Product</th>
              <th className="px-4 py-3 font-semibold">Price</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Collection</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Stock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2d2b2b]/6">
            {rows.map((p) => (
              <tr key={p.slug} className="hover:bg-[#faf7f2]/80">
                <td className="px-4 py-3">
                  <Link href={`/products/${p.slug}`} className="flex items-center gap-3">
                    <span className="relative h-12 w-10 shrink-0 overflow-hidden rounded-md bg-[#ebe3da]">
                      {p.image ? (
                        <Image src={p.image} alt="" fill className="object-cover" sizes="40px" unoptimized />
                      ) : null}
                    </span>
                    <span>
                      <span className="block font-medium text-[#2d2b2b]">{p.name}</span>
                      <span className="block text-xs text-[#7a736c]">{p.slug}</span>
                    </span>
                  </Link>
                </td>
                <td className="px-4 py-3">{money(p.price)}</td>
                <td className="px-4 py-3">{labelCategory(p.category, meta.categories)}</td>
                <td className="px-4 py-3">{labelCollection(p.collection, meta.collections)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                      p.status === 'active'
                        ? 'bg-emerald-50 text-emerald-800'
                        : 'bg-amber-50 text-amber-800'
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {p.outOfStock || p.stock <= 0 ? (
                    <span className="text-[#5e062a]">Out</span>
                  ) : p.stock <= 3 ? (
                    <span className="text-amber-700">{p.stock} low</span>
                  ) : (
                    p.stock
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<p className="text-sm text-[#7a736c]">Loading…</p>}>
      <ProductsInner />
    </Suspense>
  );
}
