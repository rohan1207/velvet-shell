/**
 * Shimmer placeholder matching ProductCard proportions.
 */
export function ProductCardSkeleton({ className = '', index = 0 }) {
  return (
    <article
      className={`flex h-full flex-col ${className}`}
      aria-hidden
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="skeleton-shimmer relative aspect-square overflow-hidden bg-cream/50" />
      <div className="mt-3 flex flex-1 flex-col">
        <div className="skeleton-shimmer mx-auto h-3.5 w-14 rounded-full bg-cream/80" />
        <div className="skeleton-shimmer mx-auto mt-2 h-8 w-[75%] max-w-[12rem] rounded-full bg-cream/80" />
        <div className="skeleton-shimmer mx-auto mt-2 h-3 w-16 rounded-full bg-cream/70" />
        <div className="mt-auto flex items-center justify-between px-4 pt-3 md:px-6">
          <div className="flex gap-0.5">
            <div className="skeleton-shimmer h-10 w-10 rounded-full bg-cream/70 md:h-11 md:w-11" />
            <div className="skeleton-shimmer h-10 w-10 rounded-full bg-cream/70 md:h-11 md:w-11" />
          </div>
          <div className="skeleton-shimmer h-9 w-24 rounded-full bg-cream/70 md:h-12 md:w-28" />
        </div>
      </div>
    </article>
  );
}

export function ProductGridSkeleton({ count = 8, className = 'lg:grid-cols-4' }) {
  return (
    <div
      className={`grid grid-cols-2 gap-x-3 gap-y-7 md:gap-x-6 md:gap-y-12 ${className}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading products"
    >
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} index={i} />
      ))}
      <span className="sr-only">Loading products…</span>
    </div>
  );
}

export function ProductStripSkeleton({
  count = 4,
  eyebrow = 'Loading',
  title = 'Gathering pieces…',
  line = 'Please wait while we prepare this edit.',
  bgClass = 'bg-ivory',
}) {
  return (
    <section
      className={`relative box-border scroll-mt-28 overflow-hidden py-10 md:py-12 ${bgClass}`}
      role="status"
      aria-busy="true"
      aria-label="Loading products"
    >
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="flex flex-col items-start justify-between gap-4 border-b border-ink/8 pb-4 md:flex-row md:items-end md:pb-5">
          <div>
            <p className="font-label text-gold">{eyebrow}</p>
            <h2 className="font-display mt-2 text-3xl leading-[1.08] text-ink md:text-5xl">{title}</h2>
            <p className="mt-2 max-w-md text-sm font-light leading-relaxed text-ink/85">{line}</p>
          </div>
          <div className="skeleton-shimmer h-10 w-28 rounded-full bg-cream/80" />
        </div>
      </div>
      <div className="mx-auto mt-6 grid max-w-[1600px] grid-cols-2 gap-x-3 gap-y-7 px-5 md:hidden">
        {Array.from({ length: Math.min(count * 2, 8) }, (_, i) => (
          <ProductCardSkeleton key={i} index={i} className="h-full" />
        ))}
      </div>
      <div className="relative mt-7 hidden md:block">
        <div className="overflow-hidden">
          <div className="flex w-max gap-6 px-16">
            {Array.from({ length: count }, (_, i) => (
              <div key={i} className="w-[40vw] shrink-0 lg:w-[22vw] xl:w-[21vw]">
                <ProductCardSkeleton index={i} className="h-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <span className="sr-only">Loading products…</span>
    </section>
  );
}
