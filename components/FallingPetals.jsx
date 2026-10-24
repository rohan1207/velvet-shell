'use client';

import { useMemo } from 'react';

const PETALS = ['🌸', '✿', '❀', '💮'];

/**
 * Soft pink petals drifting down like light snow.
 * Sparse and elegant — meant for the order-success moment only.
 */
export default function FallingPetals({ count = 20 }) {
  const petals = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const left = ((i * 37) % 97) + 1.5;
      const delay = (i * 0.17) % 2.2;
      const duration = 3.4 + (i % 6) * 0.4;
      const size = 16 + (i % 5) * 3;
      const drift = (i % 2 === 0 ? 1 : -1) * (10 + (i % 5) * 5);
      const rotate = 160 + (i % 7) * 35;
      const glyph = PETALS[i % PETALS.length];
      const opacity = 0.4 + (i % 4) * 0.12;
      return { id: i, left, delay, duration, size, drift, rotate, glyph, opacity };
    });
  }, [count]);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      {petals.map((p) => (
        <span
          key={p.id}
          className="velvet-petal absolute top-[-6%] select-none will-change-transform"
          style={{
            left: `${p.left}%`,
            fontSize: `${p.size}px`,
            opacity: p.opacity,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            '--petal-drift': `${p.drift}px`,
            '--petal-rotate': `${p.rotate}deg`,
          }}
        >
          {p.glyph}
        </span>
      ))}
    </div>
  );
}
