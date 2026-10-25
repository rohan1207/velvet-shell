'use client';

import { useEffect, useMemo, useState } from 'react';
import AppImage from '@/components/AppImage';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { collectionName as dummyCollectionName } from '@/lib/shop-meta';
import { money } from '@/lib/format';
import { useStore } from '@/context/StoreContext';
import { sortByColourPriority } from '@/lib/catalog/color-order';
import ProductCard from './ProductCard';
import { ProductPageNotes } from './ProductNotes';

function labelCollection(slug, collections = []) {
  return collections.find((c) => c.slug === slug)?.name || dummyCollectionName(slug) || slug;
}

/** Strip colour suffixes like " — Gold"; never cut mid-word hyphens (Two-Tone). */
function displayTitle(name = '') {
  return String(name || '')
    .replace(/\s+[—–]\s*.+$/, '')
    .replace(/\s+-\s+(Gold|Silver|Pink|Green|White|Blue|Clear|Purple|Edit).*$/i, '')
    .replace(/\s+/g, ' ')
    .trim() || name;
}

/** Keep admin gallery sequence: hero, then gallery items in saved order. */
function imagesForProduct(p) {
  if (!p) return [];
  const list = [];
  if (p.image) list.push(p.image);
  if (Array.isArray(p.gallery)) {
    for (const src of p.gallery) {
      if (src && !list.includes(src)) list.push(src);
    }
  }
  return list.filter(Boolean);
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
  const { addToCart, wishlist, toggleWishlist, catalog } = useStore();

  const colourVariants = useMemo(() => {
    if (!(Array.isArray(variants) && variants.length > 1)) return [];
    return sortByColourPriority(
      variants,
      (v) => v.label || v.colorLabel || v.product?.colorLabel,
    );
  }, [variants]);

  const [activeSlug, setActiveSlug] = useState(product.slug);
  const activeProduct =
    colourVariants.find((v) => v.slug === activeSlug)?.product || product;

  const sizeOptions = activeProduct.sizes?.length ? activeProduct.sizes : ['One size'];

  /**
   * Thumbnail strip: Gold images (in upload order), then Silver, then other colours.
   * Within each colour, admin gallery sequence is preserved.
   */
  const allImages = useMemo(() => {
    const tagged = [];
    const pool =
      colourVariants.length > 0
        ? colourVariants
        : [{ slug: product.slug, product, label: product.colorLabel }];

    for (const v of pool) {
      const p = v.product || product;
      const colour = v.label || v.colorLabel || p.colorLabel || 'Default';
      for (const src of imagesForProduct(p)) {
        if (tagged.some((t) => t.src === src)) continue;
        tagged.push({ src, colour, slug: v.slug || p.slug });
      }
    }
    if (!tagged.length) {
      tagged.push({
        src: '/images/product-placeholder.svg',
        colour: activeProduct.colorLabel || 'Default',
        slug: activeProduct.slug,
      });
    }
    return tagged;
  }, [colourVariants, product, activeProduct.colorLabel, activeProduct.slug]);

  /** Main stage: selected colour's images in saved gallery order (hero first). */
  const activeImages = useMemo(() => {
    const own = imagesForProduct(activeProduct);
    if (own.length) return own;
    return allImages.map((t) => t.src);
  }, [activeProduct, allImages]);

  const [active, setActive] = useState(0);
  const [size, setSize] = useState(sizeOptions[0]);
  const [qty, setQty] = useState(1);
  const [moreOpen, setMoreOpen] = useState('');
  const [customValues, setCustomValues] = useState({});
  const [customError, setCustomError] = useState('');

  const customizationFields =
    activeProduct.customizationEnabled && Array.isArray(activeProduct.customizationFields)
      ? activeProduct.customizationFields
      : [];

  useEffect(() => {
    setActiveSlug(product.slug);
    setActive(0);
  }, [product.slug]);

  useEffect(() => {
    setSize(activeProduct.sizes?.[0] || 'One size');
    setQty(1);
    setCustomValues({});
    setCustomError('');
  }, [activeProduct.slug]);

  function selectColour(slug, imageIndex = 0) {
    if (!slug) return;
    if (slug === activeSlug) {
      setActive(imageIndex);
      return;
    }
    setActiveSlug(slug);
    setActive(imageIndex);
    router.replace(`/shop/${slug}`, { scroll: false });
  }

  function selectThumb(tagged) {
    // Other colour thumb → switch swatch + show that image; same colour → just change main
    if (tagged.slug && tagged.slug !== activeSlug) {
      const nextProduct =
        colourVariants.find((v) => v.slug === tagged.slug)?.product || product;
      const nextImages = imagesForProduct(nextProduct);
      const idx = nextImages.indexOf(tagged.src);
      selectColour(tagged.slug, idx >= 0 ? idx : 0);
      return;
    }
    const idx = activeImages.indexOf(tagged.src);
    setActive(idx >= 0 ? idx : 0);
  }

  const title = displayTitle(activeProduct.name);
  const detailsList = (activeProduct.details || [])
    .map((d) => String(d || '').trim())
    .filter(Boolean)
    .filter((d) => !/^SKU\s/i.test(d));

  const materialLine = [
    activeProduct.material,
    ...(activeProduct.metal || []),
  ]
    .map((m) => String(m || '').trim())
    .filter(Boolean)
    .filter((m, i, arr) => arr.findIndex((x) => x.toLowerCase() === m.toLowerCase()) === i)
    .join(', ') || '925 Sterling Silver';

  const careCopy =
    activeProduct.care ||
    'Remove before bathing or swimming. Wipe gently with a soft dry cloth after wear. Store flat in the pouch, away from harsh chemicals and humidity.';

  const shipping = activeProduct.shipping || {};
  const shippingRegions = Array.isArray(shipping.regions) ? shipping.regions : [];
  const deliveryCopy = [
    shipping.intro,
    ...shippingRegions.map((r) => `${r.location}: ${r.eta}`),
    shipping.note,
  ]
    .filter(Boolean)
    .join('\n\n');

  const moreSections = [
    ['delivery', 'Delivery & shipping', deliveryCopy || 'We currently deliver within India. Estimated times are 5–7 working days after dispatch.'],
    ['care', 'Care', careCopy],
    [
      'returns',
      'Returns',
      shipping.returnsNote ||
        'See our Returns, Refunds & Exchanges policy for damaged or incorrect items.',
    ],
  ];

  const mainSrc = activeImages[active] || activeImages[0];

  return (
    <div className="bg-ivory pt-site-chrome">
      <div className="mx-auto grid max-w-[1600px] gap-6 px-4 pt-3 pb-[calc(6rem+env(safe-area-inset-bottom))] sm:gap-8 sm:px-5 md:gap-10 md:px-10 md:pt-8 md:pb-24 lg:grid-cols-12 lg:gap-16">
        <div className="order-1 lg:sticky lg:top-[calc(var(--site-promo-h)+var(--site-nav-h)+1rem)] lg:col-span-7 lg:self-start">
          <div className="flex h-[min(52svh,22rem)] gap-1.5 sm:h-[min(58svh,26rem)] sm:gap-2 md:h-[min(100svh-var(--site-promo-h)-var(--site-nav-h)-3rem,920px)] md:gap-3">
            <div className="flex w-12 shrink-0 flex-col gap-1.5 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] sm:w-14 sm:gap-2 md:w-16 md:gap-2.5 lg:w-[4.5rem] [&::-webkit-scrollbar]:hidden">
              {allImages.map((tagged, index) => {
                const isActiveColour = tagged.slug === activeSlug;
                const isMain =
                  isActiveColour &&
                  (tagged.src === mainSrc ||
                    (activeImages[active] === tagged.src));
                return (
                  <button
                    key={`${tagged.src}-${index}`}
                    type="button"
                    onClick={() => selectThumb(tagged)}
                    title={tagged.colour}
                    aria-label={`${tagged.colour} image ${index + 1}`}
                    aria-current={isMain}
                    className={`relative aspect-square w-full shrink-0 overflow-hidden rounded-lg bg-cream transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isMain ? 'z-10 scale-[1.08] ring-2 ring-gold/70' : 'scale-100 hover:scale-[1.03]'
                    } ${!isActiveColour ? 'opacity-70' : ''}`}
                  >
                    <AppImage src={tagged.src} alt="" fill className="object-cover" sizes="72px" />
                  </button>
                );
              })}
            </div>

            <div className="relative min-h-0 min-w-0 flex-1 overflow-hidden rounded-[1.25rem] bg-cream md:rounded-[1.5rem]">
              <AppImage
                src={mainSrc}
                alt={`${activeProduct.name}${activeProduct.colorLabel ? ` — ${activeProduct.colorLabel}` : ''}`}
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
          <h1 className="font-display mt-3 text-[1.85rem] leading-[1.08] tracking-[-0.03em] sm:text-3xl md:text-[2.75rem] md:leading-[1.05]">
            {title}
          </h1>
          <p className="font-num mt-4 text-lg text-ink/90">{money(activeProduct.price)}</p>

          {colourVariants.length > 1 && (
            <div className="mt-8">
              <p className="text-[10px] tracking-[0.28em] uppercase">
                Colour
                <span className="ml-2 tracking-normal normal-case text-ink/70">
                  {activeProduct.colorLabel || ''}
                </span>
              </p>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {colourVariants.map((variant) => {
                  const selected = variant.slug === activeSlug;
                  const swatch =
                    variant.swatch ||
                    variant.product?.colorSwatch ||
                    '#C5C5C5';
                  const label =
                    variant.label || variant.product?.colorLabel || variant.colorLabel || 'Colour';
                  return (
                    <button
                      key={variant.slug}
                      type="button"
                      title={label}
                      aria-label={label}
                      aria-pressed={selected}
                      onClick={() => selectColour(variant.slug)}
                      className={`flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-300 ${
                        selected
                          ? 'scale-110 ring-2 ring-gold/80 ring-offset-2 ring-offset-ivory'
                          : 'hover:scale-105'
                      }`}
                    >
                      <span
                        className="h-7 w-7 rounded-full border border-ink/10 shadow-sm"
                        style={{ backgroundColor: swatch }}
                      />
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-xs font-light text-ink/60">
                {colourVariants.length} colours in this piece
              </p>
            </div>
          )}

          <div className="mt-8">
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

          <div className="mt-8 flex gap-3">
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
                addToCart(activeProduct.slug, {
                  size,
                  metal: activeProduct.colorLabel || '',
                  qty,
                  customization,
                });
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
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill={wishlist.includes(activeProduct.slug) ? 'currentColor' : 'none'}
                aria-hidden
              >
                <path
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {activeProduct.description ? (
            <p className="mt-10 max-w-md text-base leading-relaxed text-stone">
              {activeProduct.description}
            </p>
          ) : null}

          {detailsList.length > 0 ? (
            <ul className="mt-6 max-w-md space-y-2 text-sm leading-relaxed text-ink/80">
              {detailsList.map((line) => (
                <li key={line} className="flex gap-2.5">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold/80" aria-hidden />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          ) : null}

          <p className="mt-6 max-w-md text-sm text-ink/75">
            <span className="tracking-[0.12em] uppercase text-[10px] text-ink/50">Material</span>
            <span className="mt-1 block">{materialLine}</span>
          </p>

          <ProductPageNotes category={activeProduct.category} />

          <div className="mt-10 divide-y divide-cream border-y border-cream">
            {moreSections.map(([id, label, copy]) => (
              <button
                key={id}
                type="button"
                onClick={() => setMoreOpen(moreOpen === id ? '' : id)}
                className="w-full py-5 text-left"
              >
                <div className="flex items-center justify-between text-[11px] tracking-[0.24em] uppercase">
                  <span>{label}</span>
                  <span aria-hidden>{moreOpen === id ? '–' : '+'}</span>
                </div>
                {moreOpen === id ? (
                  <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-stone">
                    {copy}
                  </p>
                ) : null}
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
            <ProductCard
              key={item.slug}
              product={item}
              index={index}
              colorFamilies={catalog?.colorFamilies || []}
              catalogProducts={catalog?.allProducts?.length ? catalog.allProducts : catalog?.products || []}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
