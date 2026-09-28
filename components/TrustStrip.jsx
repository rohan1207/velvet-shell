const items = [
  {
    label: 'Free worldwide shipping',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
        <path
          d="M3.5 16.5 14 8.8l6.2-3.3c.6-.3 1.2.3.9.9L17.8 12.6 10.1 21"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14 8.8 9.2 13.2"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    label: 'Carefully packed & protected',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
        <path
          d="M4.5 12a7.5 7.5 0 0 1 12.8-5.3L19 5v5h-5l1.8-1.8A5.5 5.5 0 1 0 15.5 17.5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: 'Handmade with love',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
        <path
          d="M8.2 14.2c-1.8-.4-3.2-1.6-3.2-3.4 0-1.6 1.1-2.8 2.6-2.8.9 0 1.6.4 2.1 1 .5-.6 1.2-1 2.1-1 1.5 0 2.6 1.2 2.6 2.8 0 .4-.1.8-.2 1.1"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 9.5c.4-.8 1.1-1.3 2-1.3 1.5 0 2.6 1.2 2.6 2.8 0 2.1-2.2 3.6-4.6 5.2-2.4-1.6-4.6-3.1-4.6-5.2"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 11.2c.5.4.8 1 .8 1.7 0 1.2-.9 1.9-2 2.4"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    label: '100% safe & secure checkout',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
        <path
          d="M12 3.5 5.5 6.2v5.1c0 4 2.7 6.9 6.5 8.2 3.8-1.3 6.5-4.2 6.5-8.2V6.2L12 3.5Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path
          d="m9.2 12.1 1.9 1.9 3.7-3.8"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function TrustStrip() {
  return (
    <section className="bg-burgundy" aria-label="Shopping promises">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 divide-y divide-ivory/15 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x lg:divide-ivory/15">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-center gap-3 px-6 py-5 sm:justify-start sm:px-8 sm:py-6 lg:justify-center"
          >
            <span className="shrink-0 text-gold">{item.icon}</span>
            <p className="font-label text-[10px] leading-snug tracking-[0.14em] text-ivory uppercase sm:text-[11px]">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
