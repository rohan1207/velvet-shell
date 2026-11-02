'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  getScrollY,
  readScrollPosition,
  routeKey,
  saveScrollPosition,
  scrollToY,
} from '@/lib/scroll-restore';

/**
 * Forward navigations land at the top. Back/forward restore the last scroll
 * for that route. Search-param-only updates (shop filters) keep position.
 */
export default function ScrollToTop() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams?.toString() ?? '';
  const key = routeKey(pathname, search);

  const prevPathname = useRef(pathname);
  const prevKey = useRef(key);
  const navigationType = useRef('push');

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    try {
      window.history.scrollRestoration = 'manual';
    } catch {
      /* ignore */
    }

    const onPopState = () => {
      navigationType.current = 'pop';
    };
    const onPageShow = (event) => {
      // Back-forward cache: restore without waiting for a React route effect.
      if (!event.persisted) return;
      navigationType.current = 'pop';
      const y = readScrollPosition(routeKey(window.location.pathname, window.location.search.slice(1)));
      if (y != null) {
        scrollToY(y);
        requestAnimationFrame(() => scrollToY(y));
      }
    };
    window.addEventListener('popstate', onPopState);
    window.addEventListener('pageshow', onPageShow);
    return () => {
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('pageshow', onPageShow);
    };
  }, []);

  // Persist scroll for the current route (native + Lenis).
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    let ticking = false;
    const persist = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        saveScrollPosition(key, getScrollY());
      });
    };

    const onPointerDown = (event) => {
      const anchor = event.target?.closest?.('a[href]');
      if (!anchor) return;
      saveScrollPosition(key, getScrollY());
      if (navigationType.current !== 'pop') navigationType.current = 'push';
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
  }, [key]);

  useEffect(() => {
    const pathChanged = prevPathname.current !== pathname;
    const keyChanged = prevKey.current !== key;
    if (!keyChanged) return undefined;

    // Filter / query-string updates on the same page: keep the viewport still.
    if (!pathChanged) {
      saveScrollPosition(key, getScrollY());
      prevKey.current = key;
      if (navigationType.current === 'pop') navigationType.current = 'push';
      return undefined;
    }

    const type = navigationType.current;
    prevPathname.current = pathname;
    prevKey.current = key;

    if (type === 'pop') {
      const y = readScrollPosition(key) ?? 0;
      const restore = () => scrollToY(y);
      restore();
      const raf = requestAnimationFrame(restore);
      const t1 = window.setTimeout(restore, 50);
      const t2 = window.setTimeout(restore, 160);
      const t3 = window.setTimeout(restore, 360);
      navigationType.current = 'push';
      return () => {
        cancelAnimationFrame(raf);
        window.clearTimeout(t1);
        window.clearTimeout(t2);
        window.clearTimeout(t3);
      };
    }

    const reset = () => scrollToY(0);
    reset();
    const raf = requestAnimationFrame(reset);
    const t = window.setTimeout(reset, 50);
    navigationType.current = 'push';
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
    };
  }, [pathname, key]);

  return null;
}
