export default function ProductLoading() {
  return (
    <div className="min-h-[100svh] bg-white pt-site-chrome" aria-busy="true">
      <div className="mx-auto grid max-w-[1600px] gap-8 px-5 py-10 md:grid-cols-2 md:gap-12 md:px-10 md:py-14">
        <div className="aspect-[4/5] animate-pulse rounded-sm bg-cream/80" />
        <div className="space-y-4 pt-2">
          <div className="h-3 w-24 animate-pulse rounded bg-cream/70" />
          <div className="h-10 w-3/4 max-w-md animate-pulse rounded bg-cream/90" />
          <div className="h-4 w-full max-w-lg animate-pulse rounded bg-cream/70" />
          <div className="h-4 w-2/3 max-w-sm animate-pulse rounded bg-cream/60" />
          <div className="mt-8 h-12 w-48 animate-pulse rounded bg-cream/80" />
        </div>
      </div>
    </div>
  );
}
