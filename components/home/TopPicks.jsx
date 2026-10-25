'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProductCard from '@/components/ProductCard';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function TopPicks() {
  const rootRef = useRef(null);
  const [picks, setPicks] = useState([]);
  const [colorFamilies, setColorFamilies] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/catalog')
      .then((r) => r.json())
      .then((d) => {
        if (cancelled || !d.products?.length) return;
        setPicks(d.products.slice(0, 6));
        setAllProducts(d.allProducts || d.products);
        setColorFamilies(d.colorFamilies || []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!rootRef.current || !picks.length) return undefined;
    const ctx = gsap.context(() => {
      gsap.from('[data-pick]', {
        y: 28,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 80%' },
      });
    }, rootRef);
    return () => ctx.revert();
  }, [picks.length]);

  if (!picks.length) return null;

  return (
    <section ref={rootRef} className="bg-ivory py-20 md:py-28">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-label text-[10px] tracking-[0.2em] text-gold uppercase">Top picks</p>
            <h2 className="font-display mt-3 text-4xl tracking-[-0.03em] md:text-6xl">Worn often</h2>
          </div>
          <Link href="/shop" className="font-label text-[11px] tracking-[0.16em] text-burgundy uppercase">
            Shop all
          </Link>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12 lg:grid-cols-3">
          {picks.map((product, index) => (
            <div key={product.slug} data-pick>
              <ProductCard
                product={product}
                index={index}
                colorFamilies={colorFamilies}
                catalogProducts={allProducts}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
