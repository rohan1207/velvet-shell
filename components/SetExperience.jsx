'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import AppImage from '@/components/AppImage';
import ProductCard from '@/components/ProductCard';
import NotifyMeButton from '@/components/NotifyMeButton';
import { money } from '@/lib/format';
import { useStore } from '@/context/StoreContext';
import { ProductPageNotes } from '@/components/ProductNotes';

export default function SetExperience({ set }) {
  const { addToCart, catalog } = useStore();
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');

  const images = useMemo(() => {
    const list = [];
    if (set.image) list.push(set.image);
    for (const src of set.gallery || []) {
      if (src && !list.includes(src)) list.push(src);
    }
    return list;
  }, [set]);

  const [activeImg, setActiveImg] = useState(0);

  const memberProducts = useMemo(() => {
    const all = catalog?.allProducts || catalog?.products || [];
    return (set.members || []).map((m) => {
      const live = all.find((p) => p.slug === m.slug);
      return {
        ...m,
        product: live || {
          slug: m.slug,
          name: m.name,
          price: m.price,
          image: m.image,
          gallery: m.gallery,
          category: m.category,
          outOfStock: m.outOfStock,
          colorLabel: m.colorLabel,
        },
      };
    });
  }, [set.members, catalog]);

  async function addWholeSet() {
    if (set.outOfStock || busy) return;
    setBusy(true);
    setNotice('');
    try {
      for (const m of set.members || []) {
        if (m.outOfStock || !m.slug) continue;
        addToCart(m.slug, {
          size: 'One size',
          metal: m.colorLabel || '',
          qty: 1,
        });
      }
      setNotice('Full set added to your bag');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="bg-ivory pb-24 pt-[calc(var(--site-chrome-offset)+1rem)] md:pt-36">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-5 lg:grid-cols-2 lg:gap-16">
        <div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-cream">
            <AppImage
              src={images[activeImg] || set.image}
              alt={set.name}
              fill
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 50vw"
              priority
            />
          </div>
          {images.length > 1 ? (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setActiveImg(i)}
                  className={`relative h-16 w-14 shrink-0 overflow-hidden rounded-xl ring-1 ${
                    i === activeImg ? 'ring-burgundy' : 'ring-ink/10'
                  }`}
                >
                  <AppImage src={src} alt="" fill className="object-cover" sizes="56px" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div>
          <p className="font-label text-[10px] tracking-[0.2em] text-gold uppercase">Jewellery set</p>
          <h1 className="font-display mt-3 text-3xl tracking-[-0.03em] text-ink md:text-5xl">
            {set.name}
          </h1>
          <p className="font-num mt-4 text-2xl text-burgundy">{money(set.price)}</p>
          {set.members?.length ? (
            <p className="mt-1 text-sm text-ink/55">
              {set.members.length} pieces
              {set.priceOverride == null
                ? ` · valued at ${money(set.membersSum)}`
                : ''}
            </p>
          ) : null}

          {set.description ? (
            <p className="mt-6 max-w-md text-base leading-relaxed text-stone">{set.description}</p>
          ) : null}

          <dl className="mt-6 space-y-1 text-sm text-ink/70">
            {set.material ? (
              <div>
                <dt className="inline text-ink/45">Material · </dt>
                <dd className="inline">{set.material}</dd>
              </div>
            ) : null}
            {set.design ? (
              <div>
                <dt className="inline text-ink/45">Design · </dt>
                <dd className="inline">{set.design}</dd>
              </div>
            ) : null}
            {set.colour ? (
              <div>
                <dt className="inline text-ink/45">Colour · </dt>
                <dd className="inline">{set.colour}</dd>
              </div>
            ) : null}
            {set.setSku ? (
              <div>
                <dt className="inline text-ink/45">SKU · </dt>
                <dd className="inline font-num">{set.setSku}</dd>
              </div>
            ) : null}
          </dl>

          <div className="mt-8">
            {set.outOfStock ? (
              <div className="space-y-3">
                <p className="text-sm text-burgundy">
                  This set is currently unavailable — one or more pieces are out of stock.
                </p>
                <NotifyMeButton slug={set.slug} kind="set" name={set.name} />
              </div>
            ) : (
              <button
                type="button"
                disabled={busy || !set.members?.length}
                onClick={addWholeSet}
                className="flex h-[52px] w-full items-center justify-center rounded-full bg-ink text-[11px] tracking-[0.28em] text-ivory uppercase disabled:opacity-50 sm:w-auto sm:min-w-[260px]"
              >
                {busy ? 'Adding…' : (
                  <>
                    Add this set · <span className="font-num">{money(set.price)}</span>
                  </>
                )}
              </button>
            )}
            {notice ? <p className="mt-3 text-sm text-emerald-800">{notice}</p> : null}
          </div>

          {set.shipping ? (
            <div className="mt-10">
              <ProductPageNotes shipping={set.shipping} />
            </div>
          ) : null}
        </div>
      </div>

      <div className="mx-auto mt-20 max-w-[1200px] px-5">
        <h2 className="font-display text-2xl text-ink md:text-3xl">Pieces in this set</h2>
        <p className="mt-2 max-w-xl text-sm text-ink/60">
          Add any available piece on its own if you want to customise your look.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {memberProducts.map(({ product, outOfStock }) => (
            <div key={product.slug} className="relative">
              <ProductCard product={{ ...product, outOfStock }} />
              {outOfStock || product.outOfStock ? (
                <p className="mt-2 text-center text-[10px] tracking-[0.14em] text-burgundy uppercase">
                  Out of stock
                </p>
              ) : null}
            </div>
          ))}
        </div>
        {!memberProducts.length ? (
          <p className="mt-6 text-sm text-ink/55">
            Pieces will appear here once linked in the admin Sets panel.
          </p>
        ) : null}
        <p className="mt-10">
          <Link href="/shop?category=sets" className="font-label text-[11px] tracking-[0.18em] text-burgundy uppercase">
            ← All sets
          </Link>
        </p>
      </div>
    </div>
  );
}
