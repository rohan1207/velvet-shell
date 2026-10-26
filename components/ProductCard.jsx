'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import AppImage from '@/components/AppImage';
import { money } from '@/lib/format';
import { flyToCart, prefersReducedMotion } from '@/lib/fly-to-cart';
import { useStore } from '@/context/StoreContext';
import { sortByColourPriority } from '@/lib/catalog/color-order';

function resolveFromFamily(family, catalogProducts) {
  if (!family?.variants?.length) return [];
  return sortByColourPriority(
    family.variants
      .map((variant) => {
        const product = catalogProducts.find((p) => p.slug === variant.slug);
        if (!product) return null;
        return { ...variant, product };
      })
      .filter(Boolean),
    (v) => v.label || v.product?.colorLabel,
  );
}

function resolveFromFamilyId(slug, catalogProducts) {
  const current = catalogProducts.find((p) => p.slug === slug);
  if (!current?.familyId) return [];
  const siblings = catalogProducts.filter((p) => p.familyId === current.familyId);
  if (siblings.length < 2) return [];
  return sortByColourPriority(
    siblings.map((product) => ({
      slug: product.slug,
      label: product.colorLabel,
      swatch: product.colorSwatch,
      active: product.active !== false,
      product,
    })),
    (v) => v.label || v.product?.colorLabel,
  );
}

function resolveVariants(slug, colorFamilies = [], catalogProducts = []) {
  if (catalogProducts?.length) {
    const family = (colorFamilies || []).find(
      (f) => f.primary === slug || f.variants?.some((v) => v.slug === slug),
    );
    const fromFamily = resolveFromFamily(family, catalogProducts);
    if (fromFamily.length > 1) return fromFamily;

    const fromId = resolveFromFamilyId(slug, catalogProducts);
    if (fromId.length > 1) return fromId;

    if (fromFamily.length) return fromFamily;
  }
  return [];
}

function IconHeart({ filled = false, className = 'h-4 w-4 md:h-[1.2rem] md:w-[1.2rem]' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill={filled ? 'currentColor' : 'none'} aria-hidden>
      <path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconEye({ className = 'h-5 w-5 md:h-[1.35rem] md:w-[1.35rem]' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path
        d="M2.5 12S6.2 5.5 12 5.5 21.5 12 21.5 12 17.8 18.5 12 18.5 2.5 12 2.5 12Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <circle cx="12" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function IconBagMini({ className = 'h-[1.05rem] w-[1.05rem] md:h-5 md:w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M7.2 8.5h9.6l.7 11.2H6.5L7.2 8.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M9.2 8.5V7.2a2.8 2.8 0 0 1 5.6 0v1.3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ActionIcon({ label, onClick, children, active = false, className = '' }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onClick?.();
      }}
      onPointerDown={(event) => event.stopPropagation()}
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors duration-300 md:h-10 md:w-10 ${
        active
          ? 'bg-velvet-texture text-ivory'
          : 'text-ink/85 hover:text-burgundy'
      } ${className}`}
    >
      {children}
    </button>
  );
}

function displayName(name = '') {
  return name
    .replace(/Ã¢â‚¬â€|â€”|â€“|&mdash;|&ndash;/gi, '—')
    .replace(/\s+[—–]\s*.+$/, '')
    .replace(/\s+-\s+(Gold|Silver|Pink|Green|White|Blue|Clear|Purple|Edit).*$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

const MORPH_MS = 320;
const RESET_MS = 420;

export default function ProductCard({
  product,
  index = 0,
  className = '',
  sizes = '(max-width: 768px) 50vw, 25vw',
  showQuickView = true,
  colorFamilies = [],
  catalogProducts = [],
}) {
  const { wishlist, toggleWishlist, addToCart, openQuickView, catalog } = useStore();
  const families = colorFamilies.length ? colorFamilies : catalog?.colorFamilies || [];
  // Prefer the fullest product pool so colour siblings resolve everywhere —
  // shop listings omit non-primary variants, which would hide swatches.
  const pool = useMemo(() => {
    const fromStore = catalog?.allProducts?.length
      ? catalog.allProducts
      : catalog?.products || [];
    if (fromStore.length >= catalogProducts.length && fromStore.length) return fromStore;
    if (catalogProducts.length) return catalogProducts;
    return fromStore;
  }, [catalog?.allProducts, catalog?.products, catalogProducts]);
  const variants = useMemo(
    () => resolveVariants(product.slug, families, pool),
    [product.slug, families, pool],
  );
  const [activeSlug, setActiveSlug] = useState(product.slug);
  const [previewSlug, setPreviewSlug] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);
  /** idle | morph | flying | done */
  const [bagPhase, setBagPhase] = useState('idle');
  const bagBtnRef = useRef(null);
  const animTokenRef = useRef(0);
  const timersRef = useRef([]);

  useEffect(() => {
    setActiveSlug(product.slug);
    setPreviewSlug(null);
  }, [product.slug]);

  useEffect(() => {
    setImageIndex(0);
  }, [activeSlug, previewSlug]);

  useEffect(() => {
    return () => {
      animTokenRef.current += 1;
      timersRef.current.forEach((id) => window.clearTimeout(id));
      timersRef.current = [];
    };
  }, []);

  const displaySlug = previewSlug || activeSlug;
  const active =
    variants.find((item) => item.slug === activeSlug)?.product ||
    variants[0]?.product ||
    product;
  const displayProduct =
    variants.find((item) => item.slug === displaySlug)?.product || active;

  const galleryImages = useMemo(() => {
    // Preserve admin gallery order: hero first, then gallery sequence (no resort).
    const gallery = Array.isArray(displayProduct.gallery)
      ? displayProduct.gallery.filter(Boolean)
      : [];
    const list = [displayProduct.image, ...gallery].filter(Boolean);
    return [...new Set(list)];
  }, [displayProduct.gallery, displayProduct.image]);

  const currentImage = galleryImages[imageIndex] || displayProduct.image || '';
  const hasGallery = galleryImages.length > 1 && !previewSlug;

  const wished = wishlist.includes(active.slug);
  const href = `/shop/${active.slug}`;
  const title = displayName(product.name);
  const prices = variants.length ? variants.map((item) => item.product.price) : [product.price];
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceLabel =
    variants.length > 1 && minPrice !== maxPrice
      ? `From ${money(minPrice)}`
      : money(active.price);

  const bagBusy = bagPhase !== 'idle';
  const bagCollapsed = bagPhase === 'morph' || bagPhase === 'flying';

  function cycleImage(event) {
    if (!hasGallery) return;
    event.preventDefault();
    event.stopPropagation();
    setImageIndex((i) => (i + 1) % galleryImages.length);
  }

  function schedule(fn, ms) {
    const id = window.setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  }

  async function handleAddToBag(event) {
    event.preventDefault();
    event.stopPropagation();
    if (bagBusy) return;
    if (active.outOfStock) {
      // OOS: open PDP where Notify me lives
      window.location.href = `/shop/${active.slug}`;
      return;
    }

    const token = (animTokenRef.current += 1);
    const slug = active.slug;

    // Commit cart first so state is never lost if animation is interrupted
    addToCart(slug);

    if (prefersReducedMotion() || !bagBtnRef.current) {
      setBagPhase('done');
      schedule(() => {
        if (animTokenRef.current === token) setBagPhase('idle');
      }, RESET_MS);
      return;
    }

    setBagPhase('morph');

    await new Promise((resolve) => schedule(resolve, MORPH_MS));
    if (animTokenRef.current !== token) return;

    setBagPhase('flying');
    // Let the morph settle one frame before measuring for the flyer
    await new Promise((resolve) => requestAnimationFrame(() => resolve()));
    if (animTokenRef.current !== token) return;

    try {
      await flyToCart(bagBtnRef.current);
    } catch {
      /* fly util already resolves safely */
    }
    if (animTokenRef.current !== token) return;

    setBagPhase('done');
    schedule(() => {
      if (animTokenRef.current === token) setBagPhase('idle');
    }, RESET_MS);
  }

  return (
    <article
      className={`group flex h-full animate-[fade-up_0.9s_var(--ease-luxe)_both] flex-col ${className}`}
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="relative isolate aspect-square overflow-hidden bg-[#f3eee8]">
        <AppImage
          key={currentImage}
          src={currentImage}
          alt={displayProduct.name}
          fill
          sizes={sizes}
          className="pointer-events-none object-contain object-center transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] [@media(hover:hover)]:group-hover:scale-[1.03]"
        />

        {hasGallery && variants.length <= 1 ? (
          <AppImage
            src={galleryImages[1]}
            alt=""
            fill
            sizes={sizes}
            className="pointer-events-none hidden object-contain object-center opacity-0 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] [@media(hover:hover)]:block [@media(hover:hover)]:group-hover:scale-[1.03] [@media(hover:hover)]:group-hover:opacity-100"
          />
        ) : null}

        <Link href={href} className="absolute inset-0 z-10" aria-label={`View ${active.name}`} />

        {hasGallery ? (
          <button
            type="button"
            aria-label="View next image"
            onClick={cycleImage}
            onPointerDown={(e) => e.stopPropagation()}
            className="absolute inset-x-0 bottom-0 z-20 flex h-[28%] items-end justify-center pb-2 md:hidden"
          >
            <span className="flex gap-1">
              {galleryImages.slice(0, 4).map((_, i) => (
                <span
                  key={i}
                  className={`h-1 rounded-full transition-all ${
                    i === imageIndex % Math.min(galleryImages.length, 4)
                      ? 'w-3 bg-burgundy'
                      : 'w-1 bg-ink/20'
                  }`}
                />
              ))}
            </span>
          </button>
        ) : null}
      </div>

      <div className="mt-2.5 flex flex-1 flex-col md:mt-3">
        <div className="flex min-h-4 items-center justify-center gap-1.5 md:min-h-5 md:gap-2">
          {variants.length > 1
            ? variants.map((variant) => {
                const selected = variant.slug === active.slug;
                const previewing = previewSlug === variant.slug;
                return (
                  <button
                    key={variant.slug}
                    type="button"
                    aria-label={variant.label}
                    aria-pressed={selected}
                    title={variant.label}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      setActiveSlug(variant.slug);
                      setPreviewSlug(null);
                      setImageIndex(0);
                    }}
                    onMouseEnter={() => setPreviewSlug(variant.slug)}
                    onMouseLeave={() => setPreviewSlug(null)}
                    onFocus={() => setPreviewSlug(variant.slug)}
                    onBlur={() => setPreviewSlug(null)}
                    className={`flex h-7 w-7 items-center justify-center rounded-full transition-all duration-300 md:h-5 md:w-5 ${
                      selected || previewing
                        ? 'ring-1 ring-ink ring-offset-1 ring-offset-white md:ring-offset-2'
                        : ''
                    }`}
                  >
                    <span
                      className="block h-3.5 w-3.5 rounded-full border border-ink/15 md:h-3.5 md:w-3.5"
                      style={{ backgroundColor: variant.swatch }}
                    />
                  </button>
                );
              })
            : null}
        </div>

        <Link
          href={href}
          className="font-label mt-1.5 line-clamp-2 min-h-[2.6em] w-full px-0.5 text-center text-[10px] leading-[1.25] tracking-[0.08em] text-ink uppercase transition-colors hover:text-burgundy md:mt-2 md:text-[11px] md:tracking-[0.14em]"
        >
          {title}
        </Link>

        <p className="font-num mt-1.5 text-center text-[13px] tracking-[0.04em] text-ink/75 md:mt-2">
          {priceLabel}
        </p>

        <div className="mt-auto flex items-center justify-between gap-1 px-0.5 pt-2.5 sm:gap-1.5 sm:px-4 md:px-6 md:pt-3.5">
          <div className="flex items-center gap-0">
            <ActionIcon
              label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
              active={wished}
              onClick={() => toggleWishlist(active.slug)}
            >
              <IconHeart filled={wished} />
            </ActionIcon>
            {showQuickView ? (
              <ActionIcon
                label="Quick view"
                className="hidden md:flex"
                onClick={() => openQuickView(active.slug)}
              >
                <IconEye />
              </ActionIcon>
            ) : null}
          </div>

          <button
            ref={bagBtnRef}
            type="button"
            disabled={bagBusy}
            aria-busy={bagBusy}
            aria-label={bagPhase === 'done' ? 'Added to bag' : 'Add to bag'}
            onClick={handleAddToBag}
            onPointerDown={(event) => event.stopPropagation()}
            className={`bg-velvet-texture relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-label text-ivory uppercase transition-[width,height,padding,opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              bagPhase === 'flying'
                ? 'h-8 w-8 px-0 py-0 opacity-0 md:h-9 md:w-9'
                : bagPhase === 'morph'
                  ? 'h-8 w-8 px-0 py-0 md:h-9 md:w-9'
                  : bagPhase === 'done'
                    ? 'h-8 min-w-[4.25rem] px-3 py-1.5 md:h-10 md:min-w-[6.5rem] md:px-5 md:py-2'
                    : 'h-8 min-w-[4.25rem] px-3 py-1.5 hover:opacity-90 active:scale-[0.98] md:h-10 md:min-w-[6.5rem] md:px-5 md:py-2'
            } ${bagBusy ? 'cursor-default' : 'cursor-pointer'} disabled:opacity-100`}
          >
            <span
              className={`whitespace-nowrap text-[8px] tracking-[0.1em] transition-opacity duration-200 md:text-[9px] md:tracking-[0.14em] ${
                bagPhase === 'idle' || bagPhase === 'done' ? 'opacity-100' : 'pointer-events-none absolute opacity-0'
              }`}
            >
              {bagPhase === 'done' ? 'Added' : 'Add'}
            </span>
            <span
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
                bagCollapsed ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
            >
              <IconBagMini />
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}
