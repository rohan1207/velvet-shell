import Image from 'next/image';
import Link from 'next/link';

const materials = [
  {
    n: '01',
    title: '925 Silver',
    line: 'Clean, sculptural, enduring.',
  },
  {
    n: '02',
    title: '18K Gold-Plated',
    line: 'Warmth with a softer glow.',
  },
];

export default function TheHouse() {
  return (
    <section className="relative overflow-hidden border-y border-ink/8">
      <Image
        src="/images/atelier-daylight.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-center"
        priority={false}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-[#f7f4ef]/88 via-[#f7f4ef]/72 to-[#f7f4ef]/35 md:via-[#f7f4ef]/62 md:to-[#f7f4ef]/22"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-[#f7f4ef]/50 via-transparent to-[#f7f4ef]/20"
      />

      <div className="relative mx-auto grid max-w-[1600px] gap-14 px-5 py-16 md:px-10 md:py-24 lg:grid-cols-12 lg:gap-16 lg:py-28">
        <div className="lg:col-span-6 xl:col-span-5">
          <div className="flex items-center gap-3">
            <span className="h-px w-7 bg-gold/80" aria-hidden />
            <p className="font-label text-gold">The house</p>
          </div>

          <h2 className="font-display mt-5 text-[clamp(2.2rem,4.5vw,3.6rem)] leading-[1.05] tracking-[-0.02em] text-ink">
            Softly Held.
            <span className="mt-1 block text-ink/75">Thoughtfully Made.</span>
          </h2>

          <p className="mt-6 max-w-[38ch] text-[15px] font-light leading-[1.8] text-ink/80 md:text-base">
            Velvet Shell takes its name from the quiet moment before a reveal — when something
            beautiful is still held within. Designed with restraint, shaped with intention.
          </p>

          <Link
            href="/about"
            className="bg-velvet-texture mt-9 inline-flex items-center rounded-full px-7 py-3 font-label text-[11px] tracking-[0.2em] text-ivory uppercase transition-opacity hover:opacity-90"
          >
            Read more
          </Link>
        </div>

        <div className="lg:col-span-6 lg:col-start-7 xl:col-span-6 xl:col-start-7">
          <div className="rounded-sm bg-[#f7f4ef]/70 px-5 py-7 backdrop-blur-[2px] md:px-8 md:py-9">
            <p className="font-label text-[10px] tracking-[0.22em] text-ink/55">Materials</p>
            <h3 className="font-display mt-3 text-[clamp(1.6rem,2.8vw,2.25rem)] leading-[1.12] tracking-[-0.02em] text-ink">
              Made Of Considered Details.
            </h3>
            <p className="mt-4 max-w-[42ch] text-[15px] font-light leading-[1.75] text-ink/80">
              Silver, 18K gold-plated finishes and freshwater pearls — each chosen for how it looks,
              feels and lives with you.
            </p>

            <ul className="mt-10 border-t border-ink/10">
              {materials.map((item) => (
                <li
                  key={item.n}
                  className="grid grid-cols-[auto_1fr] items-baseline gap-x-5 gap-y-1 border-b border-ink/10 py-5 md:gap-x-8 md:py-6"
                >
                  <span className="font-label text-[10px] tracking-[0.2em] text-gold">{item.n}</span>
                  <div>
                    <p className="text-[15px] font-medium tracking-[-0.01em] text-ink md:text-base">
                      {item.title}
                    </p>
                    <p className="mt-1 text-[13.5px] font-light text-ink/75 md:text-sm">{item.line}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
