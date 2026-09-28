'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';

const FRAMES = [
  '/images/earring-reel/01.png',
  '/images/earring-reel/02.png',
  '/images/earring-reel/03.png',
];

const VIDEO_SRC = '/videos/earrings-hero.mp4';
const HOLD_MS = 3200;

/**
 * Left bento card media: prefers a real MP4 at /videos/earrings-hero.mp4,
 * otherwise plays a cinematic zoom/crossfade reel of earring close-ups.
 */
export default function HeroEarringReel({ className = '' }) {
  const [useVideo, setUseVideo] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const probe = document.createElement('video');
    probe.preload = 'metadata';
    probe.src = VIDEO_SRC;
    const onReady = () => {
      if (!cancelled && probe.videoWidth > 0) setUseVideo(true);
    };
    const onFail = () => {
      if (!cancelled) setUseVideo(false);
    };
    probe.addEventListener('loadeddata', onReady);
    probe.addEventListener('error', onFail);
    // Some browsers only fire loadedmetadata for short files
    probe.addEventListener('loadedmetadata', () => {
      if (!cancelled && Number.isFinite(probe.duration) && probe.duration > 0) {
        setUseVideo(true);
      }
    });
    return () => {
      cancelled = true;
      probe.removeEventListener('loadeddata', onReady);
      probe.removeEventListener('error', onFail);
      probe.removeAttribute('src');
      probe.load();
    };
  }, []);

  useEffect(() => {
    if (useVideo) return undefined;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % FRAMES.length);
    }, HOLD_MS);
    return () => window.clearInterval(timer);
  }, [useVideo]);

  if (useVideo) {
    return (
      <video
        className={`absolute inset-0 h-full w-full object-cover ${className}`}
        src={VIDEO_SRC}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-label="Model wearing champagne-gold earrings"
      />
    );
  }

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <AnimatePresence initial={false}>
        <motion.div
          key={FRAMES[index]}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 1.15, ease: [0.45, 0.05, 0.25, 1] }}
        >
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1 }}
            animate={{ scale: 1.08 }}
            transition={{ duration: HOLD_MS / 1000, ease: 'linear' }}
          >
            <Image
              src={FRAMES[index]}
              alt="Champagne-gold earring detail"
              fill
              sizes="28vw"
              priority={index === 0}
              className="object-cover"
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
