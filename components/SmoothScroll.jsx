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
    if (reduced) return undefined;

    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });

    lenis.on('scroll', ScrollTrigger.update);
    const ticker = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      gsap.ticker.remove(ticker);
      lenis.destroy();
    };
  }, []);

  return children;
}
