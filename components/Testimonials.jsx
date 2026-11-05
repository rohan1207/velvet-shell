'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';

const testimonials = [
  {
    id: 'packaging',
    image: '/images/testimonials/review-packaging-unbox.jpg',
    imageClass: 'object-cover object-center',
    caption: 'Unboxing',
    title: 'The shell box',
    piece: 'Velvet Shell packaging',
    rating: 5,
    quote:
      'I ordered it as a gift and the unboxing did half the work. The shell box, the burgundy ribbon, and the way the piece sat inside felt considered, not like standard jewellery packaging. She opened it slowly and then just left the box on the table. It still looks special the next day.',
  },
  {
    id: 'ring',
    image: '/images/testimonials/review-flower-ring-cafe.jpg',
    imageClass: 'object-cover object-[center_40%]',
    caption: 'Worn out',
    title: 'Flower ring',
    piece: 'Flower ring',
    rating: 5,
    quote:
      'The flower ring is lighter than it looks in the photos. Silver petals, a small gold centre, and it sits flat enough that I forget it is on until someone asks where it is from. I wore it out for coffee and it held up through the whole morning without twisting or catching.',
  },
  {
    id: 'bracelet',
    image: '/images/testimonials/review-flower-bracelet-linen.jpg',
    imageClass: 'object-cover object-[center_45%]',
    caption: 'At home',
    title: 'Floral bracelet',
    piece: 'Floral bracelet',
    rating: 5,
    quote:
      'The green stone is deeper in person than on the product page, and the little silver flower lies quietly on the wrist. It is soft enough for every day, not only for an occasion. This is how it looked after I took it out of the pouch — still the piece I reach for first.',
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
          <p className="font-label text-[10px] tracking-[0.22em] text-gold uppercase">Testimonials</p>
          <h2 className="font-display mt-2 text-[1.85rem] leading-[1.08] text-ink sm:text-3xl md:text-5xl">
            From the people who wear them
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-[13px] font-light leading-relaxed text-ink/75 sm:text-sm">
            Unboxing, a flower ring worn out, and a floral bracelet kept close — in their own words.
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
                    alt={current.title}
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
                Velvet Shell
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
                  <span className="font-label text-[8px] tracking-[0.14em] text-ink/45 uppercase">
                    {current.caption}
                  </span>
                </div>
                <p className="mt-4 text-[15px] leading-[1.7] font-light tracking-[-0.01em] text-ink sm:text-[16px] sm:leading-[1.75] md:text-[1.12rem]">
                  “{current.quote}”
                </p>
                <footer className="mt-5 border-t border-ink/8 pt-4">
                  <p className="font-label text-[10px] tracking-[0.16em] text-gold uppercase">{current.title}</p>
                  <p className="mt-1 text-[13px] font-light text-ink/70">{current.piece}</p>
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
                    aria-label={`Show ${item.title}`}
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
