'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import AppImage from '@/components/AppImage';
import ProductCard from '@/components/ProductCard';
import SetCard from '@/components/SetCard';
import NotifyMeButton from '@/components/NotifyMeButton';
import { money } from '@/lib/format';
import { useStore } from '@/context/StoreContext';
import { ProductPageNotes } from '@/components/ProductNotes';

function pushUnique(list, seen, src, meta) {
  const url = typeof src === 'string' ? src.trim() : String(src?.url || src?.src || '').trim();
  if (!url || seen.has(url) || /\.(mp4|webm|mov)(\?|$)/i.test(url)) return;
  seen.add(url);
  list.push({ src: url, ...meta });
}

export default function SetExperience({ set, otherSets = [] }) {
  const { addItemsToCart, catalog } = useStore();
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [activeImg, setActiveImg] = useState(0);
  const piecesRef = useRef(null);

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

  /** Main = set hero; gallery = set images + every linked piece's images. */
  const gallery = useMemo(() => {
    const list = [];
    const seen = new Set();

    pushUnique(list, seen, set.image, { kind: 'set', label: 'Set cover' });
    for (const src of set.gallery || []) {
      pushUnique(list, seen, src, { kind: 'set', label: 'Set' });
    }

    for (const m of memberProducts) {
      const p = m.product || m;
      const name = p.name || m.name || 'Piece';
      const slug = p.slug || m.slug || '';
      pushUnique(list, seen, p.image || m.image, {
        kind: 'piece',
        label: name,
        slug,
      });
      for (const src of p.gallery || m.gallery || []) {
        pushUnique(list, seen, src, { kind: 'piece', label: name, slug });
      }
    }

    return list;
  }, [set.image, set.gallery, memberProducts]);

  const mainSrc = gallery[activeImg]?.src || set.image;
  const activeMeta = gallery[activeImg];

  const relatedProducts = useMemo(() => {
    const listing = (catalog?.products || []).filter((p) => p.active !== false);
    const memberSlugs = new Set((set.members || []).map((m) => m.slug).filter(Boolean));
    const memberCats = new Set(
      (set.members || []).map((m) => m.category).filter(Boolean),
    );
    return listing
      .filter((p) => !memberSlugs.has(p.slug) && p.kind !== 'set')
      .sort((a, b) => {
        const aScore = memberCats.has(a.category) ? 1 : 0;
        const bScore = memberCats.has(b.category) ? 1 : 0;
        return bScore - aScore;
      })
      .slice(0, 4);
  }, [catalog, set.members]);

  const moreSets = useMemo(
    () => (otherSets || []).filter((s) => s.slug && s.slug !== set.slug).slice(0, 8),
    [otherSets, set.slug],
  );

  function focusPiece(member) {
    const slug = member.slug || member.product?.slug;
    const hero = member.image || member.product?.image;
    const idx = gallery.findIndex(
      (g) =>
        (slug && g.slug === slug) ||
        (hero && g.src === hero),
    );
    if (idx >= 0) setActiveImg(idx);
  }

  function scrollToPieces() {
    piecesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function addWholeSet() {
    if (set.outOfStock || busy) return;
    setBusy(true);
    setNotice('');
    try {
      const entries = (set.members || [])
        .filter((m) => m.slug && !m.outOfStock)
        .map((m) => ({
          slug: m.slug,
          size: 'One size',
          metal: m.colorLabel || 'Sterling Silver',
          qty: 1,
          name: m.name,
          price: m.price,
          image: m.image,
          colorLabel: m.colorLabel || '',
        }));
      addItemsToCart(entries);
      setNotice(
        entries.length
          ? `${entries.length} pieces added to your bag`
          : 'Nothing available to add',
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="bg-ivory pt-page">
      <div className="mx-auto grid w-full max-w-[1600px] min-w-0 items-start gap-6 px-4 pt-2 pb-[calc(6rem+env(safe-area-inset-bottom))] sm:gap-8 sm:px-5 md:gap-10 md:px-10 md:pt-5 md:pb-24 lg:grid-cols-12 lg:gap-10 xl:gap-14">
        {/* Gallery — same language as product PDP */}
        <div className="order-1 min-w-0 max-w-full overflow-hidden lg:sticky lg:top-[calc(var(--site-chrome-offset)+0.5rem)] lg:col-span-7 lg:self-start">
          <div className="flex h-[min(52svh,22rem)] min-w-0 gap-1.5 sm:h-[min(58svh,26rem)] sm:gap-2 md:h-[min(100svh-var(--site-chrome-offset)-2.5rem,920px)] md:gap-3">
            {gallery.length > 1 ? (
              <div
                data-lenis-prevent
                className="flex min-h-0 w-12 shrink-0 flex-col gap-1.5 overflow-y-auto overflow-x-hidden overscroll-y-contain px-0.5 py-1 [scrollbar-width:thin] sm:w-14 sm:gap-2 md:w-16 md:gap-2.5 lg:w-[4.5rem]"
              >
                {gallery.map((item, index) => {
                  const isMain = index === activeImg;
                  return (
                    <button
                      key={`${item.src}-${index}`}
                      type="button"
                      onClick={() => setActiveImg(index)}
                      title={item.label}
                      aria-label={item.label || `Image ${index + 1}`}
                      aria-current={isMain}
                      className={`relative aspect-square w-full shrink-0 overflow-hidden rounded-lg bg-white ring-1 ring-ink/6 transition-[box-shadow,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isMain ? 'ring-2 ring-gold/70' : 'hover:ring-ink/20'
                      } ${item.kind === 'piece' && !isMain ? 'opacity-80' : ''}`}
                    >
                      <AppImage
                        src={item.src}
                        alt=""
                        fill
                        className="object-contain object-center"
                        sizes="72px"
                      />
                    </button>
                  );
                })}
              </div>
            ) : null}

            <div className="relative min-h-0 min-w-0 flex-1 overflow-hidden rounded-[1.25rem] bg-white p-3 ring-1 ring-ink/6 sm:p-4 md:rounded-[1.5rem] md:p-5">
              <div className="relative h-full w-full">
                <AppImage
                  key={mainSrc}
                  src={mainSrc}
                  alt={set.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-contain object-center"
                />
              </div>
              {activeMeta?.kind === 'piece' && activeMeta.label ? (
                <p className="pointer-events-none absolute inset-x-3 bottom-3 truncate rounded-full bg-white/90 px-3 py-1.5 text-center font-label text-[9px] tracking-[0.16em] text-ink/70 uppercase ring-1 ring-ink/6 sm:inset-x-4 sm:bottom-4">
                  {activeMeta.label}
                </p>
              ) : null}
            </div>
          </div>

          {/* Mobile: circular piece strip under the gallery */}
          {memberProducts.length > 0 ? (
            <div className="mt-4 lg:hidden">
              <div className="flex items-center justify-between gap-3">
                <p className="font-label text-[10px] tracking-[0.2em] text-gold uppercase">
                  In this set
                </p>
                <button
                  type="button"
                  onClick={scrollToPieces}
                  className="font-label text-[10px] tracking-[0.16em] text-burgundy uppercase"
                >
                  See pieces ↓
                </button>
              </div>
              <div className="mt-3 flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {memberProducts.map((m) => {
                  const p = m.product || m;
                  const src = p.image || m.image;
                  const out = m.outOfStock || p.outOfStock;
                  return (
                    <button
                      key={p.slug || m.slug}
                      type="button"
                      onClick={() => focusPiece(m)}
                      className="group/piece flex w-[4.5rem] shrink-0 flex-col items-center gap-1.5"
                    >
                      <span
                        className={`relative h-14 w-14 overflow-hidden rounded-full bg-white ring-2 transition ${
                          out ? 'ring-burgundy/30 opacity-70' : 'ring-ink/8 group-hover/piece:ring-gold/60'
                        }`}
                      >
                        {src ? (
                          <AppImage src={src} alt="" fill className="object-contain object-center p-1" sizes="56px" />
                        ) : null}
                      </span>
                      <span className="line-clamp-2 text-center text-[9px] leading-tight text-ink/65">
                        {p.name || m.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>

        {/* Details */}
        <div className="relative z-10 order-2 min-w-0 w-full max-w-full lg:col-span-5 lg:self-start lg:pl-1">
          <p className="text-[11px] tracking-[0.28em] text-gold uppercase">Jewellery set</p>
          <h1 className="font-display mt-3 max-w-full break-words text-[1.85rem] leading-[1.12] tracking-[-0.03em] sm:text-3xl md:text-[2.35rem] md:leading-[1.1] xl:text-[2.65rem]">
            {set.name}
          </h1>
          <p className="font-num mt-4 text-lg text-ink/90">{money(set.price)}</p>
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

          {/* Desktop / tablet: circular pieces beside the story */}
          {memberProducts.length > 0 ? (
            <div className="mt-8 hidden lg:block">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[10px] tracking-[0.28em] uppercase">
                  In this set
                  <span className="ml-2 tracking-normal normal-case text-ink/55">
                    {memberProducts.length} pieces
                  </span>
                </p>
                <button
                  type="button"
                  onClick={scrollToPieces}
                  className="font-label text-[10px] tracking-[0.16em] text-burgundy uppercase"
                >
                  Full details ↓
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                {memberProducts.map((m) => {
                  const p = m.product || m;
                  const src = p.image || m.image;
                  const out = m.outOfStock || p.outOfStock;
                  const focused =
                    activeMeta?.slug &&
                    (activeMeta.slug === p.slug || activeMeta.slug === m.slug);
                  return (
                    <button
                      key={p.slug || m.slug}
                      type="button"
                      onClick={() => focusPiece(m)}
                      title={p.name || m.name}
                      className="group/piece flex max-w-[5.5rem] flex-col items-center gap-2 text-left"
                    >
                      <span
                        className={`relative h-[4.25rem] w-[4.25rem] overflow-hidden rounded-full bg-white shadow-[0_8px_24px_rgba(40,20,24,0.08)] transition duration-300 ${
                          focused
                            ? 'ring-2 ring-gold/70 ring-offset-2 ring-offset-ivory'
                            : out
                              ? 'ring-1 ring-burgundy/25 opacity-70'
                              : 'ring-1 ring-ink/8 group-hover/piece:ring-ink/20'
                        }`}
                      >
                        {src ? (
                          <AppImage
                            src={src}
                            alt=""
                            fill
                            className="object-contain object-center p-1.5"
                            sizes="68px"
                          />
                        ) : null}
                      </span>
                      <span className="line-clamp-2 text-center text-[10px] leading-snug text-ink/70">
                        {p.name || m.name}
                      </span>
                      {out ? (
                        <span className="text-[9px] tracking-[0.12em] text-burgundy uppercase">Out</span>
                      ) : (
                        <span className="font-num text-[11px] text-ink/55">{money(p.price || m.price)}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

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

      <div
        ref={piecesRef}
        id="set-pieces"
        className="mx-auto mt-16 max-w-[1600px] scroll-mt-[calc(var(--site-chrome-offset)+1rem)] px-4 sm:px-5 md:mt-20 md:px-10"
      >
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
      </div>

      {relatedProducts.length ? (
        <div className="mx-auto mt-20 max-w-[1600px] px-4 sm:px-5 md:px-10">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="font-label text-[10px] tracking-[0.18em] text-gold uppercase">
                More from the house
              </p>
              <h2 className="font-display mt-2 text-2xl text-ink md:text-3xl">People also like</h2>
            </div>
            <Link
              href="/shop"
              className="font-label hidden text-[11px] tracking-[0.18em] text-burgundy uppercase sm:inline"
            >
              The shop
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {relatedProducts.map((product, index) => (
              <ProductCard
                key={product.slug}
                product={product}
                index={index}
                colorFamilies={catalog?.colorFamilies || []}
                catalogProducts={
                  catalog?.allProducts?.length
                    ? catalog.allProducts
                    : catalog?.products || []
                }
              />
            ))}
          </div>
        </div>
      ) : null}

      {moreSets.length ? (
        <div className="mx-auto mt-20 max-w-[1600px] px-4 pb-8 sm:px-5 md:px-10 md:pb-12">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="font-label text-[10px] tracking-[0.18em] text-gold uppercase">
                Keep exploring
              </p>
              <h2 className="font-display mt-2 text-2xl text-ink md:text-3xl">Other sets</h2>
            </div>
            <Link
              href="/shop?category=sets"
              className="font-label text-[11px] tracking-[0.18em] text-burgundy uppercase"
            >
              All sets
            </Link>
          </div>
          <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:thin] sm:-mx-5 sm:px-5 md:mx-0 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible md:px-0">
            {moreSets.map((s, index) => (
              <div key={s.slug} className="w-[11.5rem] shrink-0 md:w-auto">
                <SetCard set={s} index={index} />
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mx-auto max-w-[1600px] px-4 pb-10 sm:px-5 md:px-10">
        <Link href="/shop?category=sets" className="font-label text-[11px] tracking-[0.18em] text-burgundy uppercase">
          ← All sets
        </Link>
      </div>
    </div>
  );
}
