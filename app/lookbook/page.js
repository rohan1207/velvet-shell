import Image from 'next/image';
import Link from 'next/link';

const looks = [
  {
    src: '/images/look-lumen.png',
    title: 'Lumen, late sun',
    piece: 'lumen-choker',
    name: 'Lumen Choker',
  },
  {
    src: '/images/look-nacre.png',
    title: 'Quiet pearls',
    piece: 'tide-drops',
    name: 'Tide Drops',
  },
  {
    src: '/images/look-tide.png',
    title: 'The spiral',
    piece: 'velvet-cuff',
    name: 'Velvet Cuff',
  },
  {
    src: '/images/look-chamber.png',
    title: 'Nautilus',
    piece: 'nautilus-ear-cuff',
    name: 'Nautilus Ear Cuff',
  },
  {
    src: '/images/look-collar.png',
    title: 'The collar',
    piece: 'nacre-collar',
    name: 'Nacre Collar',
  },
  {
    src: '/images/hero-campaign.png',
    title: 'Autumn 2027',
    piece: 'nacre-collar',
    name: 'Nacre Collar',
  },
];

export const metadata = { title: 'Lookbook' };

export default function LookbookPage() {
  return (
    <div className="bg-ivory pt-28 pb-24 md:pt-36">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <p className="text-[11px] tracking-[0.28em] text-gold uppercase">Lookbook</p>
        <h1 className="font-display mt-4 max-w-4xl text-5xl md:text-8xl">The body, briefly architecture.</h1>
        <p className="mt-6 max-w-lg text-stone">Campaign studies for Autumn 2027. Click through to the piece.</p>
      </div>
      <div className="mx-auto mt-16 columns-1 gap-4 px-5 sm:columns-2 lg:columns-3 md:px-10">
        {looks.map((look, index) => (
          <Link
            key={look.title + index}
            href={`/shop/${look.piece}`}
            data-cursor="Shop"
            className={`mb-4 block break-inside-avoid overflow-hidden ${index % 3 === 0 ? '' : ''}`}
          >
            <div className={`relative overflow-hidden bg-cream ${index % 2 === 0 ? 'aspect-[3/4]' : 'aspect-[4/5]'}`}>
              <Image
                src={look.src}
                alt={look.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
                style={look.src.includes('collar') ? { objectPosition: 'center 70%' } : undefined}
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-velvet/70 to-transparent p-5">
                <p className="text-[10px] tracking-[0.28em] text-ivory/70 uppercase">{look.name}</p>
                <p className="font-display text-2xl text-ivory">{look.title}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
