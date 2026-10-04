'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ProductForm from '@/components/ProductForm';
import { getMeta, getProduct, saveProduct } from '@/lib/repository';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [meta, setMeta] = useState({ categories: [], collections: [] });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const isNew = slug === 'new';

  useEffect(() => {
    setMeta(getMeta());
    if (!isNew) setProduct(getProduct(slug));
    else setProduct({ slug: '' });
  }, [slug, isNew]);

  if (!isNew && product === null) {
    return <p className="text-sm text-[#7a736c]">Loading…</p>;
  }
  if (!isNew && !product) {
    return (
      <div>
        <p>Product not found.</p>
        <Link href="/products" className="btn-ghost mt-4">
          Back
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link href="/products" className="font-label text-[10px] text-[#7a736c] hover:text-[#5e062a]">
            ← Products
          </Link>
          <h1 className="font-display mt-2 text-4xl">{isNew ? 'Add product' : 'Edit product'}</h1>
        </div>
        {saved && <p className="text-sm text-emerald-700">Saved</p>}
      </div>
      <ProductForm
        initial={isNew ? null : product}
        lockSlug={!isNew}
        categories={meta.categories}
        collections={meta.collections}
        saving={saving}
        onSave={(next) => {
          setSaving(true);
          const savedProduct = saveProduct(next);
          setSaved(true);
          setSaving(false);
          if (isNew) router.replace(`/products/${savedProduct.slug}`);
          else setProduct(savedProduct);
          setTimeout(() => setSaved(false), 2000);
        }}
      />
    </div>
  );
}
