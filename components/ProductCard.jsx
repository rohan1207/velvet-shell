'use client';

import Image from 'next/image';
import Link from 'next/link';
import { money } from '@/lib/format';
import { useStore } from '@/context/StoreContext';

function IconHeart({ filled = false, className = 'h-4 w-4' }) {
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

function IconEye({ className = 'h-4 w-4' }) {
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

function IconBag({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path
        d="M7.2 8.5h9.6l.7 11.2H6.5L7.2 8.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M9.2 8.5V7.2a2.8 2.8 0 0 1 5.6 0v1.3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ActionButton({ label, onClick, children, active = false }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onClick?.();
      }}
      onPointerDown={(event) => {
        event.stopPropagation();
      }}
      className={`relative z-30 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        active
          ? 'border-burgundy bg-velvet-texture text-ivory'
          : 'border-ink/8 bg-ivory/95 text-ink shadow-[0_8px_24px_rgba(45,43,43,0.08)] hover:border-burgundy/30 hover:text-burgundy'
      }`}
    >
      {children}
    </button>
  );
}

export default function ProductCard({
  product,
  index = 0,
  className = '',
  sizes = '(max-width: 768px) 50vw, 25vw',
  showQuickView = true,
}) {
  const { wishlist, toggleWishlist, addToCart, openQuickView } = useStore();
  const wished = wishlist.includes(product.slug);
  const href = `/shop/${product.slug}`;
  const hasHover = Boolean(product.hoverImage && product.hoverImage !== product.image);

  return (
    <article
      className={`group animate-[fade-up_0.9s_var(--ease-luxe)_both] ${className}`}
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="relative isolate aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-pearl">
        {/* Media never captures clicks — the link below does */}
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes={sizes}
          className="pointer-events-none object-cover object-center transition-transform duration-[1.1s] ease-[cubic-bezier(0.22,1,0.36,1)] [@media(hover:hover)]:group-hover:scale-[1.03]"
        />
        {hasHover && (
          <Image
            src={product.hoverImage}
            alt=""
            fill
            sizes={sizes}
            className="pointer-events-none object-cover object-center opacity-0 transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] [@media(hover:hover)]:group-hover:opacity-100"
          />
        )}

        <Link
          href={href}
          data-cursor="View"
          className="absolute inset-0 z-10"
          aria-label={`View ${product.name}`}
        />

        {/* Outer strip stays click-through; only the pill captures pointers */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex translate-y-2 justify-center pb-4 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100">
          <div
            className="pointer-events-auto relative z-30 flex items-center gap-2 rounded-full border border-ink/6 bg-ivory/95 p-1.5 shadow-[0_10px_30px_rgba(45,43,43,0.12)] backdrop-blur-md"
            onClick={(event) => event.stopPropagation()}
            onPointerDown={(event) => event.stopPropagation()}
          >
            <ActionButton
              label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
              active={wished}
              onClick={() => toggleWishlist(product.slug)}
            >
              <IconHeart filled={wished} />
            </ActionButton>
            {showQuickView && (
              <ActionButton label="Quick view" onClick={() => openQuickView(product.slug)}>
                <IconEye />
              </ActionButton>
            )}
            <ActionButton label="Add to bag" onClick={() => addToCart(product.slug)}>
              <IconBag />
            </ActionButton>
          </div>
        </div>
      </div>

      <div className="mt-4 px-0.5">
        <Link
          href={href}
          className="font-display block text-[1.35rem] leading-tight tracking-[-0.02em] text-ink transition-colors hover:text-burgundy"
        >
          {product.name}
        </Link>
        <p className="font-num mt-1.5 text-sm text-ink/85">{money(product.price)}</p>
      </div>
    </article>
  );
}
