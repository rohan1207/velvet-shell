'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function SmoothScroll({ children }) {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Native touch scroll feels better on phones; Lenis is desktop-oriented.
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    const isNarrow = window.matchMedia('(max-width: 767px)').matches;
    if (reduced || isCoarse || isNarrow) return undefined;

    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });

    window.__lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const ticker = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      gsap.ticker.remove(ticker);
      if (window.__lenis === lenis) window.__lenis = undefined;
      lenis.destroy();
    };
  }, []);

  return children;
}
