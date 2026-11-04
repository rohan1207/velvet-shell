'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';

const testimonials = [
  {
    id: 'ananya',
    name: 'Ananya M.',
    place: 'Jaipur',
    date: '12 Oct 2026',
    rating: 5,
    image: '/images/testimonials/review-packaging-unbox.jpg',
    imageClass: 'object-cover object-center',
    quote:
      'Gifted this for Diwali. The shell velvet box with the logo on the lid, burgundy ribbon, gift wrap — it felt special before she even saw the bracelet. The little red stone catches the light so well. She left it open on the table just to look at it.',
    piece: 'Ruby Petal Bracelet',
    caption: 'Shell box unboxing',
  },
  {
    id: 'riya',
    name: 'Riya S.',
    place: 'Pune',
    date: '21 Aug 2026',
    rating: 5,
    image: '/images/testimonials/review-flower-ring-cafe.jpg',
    imageClass: 'object-cover object-[center_40%]',
    quote:
      'Took this on a slow café morning — the flower ring sits so lightly, silver petals with that tiny gold centre. Goes with everything I wear. Keep getting asked where it’s from.',
    piece: 'Flower Adjustable Ring',
    caption: 'Outdoor café, Pune',
  },
  {
    id: 'priya',
    name: 'Priya S.',
    place: 'Ahmedabad',
    date: '5 Jun 2026',
    rating: 5,
    image: '/images/testimonials/review-flower-bracelet-linen.jpg',
    imageClass: 'object-cover object-[center_45%]',
    quote:
      'Morning light on the lotus whisper — the green stone is deeper in person, and the little silver flower sits perfectly flat on the wrist. Soft enough for everyday. This is how it looked on my bed after I opened it.',
    piece: 'Lotus Whisper — Green',
    caption: 'Morning light at home',
  },
];

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`h-3.5 w-3.5 ${i < rating ? 'text-gold' : 'text-ink/15'}`}
          fill="currentColor"
          aria-hidden
        >
          <path d="M10 1.5l2.35 5.1 5.55.6-4.2 3.75 1.25 5.4L10 13.7 5.05 16.35l1.25-5.4L2.1 7.2l5.55-.6L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials({ standalone = false }) {
  const [active, setActive] = useState(0);
  const current = testimonials[active];

  useEffect(() => {
    const id = setInterval(() => {
      setActive((i) => (i + 1) % testimonials.length);
    }, 7000);
    return () => clearInterval(id);
  }, [active]);

  return (
    <section
      id="testimonials"
      className={`box-border scroll-mt-28 bg-ivory ${standalone ? 'pt-page pb-16 md:pb-24' : ''}`}
    >
      <div className="mx-auto flex w-full max-w-[1600px] flex-col px-4 py-10 sm:px-5 md:px-10 md:py-12">
        <div className="mx-auto max-w-3xl shrink-0 text-center">
          <p className="font-label text-[10px] tracking-[0.22em] text-gold uppercase">Customer reviews</p>
          <h2 className="font-display mt-2 text-[1.85rem] leading-[1.08] text-ink sm:text-3xl md:text-5xl">
            From people who bought them
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-[13px] font-light leading-relaxed text-ink/75 sm:text-sm">
            Real customer photos — unboxing, worn at home, on the table — the way pieces arrive and
            live day to day.
          </p>
        </div>

        <div className="mx-auto mt-7 grid w-full max-w-5xl items-center gap-6 md:mt-8 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] md:gap-10 lg:gap-12">
          <figure className="relative mx-auto w-full max-w-[260px] md:max-w-[320px] md:justify-self-end">
            <div className="relative aspect-[3/4] overflow-hidden rounded-[1.15rem] bg-pearl ring-1 ring-ink/8 sm:rounded-[1.35rem]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.99 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <Image
                    src={current.image}
                    alt={`${current.piece} — customer photo`}
                    fill
                    sizes="(max-width: 768px) 80vw, 360px"
                    className={current.imageClass}
                    priority={active === 0}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            <figcaption className="mt-2.5 flex items-center justify-between gap-2 px-0.5">
              <span className="truncate text-[11px] font-light text-ink/55">{current.caption}</span>
              <span className="shrink-0 rounded-full bg-ink/[0.04] px-2 py-0.5 font-label text-[8px] tracking-[0.12em] text-ink/50 uppercase">
                Customer photo
              </span>
            </figcaption>
          </figure>

          <div className="min-w-0">
            <AnimatePresence mode="wait">
              <motion.article
                key={current.id + '-quote'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-[1.15rem] border border-ink/8 bg-white/70 p-5 sm:rounded-[1.35rem] sm:p-6 md:p-7"
              >
                <div className="flex flex-wrap items-center gap-2.5">
                  <Stars rating={current.rating} />
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-label text-[8px] tracking-[0.12em] text-emerald-800 uppercase">
                    Verified purchase
                  </span>
                </div>
                <p className="mt-4 text-[15px] leading-[1.65] font-light tracking-[-0.01em] text-ink sm:text-[16px] sm:leading-[1.7] md:text-[1.15rem]">
                  “{current.quote}”
                </p>
                <footer className="mt-5 flex flex-wrap items-end justify-between gap-3 border-t border-ink/8 pt-4">
                  <div className="min-w-0">
                    <p className="text-[14px] font-medium tracking-[-0.01em] text-ink">{current.name}</p>
                    <p className="mt-0.5 text-[12px] font-light text-ink/55">
                      {current.place}
                      <span className="mx-1.5 text-ink/20">·</span>
                      {current.date}
                    </p>
                    <p className="mt-1.5 truncate text-[12px] text-ink/70">{current.piece}</p>
                  </div>
                </footer>
              </motion.article>
            </AnimatePresence>

            <div className="mt-5 flex flex-wrap items-center gap-2.5 md:mt-6">
              {testimonials.map((item, index) => {
                const selected = index === active;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-label={`Show review from ${item.name}`}
                    aria-current={selected}
                    onClick={() => setActive(index)}
                    className={`relative h-12 w-12 overflow-hidden rounded-xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:h-14 sm:w-14 sm:rounded-[0.9rem] ${
                      selected
                        ? 'z-10 scale-105 ring-2 ring-burgundy/50 ring-offset-2 ring-offset-ivory'
                        : 'opacity-80 hover:opacity-100 hover:scale-[1.03]'
                    }`}
                  >
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      className={item.imageClass}
                      sizes="56px"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
