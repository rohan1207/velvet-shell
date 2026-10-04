'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProductCard from '@/components/ProductCard';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

function Arrow({ dir, onClick, disabled }) {
  return (
    <button
      type="button"
      aria-label={dir === 'prev' ? 'Previous' : 'Next'}
      disabled={disabled}
      onClick={onClick}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/12 bg-ivory text-ink transition-all duration-300 hover:border-burgundy/30 hover:text-burgundy disabled:pointer-events-none disabled:opacity-30"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
        <path
          d={dir === 'prev' ? 'M14.5 6.5 9 12l5.5 5.5' : 'M9.5 6.5 15 12l-5.5 5.5'}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

/**
 * Full-viewport pin (desktop): vertical scroll drives the rail.
 * Horizontal scroll, drag, and arrows also move the same rail and stay in sync.
 */
export default function PinnedProductStrip({
  eyebrow,
  title,
  line,
  ctaHref = '/shop',
  ctaLabel = 'Shop all',
  products: picks,
  bgClass = 'bg-ivory',
}) {
  const rootRef = useRef(null);
  const trackRef = useRef(null);
  const scrollerRef = useRef(null);
  const stRef = useRef(null);
  const pinActiveRef = useRef(false);
  const ignoreScrollRef = useRef(false);
  const dragRef = useRef({
    active: false,
    dragging: false,
    startX: 0,
    startScrollLeft: 0,
    moved: false,
    pointerId: null,
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const maxScrollLeft = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return 0;
    return Math.max(el.scrollWidth - el.clientWidth, 0);
  }, []);

  const syncArrows = useCallback((left) => {
    const max = maxScrollLeft();
    setCanPrev(left > 8);
    setCanNext(left < max - 8);
  }, [maxScrollLeft]);

  const setRailLeft = useCallback(
    (left, { syncPin = true, smooth = false } = {}) => {
      const el = scrollerRef.current;
      if (!el) return;
      const max = maxScrollLeft();
      const next = gsap.utils.clamp(0, max, left);

      if (smooth) {
        el.scrollTo({ left: next, behavior: 'smooth' });
      } else {
        ignoreScrollRef.current = true;
        el.scrollLeft = next;
        ignoreScrollRef.current = false;
      }

      syncArrows(next);

      if (syncPin && pinActiveRef.current && stRef.current && max > 0) {
        const st = stRef.current;
        const progress = next / max;
        ignoreScrollRef.current = true;
        st.scroll(st.start + progress * (st.end - st.start));
        ignoreScrollRef.current = false;
      }
    },
    [maxScrollLeft, syncArrows],
  );

  useEffect(() => {
    const root = rootRef.current;
    const el = scrollerRef.current;
    const track = trackRef.current;
    if (!root || !el || !track) return undefined;

    let ctx;
    let refreshTimer;

    const enablePin = () => window.innerWidth > 900;

    const applyProgressToRail = (progress) => {
      const max = maxScrollLeft();
      ignoreScrollRef.current = true;
      el.scrollLeft = progress * max;
      ignoreScrollRef.current = false;
      syncArrows(el.scrollLeft);
    };

    const setup = () => {
      ctx?.revert();
      stRef.current = null;
      pinActiveRef.current = false;

      if (!enablePin()) {
        syncArrows(el.scrollLeft);
        return;
      }

      pinActiveRef.current = true;
      ctx = gsap.context(() => {
        const st = ScrollTrigger.create({
          trigger: root,
          start: 'top top',
          end: () => {
            const distance = Math.max(maxScrollLeft(), window.innerWidth * 0.75);
            return `+=${distance}`;
          },
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (dragRef.current.active) return;
            stRef.current = self;
            applyProgressToRail(self.progress);
          },
          onRefresh: (self) => {
            stRef.current = self;
            applyProgressToRail(self.progress);
          },
        });
        stRef.current = st;
      }, root);

      refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 350);
    };

    setup();

    const onResize = () => {
      clearTimeout(refreshTimer);
      setup();
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', onResize);

    return () => {
      clearTimeout(refreshTimer);
      window.removeEventListener('resize', onResize);
      ctx?.revert();
      stRef.current = null;
      pinActiveRef.current = false;
    };
  }, [picks.length, maxScrollLeft, syncArrows]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return undefined;

    const onScroll = () => {
      if (ignoreScrollRef.current) {
        syncArrows(el.scrollLeft);
        return;
      }

      syncArrows(el.scrollLeft);

      // Keep pin progress aligned when user scrolls the rail horizontally
      const st = stRef.current;
      const max = maxScrollLeft();
      if (pinActiveRef.current && st && max > 0 && !dragRef.current.active) {
        const progress = el.scrollLeft / max;
        ignoreScrollRef.current = true;
        st.scroll(st.start + progress * (st.end - st.start));
        ignoreScrollRef.current = false;
      }
    };

    const onWheel = (event) => {
      // Prefer explicit horizontal intent (trackpad swipe / shift+wheel)
      const horizontal =
        Math.abs(event.deltaX) > Math.abs(event.deltaY) || event.shiftKey;
      if (!horizontal) return;

      const delta = event.shiftKey && !event.deltaX ? event.deltaY : event.deltaX || event.deltaY;
      if (!delta) return;

      event.preventDefault();
      setRailLeft(el.scrollLeft + delta, { syncPin: true });
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('scroll', onScroll);
      el.removeEventListener('wheel', onWheel);
    };
  }, [maxScrollLeft, setRailLeft, syncArrows]);

  const scrollByPage = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.max(el.clientWidth * 0.85, 280);
    const target = el.scrollLeft + dir * amount;

    if (pinActiveRef.current && stRef.current) {
      const max = maxScrollLeft();
      const st = stRef.current;
      const progress = max > 0 ? gsap.utils.clamp(0, 1, target / max) : 0;
      const nextY = st.start + progress * (st.end - st.start);
      const proxy = { y: st.scroll() };
      gsap.to(proxy, {
        y: nextY,
        duration: 0.7,
        ease: 'power2.out',
        onUpdate: () => {
          ignoreScrollRef.current = true;
          st.scroll(proxy.y);
          el.scrollLeft = st.progress * maxScrollLeft();
          ignoreScrollRef.current = false;
          syncArrows(el.scrollLeft);
        },
      });
      return;
    }

    setRailLeft(target, { syncPin: false, smooth: true });
  };

  const onPointerDown = (event) => {
    if (event.button !== 0 && event.pointerType === 'mouse') return;
    // Let product links / action buttons receive a clean click — never capture them.
    if (event.target.closest?.('a, button')) return;

    const el = scrollerRef.current;
    if (!el) return;

    dragRef.current = {
      active: true,
      dragging: false,
      startX: event.clientX,
      startScrollLeft: el.scrollLeft,
      moved: false,
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
      drag.moved = true;
      el.setPointerCapture?.(event.pointerId);
      el.style.cursor = 'grabbing';
    }

    if (!drag.dragging) return;
    setRailLeft(drag.startScrollLeft - delta, { syncPin: true });
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

    // Only suppress the synthetic click that follows a real drag — not a tap.
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
      ref={rootRef}
      className={`relative box-border flex h-[100svh] flex-col overflow-hidden ${bgClass}`}
    >
      <div className="shrink-0 px-5 pt-5 md:px-10 md:pt-6">
        <div className="flex flex-col items-start justify-between gap-4 border-b border-ink/8 pb-4 md:flex-row md:items-end md:pb-5">
          <div>
            <p className="font-label text-gold">{eyebrow}</p>
            <h2 className="font-display mt-2 text-3xl leading-[1.08] text-ink md:text-5xl">{title}</h2>
            <p className="mt-2 max-w-md text-sm font-light leading-relaxed text-ink/85">{line}</p>
          </div>

          <div className="flex items-center gap-2">
            <Arrow dir="prev" disabled={!canPrev} onClick={() => scrollByPage(-1)} />
            <Arrow dir="next" disabled={!canNext} onClick={() => scrollByPage(1)} />
            <Link
              href={ctaHref}
              className="bg-velvet-texture ml-1 inline-flex items-center rounded-full px-5 py-2.5 font-label text-[11px] text-ivory transition-opacity hover:opacity-90"
            >
              {ctaLabel}
            </Link>
          </div>
        </div>
      </div>

      <div
        ref={scrollerRef}
        data-strip-surface
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={() => {
          if (dragRef.current.active) endDrag();
        }}
        className="min-h-0 flex-1 cursor-grab overflow-x-auto overflow-y-hidden select-none active:cursor-grabbing [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ touchAction: 'pan-x' }}
      >
        <div
          ref={trackRef}
          className="flex h-full w-max items-stretch gap-4 px-5 py-4 md:gap-6 md:px-10 md:py-5"
        >
          {picks.map((product, index) => (
            <ProductCard
              key={product.slug}
              product={product}
              index={index}
              className="flex h-full w-[72vw] shrink-0 flex-col sm:w-[40vw] lg:w-[22vw]"
              sizes="(max-width: 768px) 72vw, 22vw"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
