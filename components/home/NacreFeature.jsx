import Image from 'next/image';
import Link from 'next/link';

export default function NacreFeature() {
  return (
    <section className="grid min-h-[90vh] md:grid-cols-2">
      <div className="bg-velvet-texture relative min-h-[70vh] overflow-hidden">
        <Image
          src="/images/look-lumen.png"
          alt="Velvet Shell jewellery"
          fill
          sizes="50vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col justify-between bg-ivory px-8 py-16 md:px-16 md:py-24">
        <p className="text-[11px] font-semibold tracking-[0.18em] text-gold uppercase">Freshwater pearls</p>
        <div>
          <h2 className="font-display max-w-md text-5xl leading-[1.02] md:text-6xl">
            Freshwater pearls.
          </h2>
          <p className="mt-8 max-w-md text-base leading-relaxed text-stone">
            Pearl pieces use freshwater pearls. Each pearl can vary slightly in shape, tone and surface.
            Care notes are on the product page.
          </p>
          <Link
            href="/shop"
            className="mt-10 inline-block text-[11px] font-semibold tracking-[0.18em] uppercase"
          >
            Shop the collection
          </Link>
        </div>
        <p className="font-display text-8xl text-cream">02</p>
      </div>
    </section>
  );
}
