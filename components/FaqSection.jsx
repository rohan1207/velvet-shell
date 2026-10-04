'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { faqCategories, faqHighlights } from '@/lib/faqs';
import { FaqAccordion } from '@/components/FaqAccordion';

export function FaqExperience() {
  const [activeId, setActiveId] = useState(faqCategories[0].id);

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && faqCategories.some((category) => category.id === hash)) {
      setActiveId(hash);
    }
  }, []);

  const activeCategory = useMemo(
    () => faqCategories.find((category) => category.id === activeId) ?? faqCategories[0],
    [activeId],
  );

  const selectCategory = (id) => {
    setActiveId(id);
    window.history.replaceState(null, '', `#${id}`);
  };

  return (
    <div className="bg-ivory pt-28 pb-24 md:pt-36">
      <div className="mx-auto max-w-[1200px] px-5 md:px-10">
        <header className="max-w-2xl">
          <p className="font-label text-gold">FAQs</p>
          <h1 className="font-display mt-4 text-[clamp(2.8rem,6vw,5rem)] leading-[0.95] tracking-[-0.03em] text-ink">
            Answers, quietly arranged.
          </h1>
          <p className="mt-5 max-w-lg text-[15px] font-light leading-relaxed text-ink/85">
            Shipping, returns, materials, care, gifting — and how to reach us when you need a little more.
          </p>
        </header>

        <div className="mt-12 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden">
          {faqCategories.map((category) => {
            const active = category.id === activeId;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => selectCategory(category.id)}
                className={`shrink-0 px-4 py-2.5 text-[12px] font-light tracking-[-0.01em] transition-colors duration-400 ${
                  active ? 'text-burgundy' : 'text-ink/80 hover:text-ink'
                }`}
                aria-current={active ? 'true' : undefined}
              >
                {category.title}
                {active && <span className="mt-1 block h-px w-full bg-burgundy" />}
              </button>
            );
          })}
        </div>

        <div className="mt-10 grid gap-12 lg:mt-16 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-16 xl:grid-cols-[280px_minmax(0,1fr)]">
          <nav className="hidden lg:block" aria-label="FAQ categories">
            <ul className="sticky top-32 space-y-1 border-l border-ink/10">
              {faqCategories.map((category) => {
                const active = category.id === activeId;
                return (
                  <li key={category.id}>
                    <button
                      type="button"
                      onClick={() => selectCategory(category.id)}
                      className={`-ml-px block w-full border-l py-2.5 pl-5 text-left text-[14px] font-light transition-colors duration-400 ${
                        active
                          ? 'border-burgundy text-burgundy'
                          : 'border-transparent text-ink/80 hover:text-ink'
                      }`}
                      aria-current={active ? 'true' : undefined}
                    >
                      {category.title}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div>
            <div className="mb-2 flex items-end justify-between gap-4 border-b border-ink/10 pb-4">
              <div>
                <p className="font-label text-[10px] text-ink/85">Category</p>
                <h2 className="font-display mt-2 text-3xl text-ink md:text-4xl">{activeCategory.title}</h2>
              </div>
              <p className="font-label text-[10px] text-ink/85">
                {activeCategory.items.length}{' '}
                {activeCategory.items.length === 1 ? 'question' : 'questions'}
              </p>
            </div>

            <FaqAccordion key={activeCategory.id} items={activeCategory.items} defaultOpenIndex={0} />

            <div className="mt-14 border-t border-ink/10 pt-10">
              <p className="font-display text-2xl text-ink md:text-3xl">Still looking?</p>
              <p className="mt-3 max-w-md text-[15px] font-light leading-relaxed text-ink/85">
                For product, order or gifting enquiries, write to us through Contact Us.
              </p>
              <Link
                href="/contact"
                className="mt-6 inline-flex items-center gap-3 font-label text-[11px] tracking-[0.18em] text-burgundy transition-opacity hover:opacity-70"
              >
                Contact Us
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Compact FAQ preview — a few highlights with a link to the full page. */
export default function FaqSection({ className = '' }) {
  return (
    <section className={`bg-ivory ${className}`}>
      <div className="mx-auto max-w-[1200px] px-5 py-16 md:px-10 md:py-20">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="font-label text-gold">FAQs</p>
            <h2 className="font-display mt-3 text-3xl text-ink md:text-4xl">A few quiet answers.</h2>
          </div>
          <Link
            href="/faq"
            className="bg-velvet-texture inline-flex items-center rounded-full px-5 py-2.5 font-label text-[11px] tracking-[0.18em] text-ivory transition-opacity hover:opacity-90"
          >
            View all FAQs
          </Link>
        </div>

        <div className="mt-10 border-t border-ink/10">
          <FaqAccordion items={faqHighlights} />
        </div>
      </div>
    </section>
  );
}
