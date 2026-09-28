'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const AUTO_MS = 2800;
const EASE = [0.45, 0.05, 0.25, 1];

const slides = [
  {
    id: 'earrings',
    label: 'Earrings',
    index: '01',
    eyebrow: 'Shell Edit',
    titleLead: 'Light that falls',
    titleAccent: 'like tide.',
    description: 'Sculptural drops in champagne gold and baroque pearl — worn like a soft pulse of light.',
    cta: 'Shop earrings',
    href: '/shop?category=earrings',
    image: '/images/slide-earrings.png',
    alt: 'Campaign banner — gold and pearl earrings',
  },
  {
    id: 'necklace',
    label: 'Necklaces',
    index: '02',
    eyebrow: 'Shell Edit',
    titleLead: 'A collar like',
    titleAccent: 'a chamber.',
    description: 'Architectural gold and irregular nacre — a quiet architecture for the collarbone.',
    cta: 'Shop necklaces',
    href: '/shop?category=necklaces',
    image: '/images/slide-necklace.png',
    alt: 'Campaign banner — gold and pearl collar necklace',
  },
  {
    id: 'rings',
    label: 'Rings',
    index: '03',
    eyebrow: 'Shell Edit',
    titleLead: 'A seal of',
    titleAccent: 'quiet gold.',
    description: 'Signets and stacks with weight you feel — never noise, only presence.',
    cta: 'Shop rings',
    href: '/shop?category=rings',
    image: '/images/slide-rings.png',
    alt: 'Campaign banner — champagne gold rings',
  },
  {
    id: 'bracelets',
    label: 'Bracelets',
    index: '04',
    eyebrow: 'Shell Edit',
    titleLead: 'Foam and metal,',
    titleAccent: 'worn softly.',
    description: 'Pearl lines and sculptural cuffs — a soft conversation for the wrist.',
    cta: 'Shop bracelets',
    href: '/shop?category=bracelets',
    image: '/images/slide-bracelets.png',
    alt: 'Campaign banner — pearl bracelet and gold cuff',
  },
];

export default function HeroBanners() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const locked = useRef(false);

  const goTo = useCallback(
    (next, dir = 1) => {
      if (locked.current) return;
      locked.current = true;
      setDirection(dir);
      setIndex(((next % slides.length) + slides.length) % slides.length);
      setProgressKey((k) => k + 1);
      window.setTimeout(() => {
        locked.current = false;
      }, 900);
    },
    []
  );

  const next = useCallback(() => goTo(index + 1, 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1, -1), [goTo, index]);

  useEffect(() => {
    if (paused) return undefined;
    const timer = window.setInterval(() => {
      goTo(index + 1, 1);
    }, AUTO_MS);
    return () => window.clearInterval(timer);
  }, [paused, index, goTo]);

  const slide = slides[index];

  return (
    <section
      className="hero relative h-[100svh] min-h-[680px] overflow-hidden bg-[#ebe4d8]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Stacked slides — crossfade + soft lateral drift, never blank */}
      <div className="absolute inset-0">
        {slides.map((item, i) => {
          const active = i === index;
          return (
            <motion.div
              key={item.id}
              className="absolute inset-0"
              initial={false}
              animate={{
                opacity: active ? 1 : 0,
                x: active ? 0 : direction > 0 ? -28 : 28,
                zIndex: active ? 2 : 1,
              }}
              transition={{ duration: 1.05, ease: EASE }}
              style={{ pointerEvents: active ? 'auto' : 'none' }}
            >
              <Image
                src={item.image}
                alt={item.alt}
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover object-[68%_center] md:object-[72%_center]"
              />
            </motion.div>
          );
        })}
      </div>

      {/* Soft left wash for type — no hard flash */}
      <div className="pointer-events-none absolute inset-0 z-[3] bg-gradient-to-r from-[#ebe4d8]/95 via-[#ebe4d8]/55 to-transparent md:from-[#ebe4d8]/92 md:via-[#ebe4d8]/38 md:w-[62%] md:to-transparent" />
      <div className="pointer-events-none absolute inset-0 z-[3] bg-gradient-to-t from-[#2D2B2B]/20 via-transparent to-transparent" />

      {/* Left editorial panel */}
      <div className="absolute inset-0 z-10 flex items-center pt-20 md:pt-24">
        <div className="mx-auto flex w-full max-w-[1600px] items-stretch gap-8 px-5 md:px-10">
          {/* Vertical brand rail */}
          <div className="hidden shrink-0 flex-col items-center justify-center gap-6 pt-8 md:flex">
            <span className="h-16 w-px bg-gradient-to-b from-transparent via-[#5E062A]/45 to-transparent" />
            <p
              className="font-display text-[11px] tracking-[0.42em] text-[#5E062A]/55 uppercase"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              Velvet Shell
            </p>
            <span className="h-16 w-px bg-gradient-to-b from-transparent via-[#D4AF64]/55 to-transparent" />
          </div>

          <div className="relative max-w-xl pb-24 pt-40 md:max-w-[36rem] md:pb-16 md:pt-40">
            <AnimatePresence initial={false}>
              <motion.div
                key={slide.id}
                className="absolute inset-x-0 top-0"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.75, ease: EASE }}
              >
                <div className="flex items-center gap-4">
                  <span className="font-display text-5xl leading-none tracking-[-0.04em] text-[#5E062A]/18 md:text-6xl">
                    {slide.index}
                  </span>
                  <div>
                    <p className="text-[10px] font-medium tracking-[0.36em] text-[#D4AF64] uppercase">
                      {slide.eyebrow}
                    </p>
                    <p className="mt-1 text-[11px] tracking-[0.22em] text-[#2D2B2B]/45 uppercase">{slide.label}</p>
                  </div>
                </div>

                <h1 className="font-display mt-7 text-[2.85rem] leading-[1.08] tracking-[-0.02em] text-ink sm:text-5xl md:text-[3.75rem] lg:text-[4.25rem]">
                  <span className="block">{slide.titleLead}</span>
                  <span className="font-display-italic mt-1 block text-burgundy">{slide.titleAccent}</span>
                </h1>

                <div className="mt-7 flex items-start gap-4">
                  <span className="mt-2 h-px w-10 shrink-0 bg-[#D4AF64]/70" />
                  <p className="max-w-md text-[15px] leading-[1.75] text-[#2D2B2B]/72 md:text-[16px]">
                    {slide.description}
                  </p>
                </div>

                <div className="mt-9 flex flex-wrap items-center gap-3">
                  <Link
                    href={slide.href}
                    data-cursor="Shop"
                    className="inline-flex items-center rounded-full bg-[#5E062A] px-8 py-3.5 text-[12px] font-semibold tracking-[0.14em] text-white uppercase transition-transform duration-500 hover:scale-[1.02]"
                  >
                    {slide.cta}
                  </Link>
                  <Link
                    href="/lookbook"
                    className="inline-flex items-center gap-2 rounded-full border border-[#2D2B2B]/12 bg-white/40 px-6 py-3.5 text-[12px] font-medium tracking-[0.14em] text-[#2D2B2B] uppercase transition-colors duration-500 hover:bg-white/70"
                  >
                    The lookbook
                    <span aria-hidden className="text-[#D4AF64]">
                      →
                    </span>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
            {/* Spacer so absolute text stack keeps layout height */}
            <div className="invisible pointer-events-none" aria-hidden>
              <div className="flex items-center gap-4">
                <span className="font-display text-5xl md:text-6xl">00</span>
                <div>
                  <p className="text-[10px] tracking-[0.36em] uppercase">Shell Edit</p>
                  <p className="mt-1 text-[11px] tracking-[0.22em] uppercase">Earrings</p>
                </div>
              </div>
              <h1 className="font-display mt-7 text-[2.85rem] leading-[1.02] sm:text-5xl md:text-[3.75rem] lg:text-[4.25rem]">
                <span className="block font-semibold">Foam and metal,</span>
                <span className="mt-1 block font-semibold">worn softly.</span>
              </h1>
              <div className="mt-7 flex gap-4">
                <span className="mt-2 h-px w-10" />
                <p className="max-w-md text-[15px] leading-[1.75] md:text-[16px]">
                  Pearl lines and sculptural cuffs — a soft conversation for the wrist.
                </p>
              </div>
              <div className="mt-9 h-12" />
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute inset-x-0 bottom-0 z-20">
        <div className="mx-auto flex max-w-[1600px] items-end justify-between gap-6 px-5 pb-7 md:px-10 md:pb-9">
          <div className="flex flex-wrap gap-2">
            {slides.map((item, i) => (
              <button
                key={item.id}
                type="button"
                onClick={() => goTo(i, i > index ? 1 : -1)}
                className={`rounded-full px-3.5 py-1.5 text-[10px] font-semibold tracking-[0.16em] uppercase transition-all duration-500 ${
                  i === index
                    ? 'bg-[#5E062A] text-white'
                    : 'border border-[#2D2B2B]/10 bg-white/45 text-[#2D2B2B]/55 hover:bg-white/75'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <span className="font-display hidden text-sm tracking-[-0.02em] text-[#2D2B2B]/40 sm:inline">
              {slide.index} — 0{slides.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Previous slide"
                onClick={prev}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#2D2B2B]/10 bg-white/45 text-[#2D2B2B] transition-colors duration-500 hover:bg-white"
              >
                ←
              </button>
              <button
                type="button"
                aria-label="Next slide"
                onClick={next}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#2D2B2B]/10 bg-white/45 text-[#2D2B2B] transition-colors duration-500 hover:bg-white"
              >
                →
              </button>
            </div>
          </div>
        </div>

        <div className="h-[1.5px] w-full bg-[#2D2B2B]/08">
          <motion.div
            key={`progress-${progressKey}-${paused}`}
            className="h-full origin-left bg-[#5E062A]"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: paused ? 0 : 1 }}
            transition={{ duration: paused ? 0.35 : AUTO_MS / 1000, ease: 'linear' }}
            style={{ transformOrigin: 'left center' }}
          />
        </div>
      </div>
    </section>
  );
}
