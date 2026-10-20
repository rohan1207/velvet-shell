/**
 * Quiet product notes — PDP and home.
 * Framed carefully so they read as craft guidance, not a warning banner.
 */

export const COLOUR_VARIATION_NOTE =
  'As each piece is finished by hand, colour and detail may vary gently from the photographs. What you receive is uniquely yours.';

export const EARRING_LENGTH_NOTE =
  'On longer drop styles, dangle length can be tailored to your preference — tell us when you place your order.';

export function ProductPageNotes({ category }) {
  const isEarrings = String(category || '').toLowerCase() === 'earrings';

  return (
    <div className="mt-8 space-y-2.5 border-t border-ink/8 pt-6">
      {isEarrings ? (
        <p className="max-w-md text-[12px] font-light leading-relaxed text-ink/55">
          {EARRING_LENGTH_NOTE}
        </p>
      ) : null}
      <p className="max-w-md text-[12px] font-light leading-relaxed text-ink/55">
        {COLOUR_VARIATION_NOTE}
      </p>
    </div>
  );
}

/** Minimal, centered home note under card sections */
export function HomeProductNotes() {
  return (
    <section className="bg-pearl px-5 py-8 md:px-10 md:py-10" aria-label="Product notes">
      <div className="mx-auto max-w-xl text-center">
        <p className="text-[11px] font-light leading-relaxed tracking-[0.01em] text-ink/45 md:text-[12px]">
          {COLOUR_VARIATION_NOTE}
        </p>
        <p className="mt-2.5 text-[11px] font-light leading-relaxed tracking-[0.01em] text-ink/45 md:text-[12px]">
          {EARRING_LENGTH_NOTE}
        </p>
      </div>
    </section>
  );
}
