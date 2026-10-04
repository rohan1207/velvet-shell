'use client';

import { useId, useState } from 'react';

function PlusMinus({ open }) {
  return (
    <span className="relative flex h-5 w-5 shrink-0 items-center justify-center" aria-hidden>
      <span className="absolute h-px w-3 bg-current" />
      <span
        className={`absolute h-3 w-px bg-current transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? 'scale-y-0' : 'scale-y-100'
        }`}
      />
    </span>
  );
}

export function FaqItem({ question, answer, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  const buttonId = useId();

  return (
    <div className="border-b border-ink/10">
      <h3 className="m-0">
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
          className="flex w-full items-start justify-between gap-6 py-5 text-left transition-colors duration-400 hover:text-burgundy md:py-6"
        >
          <span className="text-[15px] font-light leading-snug tracking-[-0.01em] text-ink md:text-base">
            {question}
          </span>
          <span className={`mt-0.5 text-ink/80 ${open ? 'text-burgundy' : ''}`}>
            <PlusMinus open={open} />
          </span>
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <p className="pb-5 text-[14px] font-light leading-[1.75] text-ink/85 md:pb-6 md:text-[15px]">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export function FaqAccordion({ items, defaultOpenIndex = null }) {
  return (
    <div>
      {items.map((item, index) => (
        <FaqItem
          key={item.question}
          question={item.question}
          answer={item.answer}
          defaultOpen={defaultOpenIndex === index}
        />
      ))}
    </div>
  );
}
