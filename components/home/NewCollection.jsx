import Link from 'next/link';
import { collections, products } from '@/lib/products';
import ProductCard from '@/components/ProductCard';

const featuredCollection = collections.find((c) => c.slug === 'the-shell-edit') ?? collections[0];

const fromCollection = products.filter((product) => product.collection === featuredCollection.slug);
const featured = [
  ...fromCollection,
  ...products.filter((product) => product.collection !== featuredCollection.slug),
].slice(0, 4);

export default function NewCollection() {
  return (
    <section className="bg-ivory">
      <div className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-32">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:mb-14 md:flex-row md:items-end">
          <div>
            <p className="font-label text-gold">New collection</p>
            <h2 className="font-display mt-3 text-4xl text-ink md:text-6xl">{featuredCollection.name}</h2>
            <p className="mt-4 max-w-md text-sm font-light leading-relaxed text-ink/55">
              {featuredCollection.line}
            </p>
          </div>
          <Link
            href={`/shop?collection=${featuredCollection.slug}`}
            className="inline-flex items-center rounded-full border border-ink/12 px-5 py-2.5 font-label text-[11px] text-ink transition-colors hover:border-burgundy/30 hover:text-burgundy"
          >
            View collection
          </Link>
        </div>

        <div className="grid gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product, index) => (
            <ProductCard key={product.slug} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
