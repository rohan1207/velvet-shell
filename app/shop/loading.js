import { ProductGridSkeleton } from '@/components/ProductCardSkeleton';

export default function ShopLoading() {
  return (
    <div className="min-h-[100svh] bg-white pt-site-chrome" aria-busy="true">
      <div className="h-[28vh] max-h-[22rem] min-h-[12rem] animate-pulse bg-cream/70" />
      <div className="mx-auto max-w-[1600px] px-5 py-10 md:px-10 md:py-14">
        <div className="h-3 w-20 animate-pulse rounded bg-cream/80" />
        <div className="mt-4 h-10 w-64 max-w-full animate-pulse rounded bg-cream/90" />
        <ProductGridSkeleton count={8} className="mt-10" />
      </div>
    </div>
  );
}
