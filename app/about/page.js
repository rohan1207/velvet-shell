import Image from 'next/image';
import Link from 'next/link';
import { brand } from '@/lib/brand';

export const metadata = { title: 'Brand' };

export default function AboutPage() {
  return (
    <div className="bg-ivory pt-28 pb-0 md:pt-36">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <p className="font-label text-gold">Brand introduction</p>
        <h1 className="font-display mt-4 max-w-5xl text-5xl leading-[1.08] md:text-7xl lg:text-8xl">
          Where beautiful things become meaningful discoveries.
        </h1>
        <p className="mt-8 max-w-2xl text-base font-light leading-relaxed text-ink/70 md:text-lg">
          A premium house of jewellery, gifting, fragrances, home and lifestyle creations — thoughtful
          design and refined luxury, so every reveal feels truly special.
        </p>
      </div>

      <div className="mt-16 grid md:grid-cols-2">
        <div className="relative min-h-[70vh]">
          <Image
            src="/images/atelier-daylight.png"
            alt="Velvet Shell atelier"
            fill
            className="object-cover"
            sizes="50vw"
          />
        </div>
        <div className="flex flex-col justify-center bg-pearl px-8 py-16 md:px-16">
          <p className="font-label text-gold">Brand story</p>
          <p className="font-display-italic mt-5 text-3xl text-burgundy md:text-4xl">
            The most precious things rarely reveal themselves at first glance.
          </p>
          <p className="mt-8 text-base font-light leading-relaxed text-ink/70">
            A shell keeps its treasure hidden; protected, patiently formed, and waiting for the right
            moment to be discovered. When it opens, it reveals more than a pearl. It reveals wonder.
          </p>
          <p className="mt-5 text-base font-light leading-relaxed text-ink/70">
            Velvet lends the softness of luxury. The shell brings strength and mystery. And within
            lies the pearl — something rare, meaningful and beautifully unexpected.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-32">
        <p className="font-label text-gold">Brand philosophy</p>
        <h2 className="font-display mt-4 max-w-3xl text-4xl md:text-5xl">
          At Velvet Shell, luxury begins before the reveal.
        </h2>
        <p className="mt-6 max-w-xl text-base font-light leading-relaxed text-ink/65">
          It lives in the anticipation, the thoughtful details and the quiet excitement of discovering
          what lies within. True luxury is not simply something you see or own — it is something you
          unwrap, experience and remember.
        </p>

        <div className="mt-16 grid gap-8 border-t border-ink/10 pt-12 sm:grid-cols-2 lg:grid-cols-4">
          {brand.essence.map((word, i) => (
            <div key={word}>
              <p className="font-label text-gold">0{i + 1}</p>
              <p className="font-heading mt-3 text-2xl font-light tracking-[-0.02em] text-ink md:text-3xl">
                {word}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="border-y border-ink/8 bg-pearl">
        <div className="mx-auto max-w-[1600px] px-5 py-20 md:px-10 md:py-24">
          <p className="font-label text-gold">What Velvet Shell stands for</p>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {[
              ['Refined', 'Thoughtful design with restraint.'],
              ['Precious', 'Beauty that feels considered and valuable.'],
              ['Emotional', 'Objects that carry meaning beyond function.'],
              ['Intriguing', 'A sense of anticipation before the reveal.'],
              ['Versatile', 'A luxury language across categories.'],
            ].map(([title, line]) => (
              <div key={title}>
                <h3 className="font-heading text-xl font-light text-burgundy">{title}</h3>
                <p className="mt-3 text-sm font-light leading-relaxed text-ink/60">{line}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative min-h-[70vh]">
        <Image src="/images/salon-viewing.png" alt="Private viewing" fill className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-burgundy/45" />
        <div className="relative z-10 flex min-h-[70vh] items-end px-8 py-16 md:px-16">
          <div>
            <p className="font-label text-gold">{brand.tagline}</p>
            <h2 className="font-display mt-4 text-5xl text-ivory md:text-7xl">Viewings, not queues.</h2>
            <Link
              href="/contact"
              className="mt-6 inline-block font-label text-ivory transition-opacity hover:opacity-70"
            >
              Private appointment
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
