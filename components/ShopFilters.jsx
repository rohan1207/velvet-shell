'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { money } from '@/lib/format';
import { swatchStyle } from '@/lib/swatch';

export function emptyFilterState(priceBounds = { min: 0, max: 100000 }) {
  const min = Number(priceBounds?.min) || 0;
  // Never default max to 0 — that hides every priced product on first paint
  const max = Number(priceBounds?.max) > 0 ? Number(priceBounds.max) : 100000;
  return {
    collections: [],
    materials: [],
    colors: [],
    priceMin: min,
    priceMax: Math.max(max, min),
  };
}

export function filtersEqual(a, b) {
  if (!a || !b) return false;
  const sameList = (x, y) =>
    x.length === y.length && x.every((v, i) => v === y[i]);
  return (
    sameList(a.collections, b.collections) &&
    sameList(a.materials, b.materials) &&
    sameList(a.colors, b.colors) &&
    a.priceMin === b.priceMin &&
    a.priceMax === b.priceMax
  );
}

export function normalizeMaterialTags(material) {
  const m = String(material || '').toLowerCase();
  if (!m) return [];
  const tags = [];
  if (/sterling|s\s*925|\b925\b|sterling silver/.test(m)) tags.push('Sterling Silver');
  if (/gold\s*plat|18\s*k|18k|vermeil|gold plated/.test(m)) tags.push('Gold Plated');
  if (/silver\s*plat/.test(m)) tags.push('Silver Plated');
  if (/pearl|nacre|mother\s*of\s*pearl/.test(m)) tags.push('Pearl');
  if (
    /quartz|aventurine|aquamarine|gemstone|crystal|zircon|coral|agate|topaz|garnet|amethyst|peridot|ruby|sapphire|emerald|stone/.test(
      m,
    )
  ) {
    tags.push('Natural Gemstone');
  }
  if (!tags.length) tags.push('Other');
  return tags;
}

export function colorKey(product) {
  const label = String(product.colorLabel || 'Default').trim() || 'Default';
  if (/^default$/i.test(label)) return 'Silver';
  return label;
}

function toggleInList(list, value) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function countActiveDraft(draft, priceBounds) {
  if (!draft) return 0;
  let n = 0;
  n += draft.collections?.length || 0;
  n += draft.materials?.length || 0;
  n += draft.colors?.length || 0;
  const min = Number(priceBounds?.min) || 0;
  const max = Number(priceBounds?.max) > 0 ? Number(priceBounds.max) : 100000;
  if (draft.priceMin > min || draft.priceMax < max) n += 1;
  return n;
}

function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-ink/8 py-5 last:border-b-0">
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full cursor-pointer items-center justify-between gap-3 font-label text-[10px] tracking-[0.2em] text-ink uppercase select-none"
        aria-expanded={open}
      >
        {title}
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-full border border-ink/10 text-[10px] text-ink/45 transition-transform duration-300 ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden
        >
          ▾
        </span>
      </button>
      {open ? <div className="mt-4 space-y-1">{children}</div> : null}
    </div>
  );
}

/** Button-based checkbox — no native input focus, so the drawer never scroll-jacks. */
function CheckRow({ checked, onChange, label, swatch, count }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onChange}
      className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2.5 text-left text-sm transition-colors ${
        checked ? 'bg-burgundy/[0.04] text-ink' : 'text-ink/80 hover:bg-ivory'
      }`}
    >
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[0.3rem] border transition-colors ${
          checked ? 'border-burgundy bg-burgundy text-ivory' : 'border-ink/20 bg-white'
        }`}
        aria-hidden
      >
        {checked ? (
          <svg viewBox="0 0 16 16" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="M3.5 8.2L6.4 11l6-6.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : null}
      </span>
      {swatch ? (
        <span
          className="h-3.5 w-3.5 shrink-0 rounded-full border border-ink/15 shadow-sm"
          style={swatchStyle(swatch)}
          aria-hidden
        />
      ) : null}
      <span className="min-w-0 flex-1 truncate tracking-[-0.01em]">{label}</span>
      {typeof count === 'number' ? (
        <span className="font-num text-[11px] text-ink/35">{count}</span>
      ) : null}
    </button>
  );
}

function FilterPanelBody({
  draft,
  onDraftChange,
  options,
  priceBounds,
  onApply,
  onClear,
  dirty,
  hasActive,
  onClose,
  titleId,
}) {
  const panelRef = useRef(null);
  const scrollRef = useRef(null);
  const draftCount = countActiveDraft(draft, priceBounds);

  useEffect(() => {
    const panel = panelRef.current;
    const scroller = scrollRef.current;
    if (!panel || !scroller) return undefined;

    const onWheel = (event) => {
      event.stopPropagation();
      event.preventDefault();
      scroller.scrollTop += event.deltaY;
    };

    panel.addEventListener('wheel', onWheel, { passive: false });
    return () => panel.removeEventListener('wheel', onWheel);
  }, []);

  return (
    <div
      ref={panelRef}
      data-lenis-prevent
      className="flex h-full min-h-0 flex-col bg-[#fbfaf8]"
      style={{ overscrollBehavior: 'none' }}
    >
      <div className="relative z-10 shrink-0 border-b border-ink/8 bg-gradient-to-br from-[#f7f0ea] via-[#fbfaf8] to-[#efe4da] px-5 pt-5 pb-5 sm:px-7 sm:pt-6 sm:pb-6">
        <div
          className="pointer-events-none absolute -top-10 right-[-10%] h-36 w-36 rounded-full bg-burgundy/[0.06] blur-3xl"
          aria-hidden
        />
        <div className="relative flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="font-label text-[10px] tracking-[0.22em] text-gold uppercase">Refine</p>
            <h2
              id={titleId}
              className="font-display mt-1.5 text-[1.65rem] leading-[1.1] tracking-[-0.03em] text-ink sm:text-[1.85rem]"
            >
              Filters
            </h2>
            <p className="mt-1.5 min-h-[2.6em] text-[13px] leading-snug font-light text-ink/60">
              {draftCount
                ? `${draftCount} selected — apply to update the edit`
                : 'Choose collections, price, colour, material'}
            </p>
          </div>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/10 bg-white/80 text-ink/70 transition-colors hover:border-burgundy/30 hover:text-burgundy"
            aria-label="Close filters"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="shop-filter-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 sm:px-7"
        style={{ overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}
      >
        <Section title="Collections" defaultOpen>
          {options.collections.length === 0 ? (
            <p className="px-1 text-xs font-light text-ink/50">No collections in this category.</p>
          ) : (
            options.collections.map((item) => (
              <CheckRow
                key={item.slug}
                label={item.name}
                count={item.count}
                checked={draft.collections.includes(item.slug)}
                onChange={() =>
                  onDraftChange({
                    ...draft,
                    collections: toggleInList(draft.collections, item.slug),
                  })
                }
              />
            ))
          )}
        </Section>

        <Section title="Price">
          <div className="space-y-3 px-1">
            <div className="flex items-center justify-between gap-2 font-num text-[13px] text-ink/75">
              <span>{money(draft.priceMin)}</span>
              <span className="text-ink/25">—</span>
              <span>{money(draft.priceMax)}</span>
            </div>
            <label className="block">
              <span className="sr-only">Minimum price</span>
              <input
                type="range"
                min={priceBounds.min}
                max={priceBounds.max}
                step={50}
                value={draft.priceMin}
                onChange={(e) => {
                  const next = Number(e.target.value);
                  onDraftChange({
                    ...draft,
                    priceMin: Math.min(next, draft.priceMax),
                  });
                }}
                className="w-full accent-[#5e062a]"
              />
            </label>
            <label className="block">
              <span className="sr-only">Maximum price</span>
              <input
                type="range"
                min={priceBounds.min}
                max={priceBounds.max}
                step={50}
                value={draft.priceMax}
                onChange={(e) => {
                  const next = Number(e.target.value);
                  onDraftChange({
                    ...draft,
                    priceMax: Math.max(next, draft.priceMin),
                  });
                }}
                className="w-full accent-[#5e062a]"
              />
            </label>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {options.pricePresets.map((preset) => {
                const active =
                  draft.priceMin === preset.min && draft.priceMax === preset.max;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() =>
                      onDraftChange({
                        ...draft,
                        priceMin: preset.min,
                        priceMax: preset.max,
                      })
                    }
                    className={`rounded-full px-3 py-1.5 font-label text-[9px] tracking-[0.12em] uppercase transition-colors ${
                      active
                        ? 'bg-velvet-texture text-ivory'
                        : 'border border-ink/10 bg-white text-ink/65 hover:border-burgundy/25 hover:text-burgundy'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>
        </Section>

        <Section title="Colour">
          {options.colors.length === 0 ? (
            <p className="px-1 text-xs font-light text-ink/50">No colour variants here.</p>
          ) : (
            <div className="flex flex-wrap gap-2 px-1 pb-1">
              {options.colors.map((item) => {
                const checked = draft.colors.includes(item.key);
                return (
                  <button
                    key={item.key}
                    type="button"
                    title={item.key}
                    aria-pressed={checked}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() =>
                      onDraftChange({
                        ...draft,
                        colors: toggleInList(draft.colors, item.key),
                      })
                    }
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] transition-all ${
                      checked
                        ? 'border-burgundy/40 bg-burgundy/[0.06] text-ink ring-1 ring-gold/50'
                        : 'border-ink/10 bg-white text-ink/75 hover:border-ink/20'
                    }`}
                  >
                    <span
                      className="h-3 w-3 rounded-full border border-ink/15"
                      style={swatchStyle(item.swatch)}
                      aria-hidden
                    />
                    {item.key}
                    <span className="font-num text-[10px] text-ink/35">{item.count}</span>
                  </button>
                );
              })}
            </div>
          )}
        </Section>

        <Section title="Material">
          {options.materials.length === 0 ? (
            <p className="px-1 text-xs font-light text-ink/50">No materials listed.</p>
          ) : (
            options.materials.map((item) => (
              <CheckRow
                key={item.key}
                label={item.key}
                count={item.count}
                checked={draft.materials.includes(item.key)}
                onChange={() =>
                  onDraftChange({
                    ...draft,
                    materials: toggleInList(draft.materials, item.key),
                  })
                }
              />
            ))
          )}
        </Section>
        <div className="h-6" aria-hidden />
      </div>

      <div className="relative z-10 shrink-0 border-t border-ink/8 bg-white px-5 py-4 sm:px-7 sm:py-5">
        <div className="flex gap-2.5">
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={onClear}
            disabled={!hasActive && !dirty}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full border border-ink/12 px-4 font-label text-[10px] tracking-[0.16em] text-ink/75 uppercase transition-colors hover:border-burgundy/30 hover:text-burgundy disabled:cursor-not-allowed disabled:opacity-40"
          >
            Clear
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={onApply}
            className="bg-velvet-texture inline-flex min-h-11 flex-[1.4] items-center justify-center gap-2 rounded-full px-5 font-label text-[10px] tracking-[0.16em] text-ivory uppercase shadow-[0_10px_28px_rgba(94,6,42,0.18)]"
          >
            {dirty ? 'Apply' : 'Done'}
            <span aria-hidden>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Full-viewport filter drawer — hidden by default; opens from Filters control.
 */
export default function ShopFilters({
  draft,
  onDraftChange,
  options,
  priceBounds,
  onApply,
  onClear,
  dirty,
  hasActive,
  open,
  onClose,
}) {
  const titleId = useId();
  const drawerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const onKey = (event) => {
      if (event.key === 'Escape') onClose?.();
    };

    // Soft lock only — do NOT position:fixed the body (that was shifting this drawer up).
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevOverscroll = body.style.overscrollBehavior;
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    body.style.overscrollBehavior = 'none';

    const lockScroll = (event) => {
      const drawer = drawerRef.current;
      if (drawer && drawer.contains(event.target)) return;
      event.preventDefault();
    };

    // If anything tries to scroll the window while open, snap back.
    const scrollY = window.scrollY;
    const onScroll = () => {
      if (window.scrollY !== scrollY) window.scrollTo(0, scrollY);
    };

    window.addEventListener('keydown', onKey);
    window.addEventListener('wheel', lockScroll, { passive: false });
    window.addEventListener('touchmove', lockScroll, { passive: false });
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      body.style.overscrollBehavior = prevOverscroll;
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('wheel', lockScroll);
      window.removeEventListener('touchmove', lockScroll);
      window.removeEventListener('scroll', onScroll);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70]"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      style={{ touchAction: 'none' }}
    >
      <button
        type="button"
        className="absolute inset-0 bg-[#2d1a1e]/40 backdrop-blur-[3px] transition-opacity"
        aria-label="Close filters"
        onClick={onClose}
      />

      <div
        ref={drawerRef}
        data-lenis-prevent
        className="fixed top-0 left-0 flex h-[100dvh] max-h-[100dvh] w-[min(100vw,24rem)] max-w-full flex-col overflow-hidden bg-[#fbfaf8] shadow-[0_0_60px_rgba(40,20,24,0.22)] sm:w-[min(92vw,26rem)] md:w-[28rem]"
        style={{
          // Avoid transform animations here — they break fixed positioning with focus/scroll.
          animation: 'shop-filter-fade 0.28s ease-out both',
          touchAction: 'pan-y',
        }}
      >
        <FilterPanelBody
          draft={draft}
          onDraftChange={onDraftChange}
          options={options}
          priceBounds={priceBounds}
          onApply={onApply}
          onClear={onClear}
          dirty={dirty}
          hasActive={hasActive}
          onClose={onClose}
          titleId={titleId}
        />
      </div>
    </div>
  );
}
