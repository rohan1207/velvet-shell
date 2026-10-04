'use client';

import { useMemo, useState } from 'react';
import { slugify } from '@/lib/format';

const empty = {
  name: '',
  price: 0,
  category: 'rings',
  collection: 'the-shell-edit',
  badge: '',
  metal: ['S925 Silver'],
  sizes: ['Adjustable'],
  description: '',
  story: '',
  details: [],
  care: '',
  status: 'draft',
  stock: 10,
  outOfStock: false,
  metaTitle: '',
  metaDescription: '',
  image: '',
  hoverImage: '',
  gallery: ['', '', '', '', '', ''],
  limited: false,
  madeToOrder: false,
};

export default function ProductForm({
  initial,
  categories = [],
  collections = [],
  lockSlug = false,
  onSave,
  saving = false,
}) {
  const [form, setForm] = useState(() => {
    if (!initial) return { ...empty, gallery: ['', '', '', '', '', ''] };
    const gallery = [...(initial.gallery || [])];
    while (gallery.length < 6) gallery.push('');
    return {
      ...empty,
      ...initial,
      metal: initial.metal || [],
      sizes: initial.sizes || [],
      details: initial.details || [],
      gallery: gallery.slice(0, 6),
    };
  });

  const autoSlug = useMemo(() => slugify(form.name), [form.name]);
  const slug = lockSlug ? form.slug : autoSlug;

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function submit(event) {
    event.preventDefault();
    const gallery = form.gallery.filter(Boolean).slice(0, 6);
    onSave({
      ...form,
      slug,
      price: Number(form.price) || 0,
      stock: Number(form.stock) || 0,
      gallery,
      image: form.image || gallery[0] || '',
      metaTitle: form.metaTitle || `${form.name} | Velvet Shell`,
      metal: Array.isArray(form.metal)
        ? form.metal
        : String(form.metal)
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
      sizes: Array.isArray(form.sizes)
        ? form.sizes
        : String(form.sizes)
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
      details: Array.isArray(form.details)
        ? form.details
        : String(form.details)
            .split('\n')
            .map((s) => s.trim())
            .filter(Boolean),
    });
  }

  return (
    <form onSubmit={submit} className="space-y-8">
      <section className="card space-y-4 p-6">
        <p className="font-label text-[10px] text-[#7a736c]">Basics</p>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block md:col-span-2">
            <span className="text-xs text-[#7a736c]">Name</span>
            <input className="input mt-1" required value={form.name} onChange={(e) => set('name', e.target.value)} />
          </label>
          <label className="block">
            <span className="text-xs text-[#7a736c]">Slug (auto SEO)</span>
            <input className="input mt-1 bg-[#faf7f2]" value={slug} readOnly />
          </label>
          <label className="block">
            <span className="text-xs text-[#7a736c]">Price (INR)</span>
            <input
              className="input mt-1"
              type="number"
              min="0"
              required
              value={form.price}
              onChange={(e) => set('price', e.target.value)}
            />
          </label>
          <label className="block">
            <span className="text-xs text-[#7a736c]">Category</span>
            <select className="input mt-1" value={form.category} onChange={(e) => set('category', e.target.value)}>
              {categories.map((c) => (
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
              value={form.collection}
              onChange={(e) => set('collection', e.target.value)}
            >
              {collections.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs text-[#7a736c]">Status</span>
            <select className="input mt-1" value={form.status} onChange={(e) => set('status', e.target.value)}>
              <option value="active">Active (live)</option>
              <option value="draft">Draft</option>
            </select>
          </label>
          <label className="block">
            <span className="text-xs text-[#7a736c]">Badge</span>
            <input className="input mt-1" value={form.badge} onChange={(e) => set('badge', e.target.value)} />
          </label>
        </div>
      </section>

      <section className="card space-y-4 p-6">
        <p className="font-label text-[10px] text-[#7a736c]">Inventory</p>
        <div className="grid gap-4 md:grid-cols-3">
          <label className="block">
            <span className="text-xs text-[#7a736c]">Stock</span>
            <input
              className="input mt-1"
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) => set('stock', e.target.value)}
            />
          </label>
          <label className="flex items-center gap-3 pt-6 text-sm">
            <input
              type="checkbox"
              checked={!!form.outOfStock}
              onChange={(e) => set('outOfStock', e.target.checked)}
            />
            Out of stock
          </label>
          <label className="flex items-center gap-3 pt-6 text-sm">
            <input
              type="checkbox"
              checked={!!form.madeToOrder}
              onChange={(e) => set('madeToOrder', e.target.checked)}
            />
            Made to order
          </label>
        </div>
      </section>

      <section className="card space-y-4 p-6">
        <p className="font-label text-[10px] text-[#7a736c]">Copy</p>
        <label className="block">
          <span className="text-xs text-[#7a736c]">Description</span>
          <textarea
            className="input mt-1 min-h-24 rounded-2xl"
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
          />
        </label>
        <label className="block">
          <span className="text-xs text-[#7a736c]">Story</span>
          <textarea
            className="input mt-1 min-h-24 rounded-2xl"
            value={form.story}
            onChange={(e) => set('story', e.target.value)}
          />
        </label>
        <label className="block">
          <span className="text-xs text-[#7a736c]">Care</span>
          <textarea
            className="input mt-1 min-h-20 rounded-2xl"
            value={form.care}
            onChange={(e) => set('care', e.target.value)}
          />
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-xs text-[#7a736c]">Metals (comma-separated)</span>
            <input
              className="input mt-1"
              value={Array.isArray(form.metal) ? form.metal.join(', ') : form.metal}
              onChange={(e) => set('metal', e.target.value)}
            />
          </label>
          <label className="block">
            <span className="text-xs text-[#7a736c]">Sizes (comma-separated)</span>
            <input
              className="input mt-1"
              value={Array.isArray(form.sizes) ? form.sizes.join(', ') : form.sizes}
              onChange={(e) => set('sizes', e.target.value)}
            />
          </label>
        </div>
        <label className="block">
          <span className="text-xs text-[#7a736c]">Details (one per line)</span>
          <textarea
            className="input mt-1 min-h-24 rounded-2xl"
            value={Array.isArray(form.details) ? form.details.join('\n') : form.details}
            onChange={(e) => set('details', e.target.value)}
          />
        </label>
      </section>

      <section className="card space-y-4 p-6">
        <p className="font-label text-[10px] text-[#7a736c]">SEO</p>
        <label className="block">
          <span className="text-xs text-[#7a736c]">Meta title</span>
          <input
            className="input mt-1"
            value={form.metaTitle}
            onChange={(e) => set('metaTitle', e.target.value)}
          />
        </label>
        <label className="block">
          <span className="text-xs text-[#7a736c]">Meta description</span>
          <textarea
            className="input mt-1 min-h-20 rounded-2xl"
            value={form.metaDescription}
            onChange={(e) => set('metaDescription', e.target.value)}
          />
        </label>
      </section>

      <section className="card space-y-4 p-6">
        <p className="font-label text-[10px] text-[#7a736c]">Media (max 6 — image or video URLs)</p>
        <p className="text-xs text-[#7a736c]">
          Paste Cloudflare R2 / CDN URLs. Local paths from the storefront also work in demo.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {form.gallery.map((url, i) => (
            <label key={i} className="block">
              <span className="text-xs text-[#7a736c]">Media {i + 1}</span>
              <input
                className="input mt-1"
                value={url}
                placeholder="https://… or /path/to/file.jpg"
                onChange={(e) => {
                  const next = [...form.gallery];
                  next[i] = e.target.value;
                  set('gallery', next);
                  if (i === 0) set('image', e.target.value);
                }}
              />
            </label>
          ))}
        </div>
        <label className="block">
          <span className="text-xs text-[#7a736c]">Hover image URL</span>
          <input
            className="input mt-1"
            value={form.hoverImage}
            onChange={(e) => set('hoverImage', e.target.value)}
          />
        </label>
      </section>

      <div className="sticky bottom-4 flex justify-end gap-3">
        <button type="submit" disabled={saving} className="btn-primary shadow-lg">
          {saving ? 'Saving…' : 'Save product'}
        </button>
      </div>
    </form>
  );
}
