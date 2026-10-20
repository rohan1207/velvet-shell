const items = [
  {
    highlight: 'Softly Held',
    line: 'Thoughtfully Made',
  },
  {
    highlight: '925 Silver',
    line: 'Clean, sculptural, enduring',
  },
  {
    highlight: '18K Gold-Plated',
    line: 'Warmth with a softer glow',
  },
  {
    highlight: 'Freshwater Pearls',
    line: 'Natural luminosity, understated',
  },
];

export default function TrustStrip() {
  return (
    <section
      className="border-y border-ink/8 bg-[#f7f4ef]"
      aria-label="Velvet Shell materials and craft"
    >
      <div className="mx-auto grid max-w-[1600px] grid-cols-2 divide-x divide-y divide-ink/8 lg:grid-cols-4 lg:divide-y-0">
        {items.map((item) => (
          <div
            key={item.highlight}
            className="flex flex-col items-center justify-center gap-1 px-3 py-3.5 text-center sm:px-6 sm:py-4"
          >
            <p className="font-label text-[10px] tracking-[0.2em] text-burgundy uppercase sm:text-[11px]">
              {item.highlight}
            </p>
            <p className="font-display text-[15px] leading-snug text-ink md:text-[16px]">
              {item.line}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
