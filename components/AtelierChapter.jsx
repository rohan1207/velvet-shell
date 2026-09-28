'use client';

import Image from 'next/image';
import Link from 'next/link';

const facts = [
  { label: 'Location', value: 'Jaipur' },
  { label: 'Light', value: 'Daylight only' },
  { label: 'Pace', value: 'Unhurried' },
  { label: 'Practice', value: 'Made to measure' },
];

export default function AtelierChapter() {
  return (
    <section className="bg-ivory">
      <div className="mx-auto max-w-[1600px] px-5 py-20 md:px-10 md:py-28">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 border-b border-ink/10 pb-6">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.18em] text-ink/45 uppercase">
              Atelier · 01
            </p>
            <h2 className="font-display mt-3 max-w-2xl text-4xl font-semibold tracking-[-0.04em] text-ink md:text-6xl">
              Daylight, and no hurry.
            </h2>
          </div>
          <p className="max-w-xs text-[11px] font-medium tracking-[0.16em] text-ink/40 uppercase">
            Jaipur atelier — bench work in natural light
          </p>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="relative aspect-[4/3] overflow-hidden bg-cream lg:col-span-7 lg:aspect-auto lg:min-h-[620px]">
            <Image
              src="/images/atelier-daylight.png"
              alt="Goldsmith working a champagne-gold ring at the Jaipur atelier bench"
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col gap-6 lg:col-span-5">
            <div className="relative aspect-[3/4] overflow-hidden bg-cream lg:flex-1 lg:min-h-[340px]">
              <Image
                src="/images/atelier-bench.png"
                alt="Daylit atelier workbench with unfinished gold and nacre"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>

            <div className="border border-ink/10 bg-pearl px-6 py-7 md:px-8 md:py-8">
              <p className="text-[11px] font-semibold tracking-[0.16em] text-ink/40 uppercase">
                Jaipur atelier
              </p>
              <p className="mt-4 max-w-sm text-[15px] leading-[1.65] text-ink/70">
                The bench waits for daylight. Tools stay few. Each piece is finished for the body —
                never for a tray — in a room that refuses hurry.
              </p>

              <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-ink/10 pt-6">
                {facts.map((fact) => (
                  <div key={fact.label}>
                    <dt className="text-[10px] font-semibold tracking-[0.16em] text-ink/35 uppercase">
                      {fact.label}
                    </dt>
                    <dd className="mt-1.5 text-sm text-ink">{fact.value}</dd>
                  </div>
                ))}
              </dl>

              <Link
                href="/about"
                className="mt-8 inline-flex items-center gap-3 text-[11px] font-semibold tracking-[0.18em] text-ink uppercase transition-opacity hover:opacity-60"
              >
                The house
                <span aria-hidden className="h-px w-8 bg-ink/40" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
