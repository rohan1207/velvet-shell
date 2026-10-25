'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * Immediate top-bar feedback on internal navigations so the UI doesn't feel
 * frozen while the next RSC payload streams in.
 */
export default function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams?.toString() ?? '';
  const [active, setActive] = useState(false);
  const [width, setWidth] = useState(0);
  const hideTimer = useRef(null);
  const routeKey = `${pathname}?${search}`;
  const prevRoute = useRef(routeKey);

  useEffect(() => {
    if (prevRoute.current === routeKey) return;
    prevRoute.current = routeKey;
    setWidth(100);
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => {
      setActive(false);
      setWidth(0);
    }, 280);
    return () => {
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
    };
  }, [routeKey]);

  useEffect(() => {
    function onClick(event) {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target?.closest?.('a[href]');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return;
      }
      if (anchor.target && anchor.target !== '_self') return;
      let url;
      try {
        url = new URL(href, window.location.origin);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      const next = `${url.pathname}${url.search}`;
      const current = `${window.location.pathname}${window.location.search}`;
      if (next === current) return;
      setActive(true);
      setWidth(18);
      window.requestAnimationFrame(() => setWidth(72));
    }

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  if (!active && width === 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-[2px] overflow-hidden"
      aria-hidden
    >
      <div
        className="h-full bg-[#5e062a] transition-[width] duration-500 ease-out"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
