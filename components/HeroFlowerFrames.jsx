'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const FRAME_COUNT = 60;
const FRAME_PATH = (i) => `/flower-frames/ezgif-frame-${String(i).padStart(3, '0')}.png`;
/** Keep frames readable on a short pin (≈1 viewport / 3–4 scrolls) */
const MAX_FRAME_STEP = 1.35;

function getChromeOffset() {
  // Prefer live header height so pin sits flush under promo + navbar
  const header = document.querySelector('[data-site-header]');
  if (header) {
    const h = header.getBoundingClientRect().height;
    if (h > 0) return Math.ceil(h);
  }
  const root = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  const styles = getComputedStyle(document.documentElement);
  const promoRaw = styles.getPropertyValue('--site-promo-h').trim();
  const navRaw = styles.getPropertyValue('--site-nav-h').trim();
  const toPx = (raw, fallbackRem) => {
    const n = parseFloat(raw);
    if (!Number.isFinite(n)) return fallbackRem * root;
    if (raw.endsWith('rem')) return n * root;
    if (raw.endsWith('px')) return n;
    return n * root; // unitless treated as rem from our :root vars
  };
  return Math.ceil(toPx(promoRaw, 2.5) + toPx(navRaw, 5.25));
}

/** Larger bloom — fill the flower slot with almost no padding */
function drawBloom(ctx, img, width, height) {
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  if (!iw || !ih || !width || !height) return;

  // Scale up past strict contain so the bloom reads larger in the card
  const scale = Math.min(width / iw, height / ih) * 1.34;
  const sw = iw * scale;
  const sh = ih * scale;
  const x = (width - sw) / 2;
  const y = (height - sh) * 0.58;

  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(img, x, y, sw, sh);
}

/**
 * Scroll-locked hibiscus bloom.
 * Pins the Hero3 section while scrubbing 60 frames, unlocks after —
 * reverses cleanly on scroll up.
 */
export default function HeroFlowerFrames({ scrollRoot, className = '' }) {
  const hostRef = useRef(null);
  const canvasRef = useRef(null);
  const framesRef = useRef([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const loaded = await Promise.all(
          Array.from({ length: FRAME_COUNT }, (_, i) => {
            const index = i + 1;
            return new Promise((resolve, reject) => {
              const img = new window.Image();
              img.decoding = 'async';
              img.src = FRAME_PATH(index);
              img.onload = async () => {
                try {
                  if (img.decode) await img.decode();
                } catch {
                  // optional
                }
                resolve(img);
              };
              img.onerror = () => reject(new Error(`Failed ${FRAME_PATH(index)}`));
            });
          }),
        );
        if (cancelled) return;
        framesRef.current = loaded;
        setReady(true);
      } catch {
        if (!cancelled) setReady(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) return undefined;

    const host = hostRef.current;
    const canvas = canvasRef.current;
    const triggerEl = scrollRoot?.current || host;
    if (!host || !canvas || !triggerEl) return undefined;

    const ctx = canvas.getContext('2d', { alpha: true });
    const frames = framesRef.current;
    if (!ctx || !frames.length) return undefined;

    const targetFrame = { value: 0 };
    let displayFrame = 0;
    let lastDrawn = -1;
    let rafId = 0;

    const paint = (index) => {
      const clamped = Math.max(0, Math.min(FRAME_COUNT - 1, index));
      if (clamped === lastDrawn) return;
      lastDrawn = clamped;
      const img = frames[clamped];
      if (!img) return;
      drawBloom(ctx, img, host.clientWidth, host.clientHeight);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = host.clientWidth;
      const h = host.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      lastDrawn = -1;
      paint(Math.round(displayFrame));
    };

    resize();

    const tick = () => {
      const target = targetFrame.value;
      const diff = target - displayFrame;

      if (Math.abs(diff) <= 0.0008) {
        displayFrame = target;
      } else if (Math.abs(diff) > 1) {
        displayFrame += Math.sign(diff) * Math.min(Math.abs(diff), MAX_FRAME_STEP);
      } else {
        displayFrame += diff * 0.38;
      }

      paint(Math.round(displayFrame));
      rafId = window.requestAnimationFrame(tick);
    };
    rafId = window.requestAnimationFrame(tick);

    const ctxGsap = gsap.context(() => {
      gsap.to(targetFrame, {
        value: FRAME_COUNT - 1,
        ease: 'none',
        scrollTrigger: {
          trigger: triggerEl,
          // Lock flush under the fixed site header (promo + navbar)
          start: () => `top ${getChromeOffset()}`,
          // Short pin — full bloom in ~3–4 scroll ticks, not a long journey
          end: () => `+=${Math.round(window.innerHeight * 1.05)}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.85,
          anticipatePin: 1,
          fastScrollEnd: true,
          invalidateOnRefresh: true,
          onRefresh: (self) => {
            targetFrame.value = self.progress * (FRAME_COUNT - 1);
            displayFrame = targetFrame.value;
            lastDrawn = -1;
            paint(Math.round(displayFrame));
          },
          id: 'hero-flower-pin',
        },
      });
    }, triggerEl);

    const onResize = () => {
      resize();
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', onResize);
    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 280);

    return () => {
      clearTimeout(refreshTimer);
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      ctxGsap.revert();
    };
  }, [ready, scrollRoot]);

  return (
    <div ref={hostRef} className={`relative h-full w-full overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${
          ready ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden
      />
      {!ready ? (
        <div className="absolute inset-0 flex items-center justify-center opacity-75">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/flower-frames/ezgif-frame-001.png"
            alt=""
            className="h-auto max-h-[95%] w-[95%] object-contain"
            aria-hidden
          />
        </div>
      ) : null}
    </div>
  );
}
