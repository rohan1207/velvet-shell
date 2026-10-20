import Link from 'next/link';
import { collections, getListingProducts, products } from '@/lib/products';
import ProductCard from '@/components/ProductCard';

const featuredCollection = collections.find((c) => c.slug === 'the-shell-edit') ?? collections[0];
const listing = getListingProducts(products);

const fromCollection = listing.filter((product) => product.collection === featuredCollection.slug);
const featured = [
  ...fromCollection,
  ...listing.filter((product) => product.collection !== featuredCollection.slug),
].slice(0, 4);

export default function NewCollection() {
  return (
    <section className="bg-ivory">
      <div className="mx-auto max-w-[1600px] px-5 py-14 md:px-10 md:py-32">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:mb-14 md:flex-row md:items-end md:gap-6">
          <div>
            <p className="font-label text-gold">New collection</p>
            <h2 className="font-display mt-2 text-3xl text-ink md:mt-3 md:text-6xl">
              {featuredCollection.name}
            </h2>
            <p className="mt-3 max-w-md text-sm font-light leading-relaxed text-ink/85 md:mt-4">
              {featuredCollection.line}
            </p>
          </div>
          <Link
            href={`/shop?collection=${featuredCollection.slug}`}
            className="bg-velvet-texture inline-flex items-center rounded-full px-5 py-2.5 font-label text-[11px] text-ivory transition-opacity hover:opacity-90"
          >
            View collection
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-7 md:gap-x-6 md:gap-y-12 lg:grid-cols-4">
          {featured.map((product, index) => (
            <ProductCard key={product.slug} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
