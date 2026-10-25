import { notFound } from 'next/navigation';
import ProductExperience from '@/components/ProductExperience';
import {
  loadCatalog,
  productFromCatalog,
  relatedFromCatalog,
  colorFamilyFromCatalog,
  variantsFromCatalog,
} from '@/lib/catalog';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const catalog = await loadCatalog();
  const product = productFromCatalog(catalog, slug);
  if (!product) return { title: 'Piece' };
  return { title: product.name, description: product.description };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const catalog = await loadCatalog();
  const product = productFromCatalog(catalog, slug);
  if (!product) notFound();
  const related = relatedFromCatalog(catalog, slug);
  const colorFamily = colorFamilyFromCatalog(catalog, slug);
  const variants = variantsFromCatalog(catalog, slug);
  return (
    <ProductExperience
      product={product}
      related={related}
      colorFamily={colorFamily}
      variants={variants}
      collections={catalog.collections || []}
    />
  );
}
