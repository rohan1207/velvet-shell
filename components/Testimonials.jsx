'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';

const testimonials = [
  {
    id: 'ananya',
    name: 'Ananya Mehra',
    place: 'Jaipur',
    // Worn — wrist / hand, Indian skin tone (crop keeps focus on the piece)
    image: '/bracelets/catalog/wear-flower-rain-pink.jpg',
    imageClass: 'object-cover object-[center_72%]',
    quote:
      'I ordered the Flower In The Rain bracelet for my sister’s birthday. The box arrived looking like a gift from a private atelier — and the piece itself is even quieter and prettier in person.',
    piece: 'Flower In The Rain Bracelet',
  },
  {
    id: 'meera',
    name: 'Meera Kapoor',
    place: 'Mumbai',
    // Product only
    image: '/earrings/catalog/phalaenopsis-hoop-earrings.jpg',
    imageClass: 'object-cover object-center',
    quote:
      'I wear the phalaenopsis hoops almost every day now. They feel light, look expensive, and somehow still soft enough for work. Velvet Shell has ruined ordinary jewellery for me.',
    piece: 'Phalaenopsis Flower Hoops',
  },
  {
    id: 'arjun',
    name: 'Arjun Desai',
    place: 'Bengaluru',
    // Worn — lapel / cloth, no face
    image: '/brooch/catalog/wear-calla-lily-brooch-gold.jpg',
    imageClass: 'object-cover object-[center_40%]',
    quote:
      'Bought the calla lily brooch for my mother. She pinned it on her saree blouse the same evening. Packaging, note, everything felt considered — not like a website order.',
    piece: 'Calla Lily Brooch',
  },
  {
    id: 'isha',
    name: 'Isha Nair',
    place: 'Kochi',
    // Worn — hand only
    image: '/rings/catalog/wear-aquamarine-butterfly-ring.jpg',
    imageClass: 'object-cover object-center',
    quote:
      'The aquamarine butterfly ring looks exactly like the photos — which almost never happens. I get asked about it every time I step out. Worth every rupee.',
    piece: 'Aquamarine Butterfly Ring',
  },
  {
    id: 'priya',
    name: 'Priya Shah',
    place: 'Ahmedabad',
    // Product only
    image: '/bracelets/catalog/lotus-whisper-pink-v3.jpg',
    imageClass: 'object-cover object-center',
    quote:
      'I stacked the lotus whisper with a simple chain and it felt like my own edit. The craftsmanship is the kind you notice when you hold it close — petals, finish, weight.',
    piece: 'Lotus Whisper Bracelet',
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const current = testimonials[active];

  useEffect(() => {
    const id = setInterval(() => {
      setActive((i) => (i + 1) % testimonials.length);
    }, 6500);
    return () => clearInterval(id);
  }, [active]);

  return (
    <section className="box-border flex h-[100svh] flex-col justify-center overflow-y-auto overscroll-contain bg-ivory md:overflow-hidden">
      <div className="mx-auto flex min-h-full w-full max-w-[1600px] flex-col justify-center px-5 py-8 md:h-full md:px-10 md:py-10">
        <div className="mx-auto max-w-3xl shrink-0 text-center">
          <p className="font-label text-gold">From the house guests</p>
          <h2 className="font-display mt-2 text-3xl leading-[1.08] text-ink md:mt-3 md:text-5xl">
            Worn, kept, spoken for.
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm font-light leading-relaxed text-ink/80">
            Real notes from guests across India — the pieces as they live on the wrist, the hand, the
            blouse.
          </p>
        </div>

        <div className="mx-auto mt-6 grid w-full max-w-5xl min-h-0 flex-1 items-center gap-6 md:mt-8 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-12 lg:gap-16">
          <div className="relative mx-auto aspect-[4/5] h-auto max-h-[min(36svh,300px)] w-full max-w-[240px] overflow-hidden rounded-[1.5rem] bg-pearl md:max-h-[min(42svh,380px)] md:max-w-[320px] md:justify-self-end lg:max-h-[min(44svh,400px)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={current.image}
                  alt={current.piece}
                  fill
                  sizes="(max-width: 768px) 80vw, 360px"
                  className={current.imageClass}
                  priority={active === 0}
                />
              </motion.div>
            </AnimatePresence>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/20 via-transparent to-transparent" />
          </div>

          <div className="min-w-0">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={current.id + '-quote'}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="font-display text-[1.35rem] leading-[1.35] tracking-[-0.02em] text-ink md:text-[1.85rem] lg:text-[2rem]">
                  “{current.quote}”
                </p>
                <footer className="mt-5 md:mt-7">
                  <p className="text-[15px] font-medium tracking-[-0.01em] text-ink">{current.name}</p>
                  <p className="mt-1 text-sm font-light text-ink/85">
                    {current.place}
                    <span className="mx-2 text-ink/20">·</span>
                    {current.piece}
                  </p>
                </footer>
              </motion.blockquote>
            </AnimatePresence>

            <div className="mt-6 flex flex-wrap items-center gap-3 md:mt-8">
              {testimonials.map((item, index) => {
                const selected = index === active;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-label={`Show testimonial from ${item.name}`}
                    aria-current={selected}
                    onClick={() => setActive(index)}
                    className={`relative h-11 w-11 overflow-hidden rounded-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:h-12 md:w-12 ${
                      selected
                        ? 'z-10 scale-110 ring-2 ring-gold/70 ring-offset-2 ring-offset-ivory'
                        : 'opacity-80 hover:opacity-100 hover:scale-105'
                    }`}
                  >
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      className={item.imageClass}
                      sizes="48px"
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
