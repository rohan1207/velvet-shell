'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';

function SideArrow({ dir, onClick, disabled }) {
  return (
    <button
      type="button"
      aria-label={dir === 'prev' ? 'Previous products' : 'Next products'}
      disabled={disabled}
      onClick={onClick}
      className={`absolute top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-ink/12 bg-white/95 text-ink shadow-[0_8px_24px_rgba(45,43,43,0.1)] backdrop-blur-sm transition-all duration-300 hover:border-burgundy/35 hover:text-burgundy disabled:pointer-events-none disabled:opacity-0 md:h-11 md:w-11 ${
        dir === 'prev' ? 'left-2 md:left-3' : 'right-2 md:right-3'
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
        <path
          d={dir === 'prev' ? 'M14.5 6.5 9 12l5.5 5.5' : 'M9.5 6.5 15 12l-5.5 5.5'}
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

/**
 * Horizontal product rail — arrows, drag, and native scroll.
 * No vertical-scroll pin / lock.
 */
export default function PinnedProductStrip({
  id,
  eyebrow,
  title,
  line,
  ctaHref = '/shop',
  ctaLabel = 'Shop all',
  products: picks,
  bgClass = 'bg-ivory',
  colorFamilies = [],
  catalogProducts = [],
}) {
  const scrollerRef = useRef(null);
  const dragRef = useRef({
    active: false,
    dragging: false,
    startX: 0,
    startScrollLeft: 0,
    pointerId: null,
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const syncArrows = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = Math.max(el.scrollWidth - el.clientWidth, 0);
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft < max - 8);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return undefined;

    syncArrows();
    el.addEventListener('scroll', syncArrows, { passive: true });
    window.addEventListener('resize', syncArrows);
    const t = setTimeout(syncArrows, 120);

    return () => {
      clearTimeout(t);
      el.removeEventListener('scroll', syncArrows);
      window.removeEventListener('resize', syncArrows);
    };
  }, [picks.length, syncArrows]);

  /** Advance by ~4 visible cards (one “page” of the strip) */
  const scrollByPage = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector('[data-strip-card]');
    const gap = 24;
    const cardW = card?.getBoundingClientRect().width || el.clientWidth * 0.22;
    const page = cardW * 4 + gap * 3;
    el.scrollBy({ left: dir * page, behavior: 'smooth' });
  };

  const onPointerDown = (event) => {
    if (event.button !== 0 && event.pointerType === 'mouse') return;
    if (event.target.closest?.('a, button')) return;

    const el = scrollerRef.current;
    if (!el) return;

    dragRef.current = {
      active: true,
      dragging: false,
      startX: event.clientX,
      startScrollLeft: el.scrollLeft,
      pointerId: event.pointerId,
    };
  };

  const onPointerMove = (event) => {
    const drag = dragRef.current;
    const el = scrollerRef.current;
    if (!drag.active || !el) return;

    const delta = event.clientX - drag.startX;
    if (!drag.dragging && Math.abs(delta) > 8) {
      drag.dragging = true;
      el.setPointerCapture?.(event.pointerId);
      el.style.cursor = 'grabbing';
    }

    if (!drag.dragging) return;
    el.scrollLeft = drag.startScrollLeft - delta;
    syncArrows();
  };

  const endDrag = () => {
    const drag = dragRef.current;
    if (!drag.active) return;

    const el = scrollerRef.current;
    const wasDragging = drag.dragging;
    drag.active = false;
    drag.dragging = false;

    if (el) {
      el.style.cursor = 'grab';
      if (wasDragging && drag.pointerId != null) {
        el.releasePointerCapture?.(drag.pointerId);
      }
    }

    if (wasDragging && el) {
      const block = (e) => {
        e.preventDefault();
        e.stopPropagation();
        el.removeEventListener('click', block, true);
      };
      el.addEventListener('click', block, true);
      setTimeout(() => el.removeEventListener('click', block, true), 0);
    }
  };

  return (
    <section
      id={id}
      className={`relative box-border scroll-mt-28 overflow-hidden py-10 md:py-12 ${bgClass}`}
    >
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="flex flex-col items-start justify-between gap-4 border-b border-ink/8 pb-4 md:flex-row md:items-end md:pb-5">
          <div>
            <p className="font-label text-gold">{eyebrow}</p>
            <h2 className="font-display mt-2 text-3xl leading-[1.08] text-ink md:text-5xl">{title}</h2>
            <p className="mt-2 max-w-md text-sm font-light leading-relaxed text-ink/85">{line}</p>
          </div>
          <Link
            href={ctaHref}
            className="bg-velvet-texture inline-flex items-center rounded-full px-5 py-2.5 font-label text-[11px] text-ivory transition-opacity hover:opacity-90"
          >
            {ctaLabel}
          </Link>
        </div>
      </div>

      <div className="relative mt-6 md:mt-7">
        <SideArrow dir="prev" disabled={!canPrev} onClick={() => scrollByPage(-1)} />
        <SideArrow dir="next" disabled={!canNext} onClick={() => scrollByPage(1)} />

        <div
          ref={scrollerRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={() => {
            if (dragRef.current.active) endDrag();
          }}
          className="cursor-grab overflow-x-auto overflow-y-hidden select-none active:cursor-grabbing [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ touchAction: 'pan-x' }}
        >
          <div className="flex w-max gap-4 px-12 md:gap-6 md:px-16">
            {picks.map((product, index) => (
              <div
                key={product.slug}
                data-strip-card
                className="w-[72vw] shrink-0 sm:w-[40vw] lg:w-[22vw] xl:w-[21vw]"
              >
                <ProductCard
                  product={product}
                  index={index}
                  className="h-full"
                  sizes="(max-width: 768px) 72vw, 22vw"
                  colorFamilies={colorFamilies}
                  catalogProducts={catalogProducts}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
