import Image from 'next/image';
import Link from 'next/link';

export default function NacreFeature() {
  return (
    <section className="grid min-h-[90vh] md:grid-cols-2">
      <div className="relative min-h-[70vh] overflow-hidden bg-velvet">
        <Image
          src="/images/look-lumen.png"
          alt="Lumen choker on a limestone wall"
          fill
          sizes="50vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col justify-between bg-ivory px-8 py-16 md:px-16 md:py-24">
        <p className="text-[11px] font-semibold tracking-[0.18em] text-gold uppercase">Pearls of nacre</p>
        <div>
          <h2 className="font-display max-w-md text-5xl leading-[1.02] md:text-6xl">
            Light that does not sit still.
          </h2>
          <p className="mt-8 max-w-md text-base leading-relaxed text-stone">
            We wait for pearls that do not match. Matching is a factory idea. Kinship is slower, and it
            is the only brief we give the atelier.
          </p>
          <Link
            href="/shop?collection=pearls-of-nacre"
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
