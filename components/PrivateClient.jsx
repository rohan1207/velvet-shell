'use client';

import Image from 'next/image';
import Link from 'next/link';
import Magnetic from './Magnetic';

const details = [
  { label: 'Cities', value: 'Paris · Jaipur' },
  { label: 'Format', value: 'Private viewing' },
  { label: 'Book', value: 'Made once' },
  { label: 'Lead time', value: 'By conversation' },
];

export default function PrivateClient() {
  return (
    <section className="border-t border-ink/8 bg-pearl">
      <div className="mx-auto max-w-[1600px] px-5 py-20 md:px-10 md:py-28">
        <div className="grid items-stretch gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="flex flex-col justify-between lg:col-span-5">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.18em] text-ink/45 uppercase">
                Private client · 02
              </p>
              <h2 className="font-display mt-4 max-w-md text-4xl font-semibold tracking-[-0.04em] text-ink md:text-5xl lg:text-[3.35rem]">
                By appointment, not by accident.
              </h2>
              <p className="mt-7 max-w-md text-[15px] leading-[1.7] text-ink/65 md:text-base">
                A viewing in Paris or Jaipur. A piece made to the measure of a hand. The house keeps
                a small book of private work — collars, signets, and objects that will not be repeated.
              </p>
            </div>

            <div className="mt-12">
              <dl className="grid grid-cols-2 gap-x-6 gap-y-6 border-t border-ink/10 pt-7">
                {details.map((item) => (
                  <div key={item.label}>
                    <dt className="text-[10px] font-semibold tracking-[0.16em] text-ink/35 uppercase">
                      {item.label}
                    </dt>
                    <dd className="mt-1.5 text-sm text-ink">{item.value}</dd>
                  </div>
                ))}
              </dl>

              <Magnetic className="mt-10 inline-block">
                <Link
                  href="/contact"
                  className="inline-flex h-12 items-center bg-[#5E062A] px-8 text-[11px] font-semibold tracking-[0.18em] text-ivory uppercase transition-opacity hover:opacity-90"
                >
                  Request a viewing
                </Link>
              </Magnetic>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            <div className="relative min-h-[320px] overflow-hidden bg-cream sm:min-h-[480px] lg:min-h-full">
              <Image
                src="/images/salon-viewing.png"
                alt="Private salon prepared for a jewelry viewing"
                fill
                sizes="(max-width: 640px) 100vw, 35vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-4">
              <div className="relative aspect-[3/4] overflow-hidden bg-cream sm:flex-1 sm:aspect-auto">
                <Image
                  src="/images/private-appointment.png"
                  alt="Private appointment — hands studying a gold necklace on velvet"
                  fill
                  sizes="(max-width: 640px) 100vw, 28vw"
                  className="object-cover"
                />
              </div>
              <div className="border border-ink/10 bg-ivory px-5 py-5">
                <p className="text-[10px] font-semibold tracking-[0.16em] text-ink/35 uppercase">
                  The quiet room
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink/65">
                  One tray. Soft light. Time enough to decide how a piece should live on you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
