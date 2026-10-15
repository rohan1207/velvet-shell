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
      <div className="skeleton-shimmer relative aspect-square overflow-hidden rounded-2xl bg-cream/80 md:rounded-[1.25rem]" />
      <div className="mt-3.5 flex flex-1 flex-col items-center">
        <div className="skeleton-shimmer h-3.5 w-14 rounded-full bg-cream/90" />
        <div className="skeleton-shimmer mt-3 h-3 w-[70%] max-w-[12rem] rounded-full bg-cream/90" />
        <div className="skeleton-shimmer mt-2.5 h-3 w-16 rounded-full bg-cream/80" />
        <div className="skeleton-shimmer mt-3.5 h-8 w-24 rounded-full bg-cream/70" />
      </div>
    </article>
  );
}

export function ProductGridSkeleton({ count = 8, className = '' }) {
  return (
    <div
      className={`grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12 lg:grid-cols-4 ${className}`}
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
      <div className="relative mt-6 md:mt-7">
        <div className="overflow-hidden">
          <div className="flex w-max gap-4 px-12 md:gap-6 md:px-16">
            {Array.from({ length: count }, (_, i) => (
              <div
                key={i}
                className="w-[72vw] shrink-0 sm:w-[40vw] lg:w-[22vw] xl:w-[21vw]"
              >
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
