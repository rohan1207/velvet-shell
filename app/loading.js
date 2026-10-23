/**
 * Route-level fallback: keep the viewport filled from the top so the footer
 * never flashes into view while the next page streams in.
 */
export default function Loading() {
  return (
    <div className="min-h-[100svh] bg-ivory pt-site-chrome" aria-busy="true" aria-live="polite">
      <div className="mx-auto max-w-[1600px] px-5 py-10 md:px-10 md:py-14">
        <div className="h-3 w-28 animate-pulse rounded bg-cream/80" />
        <div className="mt-6 h-10 w-[min(100%,22rem)] animate-pulse rounded bg-cream/90 md:h-12" />
        <div className="mt-4 h-4 w-[min(100%,36rem)] animate-pulse rounded bg-cream/70" />
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-[3/4] animate-pulse rounded-sm bg-cream/80" />
              <div className="h-3 w-3/4 animate-pulse rounded bg-cream/70" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-cream/60" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
