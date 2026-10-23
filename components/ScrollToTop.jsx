'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * Always land at the top of the new page so users see navbar + content,
 * never the footer from a preserved scroll position.
 */
export default function ScrollToTop() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams?.toString() ?? '';

  useEffect(() => {
    const reset = () => {
      if (typeof window === 'undefined') return;
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      window.__lenis?.scrollTo(0, { immediate: true });
    };

    reset();
    // Catch layout that paints after the route swap
    const raf = requestAnimationFrame(reset);
    const t = window.setTimeout(reset, 50);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
    };
  }, [pathname, search]);

  return null;
}
