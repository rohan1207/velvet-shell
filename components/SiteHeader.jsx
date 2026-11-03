'use client';

import { useEffect, useRef } from 'react';
import PromoMarquee from '@/components/PromoMarquee';
import Navbar from '@/components/Navbar';

/**
 * Keep --site-header-h equal to the painted fixed header so sticky shop
 * toolbars can sit flush (CSS rem estimates drifted by ~2px and left a gap).
 */
export default function SiteHeader() {
  const rootRef = useRef(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof window === 'undefined') return undefined;

    const publish = () => {
      const h = Math.ceil(el.getBoundingClientRect().height);
      if (h > 0) {
        document.documentElement.style.setProperty('--site-header-h', `${h}px`);
      }
    };

    publish();
    const ro = new ResizeObserver(publish);
    ro.observe(el);
    window.addEventListener('resize', publish);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', publish);
    };
  }, []);

  return (
    <div ref={rootRef} data-site-header className="fixed inset-x-0 top-0 z-50">
      {/* Paint into the iOS notch / status bar so Safari doesn’t leave a blank gap */}
      <div className="bg-[#f7f4ef] pt-[env(safe-area-inset-top,0px)]">
        <PromoMarquee />
      </div>
      <Navbar />
    </div>
  );
}
