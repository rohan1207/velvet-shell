'use client';

import { useEffect, useRef, useState } from 'react';
import SpinHintHand from './SpinHintHand';

/**
 * Fast WebGL viewer via @google/model-viewer.
 * Place your GLB at: public/model.glb  →  loads from /model.glb
 */
export default function HeroModelViewer({ src = '/model.glb' }) {
  const viewerRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [hint, setHint] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      await import('@google/model-viewer');
      if (alive) setReady(true);
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!ready || !viewerRef.current) return undefined;
    const el = viewerRef.current;

    el.src = src;
    el.alt = 'Velvet Shell jewelry — drag to spin';
    el.exposure = '1';
    el.setAttribute('camera-controls', '');
    el.setAttribute('touch-action', 'none');
    el.setAttribute('disable-zoom', '');
    el.setAttribute('disable-pan', '');
    el.setAttribute('disable-tap', '');
    el.setAttribute('auto-rotate', '');
    el.setAttribute('auto-rotate-delay', '0');
    el.setAttribute('rotation-per-second', '18deg');
    el.setAttribute('interaction-prompt', 'none');
    el.setAttribute('shadow-intensity', '0.35');
    el.setAttribute('shadow-softness', '1');
    el.setAttribute('environment-image', 'neutral');
    // Fixed pitch + distance: only horizontal spin (yaw)
    el.setAttribute('camera-orbit', '0deg 75deg 100%');
    el.setAttribute('field-of-view', '30deg');
    el.setAttribute('min-field-of-view', '30deg');
    el.setAttribute('max-field-of-view', '30deg');
    el.setAttribute('min-camera-orbit', '-Infinity 75deg 100%');
    el.setAttribute('max-camera-orbit', 'Infinity 75deg 100%');
    el.setAttribute('interpolation-decay', '90');
    el.setAttribute('orbit-sensitivity', '0.85');

    const hide = () => setHint(false);
    const onError = () => setFailed(true);
    const onLoad = () => setFailed(false);
    const blockWheel = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };

    el.addEventListener('pointerdown', hide);
    el.addEventListener('camera-change', hide);
    el.addEventListener('error', onError);
    el.addEventListener('load', onLoad);
    el.addEventListener('wheel', blockWheel, { passive: false });

    const autoHide = setTimeout(hide, 7000);
    return () => {
      clearTimeout(autoHide);
      el.removeEventListener('pointerdown', hide);
      el.removeEventListener('camera-change', hide);
      el.removeEventListener('error', onError);
      el.removeEventListener('load', onLoad);
      el.removeEventListener('wheel', blockWheel);
    };
  }, [ready, src]);

  return (
    <div className="relative h-full min-h-[320px] w-full">
      {ready ? (
        <model-viewer
          ref={viewerRef}
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent',
            transform: 'scale(0.92)',
            transformOrigin: 'center center',
            '--progress-bar-color': '#D4AF64',
            '--progress-mask': 'transparent',
          }}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-px w-16 origin-left bg-gold/50 gold-line" />
        </div>
      )}

      {failed && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <div className="h-44 w-44 rounded-full border border-dashed border-ink/15 md:h-64 md:w-64" />
          <p className="mt-6 text-[10px] tracking-[0.28em] text-stone uppercase">Add public/model.glb</p>
        </div>
      )}

      {hint && !failed && (
        <SpinHintHand className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 md:bottom-10" />
      )}
    </div>
  );
}
