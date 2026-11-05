'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';

const testimonials = [
  {
    id: 'packaging',
    image: '/images/testimonials/review-packaging-unbox.jpg',
    imageClass: 'object-cover object-center',
    caption: 'Velvet Shell packaging',
    title: 'Packaging',
    line: 'The shell box, as an order arrives.',
  },
  {
    id: 'ring',
    image: '/images/testimonials/review-flower-ring-cafe.jpg',
    imageClass: 'object-cover object-[center_40%]',
    caption: 'Flower ring',
    title: 'Flower ring',
    line: 'A flower ring from the collection, worn.',
  },
  {
    id: 'bracelet',
    image: '/images/testimonials/review-flower-bracelet-linen.jpg',
    imageClass: 'object-cover object-[center_45%]',
    caption: 'Floral bracelet',
    title: 'Floral bracelet',
    line: 'A floral bracelet from the collection, worn.',
  },
];

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
          <p className="font-label text-[10px] tracking-[0.22em] text-gold uppercase">Photographs</p>
          <h2 className="font-display mt-2 text-[1.85rem] leading-[1.08] text-ink sm:text-3xl md:text-5xl">
            Pieces, as they are worn
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-[13px] font-light leading-relaxed text-ink/75 sm:text-sm">
            Packaging, a flower ring, and a floral bracelet from the Velvet Shell collection.
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
                <p className="font-label text-[10px] tracking-[0.18em] text-gold uppercase">{current.title}</p>
                <p className="mt-4 text-[15px] leading-[1.65] font-light tracking-[-0.01em] text-ink sm:text-[16px] sm:leading-[1.7] md:text-[1.15rem]">
                  {current.line}
                </p>
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
