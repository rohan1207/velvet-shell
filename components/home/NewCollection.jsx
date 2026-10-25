'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';

export default function NewCollection() {
  const [featured, setFeatured] = useState([]);
  const [colorFamilies, setColorFamilies] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [collectionName, setCollectionName] = useState('The Shell Edit');

  useEffect(() => {
    let cancelled = false;
    fetch('/api/catalog')
      .then((r) => r.json())
      .then((d) => {
        if (cancelled || !d.products?.length) return;
        const col =
          (d.collections || []).find((c) => c.slug === 'the-shell-edit') ||
          (d.collections || [])[0];
        if (col?.name) setCollectionName(col.name);
        const slug = col?.slug || 'the-shell-edit';
        const fromCol = d.products.filter((p) => p.collection === slug);
        const merged = [
          ...fromCol,
          ...d.products.filter((p) => p.collection !== slug),
        ].slice(0, 4);
        setFeatured(merged);
        setAllProducts(d.allProducts || d.products);
        setColorFamilies(d.colorFamilies || []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (!featured.length) return null;

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <p className="font-label text-[10px] tracking-[0.2em] text-gold uppercase">New collection</p>
        <h2 className="font-display mt-3 text-4xl tracking-[-0.03em] md:text-6xl">{collectionName}</h2>
        <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12 lg:grid-cols-4">
          {featured.map((product, index) => (
            <ProductCard
              key={product.slug}
              product={product}
              index={index}
              colorFamilies={colorFamilies}
              catalogProducts={allProducts}
            />
          ))}
        </div>
        <div className="mt-10">
          <Link href="/shop" className="font-label text-[11px] tracking-[0.16em] text-burgundy uppercase">
            Explore the collection
          </Link>
        </div>
      </div>
    </section>
  );
}
