'use client';

import { useEffect, useState } from 'react';
import AppImage from '@/components/AppImage';
import ResponsiveBannerImage from '@/components/ResponsiveBannerImage';

const packagingShots = [
  {
    id: 'wedding',
    src: '/images/gifting/packaging/wedding-bento.jpg',
    alt: 'Velvet Shell wedding gift box with burgundy ribbon',
    label: 'Wedding',
  },
  {
    id: 'reveal',
    src: '/images/gifting/packaging/shell-reveal-bento.jpg',
    alt: 'Open Velvet Shell case with jewellery — the reveal',
    label: 'The reveal',
  },
  {
    id: 'bag',
    src: '/images/gifting/packaging/gift-bag-bento.jpg',
    alt: 'Velvet Shell gift box with wooden ring and branded ribbon',
    label: 'Gift bag',
  },
];

const occasions = [
  {
    title: 'Client & Partner Gifting',
    line: 'Thoughtful gestures for relationships that have grown over time.',
    formValue: 'Corporate / client gifts',
  },
  {
    title: 'Leadership Gifting',
    line: 'Considered pieces for moments that call for something distinctive.',
    formValue: 'Leadership / milestone',
  },
  {
    title: 'Employee & Team Gifting',
    line: 'Meaningful choices for milestones, appreciation and celebration.',
    formValue: 'Team & employee gifts',
  },
  {
    title: 'Wedding Favours',
    line: 'Shell-wrapped keepsakes for guests — intimate, lasting, and beautifully presented.',
    formValue: 'Wedding favours',
  },
  {
    title: 'Festive Gifting',
    line: 'A refined way to mark the season and the relationships within it.',
    formValue: 'Festive gifting',
  },
  {
    title: 'Milestone Gifting',
    line: 'For new beginnings, achievements and moments worth remembering.',
    formValue: 'Leadership / milestone',
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

/** One type system for the gifting page — Playfair headings, Montserrat labels, Poppins body. */
const eyebrowClass = 'font-label text-[10px] tracking-[0.22em] text-gold';
const captionClass = 'font-label text-[10px] tracking-[0.22em] text-ivory';
const titleClass =
  'font-display mt-2 text-[clamp(1.7rem,5vw,2.85rem)] leading-[1.08] tracking-[-0.02em] text-ink';
const bodyClass = 'mt-3 max-w-xl text-sm font-light leading-relaxed text-ink/75';
const linkClass = 'font-label text-[11px] tracking-[0.18em]';
const buttonClass = 'font-label text-[11px] tracking-[0.18em]';

export default function CorporateGifting() {
  const [preferredOccasion, setPreferredOccasion] = useState('');

  function goToForm(occasionValue = '') {
    if (occasionValue) setPreferredOccasion(occasionValue);
    // Allow state to flush before focus/scroll
    requestAnimationFrame(() => {
      scrollToBrief();
      window.setTimeout(() => {
        document.getElementById('gifting-name')?.focus({ preventScroll: true });
      }, 350);
    });
  }

  return (
    <div className="overflow-x-clip bg-ivory text-ink">
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

        <div className="relative mx-auto grid max-w-[1600px] items-start gap-5 px-4 pb-8 pt-2 sm:gap-8 sm:px-6 sm:pb-14 sm:pt-5 md:gap-10 md:px-10 md:pb-16 lg:min-h-[calc(100svh-var(--site-chrome-offset))] lg:grid-cols-12 lg:items-center lg:gap-8 lg:pt-8">
          <div className="animate-[fade-up_0.9s_var(--ease-luxe)_both] min-w-0 lg:col-span-5 lg:self-center">
            <p className="font-display text-[clamp(1.85rem,6vw,3.25rem)] leading-[1.05] tracking-[-0.02em] text-burgundy">
              Velvet Shell
            </p>
            <p className={`${eyebrowClass} mt-3`}>
              Corporate gifting & wedding favours
            </p>
            <h1 className="font-display mt-3 max-w-[18ch] text-[clamp(1.7rem,5vw,3rem)] leading-[1.08] tracking-[-0.02em] text-ink sm:mt-4">
              Chosen with thought.
              <span className="mt-1 block text-burgundy">Given with meaning.</span>
            </h1>
            <p className="mt-3 max-w-md text-sm font-light leading-relaxed text-ink/75 sm:mt-4">
              Curated jewellery in official Velvet Shell packaging — for clients, teams, leaders and
              celebrations.
            </p>
            <div className="mt-5 flex w-full flex-col gap-2.5 sm:mt-8 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
              <button
                type="button"
                onClick={() => goToForm()}
                className={`bg-velvet-texture inline-flex h-11 w-full items-center justify-center gap-3 rounded-full px-6 text-ivory sm:h-12 sm:w-auto sm:justify-start sm:px-7 ${buttonClass}`}
              >
                Begin a conversation
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ivory/15 text-sm"
                  aria-hidden
                >
                  ↗
                </span>
              </button>
              <button
                type="button"
                onClick={() => goToForm()}
                className={`inline-flex h-11 w-full items-center justify-center rounded-full border border-ink/15 px-6 text-ink transition-colors hover:border-burgundy/40 hover:text-burgundy sm:h-12 sm:w-auto ${buttonClass}`}
              >
                Share a brief
              </button>
            </div>
          </div>

          <div className="relative w-full min-w-0 animate-[fade-up_1.05s_var(--ease-luxe)_0.12s_both] lg:col-span-7">
            <div className="relative mx-auto aspect-[4/3] w-full max-w-3xl overflow-hidden rounded-[1.15rem] bg-white shadow-[0_18px_50px_rgba(40,20,24,0.1)] ring-1 ring-ink/6 sm:aspect-[5/4] sm:rounded-[1.75rem] md:rounded-[2rem]">
              <ResponsiveBannerImage
                src="/images/gifting/hero-gift-box.jpg"
                alt="Velvet Shell gift box with burgundy ribbon and wooden ring"
                priority
                className="object-cover object-center"
              />
            </div>
            <div className="absolute -bottom-2 left-2 w-[36%] overflow-hidden rounded-[1rem] bg-white p-1.5 shadow-[0_18px_50px_rgba(40,20,24,0.14)] ring-1 ring-ink/8 sm:-bottom-4 sm:left-0 sm:w-[42%] sm:rounded-[1.25rem] sm:p-2 md:-bottom-6 md:left-[-4%] md:w-[38%] md:rounded-[1.5rem] md:p-2.5 lg:left-[-6%]">
              <div className="relative aspect-square overflow-hidden rounded-[0.85rem] sm:rounded-[1rem] md:rounded-[1.15rem]">
                <AppImage
                  src="/images/gifting/hero-shell-open.jpg"
                  alt="Open Velvet Shell jewellery case"
                  fill
                  sizes="(max-width:640px) 40vw, 280px"
                  className="object-cover object-center"
                />
              </div>
              <p className={`${eyebrowClass} mt-2 hidden px-1 pb-0.5 text-ink/55 sm:block`}>
                A treasure in every reveal
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enquiry — under hero */}
      <section
        id="gifting-brief"
        className="scroll-mt-24 bg-pearl sm:scroll-mt-28 md:scroll-mt-32 lg:flex lg:min-h-[100svh] lg:flex-col lg:overflow-hidden"
      >
        <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-center gap-5 px-4 py-8 sm:gap-7 sm:px-6 sm:py-10 md:px-10 md:py-12 lg:min-h-0 lg:grid lg:grid-cols-12 lg:items-center lg:gap-10 lg:py-10 xl:gap-14">
          <div className="min-w-0 lg:col-span-5">
            <p className={eyebrowClass}>Enquiry</p>
            <h2 className={titleClass}>Have a gifting brief?</h2>
            <p className={bodyClass}>
              A few details are enough — we will write back with considered options for corporate
              gifts, wedding favours, or team edits.
            </p>
            <button
              type="button"
              onClick={() => goToForm()}
              className={`mt-4 inline-flex items-center gap-2 text-burgundy sm:mt-5 ${linkClass}`}
            >
              Fill the form
              <span aria-hidden>→</span>
            </button>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <GiftingEnquiryForm preferredOccasion={preferredOccasion} />
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="relative overflow-x-clip border-y border-ink/6 bg-[#f7f2ea]">
        <div className="relative mx-auto max-w-[1600px] px-4 py-6 sm:px-8 sm:py-8 md:px-10 md:py-9 lg:py-10">
          <div
            className="pointer-events-none absolute top-1/2 left-1 z-0 hidden h-[15.5rem] w-[15.5rem] -translate-y-[55%] scale-110 sm:block md:left-4 md:h-[18.5rem] md:w-[18.5rem] md:scale-[1.12] lg:left-8 lg:h-[20rem] lg:w-[20rem] xl:left-12"
            aria-hidden
          >
            <AppImage
              src="/images/gifting/approach-shell-gift.png"
              alt=""
              fill
              sizes="320px"
              className="object-contain mix-blend-lighten"
            />
          </div>
          <div
            className="pointer-events-none absolute top-1/2 right-1 z-0 hidden h-[12rem] w-[12rem] -translate-y-[62%] scale-110 sm:block md:right-4 md:h-[14.5rem] md:w-[14.5rem] md:scale-[1.12] lg:right-8 lg:h-[15.5rem] lg:w-[15.5rem] xl:right-12"
            aria-hidden
          >
            <AppImage
              src="/images/gifting/approach-floral.png"
              alt=""
              fill
              sizes="240px"
              className="object-contain mix-blend-lighten"
            />
          </div>

          <div className="relative z-10 mx-auto flex w-full max-w-xl flex-col items-center text-center lg:max-w-2xl">
            <div className="relative mb-3 aspect-square w-[7.75rem] sm:hidden">
              <AppImage
                src="/images/gifting/approach-shell-gift.png"
                alt="Jewellery in a Velvet Shell gift case"
                fill
                sizes="124px"
                className="object-contain mix-blend-lighten"
              />
            </div>

            <p className={eyebrowClass}>The approach</p>
            <p className="font-display mt-2 text-[clamp(1.7rem,5vw,2.85rem)] leading-[1.08] tracking-[-0.02em] text-ink sm:mt-3">
              Velvet Shell
            </p>
            <p className="font-display-italic mt-2 text-[clamp(1.35rem,3.5vw,2rem)] leading-snug text-burgundy sm:mt-3">
              A treasure in every reveal
            </p>
            <span className="mt-3 h-px w-10 bg-gold sm:mt-4 sm:w-14" aria-hidden />
            <p className="mt-3 max-w-[28rem] text-sm font-light leading-relaxed text-ink/75 sm:mt-4">
              Corporate gifts and wedding favours, chosen with care and presented in official Velvet
              Shell packaging — so every gesture feels considered from the first unboxing.
            </p>
            <button
              type="button"
              onClick={() => goToForm()}
              className={`mt-5 inline-flex items-center gap-3 text-burgundy sm:mt-6 ${linkClass}`}
            >
              Share your gifting brief
              <span
                className="flex h-7 w-7 items-center justify-center rounded-full border border-burgundy/25 text-sm"
                aria-hidden
              >
                →
              </span>
            </button>

            <div className="relative mt-4 aspect-square w-[6.25rem] opacity-95 sm:hidden">
              <AppImage
                src="/images/gifting/approach-floral.png"
                alt=""
                fill
                sizes="100px"
                className="object-contain mix-blend-lighten"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Packaging bento */}
      <section className="bg-ivory lg:flex lg:h-[100svh] lg:flex-col lg:overflow-hidden">
        <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10 md:px-10 md:py-12 lg:min-h-0 lg:py-8 xl:py-10">
          <div className="flex shrink-0 flex-col justify-between gap-3 sm:gap-4 md:flex-row md:items-end">
            <div className="max-w-2xl min-w-0">
              <p className={eyebrowClass}>Packaging</p>
              <h2 className={titleClass}>A treasure in every reveal</h2>
              <p className={bodyClass}>
                Wedding presentation, shell reveal cases, and the Velvet Shell gift bag — each piece
                arrives ready to give.
              </p>
            </div>
            <button
              type="button"
              onClick={() => goToForm()}
              className={`inline-flex shrink-0 items-center gap-2 self-start text-ink/70 transition-colors hover:text-burgundy ${linkClass}`}
            >
              Enquire about packaging
              <span aria-hidden>→</span>
            </button>
          </div>

          <div className="mt-5 grid min-h-0 flex-1 grid-cols-2 gap-2.5 sm:mt-7 sm:gap-4 md:grid-cols-3 md:gap-4 lg:mt-8 lg:gap-5">
            {packagingShots.map((shot, i) => {
              const card = (
                <button
                  type="button"
                  onClick={() => goToForm(shot.id === 'wedding' ? 'Wedding favours' : '')}
                  className="group relative block h-full min-w-0 w-full overflow-hidden rounded-[1rem] bg-white text-left ring-1 ring-ink/6 sm:rounded-[1.35rem] md:rounded-[1.5rem]"
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden md:aspect-auto md:h-full md:min-h-[20rem] lg:min-h-0 lg:h-full">
                    <AppImage
                      src={shot.src}
                      alt={shot.alt}
                      fill
                      sizes="(max-width:768px) 50vw, 33vw"
                      className="object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent opacity-80"
                      aria-hidden
                    />
                    <span className={`absolute bottom-3 left-3 sm:bottom-4 sm:left-4 md:bottom-5 md:left-5 ${captionClass}`}>
                      {shot.label}
                    </span>
                  </div>
                </button>
              );

              if (i === 2) {
                return (
                  <div
                    key={shot.id}
                    className="col-span-2 flex justify-center md:col-span-1 md:block md:h-full"
                  >
                    <div className="w-[calc(50%-0.3125rem)] sm:w-[calc(50%-0.5rem)] md:h-full md:w-full">
                      {card}
                    </div>
                  </div>
                );
              }

              return (
                <div key={shot.id} className="min-w-0 md:h-full">
                  {card}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Occasion cards */}
      <section className="bg-[#f6efe8]">
        <div className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 sm:py-12 md:px-10 md:py-16">
          <div className="mx-auto max-w-2xl text-center">
            <p className={eyebrowClass}>Occasions</p>
            <h2 className={`${titleClass} mx-auto max-w-2xl`}>
              Curated for every gesture
            </h2>
          </div>

          <ul className="mt-7 grid grid-cols-1 gap-3 sm:mt-9 sm:grid-cols-2 sm:gap-4 lg:mt-10 lg:grid-cols-3 lg:gap-5">
            {occasions.map((item, index) => (
              <li key={item.title}>
                <button
                  type="button"
                  onClick={() => goToForm(item.formValue)}
                  className="group flex h-full min-h-[11.5rem] w-full flex-col rounded-[1.15rem] bg-white p-5 text-left ring-1 ring-ink/6 transition-shadow duration-500 hover:shadow-[0_18px_50px_rgba(40,20,24,0.08)] sm:min-h-[12.5rem] sm:rounded-[1.35rem] sm:p-6 md:p-7"
                >
                  <span className={eyebrowClass}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-display mt-3 text-xl leading-[1.15] tracking-[-0.02em] text-ink sm:mt-4 sm:text-2xl">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 flex-1 text-sm font-light leading-relaxed text-ink/70 sm:mt-3">
                    {item.line}
                  </p>
                  <span
                    className="mt-5 inline-flex h-8 w-8 items-center justify-center rounded-full border border-ink/10 text-sm text-ink/40 transition-colors group-hover:border-burgundy/30 group-hover:text-burgundy sm:mt-6"
                    aria-hidden
                  >
                    →
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Velvet CTA + ticker */}
      <section className="bg-velvet-texture overflow-hidden text-ivory">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-6 px-4 py-10 sm:gap-8 sm:px-6 sm:py-14 md:flex-row md:items-end md:justify-between md:gap-16 md:px-10 md:py-16">
          <div className="max-w-2xl min-w-0">
            <p className={eyebrowClass}>Made for your occasion</p>
            <h2 className="font-display mt-3 text-[clamp(1.7rem,5vw,2.85rem)] leading-[1.12] tracking-[-0.02em] text-ivory sm:mt-4">
              Whether you are gifting one meaningful piece or curating for an entire team, we shape a
              considered experience with you.
            </h2>
          </div>
          <button
            type="button"
            onClick={() => goToForm()}
            className={`inline-flex w-full shrink-0 items-center justify-center gap-3 rounded-full border border-ivory/35 px-6 py-3.5 text-center text-ivory transition-colors hover:border-gold hover:text-gold sm:w-auto sm:px-7 ${buttonClass}`}
          >
            Enquire for corporate gifting
            <span aria-hidden>→</span>
          </button>
        </div>
        <div className="overflow-hidden border-t border-ivory/10 py-3.5 sm:py-4" aria-hidden>
          <div className="flex w-max animate-[marquee_28s_linear_infinite] gap-8 whitespace-nowrap font-label text-[10px] tracking-[0.22em] text-ivory/50 sm:gap-10">
            {[...TICKER, ...TICKER, ...TICKER].map((label, i) => (
              <span key={`${label}-${i}`} className="inline-flex items-center gap-8 sm:gap-10">
                {label}
                <span className="text-gold/70">✦</span>
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function GiftingEnquiryForm({ preferredOccasion = '' }) {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [occasion, setOccasion] = useState(preferredOccasion || '');

  useEffect(() => {
    if (preferredOccasion) setOccasion(preferredOccasion);
  }, [preferredOccasion]);

  async function onSubmit(event) {
    event.preventDefault();
    setError('');
    setStatus('sending');

    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get('name') || '').trim(),
      email: String(form.get('email') || '').trim(),
      phone: String(form.get('phone') || '').trim(),
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
      <div className="rounded-[1.15rem] bg-white px-5 py-7 ring-1 ring-ink/8 sm:rounded-[1.35rem] sm:px-6 sm:py-8 md:px-8 md:py-9">
        <p className="font-display text-2xl leading-[1.08] tracking-[-0.02em] text-ink sm:text-3xl">
          We have your brief.
        </p>
        <p className="mt-3 max-w-sm text-sm font-light leading-relaxed text-ink/75">
          Our team will review your occasion and write back with considered options.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-[1.15rem] bg-white px-4 py-5 ring-1 ring-ink/8 sm:rounded-[1.35rem] sm:px-6 sm:py-6 md:px-8 md:py-7"
    >
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
        <Field id="gifting-name" label="Name" name="name" required autoComplete="name" />
        <Field label="Email" name="email" type="email" required autoComplete="email" />
      </div>
      <div className="mt-4 grid gap-4 sm:mt-5 sm:grid-cols-2 sm:gap-5">
        <Field label="Phone" name="phone" type="tel" autoComplete="tel" placeholder="Optional" />
        <label className="block min-w-0">
          <span className="font-label text-[10px] tracking-[0.22em] text-ink/55">Occasion</span>
          <select
            name="occasion"
            required
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
            className="mt-2 w-full appearance-none border-b border-ink/12 bg-transparent py-2.5 font-sans text-sm font-light text-ink outline-none"
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
      </div>
      <label className="mt-4 block sm:mt-5">
        <span className="font-label text-[10px] tracking-[0.22em] text-ink/55">Note</span>
        <textarea
          name="note"
          rows={2}
          placeholder="Quantity, timeline, or anything we should know…"
          className="mt-2 w-full resize-none border-b border-ink/12 bg-transparent py-2.5 font-sans text-sm font-light text-ink outline-none placeholder:text-ink/30"
        />
      </label>
      {error ? <p className="mt-3 text-sm text-burgundy">{error}</p> : null}
      <button
        type="submit"
        disabled={status === 'sending'}
        className="bg-velvet-texture mt-5 inline-flex h-11 w-full items-center justify-center gap-3 rounded-full px-7 font-label text-[11px] tracking-[0.18em] text-ivory transition-opacity hover:opacity-90 disabled:opacity-60 sm:mt-6 sm:h-12 sm:w-auto"
      >
        {status === 'sending' ? 'Sending…' : 'Send enquiry'}
        <span
          className="flex h-7 w-7 items-center justify-center rounded-full bg-ivory/15 text-sm"
          aria-hidden
        >
          ↗
        </span>
      </button>
    </form>
  );
}

function Field({ id, label, name, type = 'text', required, placeholder, autoComplete }) {
  return (
    <label className="block min-w-0">
      <span className="font-label text-[10px] tracking-[0.22em] text-ink/55">{label}</span>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="mt-2 w-full border-b border-ink/12 bg-transparent py-2.5 font-sans text-sm font-light text-ink outline-none placeholder:text-ink/30"
      />
    </label>
  );
}
