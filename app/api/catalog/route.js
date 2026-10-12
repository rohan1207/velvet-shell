import { NextResponse } from 'next/server';
import { listingFromCatalog, loadCatalog } from '@/lib/catalog';
import { shopHero } from '@/lib/products';

export async function GET() {
  const catalog = await loadCatalog();
  return NextResponse.json({
    source: catalog.source,
    error: catalog.error || null,
    products: listingFromCatalog(catalog),
    allProducts: catalog.products,
    colorFamilies: catalog.colorFamilies,
    collections: catalog.collections || [],
    categories: catalog.categories || [],
    shopHero,
  });
}
