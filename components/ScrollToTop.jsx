'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import {
  consumePopNavigation,
  currentRouteKey,
  getScrollY,
  installScrollRestoreListeners,
  isRestoreLocked,
  readReturnFocus,
  readScrollPosition,
  restoreViewport,
  saveReturnFocus,
  saveScrollPosition,
  scrollToY,
} from '@/lib/scroll-restore';

/**
 * Forward path changes → top.
 * Browser back/forward → restore saved Y + last product/set card.
 * Same-path query changes (filters) → keep viewport.
 *
 * Pathname-only (no useSearchParams) so this never remounts inside Suspense.
 */
export default function ScrollToTop() {
  const pathname = usePathname();
  const prevPathname = useRef(null);
  const cancelRestore = useRef(null);

  useEffect(() => {
    installScrollRestoreListeners();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    let ticking = false;
    const persist = () => {
      if (isRestoreLocked()) return;
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        if (isRestoreLocked()) return;
        saveScrollPosition(currentRouteKey(), getScrollY());
      });
    };

    const onPointerDown = (event) => {
      if (isRestoreLocked()) return;
      const anchor = event.target?.closest?.('a[href]');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return;
      }
      saveScrollPosition(currentRouteKey(), getScrollY());

      const card = event.target?.closest?.('[data-restore-id]');
      const id = card?.getAttribute('data-restore-id');
      if (id) saveReturnFocus(id);
    };

    window.addEventListener('scroll', persist, { passive: true });
    document.addEventListener('pointerdown', onPointerDown, true);
    const lenis = window.__lenis;
    lenis?.on?.('scroll', persist);

    return () => {
      window.removeEventListener('scroll', persist);
      document.removeEventListener('pointerdown', onPointerDown, true);
      lenis?.off?.('scroll', persist);
    };
  }, [pathname]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const key = currentRouteKey();
    const prev = prevPathname.current;
    const pathChanged = prev != null && prev !== pathname;
    const isFirst = prev == null;
    prevPathname.current = pathname;

    cancelRestore.current?.();
    cancelRestore.current = null;

    if (isFirst) {
      saveScrollPosition(key, getScrollY());
      return undefined;
    }

    // Filters / query-only: keep still. If this was a back into same path+new
    // search, popstate handler below restores.
    if (!pathChanged) {
      if (consumePopNavigation()) {
        const y = readScrollPosition(key) ?? getScrollY();
        const focusId = readReturnFocus(key);
        cancelRestore.current = restoreViewport({ y, focusId });
        return () => {
          cancelRestore.current?.();
          cancelRestore.current = null;
        };
      }
      saveScrollPosition(key, getScrollY());
      return undefined;
    }

    const wasPop = consumePopNavigation();

    if (wasPop) {
      const y = readScrollPosition(key) ?? 0;
      const focusId = readReturnFocus(key);
      cancelRestore.current = restoreViewport({ y, focusId });
      return () => {
        cancelRestore.current?.();
        cancelRestore.current = null;
      };
    }

    const reset = () => scrollToY(0);
    reset();
    const raf = requestAnimationFrame(reset);
    const t = window.setTimeout(reset, 40);
    saveScrollPosition(key, 0);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
    };
  }, [pathname]);

  // Catch back/forward when Next restores the same pathname (or before React
  // commits). Location is already the destination when popstate fires.
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const onPopState = () => {
      const run = () => {
        const key = currentRouteKey();
        const y = readScrollPosition(key);
        const focusId = readReturnFocus(key);
        if (y == null && !focusId) return;
        cancelRestore.current?.();
        cancelRestore.current = restoreViewport({
          y: y ?? 0,
          focusId,
        });
      };
      requestAnimationFrame(() => requestAnimationFrame(run));
      window.setTimeout(run, 90);
      window.setTimeout(run, 280);
      window.setTimeout(run, 600);
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  return null;
}
