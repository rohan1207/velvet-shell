'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { HOME_BANNER_SLIDES } from '@/lib/home-banner-slides';
import ResponsiveBannerImage from '@/components/ResponsiveBannerImage';

const HOLD_MS = 1900;
const FRAMES = HOME_BANNER_SLIDES;

function ArrowCircle({ className = '', iconClassName = 'h-3.5 w-3.5' }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full border border-ink/10 bg-white text-burgundy ${className}`}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className={iconClassName} fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M7 17L17 7M10 7h7v7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

/**
 * Hero3 rings card — cycles every BannerShowcase homepage slider image.
 */
export default function HeroEarringReel({ className = '', showBadge = true, compact = false }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % FRAMES.length);
    }, HOLD_MS);
    return () => window.clearInterval(timer);
  }, []);

  const frame = FRAMES[index];

  return (
    <Link
      href={frame.href}
      data-cursor="Shop"
      className={`group absolute inset-0 overflow-hidden bg-cream ${className}`}
      aria-label={frame.alt}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={frame.id}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.45, 0.05, 0.25, 1] }}
        >
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1 }}
            animate={{ scale: 1.06 }}
            transition={{ duration: HOLD_MS / 1000, ease: 'linear' }}
          >
            <ResponsiveBannerImage
              src={frame.image}
              alt={frame.alt}
              priority={index === 0}
              sizes="(max-width: 768px) 50vw, 28vw"
              className="object-cover object-center"
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {showBadge && (
        <span
          className={`absolute z-10 inline-flex items-center rounded-full bg-ivory/95 shadow-sm ${
            compact
              ? 'bottom-2 left-2 gap-1 py-1 pr-1 pl-2.5'
              : 'bottom-3 left-3 gap-2 py-2 pr-2 pl-3.5'
          }`}
        >
          <span
            className={`font-semibold tracking-[0.12em] text-ink uppercase ${
              compact ? 'text-[8px]' : 'text-[9px] tracking-[0.14em]'
            }`}
          >
            {frame.label}
          </span>
          <ArrowCircle
            className={compact ? 'h-5 w-5' : 'h-8 w-8'}
            iconClassName={compact ? 'h-2.5 w-2.5' : 'h-3.5 w-3.5'}
          />
        </span>
      )}
    </Link>
  );
}
