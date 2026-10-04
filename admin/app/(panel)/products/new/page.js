'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProductForm from '@/components/ProductForm';
import { getMeta, saveProduct } from '@/lib/repository';

export default function NewProductPage() {
  const router = useRouter();
  const [meta, setMeta] = useState({ categories: [], collections: [] });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setMeta(getMeta());
  }, []);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link href="/products" className="font-label text-[10px] text-[#7a736c] hover:text-[#5e062a]">
          ← Products
        </Link>
        <h1 className="font-display mt-2 text-4xl">Add product</h1>
      </div>
      <ProductForm
        initial={null}
        lockSlug={false}
        categories={meta.categories}
        collections={meta.collections}
        saving={saving}
        onSave={(next) => {
          setSaving(true);
          const saved = saveProduct(next);
          setSaving(false);
          router.replace(`/products/${saved.slug}`);
        }}
      />
    </div>
  );
}
