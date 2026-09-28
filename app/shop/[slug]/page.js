import { notFound } from 'next/navigation';
import ProductExperience from '@/components/ProductExperience';
import { getProduct, getRelated, products } from '@/lib/products';

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: 'Piece' };
  return { title: product.name, description: product.description };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const related = getRelated(slug);
  return <ProductExperience product={product} related={related} />;
}
