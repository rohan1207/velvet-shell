'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';

/** On-model shots from the real earring catalog — not placeholder reel art. */
const FRAMES = [
  {
    src: '/earrings/catalog/wear-phalaenopsis-hoop-earrings.jpg',
    alt: 'Model wearing Phalaenopsis hoop earrings',
  },
  {
    src: '/earrings/catalog/wear-dragonfly-baroque-pearl-earrings.jpg',
    alt: 'Model wearing dragonfly baroque pearl earrings',
  },
  {
    src: '/earrings/catalog/wear-forget-me-not-hoop-earrings.jpg',
    alt: 'Model wearing forget-me-not hoop earrings',
  },
  {
    src: '/earrings/catalog/wear-iris-flower-dangle-earrings.jpg',
    alt: 'Model wearing iris flower dangle earrings',
  },
];

const HOLD_MS = 3200;

/**
 * Left bento card media: cinematic zoom/crossfade of real earring wear shots.
 */
export default function HeroEarringReel({ className = '' }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % FRAMES.length);
    }, HOLD_MS);
    return () => window.clearInterval(timer);
  }, []);

  const frame = FRAMES[index];

  return (
    <div className={`absolute inset-0 overflow-hidden bg-cream ${className}`}>
      <AnimatePresence initial={false}>
        <motion.div
          key={frame.src}
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
              src={frame.src}
              alt={frame.alt}
              fill
              sizes="28vw"
              priority={index === 0}
              className="object-cover object-center"
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
