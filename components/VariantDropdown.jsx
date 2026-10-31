'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { money } from '@/lib/format';

function IconChevron({ open }) {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      className={`h-3 w-3 shrink-0 text-ink/45 transition-transform duration-200 ${
        open ? 'rotate-180' : ''
      }`}
      aria-hidden
    >
      <path
        d="M2.5 4.5 6 8l3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Swatch({ color, className = 'h-3.5 w-3.5' }) {
  return (
    <span
      className={`${className} shrink-0 rounded-full border border-ink/15 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.35)]`}
      style={{ backgroundColor: color || '#C5C5C5' }}
      aria-hidden
    />
  );
}

/**
 * Custom colour / finish picker for product cards.
 * Shows swatch · label · price — not a native <select>.
 */
export default function VariantDropdown({
  variants = [],
  value,
  onChange,
  onPreview,
  onOpenChange,
  className = '',
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const listId = useId();

  const selected =
    variants.find((v) => v.slug === value) || variants[0] || null;

  function setOpenState(next) {
    setOpen(next);
    onOpenChange?.(next);
  }

  useEffect(() => {
    if (!open) return undefined;
    function onDoc(event) {
      if (!rootRef.current?.contains(event.target)) setOpenState(false);
    }
    function onKey(event) {
      if (event.key === 'Escape') setOpenState(false);
    }
    document.addEventListener('pointerdown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- close handlers only need open
  }, [open]);

  if (!selected || variants.length < 2) return null;

  const selectedLabel = selected.label || selected.product?.colorLabel || 'Option';
  const selectedPrice = selected.product?.price ?? selected.price ?? 0;
  const selectedSwatch =
    selected.swatch || selected.product?.colorSwatch || '#C5C5C5';

  return (
    <div ref={rootRef} className={`relative z-30 w-full ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setOpenState(!open);
        }}
        onPointerDown={(event) => event.stopPropagation()}
        className={`flex w-full min-h-9 items-center gap-2 rounded-lg border bg-white/90 px-2.5 text-left shadow-[0_1px_0_rgba(40,20,24,0.04)] transition-[border-color,box-shadow,background] duration-200 md:min-h-10 md:px-3 ${
          open
            ? 'border-burgundy/35 shadow-[0_8px_24px_rgba(94,6,42,0.08)]'
            : 'border-ink/12 hover:border-ink/25'
        }`}
      >
        <Swatch color={selectedSwatch} className="h-3.5 w-3.5 md:h-4 md:w-4" />
        <span className="min-w-0 flex-1 truncate font-label text-[10px] tracking-[0.06em] text-ink uppercase md:text-[11px] md:tracking-[0.1em]">
          {selectedLabel}
        </span>
        <span className="font-num shrink-0 text-[11px] text-ink/70 md:text-[12px]">
          {money(selectedPrice)}
        </span>
        <IconChevron open={open} />
      </button>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-label="Colour options"
          className="absolute inset-x-0 top-[calc(100%+4px)] z-40 max-h-52 overflow-y-auto overscroll-contain rounded-xl border border-ink/10 bg-ivory py-1 shadow-[0_16px_40px_rgba(40,20,24,0.16)] ring-1 ring-black/5"
        >
          {variants.map((variant) => {
            const label = variant.label || variant.product?.colorLabel || 'Option';
            const price = variant.product?.price ?? variant.price ?? 0;
            const swatch =
              variant.swatch || variant.product?.colorSwatch || '#C5C5C5';
            const isActive = variant.slug === selected.slug;
            return (
              <li key={variant.slug} role="option" aria-selected={isActive}>
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onChange?.(variant.slug);
                    onPreview?.(null);
                    setOpenState(false);
                  }}
                  onPointerDown={(event) => event.stopPropagation()}
                  onMouseEnter={() => onPreview?.(variant.slug)}
                  onMouseLeave={() => onPreview?.(null)}
                  onFocus={() => onPreview?.(variant.slug)}
                  onBlur={() => onPreview?.(null)}
                  className={`flex w-full items-center gap-2.5 px-2.5 py-2.5 text-left transition-colors md:px-3 ${
                    isActive
                      ? 'bg-burgundy/[0.06] text-burgundy'
                      : 'text-ink hover:bg-cream/80'
                  }`}
                >
                  <Swatch color={swatch} className="h-4 w-4" />
                  <span className="min-w-0 flex-1 truncate text-[12px] md:text-[13px]">
                    {label}
                  </span>
                  <span
                    className={`font-num shrink-0 text-[11px] md:text-[12px] ${
                      isActive ? 'text-burgundy' : 'text-ink/65'
                    }`}
                  >
                    {money(price)}
                  </span>
                  {isActive ? (
                    <svg
                      viewBox="0 0 12 12"
                      className="h-3 w-3 shrink-0 text-burgundy"
                      fill="none"
                      aria-hidden
                    >
                      <path
                        d="M2.5 6.2 4.8 8.5 9.5 3.5"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <span className="w-3 shrink-0" aria-hidden />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
