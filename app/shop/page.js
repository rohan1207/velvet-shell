import { Suspense } from 'react';
import ShopExperience from '@/components/ShopExperience';
import { ProductGridSkeleton } from '@/components/ProductCardSkeleton';
import { listingFromCatalog, loadCatalog } from '@/lib/catalog';
import { shopHero } from '@/lib/products';

export const metadata = {
  title: 'Shop',
};

export const dynamic = 'force-dynamic';

function ShopFallback() {
  return (
    <div className="min-h-screen bg-white">
      <div className="h-[42vw] max-h-[28rem] min-h-[14rem] animate-pulse bg-cream/70" />
      <div className="mx-auto max-w-[1600px] px-5 py-14 md:px-10 md:py-20">
        <div className="skeleton-shimmer mb-3 h-3 w-20 rounded-full bg-cream/80" />
        <div className="skeleton-shimmer h-10 w-64 max-w-full rounded-lg bg-cream/90 md:h-12" />
        <div className="skeleton-shimmer mt-4 h-4 w-80 max-w-full rounded-full bg-cream/70" />
        <ProductGridSkeleton count={8} className="mt-12" />
      </div>
    </div>
  );
}

export default async function ShopPage() {
  const catalog = await loadCatalog();
  const listing = listingFromCatalog(catalog);

  return (
    <Suspense fallback={<ShopFallback />}>
      <ShopExperience
        initialProducts={listing}
        initialCollections={catalog.collections || []}
        initialCategories={catalog.categories || []}
        initialColorFamilies={catalog.colorFamilies || []}
        shopHeroData={shopHero}
        catalogSource={catalog.source}
      />
    </Suspense>
  );
}
