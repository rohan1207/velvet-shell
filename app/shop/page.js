import { Suspense } from 'react';
import ShopExperience from '@/components/ShopExperience';
import { listingFromCatalog, loadCatalog } from '@/lib/catalog';
import { shopHero } from '@/lib/products';

export const metadata = {
  title: 'Shop',
};

export const dynamic = 'force-dynamic';

export default async function ShopPage() {
  const catalog = await loadCatalog();
  const listing = listingFromCatalog(catalog);

  return (
    <Suspense fallback={<div className="min-h-screen bg-ivory" />}>
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
