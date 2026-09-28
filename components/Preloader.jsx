'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const HOLD_MS = 5000;
/** Brand Book 2026 — Velvet Burgundy HEX #5E062A */
const BURGUNDY = '#5E062A';
const LOGO_SRC = '/logo-splash.png';

export default function Preloader() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const seen = sessionStorage.getItem('vs-preloaded');
    if (seen) {
      setShow(false);
      return undefined;
    }

    const logo = new window.Image();
    logo.decoding = 'sync';
    logo.src = LOGO_SRC;
    const bg = new window.Image();
    bg.src = '/images/landing-bg.png';

    const timer = window.setTimeout(() => {
      setShow(false);
      sessionStorage.setItem('vs-preloaded', '1');
    }, HOLD_MS);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] overflow-hidden"
          style={{ backgroundColor: BURGUNDY }}
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.9, ease: [0.65, 0, 0.35, 1] },
          }}
        >
          <div
            className="absolute inset-0 bg-cover bg-[position:50%_32%]"
            style={{ backgroundImage: "url('/images/landing-bg.png')" }}
          />

          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundColor: BURGUNDY,
              mixBlendMode: 'multiply',
              opacity: 0.55,
            }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{ backgroundColor: 'rgba(94, 6, 42, 0.38)' }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at 50% 42%, rgba(94,6,42,0.05) 0%, rgba(30,4,14,0.45) 58%, rgba(12,2,6,0.82) 100%)',
            }}
          />

          <div className="absolute inset-0 flex items-center justify-center px-6">
            <div className="relative aspect-square w-[min(62vw,300px)] sm:w-[min(48vw,340px)] md:w-[min(36vw,400px)]">
              <img
                src={LOGO_SRC}
                alt="Velvet Shell — A treasure in every reveal"
                width={800}
                height={800}
                decoding="sync"
                fetchPriority="high"
                className="h-full w-full object-contain select-none"
                style={{ mixBlendMode: 'screen' }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
