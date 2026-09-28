'use client';

import { motion } from 'framer-motion';

/** Illustrated hand + arc — hints the 3D model can be spun left / right */
export default function SpinHintHand({ className = '' }) {
  return (
    <motion.div
      className={`pointer-events-none select-none ${className}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      aria-hidden
    >
      <div className="relative flex flex-col items-center">
        <svg width="120" height="72" viewBox="0 0 120 72" fill="none" className="text-ink/55">
          {/* left arrow */}
          <motion.path
            d="M28 28 H14"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            animate={{ x: [-2, 2, -2] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.path
            d="M18 22 L12 28 L18 34"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            animate={{ x: [-2, 2, -2] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* right arrow */}
          <motion.path
            d="M92 28 H106"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            animate={{ x: [2, -2, 2] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.path
            d="M102 22 L108 28 L102 34"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            animate={{ x: [2, -2, 2] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* drag arc */}
          <path
            d="M34 22 C48 10, 72 10, 86 22"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeDasharray="3 4"
            opacity="0.55"
          />

          {/* hand — simplified editorial illustration */}
          <motion.g
            animate={{ x: [-10, 10, -10] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            {/* palm */}
            <path
              d="M52 34 C50 30, 51 26, 55 24 C58 22, 62 23, 64 26 L66 30 C68 28, 72 28, 74 32 C76 36, 75 42, 72 46 C68 52, 60 54, 54 50 C50 47, 48 40, 52 34 Z"
              fill="currentColor"
              fillOpacity="0.92"
            />
            {/* thumb */}
            <path
              d="M54 36 C48 34, 44 30, 46 26 C48 23, 52 24, 54 28"
              stroke="currentColor"
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
              opacity="0.95"
            />
            {/* index finger */}
            <path
              d="M64 26 C65 18, 66 12, 68 10 C70 8, 72 10, 71 14 L68 26"
              fill="currentColor"
              fillOpacity="0.95"
            />
            {/* middle */}
            <path
              d="M68 28 C70 20, 72 14, 74 12 C76 10, 78 12, 77 16 L72 30"
              fill="currentColor"
              fillOpacity="0.9"
            />
            {/* ring */}
            <path
              d="M71 32 C73 26, 75 22, 77 20 C79 18, 81 20, 80 24 L74 34"
              fill="currentColor"
              fillOpacity="0.88"
            />
            {/* pinky */}
            <path
              d="M73 36 C75 32, 77 29, 79 28 C81 27, 82 29, 81 32 L76 38"
              fill="currentColor"
              fillOpacity="0.85"
            />
            {/* cuff / sleeve hint */}
            <path
              d="M54 48 C56 54, 62 56, 68 52"
              stroke="currentColor"
              strokeWidth="1.1"
              strokeLinecap="round"
              opacity="0.45"
            />
          </motion.g>
        </svg>
        <p className="mt-1 text-[9px] tracking-[0.32em] text-stone uppercase">Drag to spin</p>
      </div>
    </motion.div>
  );
}
