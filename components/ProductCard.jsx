'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { money } from '@/lib/format';
import { getProductVariants as getDummyVariants } from '@/lib/products';
import { useStore } from '@/context/StoreContext';

function resolveVariants(slug, colorFamilies = [], catalogProducts = []) {
  if (colorFamilies?.length && catalogProducts?.length) {
    const family = colorFamilies.find(
      (f) => f.primary === slug || f.variants?.some((v) => v.slug === slug)
    );
    if (!family) return [];
    return family.variants
      .map((variant) => {
        const product = catalogProducts.find((p) => p.slug === variant.slug);
        if (!product) return null;
        return { ...variant, product };
      })
      .filter(Boolean);
  }
  return getDummyVariants(slug);
}

function IconHeart({ filled = false, className = 'h-3.5 w-3.5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill={filled ? 'currentColor' : 'none'} aria-hidden>
      <path
        d="M12 20s-7.2-4.35-9.2-8.2C1.3 9.1 2.7 6.2 5.6 5.5c1.7-.4 3.4.3 4.4 1.6 1-1.3 2.7-2 4.4-1.6 2.9.7 4.3 3.6 2.8 6.3C19.2 15.65 12 20 12 20Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconEye({ className = 'h-3.5 w-3.5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path
        d="M2.5 12S6.2 5.5 12 5.5 21.5 12 21.5 12 17.8 18.5 12 18.5 2.5 12 2.5 12Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function CornerActionButton({ label, onClick, children, active = false }) {
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
      className={`relative z-30 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        active
          ? 'border-burgundy bg-velvet-texture text-ivory'
          : 'border-ink/8 bg-white/95 text-ink shadow-[0_4px_14px_rgba(45,43,43,0.08)] hover:border-burgundy/30 hover:text-burgundy'
      }`}
    >
      {children}
    </button>
  );
}

function displayName(name = '') {
  return name
    .replace(/Ã¢â‚¬â€|â€”|â€“|&mdash;|&ndash;/gi, '—')
    .replace(/\s*[—–-]\s*(Gold|Silver|Pink|Green|White|Edit).*$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

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
  const pool = catalogProducts.length ? catalogProducts : catalog?.allProducts || [];
  const variants = useMemo(
    () => resolveVariants(product.slug, families, pool),
    [product.slug, families, pool]
  );
  const [activeSlug, setActiveSlug] = useState(product.slug);

  useEffect(() => {
    setActiveSlug(product.slug);
  }, [product.slug]);

  const active =
    variants.find((item) => item.slug === activeSlug)?.product ||
    variants[0]?.product ||
    product;

  const wished = wishlist.includes(active.slug);
  const href = `/shop/${active.slug}`;
  const title = displayName(product.name);
  const prices = variants.length
    ? variants.map((item) => item.product.price)
    : [product.price];
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceLabel =
    variants.length > 1 && minPrice !== maxPrice
      ? `From ${money(minPrice)}`
      : money(active.price);

  const iconReveal =
    'opacity-100 max-md:opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-within:opacity-100';

  const cartReveal =
    'pointer-events-auto opacity-100 translate-y-0 max-md:opacity-100 [@media(hover:hover)]:pointer-events-none [@media(hover:hover)]:translate-y-1 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:pointer-events-auto [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-within:pointer-events-auto [@media(hover:hover)]:group-focus-within:translate-y-0 [@media(hover:hover)]:group-focus-within:opacity-100';

  return (
    <article
      className={`group flex h-full animate-[fade-up_0.9s_var(--ease-luxe)_both] flex-col ${className}`}
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="relative isolate aspect-square overflow-hidden rounded-2xl bg-white md:rounded-[1.25rem]">
        <Image
          key={active.image}
          src={active.image}
          alt={active.name}
          fill
          sizes={sizes}
          className="pointer-events-none object-contain object-center p-5 transition-transform duration-[1.1s] ease-[cubic-bezier(0.22,1,0.36,1)] [@media(hover:hover)]:group-hover:scale-[1.03]"
        />

        <Link href={href} className="absolute inset-0 z-10" aria-label={`View ${active.name}`} />

        <div
          className={`pointer-events-none absolute top-3 right-3 z-20 flex flex-col gap-1.5 transition-opacity duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${iconReveal}`}
        >
          <div className="pointer-events-auto flex flex-col gap-1.5">
            <CornerActionButton
              label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
              active={wished}
              onClick={() => toggleWishlist(active.slug)}
            >
              <IconHeart filled={wished} />
            </CornerActionButton>
            {showQuickView ? (
              <CornerActionButton label="Quick view" onClick={() => openQuickView(active.slug)}>
                <IconEye />
              </CornerActionButton>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-3.5 flex flex-1 flex-col items-center text-center">
        <div className="flex min-h-5 items-center justify-center gap-2">
          {variants.length > 1
            ? variants.map((variant) => {
                const selected = variant.slug === active.slug;
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
                    }}
                    className={`flex h-5 w-5 items-center justify-center rounded-full transition-all duration-300 ${
                      selected ? 'ring-1 ring-ink ring-offset-2 ring-offset-white' : 'hover:scale-110'
                    }`}
                  >
                    <span
                      className="block h-3.5 w-3.5 rounded-full border border-ink/15"
                      style={{ backgroundColor: variant.swatch }}
                    />
                  </button>
                );
              })
            : null}
        </div>

        <Link
          href={href}
          className="font-label mt-2.5 line-clamp-2 max-w-[15rem] text-[11px] leading-[1.4] tracking-[0.14em] text-ink uppercase transition-colors hover:text-burgundy"
        >
          {title}
        </Link>

        <p className="font-num mt-2 text-[13px] tracking-[0.04em] text-ink/75">{priceLabel}</p>

        <div className="mt-2.5 flex min-h-[2.25rem] w-full items-start justify-center">
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              addToCart(active.slug);
            }}
            className={`bg-velvet-texture rounded-full px-5 py-2 font-label text-[9px] tracking-[0.16em] text-ivory uppercase shadow-[0_8px_20px_rgba(94,6,42,0.18)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:opacity-90 active:scale-[0.98] ${cartReveal}`}
          >
            Add to bag
          </button>
        </div>
      </div>
    </article>
  );
}
