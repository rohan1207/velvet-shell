'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';

const notes = [
  {
    id: 'nacre',
    index: '01',
    title: 'Nacre',
    line: 'Irregular pearl, chosen for kinship — never for match.',
    href: '/shop?collection=pearls-of-nacre',
  },
  {
    id: 'gold',
    index: '02',
    title: 'Champagne gold',
    line: 'Warm 18k with a quiet sheen. Made to age with the hand.',
    href: '/shop?category=rings',
  },
  {
    id: 'pearl',
    index: '03',
    title: 'Baroque pearl',
    line: 'Sculptural drops and strands — light that will not sit still.',
    href: '/shop?category=earrings',
  },
  {
    id: 'jaipur',
    index: '04',
    title: 'Jaipur atelier',
    line: 'Daylight benches. Slow hands. No factory brief.',
    href: '/about',
  },
  {
    id: 'paris',
    index: '05',
    title: 'Paris salon',
    line: 'Private viewings by appointment — never by accident.',
    href: '/contact',
  },
  {
    id: 'client',
    index: '06',
    title: 'Private client',
    line: 'Collars, signets, and pieces that will not be repeated.',
    href: '/contact',
  },
];

const EASE = [0.22, 1, 0.36, 1];

export default function AtelierRibbon() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return undefined;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % notes.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [paused]);

  const current = notes[active];

  return (
    <section
      className="relative border-y border-ink/8 bg-pearl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        setPaused(false);
      }}
    >
      <div className="mx-auto max-w-[1600px]">
        {/* Top meta row */}
        <div className="flex items-center justify-between gap-6 border-b border-ink/6 px-5 py-3.5 md:px-10">
          <div className="flex items-center gap-3">
            <span className="h-px w-6 bg-gold" />
            <p className="text-[10px] font-medium tracking-[0.32em] text-ink/45 uppercase">House notes</p>
          </div>
          <p className="hidden text-[10px] tracking-[0.22em] text-stone uppercase sm:block">
            Materials · Ateliers · Appointment
          </p>
          <Link
            href="/about"
            className="text-[10px] font-medium tracking-[0.22em] text-ink/55 uppercase transition-colors duration-500 hover:text-[#5E062A]"
          >
            The house →
          </Link>
        </div>

        {/* Interactive index */}
        <div className="flex overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {notes.map((note, i) => {
            const isActive = i === active;
            return (
              <button
                key={note.id}
                type="button"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                className={`group relative flex min-w-[9.5rem] flex-1 flex-col items-start gap-2 border-r border-ink/6 px-5 py-6 text-left last:border-r-0 md:min-w-0 md:px-8 md:py-7 ${
                  isActive ? 'bg-ivory' : 'bg-transparent'
                } transition-colors duration-500`}
              >
                <span
                  className={`text-[10px] tracking-[0.28em] uppercase transition-colors duration-500 ${
                    isActive ? 'text-gold' : 'text-ink/30'
                  }`}
                >
                  {note.index}
                </span>
                <span
                  className={`font-display text-[1.2rem] font-semibold leading-none tracking-[-0.03em] transition-colors duration-500 md:text-[1.35rem] ${
                    isActive ? 'text-[#5E062A]' : 'text-ink/40 group-hover:text-ink/70'
                  }`}
                >
                  {note.title}
                </span>

                {/* Active underline */}
                <span
                  className={`mt-1 h-px w-full origin-left bg-[#5E062A]/70 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isActive ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Detail strip */}
        <div className="flex min-h-[3.25rem] items-center justify-between gap-6 border-t border-ink/6 bg-ivory/70 px-5 py-3.5 md:px-10">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={current.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="max-w-2xl text-[13px] leading-relaxed text-ink/65 md:text-sm"
            >
              <span className="mr-2 font-display text-[15px] font-semibold tracking-[-0.02em] text-[#5E062A]">
                {current.title}.
              </span>
              {current.line}
            </motion.p>
          </AnimatePresence>

          <Link
            href={current.href}
            className="shrink-0 text-[10px] font-medium tracking-[0.2em] text-ink/50 uppercase transition-colors duration-500 hover:text-[#5E062A]"
          >
            Explore
          </Link>
        </div>
      </div>
    </section>
  );
}
