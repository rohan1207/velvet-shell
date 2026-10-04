'use client';

import InfiniteSpiral from './InfiniteSpiral';

const images = [
  { src: '/images/product-nacre-collar.png', alt: 'Nacre Collar', href: '/shop/nacre-collar' },
  { src: '/images/product-tide-drops.png', alt: 'Tide Drops', href: '/shop/tide-drops' },
  { src: '/images/product-abalone-signet.png', alt: 'Abalone Signet', href: '/shop/abalone-signet' },
  { src: '/images/product-velvet-cuff.png', alt: 'Velvet Cuff', href: '/shop/velvet-cuff' },
  { src: '/images/product-lumen-choker.png', alt: 'Lumen Choker', href: '/shop/lumen-choker' },
  { src: '/images/product-moonlit-strand.png', alt: 'Moonlit Strand', href: '/shop/moonlit-strand' },
  { src: '/images/look-neck-ears.png', alt: 'Collar edit look' },
  { src: '/images/look-wrist-ring.png', alt: 'Wrist edit look' },
  { src: '/images/hero-gift.png', alt: 'Shell reveal' },
  { src: '/images/banner-bracelets.jpg', alt: 'Velvet Shell floral jewellery campaign' },
];

export default function SpiralGallery() {
  return (
    <section className="relative overflow-hidden bg-ivory">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(94,6,42,0.05)_0%,transparent_55%)]" />

      <div className="relative mx-auto max-w-[1600px] px-5 py-16 md:px-10 md:py-20 lg:py-24">
        {/* Mobile intro */}
        <div className="mb-8 text-center lg:hidden">
          <h2 className="font-display text-3xl leading-[1.12] text-ink md:text-4xl">
            Softly Held. Thoughtfully Made.
          </h2>
          <p className="mt-5 text-[15px] font-light leading-[1.75] text-ink/85">
            Velvet Shell takes its name from the quiet moment before a reveal, when something beautiful
            is still held within. Our pieces are designed with restraint, shaped with intention and made
            to feel considered rather than loud.
          </p>
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(320px,1.15fr)_minmax(0,1fr)] lg:gap-6 xl:gap-10">
          {/* Left */}
          <aside className="relative z-10 order-2 hidden max-w-md lg:order-1 lg:block lg:max-w-none lg:pr-2">
            <h2 className="font-display text-3xl leading-[1.12] text-ink md:text-4xl xl:text-[2.65rem]">
              Softly Held. Thoughtfully Made.
            </h2>
            <p className="mt-5 text-[15px] font-light leading-[1.75] text-ink/85">
              Velvet Shell takes its name from the quiet moment before a reveal, when something beautiful
              is still held within. Our pieces are designed with restraint, shaped with intention and made
              to feel considered rather than loud.
            </p>
          </aside>

          {/* Center — spiral */}
          <div className="relative order-1 lg:order-2">
            <div className="relative mx-auto h-[520px] w-full max-w-[420px] overflow-visible sm:h-[560px] md:h-[600px] lg:max-w-none lg:h-[620px] xl:h-[680px]">
              <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-ivory to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-ivory to-transparent" />
              <InfiniteSpiral
                items={images}
                animationMode="auto"
                speed={0.55}
                radius={150}
                cardWidth={108}
                cardHeight={108}
                verticalSpacing={56}
                perspective={1100}
                cardRadius={12}
                centerScale={1.15}
                edgeBlur={4}
                cardsPerTurn={7}
                pauseOnHover={false}
                direction="up"
                rotation={0}
                cardTilt={0}
                edgeFade={0.22}
                imageFit="cover"
                grayscale={0}
                className="!min-h-full"
              />
            </div>
          </div>

          {/* Right */}
          <aside className="relative z-10 order-3 max-w-md lg:max-w-none lg:pl-2 lg:text-right">
            <h2 className="font-display text-3xl leading-[1.12] text-ink md:text-4xl xl:text-[2.65rem]">
              Made Of Considered Details.
            </h2>
            <p className="mt-5 text-[15px] font-light leading-[1.75] text-ink/85 lg:ml-auto lg:max-w-sm">
              Our jewellery brings together silver, 18K gold-plated finishes and freshwater pearls, with
              each material chosen to complement the form and feeling of the piece.
            </p>
            <p className="mt-4 text-[15px] font-light leading-[1.75] text-ink/85 lg:ml-auto lg:max-w-sm">
              From the cool character of silver to the warmth of gold and the quiet luminosity of pearls,
              every detail is considered for how it looks, feels and lives with you.
            </p>
            <ul className="mt-7 space-y-3 text-sm font-light text-ink/85 lg:ml-auto lg:max-w-sm">
              <li className="flex gap-3 lg:flex-row-reverse">
                <span className="mt-2 h-px w-5 shrink-0 bg-gold" />
                <span>925 Silver - Clean, Sculptural, Enduring.</span>
              </li>
              <li className="flex gap-3 lg:flex-row-reverse">
                <span className="mt-2 h-px w-5 shrink-0 bg-gold" />
                <span>18K Gold-Plated - Warmth with a softer glow.</span>
              </li>
              <li className="flex gap-3 lg:flex-row-reverse">
                <span className="mt-2 h-px w-5 shrink-0 bg-gold" />
                <span>Freshwater Pearls - Natural luminosity, beautifully understated.</span>
              </li>
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
