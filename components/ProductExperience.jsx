'use client';

import { useEffect, useMemo, useState } from 'react';
import AppImage from '@/components/AppImage';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { collectionName as dummyCollectionName } from '@/lib/products';
import { money } from '@/lib/format';
import { useStore } from '@/context/StoreContext';
import ProductCard from './ProductCard';
import { ProductPageNotes } from './ProductNotes';

function labelCollection(slug, collections = []) {
  return collections.find((c) => c.slug === slug)?.name || dummyCollectionName(slug) || slug;
}

function displayTitle(name = '') {
  return name.replace(/\s*[—–-]\s*.+$/, '').trim() || name;
}

export default function ProductExperience({
  product,
  related = [],
  collections = [],
  colorFamily = null,
  variants = [],
}) {
  void colorFamily;
  const router = useRouter();
  const { addToCart, wishlist, toggleWishlist } = useStore();

  const allVariants = useMemo(() => {
    if (Array.isArray(variants) && variants.length > 1) return variants;
    return [];
  }, [variants]);

  const [activeSlug, setActiveSlug] = useState(product.slug);
  const activeProduct =
    allVariants.find((v) => v.slug === activeSlug)?.product || product;

  const gallery =
    activeProduct.gallery?.length > 0
      ? activeProduct.gallery
      : [activeProduct.image || '/images/product-placeholder.svg'];
  const sizeOptions = activeProduct.sizes?.length ? activeProduct.sizes : ['One size'];

  const gemColorOptions = useMemo(() => {
    const seen = new Set();
    const list = [];
    for (const v of allVariants) {
      const label =
        v.colorLabel ||
        v.product?.colorLabel ||
        (v.isGemColor ? v.label : '');
      if (!label || label === 'Default') continue;
      if (v.isGemColor === false) continue;
      if (seen.has(label)) continue;
      seen.add(label);
      list.push({
        label,
        swatch: v.swatch || v.product?.colorSwatch || '#C5C5C5',
        slug: v.slug,
      });
    }
    // Fallback: if family flagged gem colours but labels sit on product
    if (!list.length && activeProduct.hasGemColors) {
      for (const v of allVariants) {
        const label = v.product?.colorLabel;
        if (!label || label === 'Default' || seen.has(label)) continue;
        seen.add(label);
        list.push({
          label,
          swatch: v.product?.colorSwatch || '#C5C5C5',
          slug: v.slug,
        });
      }
    }
    return list;
  }, [allVariants, activeProduct.hasGemColors]);

  const finishOptions = useMemo(() => {
    const seen = new Set();
    const list = [];
    for (const v of allVariants) {
      const finish =
        v.finish ||
        v.product?.finishLabel ||
        v.product?.metal?.[0] ||
        '';
      if (!finish || seen.has(finish)) continue;
      seen.add(finish);
      list.push(finish);
    }
    if (!list.length && activeProduct.finishLabel) list.push(activeProduct.finishLabel);
    if (!list.length && activeProduct.metal?.[0]) list.push(activeProduct.metal[0]);
    return list;
  }, [allVariants, activeProduct.finishLabel, activeProduct.metal]);

  const [active, setActive] = useState(0);
  const [size, setSize] = useState(sizeOptions[0]);
  const [metal, setMetal] = useState(
    activeProduct.finishLabel || activeProduct.metal?.[0] || finishOptions[0] || '',
  );
  const [qty, setQty] = useState(1);
  const [open, setOpen] = useState('story');
  const [customValues, setCustomValues] = useState({});
  const [customError, setCustomError] = useState('');

  const customizationFields =
    activeProduct.customizationEnabled && Array.isArray(activeProduct.customizationFields)
      ? activeProduct.customizationFields
      : [];

  useEffect(() => {
    setActiveSlug(product.slug);
  }, [product.slug]);

  useEffect(() => {
    setActive(0);
    setSize(activeProduct.sizes?.[0] || 'One size');
    setMetal(activeProduct.finishLabel || activeProduct.metal?.[0] || '');
    setQty(1);
    setCustomValues({});
    setCustomError('');
  }, [activeProduct.slug]);

  function resolveVariantSlug({ colorLabel, finishLabel }) {
    const color = colorLabel ?? activeProduct.colorLabel;
    const finish = finishLabel ?? metal;
    const match = allVariants.find((v) => {
      const vColor = v.colorLabel || v.product?.colorLabel || 'Default';
      const vFinish =
        v.finish || v.product?.finishLabel || v.product?.metal?.[0] || '';
      const colorOk = gemColorOptions.length ? vColor === color : true;
      const finishOk = finish ? vFinish === finish : true;
      return colorOk && finishOk;
    });
    if (match) return match.slug;
    const byFinish = allVariants.find(
      (v) => (v.finish || v.product?.finishLabel || v.product?.metal?.[0]) === finish,
    );
    if (byFinish) return byFinish.slug;
    const byColor = allVariants.find(
      (v) => (v.colorLabel || v.product?.colorLabel) === color,
    );
    return byColor?.slug || allVariants[0]?.slug || activeSlug;
  }

  function selectVariantSlug(slug) {
    if (!slug || slug === activeSlug) return;
    setActiveSlug(slug);
    router.replace(`/shop/${slug}`, { scroll: false });
  }

  function selectGemColor(label) {
    selectVariantSlug(resolveVariantSlug({ colorLabel: label, finishLabel: metal }));
  }

  function selectFinish(finish) {
    setMetal(finish);
    selectVariantSlug(
      resolveVariantSlug({
        colorLabel: activeProduct.colorLabel,
        finishLabel: finish,
      }),
    );
  }

  const detailsList = (activeProduct.details || []).filter(Boolean);
  const storyCopy =
    activeProduct.story ||
    `${displayTitle(activeProduct.name)} is shaped for everyday wear — a quiet motif with considered proportions, easy to style alone or with pieces you already love.`;
  const careCopy =
    activeProduct.care ||
    'Remove before bathing or swimming. Wipe gently with a soft dry cloth after wear. Store flat in the pouch, away from harsh chemicals and humidity.';
  const detailsCopy = detailsList.length
    ? detailsList.join(' · ')
    : [
        activeProduct.finishLabel || activeProduct.metal?.[0] || '925 Silver',
        activeProduct.colorLabel && activeProduct.colorLabel !== 'Default'
          ? `Colour: ${activeProduct.colorLabel}`
          : null,
        activeProduct.sizes?.[0] || 'One size',
        'Ships within India in 5–7 working days',
      ]
        .filter(Boolean)
        .join(' · ');

  const title =
    allVariants.length > 1 ? displayTitle(activeProduct.name) : activeProduct.name;

  return (
    <div className="bg-ivory pt-site-chrome">
      <div className="mx-auto grid max-w-[1600px] gap-8 px-5 pt-4 pb-28 md:gap-10 md:px-10 md:pt-8 md:pb-24 lg:grid-cols-12 lg:gap-16">
        <div className="order-1 lg:sticky lg:top-[calc(var(--site-promo-h)+var(--site-nav-h)+1rem)] lg:col-span-7 lg:self-start">
          <div className="flex h-[min(58svh,26rem)] gap-2 md:h-[min(100svh-var(--site-promo-h)-var(--site-nav-h)-3rem,920px)] md:gap-3">
            <div className="flex w-14 shrink-0 flex-col gap-2 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] md:w-16 md:gap-2.5 lg:w-[4.5rem] [&::-webkit-scrollbar]:hidden">
              {gallery.map((src, index) => (
                <button
                  key={`${src}-${index}`}
                  type="button"
                  onClick={() => setActive(index)}
                  aria-label={`View image ${index + 1}`}
                  aria-current={active === index}
                  className={`relative aspect-square w-full shrink-0 overflow-hidden rounded-lg bg-cream transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    active === index ? 'z-10 scale-[1.08]' : 'scale-100 hover:scale-[1.03]'
                  }`}
                >
                  <AppImage src={src} alt="" fill className="object-cover" sizes="72px" />
                </button>
              ))}
            </div>

            <div className="relative min-h-0 min-w-0 flex-1 overflow-hidden rounded-[1.25rem] bg-cream md:rounded-[1.5rem]">
              <AppImage
                src={gallery[active] || gallery[0]}
                alt={activeProduct.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>

        <div className="order-2 lg:sticky lg:top-[calc(var(--site-promo-h)+var(--site-nav-h)+1rem)] lg:col-span-5 lg:self-start">
          <p className="text-[11px] tracking-[0.28em] text-gold uppercase">
            {labelCollection(activeProduct.collection, collections)}
          </p>
          <h1 className="font-display mt-3 text-[1.85rem] leading-[1.08] tracking-[-0.03em] sm:text-3xl md:text-6xl">
            {title}
          </h1>
          <p className="font-num mt-4 text-lg text-ink/90">{money(activeProduct.price)}</p>
          <p className="mt-8 max-w-md text-base leading-relaxed text-stone">
            {activeProduct.description}
          </p>

          {gemColorOptions.length > 1 && (
            <div className="mt-10">
              <p className="text-[10px] tracking-[0.28em] uppercase">
                Colour
                <span className="ml-2 tracking-normal normal-case text-ink/70">
                  {activeProduct.colorLabel && activeProduct.colorLabel !== 'Default'
                    ? activeProduct.colorLabel
                    : ''}
                </span>
              </p>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {gemColorOptions.map((option) => {
                  const selected =
                    activeProduct.colorLabel === option.label ||
                    (!activeProduct.colorLabel && option.slug === activeSlug);
                  return (
                    <button
                      key={option.label}
                      type="button"
                      title={option.label}
                      aria-label={option.label}
                      aria-pressed={selected}
                      onClick={() => selectGemColor(option.label)}
                      className={`flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-300 ${
                        selected
                          ? 'scale-110 ring-2 ring-gold/80 ring-offset-2 ring-offset-ivory'
                          : 'hover:scale-105'
                      }`}
                    >
                      <span
                        className="h-7 w-7 rounded-full border border-ink/10 shadow-sm"
                        style={{ backgroundColor: option.swatch }}
                      />
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-xs font-light text-ink/60">
                {gemColorOptions.length} colours in this piece
              </p>
            </div>
          )}

          <div className="mt-10">
            <p className="text-[10px] tracking-[0.28em] uppercase">Measure</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {sizeOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setSize(option)}
                  className={`min-w-16 rounded-full px-4 py-2 text-[11px] tracking-[0.16em] uppercase ${
                    size === option ? 'bg-ink text-ivory' : 'border border-cream text-stone'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {finishOptions.length > 0 && (
            <div className="mt-8">
              <p className="text-[10px] tracking-[0.28em] uppercase">
                Finish
                <span className="ml-2 tracking-normal normal-case text-ink/70">
                  {metal}
                </span>
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {finishOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => selectFinish(option)}
                    className={`rounded-full px-4 py-2 text-[11px] tracking-[0.1em] ${
                      metal === option ? 'bg-ink text-ivory' : 'border border-cream text-stone'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {finishOptions.length > 1 ? (
                <p className="mt-2 text-xs font-light text-ink/55">
                  Choose 925 Silver or 18K Gold-Plated — each finish can have its own photos.
                </p>
              ) : null}
            </div>
          )}

          {customizationFields.length > 0 ? (
            <div className="mt-8 space-y-4">
              <p className="text-[10px] tracking-[0.28em] uppercase">Customization</p>
              {customizationFields.map((field) => {
                const value = customValues[field.id] ?? '';
                const common = {
                  id: `custom-${field.id}`,
                  value,
                  placeholder: field.placeholder || '',
                  required: !!field.required,
                  onChange: (e) => {
                    setCustomError('');
                    setCustomValues((prev) => ({ ...prev, [field.id]: e.target.value }));
                  },
                  className:
                    'mt-2 w-full rounded-xl border border-cream bg-white px-4 py-3 text-sm outline-none transition focus:border-ink/25',
                };
                return (
                  <label key={field.id} className="block">
                    <span className="text-sm text-ink">
                      {field.label}
                      {field.required ? <span className="text-burgundy"> *</span> : null}
                    </span>
                    {field.inputType === 'textarea' ? (
                      <textarea {...common} rows={3} />
                    ) : (
                      <input
                        {...common}
                        type={field.inputType === 'number' ? 'number' : 'text'}
                        inputMode={field.inputType === 'number' ? 'decimal' : undefined}
                      />
                    )}
                  </label>
                );
              })}
              {customError ? <p className="text-sm text-burgundy">{customError}</p> : null}
            </div>
          ) : null}

          <div className="mt-8">
            <p className="text-[10px] tracking-[0.28em] uppercase">Quantity</p>
            <div className="mt-3 inline-flex items-center rounded-full border border-cream px-1.5">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQty((n) => Math.max(1, n - 1))}
                className="flex h-11 w-11 items-center justify-center"
              >
                −
              </button>
              <span className="min-w-6 text-center text-sm">{qty}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQty((n) => Math.min(10, n + 1))}
                className="flex h-11 w-11 items-center justify-center"
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-10 flex gap-3">
            <button
              type="button"
              onClick={() => {
                const missing = customizationFields.find(
                  (field) => field.required && !String(customValues[field.id] ?? '').trim(),
                );
                if (missing) {
                  setCustomError(`Please fill in: ${missing.label}`);
                  return;
                }
                const customization = customizationFields
                  .map((field) => ({
                    id: field.id,
                    label: field.label,
                    value: String(customValues[field.id] ?? '').trim(),
                  }))
                  .filter((entry) => entry.value);
                addToCart(activeProduct.slug, { size, metal, qty, customization });
              }}
              className="flex h-[52px] flex-1 items-center justify-center rounded-full bg-ink text-[11px] tracking-[0.28em] text-ivory uppercase"
            >
              Add to bag · <span className="font-num">{money(activeProduct.price * qty)}</span>
            </button>
            <button
              type="button"
              onClick={() => toggleWishlist(activeProduct.slug)}
              className="flex h-[52px] w-[52px] items-center justify-center rounded-full border border-cream text-lg"
              aria-label="Save"
            >
              {wishlist.includes(activeProduct.slug) ? '♥' : '♡'}
            </button>
          </div>
          {activeProduct.madeToOrder && (
            <p className="mt-4 text-xs text-stone">
              Made to order. Allow two to three weeks in the atelier.
            </p>
          )}

          <ProductPageNotes category={activeProduct.category} />

          <div className="mt-12 divide-y divide-cream border-y border-cream">
            {[
              ['story', 'The piece', storyCopy],
              ['details', 'Details', detailsCopy],
              ['care', 'Care', careCopy],
            ].map(([id, label, copy]) => (
              <button
                key={id}
                type="button"
                onClick={() => setOpen(open === id ? '' : id)}
                className="w-full py-5 text-left"
              >
                <div className="flex items-center justify-between text-[11px] tracking-[0.24em] uppercase">
                  <span>{label}</span>
                  <span>{open === id ? '–' : '+'}</span>
                </div>
                {open === id && <p className="mt-4 text-sm leading-relaxed text-stone">{copy}</p>}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] px-5 pb-28 md:px-10">
        <div className="mb-10 flex items-end justify-between">
          <h2 className="font-display text-4xl">Worn with</h2>
          <Link href="/shop" className="text-[11px] tracking-[0.28em] uppercase">
            The shop
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-7 md:gap-x-6 md:gap-y-12 lg:grid-cols-4">
          {related.map((item, index) => (
            <ProductCard key={item.slug} product={item} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
