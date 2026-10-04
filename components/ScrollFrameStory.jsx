'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const FRAME_COUNT = 29;
const FRAME_PATH = (i) =>
  `/frames/ezgif-frame-${String(i).padStart(3, '0')}.png`;

/** Max frames advanced per animation tick — keeps every frame visible even on fast scroll */
const MAX_FRAME_STEP = 0.85;

function drawCover(ctx, img, width, height) {
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  if (!iw || !ih || !width || !height) return;

  const scale = Math.max(width / iw, height / ih);
  const sw = iw * scale;
  const sh = ih * scale;
  const x = (width - sw) / 2;
  const y = (height - sh) / 2;
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(img, x, y, sw, sh);
}

export default function ScrollFrameStory() {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const framesRef = useRef([]);
  const frameIndexRef = useRef(0);
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState(false);

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
                  // decode optional
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
        if (!cancelled) setLoadError(true);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) return undefined;

    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return undefined;

    const ctx = canvas.getContext('2d', { alpha: false });
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
      frameIndexRef.current = clamped;
      const img = frames[clamped];
      const parent = canvas.parentElement;
      if (!img || !parent) return;
      drawCover(ctx, img, parent.clientWidth, parent.clientHeight);
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = parent.clientWidth;
      const h = parent.clientHeight;
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

      if (Math.abs(diff) <= 0.001) {
        displayFrame = target;
      } else if (Math.abs(diff) > 1) {
        // Fast scroll / big progress jumps: walk frame-by-frame, never skip
        displayFrame += Math.sign(diff) * Math.min(Math.abs(diff), MAX_FRAME_STEP);
      } else {
        displayFrame += diff * 0.28;
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
          trigger: root,
          start: 'top top',
          // Longer distance = harder to blast through the sequence
          end: () => `+=${Math.round(Math.max(window.innerHeight * 4.5, FRAME_COUNT * 90))}`,
          pin: true,
          scrub: 1.15,
          anticipatePin: 1,
          fastScrollEnd: false,
          invalidateOnRefresh: true,
          onRefresh: (self) => {
            targetFrame.value = self.progress * (FRAME_COUNT - 1);
          },
          id: 'scroll-frame-story',
        },
      });
    }, root);

    const onResize = () => {
      resize();
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', onResize);
    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 220);

    return () => {
      clearTimeout(refreshTimer);
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      ctxGsap.revert();
    };
  }, [ready]);

  return (
    <section
      ref={rootRef}
      className="relative z-[1] isolate box-border flex h-[100svh] flex-col overflow-hidden bg-[#ffffff] pt-[6.25rem] md:pt-[7.1rem]"
      style={{ backgroundColor: '#ffffff' }}
    >
      <div className="mx-auto grid h-full min-h-0 w-full max-w-[1600px] grid-cols-1 bg-[#ffffff] lg:grid-cols-2">
        <div
          className="relative isolate min-h-[42svh] bg-[#ffffff] lg:min-h-0 lg:h-full"
          style={{ backgroundColor: '#ffffff' }}
        >
          <canvas
            ref={canvasRef}
            className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${
              ready ? 'opacity-100' : 'opacity-0'
            }`}
            aria-hidden
          />
          {!ready && !loadError && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#ffffff]">
              <p className="font-label text-[11px] tracking-[0.22em] text-ink/85 uppercase">
                Preparing the reveal
              </p>
            </div>
          )}
          {loadError && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#ffffff] px-6 text-center">
              <p className="text-sm font-light text-ink/85">Unable to load the sequence.</p>
            </div>
          )}
        </div>

        <div className="relative flex h-full min-h-0 flex-col overflow-hidden bg-[#FAFAFA] px-5 pt-4 pb-5 md:px-10 md:pt-5 md:pb-6 lg:px-12 lg:pt-6 xl:px-16">
          <div
            aria-hidden
            className="pointer-events-none absolute top-8 right-8 h-24 w-24 rounded-full border border-gold/15 md:top-10 md:right-12 md:h-32 md:w-32"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute top-[2.65rem] right-[2.65rem] h-12 w-12 rounded-full border border-gold/10 md:top-[3.35rem] md:right-[4.1rem] md:h-16 md:w-16"
          />

          <div className="relative mt-[4vh] mb-auto w-full max-w-md lg:mt-[5vh] lg:max-w-lg">
            <div className="flex items-center gap-3">
              <span className="h-px w-7 bg-gold/80" />
              <p className="font-label text-gold">The house</p>
            </div>

            <h2 className="font-display mt-2.5 text-[1.75rem] leading-[1.1] text-ink md:text-[2.15rem] xl:text-[2.35rem]">
              Softly Held.
              <span className="mt-1 block text-ink/80">Thoughtfully Made.</span>
            </h2>
            <p className="mt-3 max-w-[34ch] text-[13.5px] font-light leading-[1.65] text-ink/85 md:text-[14.5px] md:leading-[1.7]">
              Velvet Shell takes its name from the quiet moment before a reveal — when something beautiful
              is still held within. Designed with restraint, shaped with intention.
            </p>

            <div className="my-4 flex items-center gap-3 md:my-5">
              <div className="h-px flex-1 bg-gradient-to-r from-gold/70 via-ink/10 to-transparent" />
              <span className="font-label text-[9px] tracking-[0.2em] text-ink/80">Materials</span>
            </div>

            <h3 className="font-display text-[1.3rem] leading-[1.15] text-ink md:text-[1.65rem]">
              Made Of Considered Details.
            </h3>
            <p className="mt-2.5 max-w-[38ch] text-[13.5px] font-light leading-[1.65] text-ink/85 md:text-[14.5px] md:leading-[1.7]">
              Silver, 18K gold-plated finishes and freshwater pearls — each chosen for how it looks, feels
              and lives with you.
            </p>

            <ul className="mt-4 space-y-0 md:mt-5">
              {[
                {
                  n: '01',
                  title: '925 Silver',
                  line: 'Clean, sculptural, enduring.',
                },
                {
                  n: '02',
                  title: '18K Gold-Plated',
                  line: 'Warmth with a softer glow.',
                },
                {
                  n: '03',
                  title: 'Freshwater Pearls',
                  line: 'Natural luminosity, understated.',
                },
              ].map((item) => (
                <li
                  key={item.n}
                  className="group flex items-baseline gap-4 border-t border-ink/10 py-2.5 transition-colors duration-500 first:border-t-0 first:pt-0 last:pb-0 hover:border-gold/30 md:py-3"
                >
                  <span className="font-label w-6 shrink-0 text-[9px] tracking-[0.16em] text-gold/80 transition-colors group-hover:text-gold">
                    {item.n}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[13px] font-medium tracking-[-0.01em] text-ink md:text-sm">
                      {item.title}
                    </span>
                    <span className="mt-0.5 block text-[12.5px] font-light text-ink/85 md:text-[13px]">
                      {item.line}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
