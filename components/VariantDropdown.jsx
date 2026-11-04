'use client';

import { swatchStyle } from '@/lib/swatch';

/**
 * Colour swatches for product cards — side-by-side circles.
 * Hover previews that variant (image + price); click selects it.
 * Supports two-tone swatches (`#A/#B`).
 */
export default function VariantDropdown({
  variants = [],
  value,
  onChange,
  onPreview,
  className = '',
}) {
  const selected =
    variants.find((v) => v.slug === value) || variants[0] || null;

  if (!selected || variants.length < 2) return null;

  return (
    <div
      role="listbox"
      aria-label="Colour options"
      className={`flex flex-wrap items-center justify-center gap-2 md:gap-2.5 ${className}`}
      onMouseLeave={() => onPreview?.(null)}
    >
      {variants.map((variant) => {
        const label = variant.label || variant.product?.colorLabel || 'Option';
        const swatch =
          variant.swatch || variant.product?.colorSwatch || '#C5C5C5';
        const isActive = variant.slug === selected.slug;
        return (
          <button
            key={variant.slug}
            type="button"
            role="option"
            aria-selected={isActive}
            aria-label={label}
            title={label}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onChange?.(variant.slug);
              onPreview?.(null);
            }}
            onPointerDown={(event) => event.stopPropagation()}
            onMouseEnter={() => onPreview?.(variant.slug)}
            onFocus={() => onPreview?.(variant.slug)}
            onBlur={() => onPreview?.(null)}
            className={`relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-[transform,box-shadow] duration-200 md:h-7 md:w-7 ${
              isActive
                ? 'scale-110 ring-1 ring-burgundy/70 ring-offset-2 ring-offset-ivory'
                : 'hover:scale-105 ring-1 ring-ink/15 ring-offset-1 ring-offset-ivory'
            }`}
          >
            <span
              className="h-full w-full rounded-full border border-ink/10 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.35)]"
              style={swatchStyle(swatch)}
              aria-hidden
            />
          </button>
        );
      })}
    </div>
  );
}
