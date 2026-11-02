'use client';

import { useState } from 'react';
import AppImage from '@/components/AppImage';
import Link from 'next/link';
import { whatsappGiftingHref } from '@/lib/social';

const occasions = [
  {
    title: 'Client & Partner Gifting',
    line: 'Thoughtful gestures for relationships that have grown over time.',
  },
  {
    title: 'Leadership Gifting',
    line: 'Considered pieces for moments that call for something distinctive.',
  },
  {
    title: 'Employee & Team Gifting',
    line: 'Meaningful choices for milestones, appreciation and celebration.',
  },
  {
    title: 'Wedding Favours',
    line: 'Shell-wrapped keepsakes for guests — intimate, lasting, and beautifully presented.',
  },
  {
    title: 'Festive Gifting',
    line: 'A refined way to mark the season and the relationships within it.',
  },
  {
    title: 'Milestone Gifting',
    line: 'For new beginnings, achievements and moments worth remembering.',
  },
];

const OCCASION_OPTIONS = [
  'Corporate / client gifts',
  'Wedding favours',
  'Team & employee gifts',
  'Festive gifting',
  'Leadership / milestone',
  'Other',
];

const TICKER = [
  'Client gifts',
  'Wedding favours',
  'Team edits',
  'Leadership',
  'Festive',
  'Milestones',
];

function scrollToBrief() {
  document.getElementById('gifting-brief')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function CorporateGifting() {
  return (
    <div className="overflow-x-clip bg-[#faf7f2] text-ink">
      {/* Hero — brand strip + packaging photos only */}
      <section className="relative isolate pt-page">
        <div className="mx-auto max-w-[1600px] px-4 pb-8 pt-4 sm:px-6 sm:pb-10 sm:pt-6 md:px-10 md:pb-12">
          {/* Brand banner (typographic strip with flower) */}
          <div className="relative mx-auto aspect-[21/9] w-full max-w-5xl overflow-hidden rounded-[1.15rem] bg-[#faf7f2] sm:rounded-[1.5rem] md:aspect-[2.4/1] md:rounded-[1.75rem]">
            <AppImage
              src="/images/gifting/hero-brand-strip.png"
              alt="Velvet Shell — A treasure in every reveal"
              fill
              priority
              sizes="(max-width:1024px) 100vw, 1100px"
              className="object-contain object-center"
            />
          </div>

          {/* Packaging pair — gift box + shell case */}
          <div className="mx-auto mt-5 grid max-w-5xl grid-cols-2 gap-2.5 sm:mt-7 sm:gap-4 md:mt-8 md:gap-5">
            <figure className="relative aspect-square overflow-hidden rounded-[1.1rem] bg-white ring-1 ring-ink/6 sm:rounded-[1.35rem]">
              <AppImage
                src="/images/gifting/hero-gift-box.jpg"
                alt="Velvet Shell white gift box with burgundy branded ribbon"
                fill
                priority
                sizes="(max-width:768px) 50vw, 520px"
                className="object-cover object-center"
              />
            </figure>
            <figure className="relative aspect-square overflow-hidden rounded-[1.1rem] bg-white ring-1 ring-ink/6 sm:rounded-[1.35rem]">
              <AppImage
                src="/images/gifting/hero-shell-open.jpg"
                alt="Open Velvet Shell scallop case held in hand"
                fill
                priority
                sizes="(max-width:768px) 50vw, 520px"
                className="object-cover object-center"
              />
            </figure>
          </div>

          <div className="mx-auto mt-7 flex max-w-5xl flex-col items-center text-center sm:mt-9">
            <p className="font-label text-[9px] tracking-[0.22em] text-gold uppercase sm:text-[10px] sm:tracking-[0.28em]">
              Corporate gifting & wedding favours
            </p>
            <h1 className="font-display mt-3 max-w-[18ch] text-[clamp(1.65rem,5.5vw,3.1rem)] leading-[1.08] tracking-[-0.03em] text-ink">
              Chosen with thought.
              <span className="mt-1 block text-burgundy">Given with meaning.</span>
            </h1>
            <p className="mt-3 max-w-lg text-[13px] font-light leading-[1.7] text-ink/70 sm:mt-4 sm:text-[15px] sm:leading-[1.8]">
              Curated jewellery in official Velvet Shell packaging — for clients, teams, leaders and
              celebrations.
            </p>
            <div className="mt-6 flex w-full flex-col gap-2.5 sm:mt-8 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
              <button
                type="button"
                onClick={scrollToBrief}
                className="bg-velvet-texture inline-flex h-11 w-full items-center justify-center gap-3 rounded-full px-6 font-label text-[11px] tracking-[0.16em] text-ivory sm:h-12 sm:w-auto sm:px-7 sm:tracking-[0.2em]"
              >
                Begin a conversation
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ivory/15 text-sm"
                  aria-hidden
                >
                  ↗
                </span>
              </button>
              <a
                href={whatsappGiftingHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 w-full items-center justify-center rounded-full border border-ink/15 px-6 font-label text-[11px] tracking-[0.16em] text-ink transition-colors hover:border-burgundy/40 hover:text-burgundy sm:h-12 sm:w-auto sm:tracking-[0.18em]"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Flower strip — homepage bloom language */}
      <section
        className="relative overflow-hidden border-y border-ink/6 bg-gradient-to-b from-[#f3ebe3] to-[#faf7f2]"
        aria-hidden
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.65),transparent_70%)]" />
        <div className="relative mx-auto flex h-[7.5rem] max-w-[1600px] items-center justify-center sm:h-[9.5rem] md:h-[11rem]">
          <div className="relative h-[140%] w-[min(100%,28rem)] sm:w-[min(100%,34rem)] md:w-[min(100%,40rem)]">
            <AppImage
              src="/flower-frames/ezgif-frame-001.png"
              alt=""
              fill
              sizes="640px"
              className="object-contain object-center drop-shadow-[0_18px_40px_rgba(94,6,42,0.12)]"
            />
          </div>
        </div>
      </section>

      {/* Occasions */}
      <section className="bg-[#faf7f2]">
        <div className="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 sm:py-16 md:px-10 md:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-label text-[9px] tracking-[0.22em] text-gold uppercase sm:text-[10px] sm:tracking-[0.28em]">
              The edit
            </p>
            <h2 className="font-display mt-3 text-[clamp(1.75rem,6vw,3.2rem)] leading-[1.08] tracking-[-0.03em]">
              Curated for the occasion
            </h2>
            <p className="mt-3 text-[14px] font-light leading-relaxed text-ink/70 sm:mt-4 sm:text-[15px]">
              Corporate edits, wedding favours, and festive moments — each tuned to the relationship.
            </p>
          </div>

          <ul className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-4 lg:mt-12 lg:grid-cols-3 lg:gap-5">
            {occasions.map((item, index) => (
              <li
                key={item.title}
                className="group relative min-w-0 overflow-hidden rounded-[1.15rem] bg-white p-5 ring-1 ring-ink/6 transition-shadow duration-500 hover:shadow-[0_18px_50px_rgba(40,20,24,0.08)] sm:rounded-[1.35rem] sm:p-6 md:p-7"
              >
                <span className="font-label text-[10px] tracking-[0.2em] text-gold">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="font-display mt-3 text-[1.3rem] leading-[1.18] tracking-[-0.02em] text-ink sm:mt-4 sm:text-[1.45rem] md:text-[1.65rem]">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-[13px] font-light leading-relaxed text-ink/70 sm:mt-3 sm:text-[14px]">
                  {item.line}
                </p>
                <button
                  type="button"
                  onClick={scrollToBrief}
                  className="mt-5 inline-flex h-8 w-8 items-center justify-center rounded-full border border-ink/10 text-sm text-ink/40 transition-colors group-hover:border-burgundy/30 group-hover:text-burgundy sm:mt-6"
                  aria-label={`Enquire about ${item.title}`}
                >
                  →
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Velvet CTA + ticker */}
      <section className="bg-velvet-texture overflow-hidden text-ivory">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-8 px-4 py-12 sm:gap-10 sm:px-6 sm:py-16 md:flex-row md:items-end md:justify-between md:gap-16 md:px-10 md:py-20">
          <div className="max-w-2xl min-w-0">
            <p className="font-label text-[9px] tracking-[0.22em] text-gold uppercase sm:text-[10px] sm:tracking-[0.28em]">
              Made for your occasion
            </p>
            <h2 className="font-display mt-3 text-[clamp(1.55rem,6vw,3rem)] leading-[1.12] tracking-[-0.02em] sm:mt-4">
              Whether you are gifting one meaningful piece or curating for an entire team, we shape a
              considered experience with you.
            </h2>
          </div>
          <button
            type="button"
            onClick={scrollToBrief}
            className="inline-flex w-full shrink-0 items-center justify-center gap-3 rounded-full border border-ivory/35 px-6 py-3.5 text-center font-label text-[11px] tracking-[0.16em] text-ivory transition-colors hover:border-gold hover:text-gold sm:w-auto sm:px-7 sm:tracking-[0.2em]"
          >
            Enquire for corporate gifting
            <span aria-hidden>→</span>
          </button>
        </div>
        <div className="overflow-hidden border-t border-ivory/10 py-3.5 sm:py-4" aria-hidden>
          <div className="flex w-max animate-[marquee_28s_linear_infinite] gap-8 whitespace-nowrap font-label text-[10px] tracking-[0.22em] text-ivory/45 uppercase sm:gap-10 sm:text-[11px] sm:tracking-[0.28em]">
            {[...TICKER, ...TICKER, ...TICKER].map((label, i) => (
              <span key={`${label}-${i}`} className="inline-flex items-center gap-8 sm:gap-10">
                {label}
                <span className="text-gold/70">✦</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Enquiry */}
      <section id="gifting-brief" className="scroll-mt-24 bg-pearl sm:scroll-mt-28 md:scroll-mt-32">
        <div className="mx-auto grid max-w-[1600px] gap-10 px-4 py-12 sm:gap-12 sm:px-6 sm:py-16 md:gap-16 md:px-10 md:py-24 lg:grid-cols-12 lg:gap-20">
          <div className="min-w-0 lg:col-span-5">
            <p className="font-label text-[9px] tracking-[0.22em] text-gold uppercase sm:text-[10px] sm:tracking-[0.28em]">
              Enquiry
            </p>
            <h2 className="font-display mt-3 text-[clamp(1.75rem,7vw,3.5rem)] leading-[1.08] tracking-[-0.03em] sm:mt-4">
              Have a gifting brief?
            </h2>
            <p className="mt-4 max-w-md text-[14px] font-light leading-[1.7] text-ink/75 sm:mt-5 sm:text-[15px] sm:leading-[1.8]">
              A few details are enough — we will write back with considered options.
            </p>
            <p className="mt-6 text-[13px] font-light leading-relaxed text-ink/60 sm:mt-8">
              Prefer WhatsApp?{' '}
              <a
                href={whatsappGiftingHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-burgundy transition-opacity hover:opacity-70"
              >
                Message us
              </a>
              {' · '}
              <Link href="/contact" className="text-burgundy transition-opacity hover:opacity-70">
                Contact
              </Link>
            </p>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <GiftingEnquiryForm />
          </div>
        </div>
      </section>
    </div>
  );
}

function GiftingEnquiryForm() {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  async function onSubmit(event) {
    event.preventDefault();
    setError('');
    setStatus('sending');

    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get('name') || '').trim(),
      email: String(form.get('email') || '').trim(),
      occasion: String(form.get('occasion') || '').trim(),
      note: String(form.get('note') || '').trim(),
    };

    try {
      const res = await fetch('/api/gifting/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Could not send enquiry.');
      setStatus('sent');
    } catch (err) {
      setStatus('idle');
      setError(err.message || 'Could not send enquiry.');
    }
  }

  if (status === 'sent') {
    return (
      <div className="rounded-[1.25rem] bg-white px-5 py-8 ring-1 ring-ink/8 sm:rounded-[1.5rem] sm:px-6 sm:py-10 md:px-10 md:py-12">
        <p className="font-display text-[1.75rem] text-ink sm:text-3xl md:text-4xl">We have your brief.</p>
        <p className="mt-3 max-w-sm text-[14px] font-light leading-relaxed text-ink/75 sm:mt-4 sm:text-[15px]">
          Our team will review your occasion and write back with considered options.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-6 rounded-[1.25rem] bg-white px-5 py-7 ring-1 ring-ink/8 sm:space-y-7 sm:rounded-[1.5rem] sm:px-6 sm:py-8 md:space-y-8 md:px-10 md:py-10"
    >
      <Field label="Name" name="name" required autoComplete="name" />
      <Field label="Email" name="email" type="email" required autoComplete="email" />
      <label className="block">
        <span className="font-label text-[10px] tracking-[0.14em] text-ink/55 uppercase">Occasion</span>
        <select
          name="occasion"
          required
          defaultValue=""
          className="mt-3 w-full appearance-none border-b border-ink/12 bg-transparent py-3 text-[15px] font-light text-ink outline-none"
        >
          <option value="" disabled>
            Choose an occasion…
          </option>
          {OCCASION_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="font-label text-[10px] tracking-[0.14em] text-ink/55 uppercase">Note</span>
        <textarea
          name="note"
          rows={3}
          placeholder="Quantity, timeline, or anything we should know…"
          className="mt-3 w-full resize-none border-b border-ink/12 bg-transparent py-3 text-[15px] font-light text-ink outline-none placeholder:text-ink/30"
        />
      </label>
      {error ? <p className="text-sm text-burgundy">{error}</p> : null}
      <button
        type="submit"
        disabled={status === 'sending'}
        className="bg-velvet-texture mt-2 inline-flex h-12 w-full items-center justify-center gap-3 rounded-full px-8 font-label text-[11px] tracking-[0.18em] text-ivory transition-opacity hover:opacity-90 disabled:opacity-60 sm:w-auto sm:justify-start sm:tracking-[0.2em]"
      >
        {status === 'sending' ? 'Sending…' : 'Send enquiry'}
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ivory/15 text-sm" aria-hidden>
          ↗
        </span>
      </button>
    </form>
  );
}

function Field({ label, name, type = 'text', required, placeholder, autoComplete }) {
  return (
    <label className="block">
      <span className="font-label text-[10px] tracking-[0.14em] text-ink/55 uppercase">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="mt-3 w-full border-b border-ink/12 bg-transparent py-3 text-[15px] font-light text-ink outline-none placeholder:text-ink/30"
      />
    </label>
  );
}
