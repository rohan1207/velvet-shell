import Image from 'next/image';
import Link from 'next/link';
import { mobileBannerSrc } from '@/lib/mobile-banner';

function lookImage(src) {
  // Only swap when we have a generated phone twin (campaign / banner art).
  if (/hero-campaign|banner|home-slide|hero-gifting|\/banners\//.test(src)) {
    return { desktop: src, phone: mobileBannerSrc(src) };
  }
  return { desktop: src, phone: src };
}

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
    src: '/images/hero-campaign.jpg',
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
        <h1 className="font-display mt-4 max-w-4xl text-4xl tracking-[-0.03em] md:text-8xl">
          The body, briefly architecture.
        </h1>
        <p className="mt-4 max-w-lg text-sm text-stone md:mt-6">
          Campaign studies for Autumn 2027. Tap through to the piece.
        </p>
      </div>
      <div className="mx-auto mt-10 grid grid-cols-2 gap-3 px-5 md:mt-16 md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:px-10">
        {looks.map((look, index) => (
          <Link
            key={look.title + index}
            href={`/shop/${look.piece}`}
            data-cursor="Shop"
            className="block overflow-hidden"
          >
            <div
              className={`relative overflow-hidden rounded-xl bg-cream md:rounded-none ${
                index % 2 === 0 ? 'aspect-[3/4]' : 'aspect-[4/5]'
              }`}
            >
              {(() => {
                const { desktop, phone } = lookImage(look.src);
                const pos = look.src.includes('collar')
                  ? { objectPosition: 'center 70%' }
                  : undefined;
                if (phone === desktop) {
                  return (
                    <Image
                      src={desktop}
                      alt={look.title}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 hover:scale-105"
                      style={pos}
                    />
                  );
                }
                return (
                  <>
                    <Image
                      src={desktop}
                      alt={look.title}
                      fill
                      sizes="33vw"
                      className="hidden object-cover transition-transform duration-700 hover:scale-105 md:block"
                      style={pos}
                    />
                    <Image
                      src={phone}
                      alt={look.title}
                      fill
                      sizes="50vw"
                      className="object-cover md:hidden"
                      style={pos}
                    />
                  </>
                );
              })()}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-velvet/70 to-transparent p-3 md:p-5">
                <p className="text-[9px] tracking-[0.2em] text-ivory/80 uppercase md:text-[10px] md:tracking-[0.28em]">
                  {look.name}
                </p>
                <p className="font-display text-base leading-tight text-ivory md:text-2xl">
                  {look.title}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
