'use client';

import { useState } from 'react';
import AppImage from '@/components/AppImage';
import Link from 'next/link';
import ResponsiveBannerImage from '@/components/ResponsiveBannerImage';
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

const packagingShots = [
  {
    src: '/images/gifting/packaging/official-packaging.png',
    alt: 'Velvet Shell gift bag with burgundy ribbon and open shell jewellery cases',
    label: 'The reveal',
    span: 'sm:col-span-2 lg:col-span-7 lg:row-span-2',
    aspect: 'aspect-[4/3] lg:aspect-auto lg:min-h-[28rem]',
  },
  {
    src: '/images/gifting/packaging/bag-ribbon.jpg',
    alt: 'Velvet Shell white gift bag with branded burgundy ribbon',
    label: 'Gift bag',
    span: 'lg:col-span-5',
    aspect: 'aspect-[5/4]',
  },
  {
    src: '/images/gifting/packaging/wedding-favours.jpg',
    alt: 'Velvet Shell wedding favours with shell boxes and ribbons',
    label: 'Wedding favours',
    span: 'lg:col-span-5',
    aspect: 'aspect-[5/4]',
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
    <div className="bg-ivory text-ink overflow-x-clip">
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#f7f0ea] via-ivory to-[#efe4da] pt-page lg:min-h-[100svh]">
        <div
          className="pointer-events-none absolute -top-24 right-[-20%] h-[18rem] w-[18rem] rounded-full bg-burgundy/[0.06] blur-3xl sm:right-[-10%] sm:h-[28rem] sm:w-[28rem] md:h-[36rem] md:w-[36rem]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-0 left-[-25%] h-[14rem] w-[14rem] rounded-full bg-gold/15 blur-3xl sm:left-[-15%] sm:h-[22rem] sm:w-[22rem]"
          aria-hidden
        />

        <div className="relative mx-auto grid max-w-[1600px] items-start gap-6 px-4 pb-10 pt-3 sm:gap-10 sm:px-6 sm:pb-16 sm:pt-6 md:gap-12 md:px-10 md:pb-20 lg:min-h-[calc(100svh-var(--site-chrome-offset))] lg:grid-cols-12 lg:items-center lg:gap-8 lg:pt-10">
          <div className="animate-[fade-up_0.9s_var(--ease-luxe)_both] lg:col-span-5 lg:self-center">
            <p className="font-display text-[clamp(1.85rem,8vw,3.75rem)] leading-[0.95] tracking-[-0.04em] text-burgundy">
              Velvet Shell
            </p>
            <p className="font-label mt-2 text-[9px] tracking-[0.2em] text-gold uppercase sm:mt-4 sm:text-[10px] sm:tracking-[0.28em]">
              Corporate gifting & wedding favours
            </p>
            <h1 className="font-display mt-3 max-w-[16ch] text-[clamp(1.5rem,6.5vw,3.35rem)] leading-[1.1] tracking-[-0.03em] text-ink sm:mt-6 sm:max-w-[18ch]">
              Chosen with thought.
              <span className="mt-0.5 block text-burgundy sm:mt-1">Given with meaning.</span>
            </h1>
            <p className="mt-3 max-w-md text-[13px] font-light leading-[1.65] text-ink/75 sm:mt-5 sm:text-[15px] sm:leading-[1.75]">
              Curated jewellery in official Velvet Shell packaging — for clients, teams, leaders and
              celebrations.
            </p>
            <div className="mt-5 flex w-full flex-col gap-2.5 sm:mt-9 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
              <button
                type="button"
                onClick={scrollToBrief}
                className="bg-velvet-texture inline-flex h-11 w-full items-center justify-center gap-3 rounded-full px-6 font-label text-[11px] tracking-[0.16em] text-ivory sm:h-12 sm:w-auto sm:justify-start sm:px-7 sm:tracking-[0.2em]"
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

          <div className="relative w-full min-w-0 animate-[fade-up_1.05s_var(--ease-luxe)_0.12s_both] lg:col-span-7">
            <div className="relative mx-auto aspect-[5/4] w-full max-w-3xl overflow-hidden rounded-[1.15rem] bg-white shadow-[0_18px_50px_rgba(40,20,24,0.1)] ring-1 ring-ink/6 sm:rounded-[1.75rem] md:rounded-[2rem]">
              <ResponsiveBannerImage
                src="/images/gifting/hero-packaging.jpg"
                alt="Velvet Shell official gifting packaging — gift bag, ribbon and shell cases"
                priority
                className="object-cover object-center"
              />
            </div>
            <div className="absolute -bottom-3 -left-1 hidden w-[42%] overflow-hidden rounded-[1.25rem] bg-white p-2 shadow-[0_18px_50px_rgba(40,20,24,0.14)] ring-1 ring-ink/8 sm:block md:-bottom-6 md:left-[-4%] md:w-[38%] md:rounded-[1.5rem] md:p-2.5 lg:left-[-6%]">
              <div className="relative aspect-square overflow-hidden rounded-[1rem] md:rounded-[1.15rem]">
                <AppImage
                  src="/images/gifting/packaging/official-packaging.png"
                  alt="Shell cases and ribbon reveal"
                  fill
                  sizes="280px"
                  className="object-cover object-center"
                />
              </div>
              <p className="font-label mt-2 px-1 pb-0.5 text-[9px] tracking-[0.2em] text-ink/55 uppercase">
                A treasure in every reveal
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="relative overflow-hidden border-y border-ink/6 bg-pearl">
        <div className="mx-auto grid max-w-[1600px] items-center gap-8 px-4 py-12 sm:gap-12 sm:px-6 sm:py-16 md:gap-16 md:px-10 md:py-24 lg:grid-cols-12">
          <div className="relative mx-auto w-full max-w-[17.5rem] sm:max-w-md lg:col-span-5 lg:max-w-none">
            <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-full bg-white ring-1 ring-ink/8 shadow-[0_16px_48px_rgba(40,20,24,0.1)]">
              <AppImage
                src="/images/gifting/weeding.png"
                alt="Velvet Shell gift bag and open shell case"
                fill
                sizes="(max-width:1024px) 70vw, 40vw"
                className="object-cover object-center scale-[1.02]"
              />
            </div>
          </div>

          <div className="min-w-0 lg:col-span-6 lg:col-start-7">
            <p className="font-label text-[9px] tracking-[0.22em] text-gold uppercase sm:text-[10px] sm:tracking-[0.28em]">
              The approach
            </p>
            <h2 className="font-display mt-3 text-[clamp(1.75rem,6.5vw,3.5rem)] leading-[1.08] tracking-[-0.03em] sm:mt-4">
              More than a gesture
            </h2>
            <p className="mt-4 max-w-lg text-[14px] font-light leading-[1.75] text-ink/80 sm:mt-6 sm:text-[15px] sm:leading-[1.85]">
              A corporate gift can acknowledge a relationship, mark a milestone or simply say, we
              value this.
            </p>
            <p className="mt-3 max-w-lg text-[14px] font-light leading-[1.75] text-ink/80 sm:mt-4 sm:text-[15px] sm:leading-[1.85]">
              Our approach begins with understanding the occasion, the recipient and the sentiment —
              then finding something that feels genuinely worth receiving.
            </p>
            <button
              type="button"
              onClick={scrollToBrief}
              className="mt-7 inline-flex items-center gap-3 font-label text-[11px] tracking-[0.18em] text-burgundy sm:mt-8 sm:tracking-[0.2em]"
            >
              Share your occasion
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full border border-burgundy/25 text-sm"
                aria-hidden
              >
                →
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Packaging bento */}
      <section className="bg-ivory">
        <div className="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 sm:py-16 md:px-10 md:py-24">
          <div className="flex flex-col justify-between gap-5 sm:gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl min-w-0">
              <p className="font-label text-[9px] tracking-[0.22em] text-gold uppercase sm:text-[10px] sm:tracking-[0.28em]">
                Packaging
              </p>
              <h2 className="font-display mt-2 text-[clamp(1.7rem,6.5vw,3.4rem)] leading-[1.08] tracking-[-0.02em] sm:mt-3">
                A treasure in every reveal
              </h2>
              <p className="mt-3 max-w-xl text-[14px] font-light leading-[1.7] text-ink/75 sm:mt-4 sm:text-[15px] sm:leading-[1.8]">
                White gift bag, burgundy Velvet Shell ribbon, and scallop shell cases — also available
                as wedding favours.
              </p>
            </div>
            <Link
              href="/shop?category=sets"
              className="inline-flex shrink-0 items-center gap-2 self-start font-label text-[11px] tracking-[0.16em] text-ink/70 uppercase transition-colors hover:text-burgundy sm:tracking-[0.18em]"
            >
              Explore gift sets
              <span aria-hidden>→</span>
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-4 md:gap-5 lg:mt-12 lg:grid-cols-12 lg:grid-rows-[auto_auto]">
            {packagingShots.map((shot, i) => (
              <figure
                key={shot.src}
                className={`group relative min-w-0 overflow-hidden rounded-[1.1rem] bg-white ring-1 ring-ink/6 sm:rounded-[1.35rem] ${shot.span}`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className={`relative w-full overflow-hidden ${shot.aspect} lg:h-full`}>
                  <AppImage
                    src={shot.src}
                    alt={shot.alt}
                    fill
                    sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 50vw"
                    className="object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent opacity-80"
                    aria-hidden
                  />
                  <figcaption className="absolute bottom-3 left-3 font-label text-[9px] tracking-[0.18em] text-ivory uppercase sm:bottom-4 sm:left-4 sm:text-[10px] sm:tracking-[0.2em]">
                    {shot.label}
                  </figcaption>
                </div>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Occasions */}
      <section className="overflow-hidden bg-gradient-to-b from-[#f6efe8] to-ivory">
        <div className="relative min-h-[52vw] overflow-hidden sm:min-h-[36vh] md:min-h-[42vh]">
          <AppImage
            src="/images/gifting/occasion-packaging.jpg"
            alt="Velvet Shell wedding favours and occasion packaging"
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/45 to-ink/20 md:bg-gradient-to-r md:from-ink/75 md:via-ink/45 md:to-ink/20"
            aria-hidden
          />
          <div className="relative z-10 mx-auto flex min-h-[52vw] max-w-[1600px] flex-col justify-end px-4 py-10 sm:min-h-[36vh] sm:px-6 sm:py-12 md:min-h-[42vh] md:px-10 md:py-16">
            <p className="font-label text-[9px] tracking-[0.22em] text-gold uppercase sm:text-[10px] sm:tracking-[0.28em]">
              The edit
            </p>
            <h2 className="font-display mt-2 max-w-2xl text-[clamp(1.85rem,7vw,3.8rem)] leading-[1.05] tracking-[-0.03em] text-ivory sm:mt-3">
              Curated for the occasion
            </h2>
            <p className="mt-3 max-w-md text-[14px] font-light leading-relaxed text-ivory/80 sm:mt-4 sm:text-[15px]">
              Corporate edits, wedding favours, and festive moments — each tuned to the relationship.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 sm:py-14 md:px-10 md:py-20">
          <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5">
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
                <span
                  className="mt-5 inline-flex h-8 w-8 items-center justify-center rounded-full border border-ink/10 text-sm text-ink/40 transition-colors group-hover:border-burgundy/30 group-hover:text-burgundy sm:mt-6"
                  aria-hidden
                >
                  →
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Sets invite */}
      <section className="bg-ivory">
        <div className="mx-auto grid max-w-[1600px] items-center gap-8 px-4 py-12 sm:gap-10 sm:px-6 sm:py-16 md:px-10 md:py-24 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <p className="font-label text-[9px] tracking-[0.22em] text-gold uppercase sm:text-[10px] sm:tracking-[0.28em]">
              Gift sets
            </p>
            <h2 className="font-display mt-2 text-[clamp(1.7rem,6.5vw,3.2rem)] leading-[1.08] tracking-[-0.02em] sm:mt-3">
              Pieces meant to be worn together
            </h2>
            <p className="mt-4 max-w-md text-[14px] font-light leading-[1.7] text-ink/75 sm:mt-5 sm:text-[15px] sm:leading-[1.8]">
              Coordinated jewellery sets — ready to gift, or shaped into a corporate edit with our
              packaging.
            </p>
            <Link
              href="/shop?category=sets"
              className="bg-velvet-texture mt-7 inline-flex h-12 w-full items-center justify-center gap-3 rounded-full px-7 font-label text-[11px] tracking-[0.18em] text-ivory sm:mt-8 sm:w-auto sm:justify-start sm:tracking-[0.2em]"
            >
              Shop sets
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ivory/15 text-sm" aria-hidden>
                ↗
              </span>
            </Link>
          </div>
          <div className="relative min-w-0 overflow-hidden rounded-[1.25rem] bg-white ring-1 ring-ink/6 sm:rounded-[1.75rem] lg:col-span-7">
            <div className="relative aspect-[5/4] w-full sm:aspect-[16/10] md:aspect-[16/9]">
              <AppImage
                src="/images/gifting/packaging/shell-pair.jpg"
                alt="Velvet Shell jewellery cases ready for gifting"
                fill
                sizes="(max-width:1024px) 100vw, 55vw"
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Velvet CTA + ticker */}
      <section className="bg-velvet-texture text-ivory overflow-hidden">
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
