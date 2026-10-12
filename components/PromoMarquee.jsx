function Segment() {
  return (
    <span className="inline-flex shrink-0 items-center px-6 font-label text-[10px] tracking-[0.2em] text-ink/85 uppercase md:px-10 md:text-[11px]">
      <span className="text-burgundy">First order</span>
      <span className="mx-3 text-ink/30" aria-hidden>
        ·
      </span>
      <span>10% off on all products</span>
      <span className="mx-3 text-ink/30" aria-hidden>
        ·
      </span>
      <span>
        Use code{' '}
        <span className="font-num tracking-[0.18em] text-burgundy">VELVET10</span>
      </span>
      <span className="mx-6 h-px w-8 bg-ink/15 md:mx-10" aria-hidden />
    </span>
  );
}

function Track() {
  return (
    <div className="flex shrink-0 items-center">
      {Array.from({ length: 4 }, (_, i) => (
        <Segment key={i} />
      ))}
    </div>
  );
}

export default function PromoMarquee() {
  return (
    <section
      className="relative h-[var(--site-promo-h)] shrink-0 overflow-hidden border-b border-ink/10 bg-[#f7f4ef]"
      aria-label="First order offer: 10% off with code VELVET10"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[#f7f4ef] to-transparent md:w-16" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[#f7f4ef] to-transparent md:w-16" />

      <div className="flex h-full items-center overflow-hidden">
        <div className="marquee-track flex w-max items-center whitespace-nowrap">
          <Track />
          <div aria-hidden>
            <Track />
          </div>
        </div>
      </div>
    </section>
  );
}
