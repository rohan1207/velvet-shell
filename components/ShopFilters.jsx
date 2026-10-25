'use client';

import { useEffect, useRef } from 'react';
import { money } from '@/lib/format';

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

function Section({ title, children, defaultOpen = true }) {
  return (
    <details open={defaultOpen} className="group border-b border-ink/8 py-4 last:border-b-0">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-label text-[10px] tracking-[0.18em] text-ink uppercase [&::-webkit-details-marker]:hidden">
        {title}
        <span className="text-ink/40 transition-transform duration-300 group-open:rotate-180" aria-hidden>
          ▾
        </span>
      </summary>
      <div className="mt-3 space-y-2">{children}</div>
    </details>
  );
}

function CheckRow({ checked, onChange, label, swatch, count }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-1 py-1.5 text-sm text-ink/85 transition-colors hover:bg-ivory/80">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-3.5 w-3.5 accent-[#5e062a]"
      />
      {swatch ? (
        <span
          className="h-3 w-3 shrink-0 rounded-full border border-ink/15"
          style={{ backgroundColor: swatch }}
          aria-hidden
        />
      ) : null}
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {typeof count === 'number' ? (
        <span className="font-num text-[11px] text-ink/40">{count}</span>
      ) : null}
    </label>
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
  onToggleCollapsed,
  onCloseMobile,
  showHide,
  showClose,
}) {
  const panelRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const panel = panelRef.current;
    const scroller = scrollRef.current;
    if (!panel || !scroller) return undefined;

    const onWheel = (event) => {
      // Always keep wheel on the filter panel — never let the page take it.
      event.preventDefault();
      event.stopPropagation();
      scroller.scrollTop += event.deltaY;
    };

    panel.addEventListener('wheel', onWheel, { passive: false });
    return () => panel.removeEventListener('wheel', onWheel);
  }, []);

  return (
    <div
      ref={panelRef}
      className="flex h-full min-h-0 flex-col"
      style={{ overscrollBehavior: 'contain' }}
    >
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-ink/8 pb-4">
        <div>
          <p className="font-label text-[10px] tracking-[0.18em] text-gold uppercase">Filter</p>
          <p className="mt-1 text-sm font-light text-ink/70">Refine this edit</p>
        </div>
        <div className="flex items-center gap-2">
          {showHide ? (
            <button
              type="button"
              onClick={onToggleCollapsed}
              className="rounded-full border border-ink/10 px-3 py-1.5 font-label text-[9px] tracking-[0.14em] text-ink/70 uppercase transition-colors hover:border-burgundy/30 hover:text-burgundy"
            >
              Hide
            </button>
          ) : null}
          {showClose ? (
            <button
              type="button"
              onClick={onCloseMobile}
              className="rounded-full border border-ink/10 px-3 py-1.5 font-label text-[9px] tracking-[0.14em] text-ink/70 uppercase"
            >
              Close
            </button>
          ) : null}
        </div>
      </div>

      <div
        ref={scrollRef}
        className="shop-filter-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain pr-0.5"
        style={{ overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}
      >
        <Section title="Collections" defaultOpen>
          {options.collections.length === 0 ? (
            <p className="text-xs font-light text-ink/50">No collections in this category.</p>
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
            <div className="flex items-center justify-between gap-2 font-num text-[12px] text-ink/70">
              <span>{money(draft.priceMin)}</span>
              <span className="text-ink/30">—</span>
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
                    onClick={() =>
                      onDraftChange({
                        ...draft,
                        priceMin: preset.min,
                        priceMax: preset.max,
                      })
                    }
                    className={`rounded-full px-2.5 py-1 font-label text-[9px] tracking-[0.12em] uppercase transition-colors ${
                      active
                        ? 'bg-velvet-texture text-ivory'
                        : 'border border-ink/10 text-ink/65 hover:border-burgundy/25 hover:text-burgundy'
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
            <p className="text-xs font-light text-ink/50">No colour variants here.</p>
          ) : (
            options.colors.map((item) => (
              <CheckRow
                key={item.key}
                label={item.key}
                swatch={item.swatch}
                count={item.count}
                checked={draft.colors.includes(item.key)}
                onChange={() =>
                  onDraftChange({
                    ...draft,
                    colors: toggleInList(draft.colors, item.key),
                  })
                }
              />
            ))
          )}
        </Section>

        <Section title="Material">
          {options.materials.length === 0 ? (
            <p className="text-xs font-light text-ink/50">No materials listed.</p>
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
      </div>

      <div className="mt-4 flex shrink-0 flex-wrap gap-2 border-t border-ink/8 bg-white pt-4">
        <button
          type="button"
          onClick={onApply}
          disabled={!dirty}
          className="bg-velvet-texture inline-flex flex-1 items-center justify-center rounded-full px-4 py-2.5 font-label text-[10px] tracking-[0.16em] text-ivory uppercase transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
        >
          Apply
        </button>
        <button
          type="button"
          onClick={onClear}
          disabled={!hasActive && !dirty}
          className="inline-flex flex-1 items-center justify-center rounded-full border border-ink/12 px-4 py-2.5 font-label text-[10px] tracking-[0.16em] text-ink/75 uppercase transition-colors hover:border-burgundy/30 hover:text-burgundy disabled:cursor-not-allowed disabled:opacity-40"
        >
          Clear
        </button>
      </div>
    </div>
  );
}

/**
 * Sticky filter panel — collections (category-aware), price, color, material.
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
  collapsed,
  onToggleCollapsed,
  mobileOpen,
  onCloseMobile,
}) {
  const panelProps = {
    draft,
    onDraftChange,
    options,
    priceBounds,
    onApply,
    onClear,
    dirty,
    hasActive,
    onToggleCollapsed,
    onCloseMobile,
  };

  return (
    <>
      <aside
        className={`relative hidden shrink-0 self-stretch transition-[width,opacity,margin] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:block ${
          collapsed
            ? 'pointer-events-none w-0 overflow-hidden opacity-0'
            : 'w-[16.5rem] opacity-100 xl:w-[17.5rem]'
        }`}
        aria-hidden={collapsed}
      >
        {!collapsed && (
          <div
            className="sticky z-30 flex flex-col overflow-hidden rounded-[1.25rem] border border-ink/8 bg-white p-5 shadow-[0_10px_40px_rgba(45,43,43,0.04)]"
            style={{
              top: 'calc(var(--site-chrome-offset) + 3.75rem)',
              height:
                'calc(100svh - var(--site-promo-h) - var(--site-nav-h) - 4.5rem)',
              maxHeight:
                'calc(100svh - var(--site-promo-h) - var(--site-nav-h) - 4.5rem)',
            }}
          >
            <FilterPanelBody {...panelProps} showHide showClose={false} />
          </div>
        )}
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
            aria-label="Close filters"
            onClick={onCloseMobile}
          />
          <div className="absolute inset-y-0 left-0 flex h-full w-[min(92vw,22rem)] flex-col overflow-hidden bg-white p-5 shadow-2xl">
            <FilterPanelBody {...panelProps} showHide={false} showClose />
          </div>
        </div>
      ) : null}
    </>
  );
}
