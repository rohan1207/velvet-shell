'use client';

import { useEffect, useRef, useState } from 'react';

const CLIPS = ['/ring1.mp4', '/ring2.mp4'];
const LEAD_S = 0.35;

export default function FullBleedVideo() {
  const layerA = useRef(null);
  const layerB = useRef(null);
  const indexRef = useRef(0);
  const layerRef = useRef('a');
  const switchingRef = useRef(false);
  const [activeLayer, setActiveLayer] = useState('a');

  useEffect(() => {
    const a = layerA.current;
    const b = layerB.current;
    if (!a || !b) return undefined;

    const layers = { a, b };
    const other = (key) => (key === 'a' ? 'b' : 'a');

    const playOn = (layerKey, clipIndex) => {
      const el = layers[layerKey];
      if (el.getAttribute('src') !== CLIPS[clipIndex]) {
        el.src = CLIPS[clipIndex];
        el.load();
      }
      el.currentTime = 0;
      const p = el.play();
      if (p?.catch) p.catch(() => {});
    };

    a.src = CLIPS[0];
    b.src = CLIPS[1];
    a.load();
    b.load();

    indexRef.current = 0;
    layerRef.current = 'a';
    setActiveLayer('a');
    playOn('a', 0);

    const advance = () => {
      if (switchingRef.current) return;
      switchingRef.current = true;

      const nextIndex = (indexRef.current + 1) % CLIPS.length;
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

    a.addEventListener('timeupdate', onTime('a'));
    b.addEventListener('timeupdate', onTime('b'));
    a.addEventListener('ended', onEnded('a'));
    b.addEventListener('ended', onEnded('b'));

    return () => {
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
