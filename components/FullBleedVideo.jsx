'use client';

import { useEffect, useRef, useState } from 'react';

const DESKTOP_CLIPS = ['/ring1_gwr_video_mvp.mp4', '/ring2_gwr_video_mvp.mp4'];
const PHONE_CLIPS = [
  '/ring1_gwr_video_mvp_b762bb31_gwr_video_mvp.mp4',
  '/ring2_gwr_video_mvp_9b96a85f_gwr_video_mvp.mp4',
];
const PHONE_MQ = '(max-width: 767px)';
const LEAD_S = 0.35;

function clipsForViewport() {
  if (typeof window === 'undefined') return DESKTOP_CLIPS;
  return window.matchMedia(PHONE_MQ).matches ? PHONE_CLIPS : DESKTOP_CLIPS;
}

export default function FullBleedVideo() {
  const layerA = useRef(null);
  const layerB = useRef(null);
  const indexRef = useRef(0);
  const layerRef = useRef('a');
  const switchingRef = useRef(false);
  const clipsRef = useRef(DESKTOP_CLIPS);
  const [activeLayer, setActiveLayer] = useState('a');

  useEffect(() => {
    const a = layerA.current;
    const b = layerB.current;
    if (!a || !b) return undefined;

    const layers = { a, b };
    const other = (key) => (key === 'a' ? 'b' : 'a');
    const mq = window.matchMedia(PHONE_MQ);

    const playOn = (layerKey, clipIndex) => {
      const clips = clipsRef.current;
      const el = layers[layerKey];
      if (el.getAttribute('src') !== clips[clipIndex]) {
        el.src = clips[clipIndex];
        el.load();
      }
      el.currentTime = 0;
      const p = el.play();
      if (p?.catch) p.catch(() => {});
    };

    const start = () => {
      const clips = clipsForViewport();
      clipsRef.current = clips;
      switchingRef.current = false;
      a.src = clips[0];
      b.src = clips[1];
      a.load();
      b.load();
      indexRef.current = 0;
      layerRef.current = 'a';
      setActiveLayer('a');
      playOn('a', 0);
    };

    const advance = () => {
      if (switchingRef.current) return;
      switchingRef.current = true;

      const clips = clipsRef.current;
      const nextIndex = (indexRef.current + 1) % clips.length;
      const nextLayer = other(layerRef.current);

      playOn(nextLayer, nextIndex);
      indexRef.current = nextIndex;
      layerRef.current = nextLayer;
      setActiveLayer(nextLayer);

      window.setTimeout(() => {
        switchingRef.current = false;
      }, 450);
    };

    const onTime = (layerKey) => () => {
      if (layerRef.current !== layerKey) return;
      const el = layers[layerKey];
      if (!el.duration || Number.isNaN(el.duration)) return;
      if (el.duration - el.currentTime > LEAD_S) return;
      advance();
    };

    const onEnded = (layerKey) => () => {
      if (layerRef.current !== layerKey) return;
      advance();
    };

    const onViewportChange = () => {
      a.pause();
      b.pause();
      start();
    };

    a.addEventListener('timeupdate', onTime('a'));
    b.addEventListener('timeupdate', onTime('b'));
    a.addEventListener('ended', onEnded('a'));
    b.addEventListener('ended', onEnded('b'));
    mq.addEventListener('change', onViewportChange);

    start();

    return () => {
      mq.removeEventListener('change', onViewportChange);
      a.removeEventListener('timeupdate', onTime('a'));
      b.removeEventListener('timeupdate', onTime('b'));
      a.removeEventListener('ended', onEnded('a'));
      b.removeEventListener('ended', onEnded('b'));
      a.pause();
      b.pause();
    };
  }, []);

  return (
    <section className="relative h-[100svh] w-full overflow-hidden bg-ink" aria-label="Film">
      <video
        ref={layerA}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          activeLayer === 'a' ? 'opacity-100' : 'opacity-0'
        }`}
        muted
        playsInline
        preload="auto"
      />
      <video
        ref={layerB}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          activeLayer === 'b' ? 'opacity-100' : 'opacity-0'
        }`}
        muted
        playsInline
        preload="auto"
      />
    </section>
  );
}
