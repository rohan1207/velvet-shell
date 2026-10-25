import { NextResponse } from 'next/server';
import { listingFromCatalog, loadCatalog } from '@/lib/catalog';
import { shopHero } from '@/lib/shop-meta';

export const revalidate = 60;

export async function GET() {
  const catalog = await loadCatalog();
  return NextResponse.json(
    {
      source: catalog.source,
      error: catalog.error || null,
      products: listingFromCatalog(catalog),
      allProducts: catalog.products,
      colorFamilies: catalog.colorFamilies,
      collections: catalog.collections || [],
      categories: catalog.categories || [],
      shopHero,
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    },
  );
}
