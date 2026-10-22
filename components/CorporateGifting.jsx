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
  },
  {
    src: '/images/gifting/packaging/bag-ribbon.jpg',
    alt: 'Velvet Shell white gift bag with branded burgundy ribbon',
    label: 'Gift bag',
  },
  {
    src: '/images/gifting/packaging/wedding-favours.jpg',
    alt: 'Velvet Shell wedding favours with shell boxes and ribbons',
    label: 'Wedding favours',
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

function scrollToBrief() {
  document.getElementById('gifting-brief')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function CorporateGifting() {
  return (
    <div className="bg-ivory">
      {/* Hero */}
      <section className="relative box-border h-[100svh] w-full overflow-hidden bg-[#f3ebe3] pt-[5.25rem] md:pt-[5.85rem]">
        <div className="relative h-full w-full">
          <ResponsiveBannerImage
            src="/images/gifting/hero-packaging.jpg"
            alt="Velvet Shell official gifting packaging — gift bag, ribbon and shell cases"
            priority
            className="object-cover object-center"
          />
        </div>
      </section>

      {/* Intro */}
      <section className="border-b border-ink/8 bg-ivory">
        <div className="mx-auto grid max-w-[1600px] gap-12 px-5 py-20 md:px-10 md:py-28 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-end lg:gap-20">
          <div>
            <p className="font-label text-gold">Corporate gifting</p>
            <h2 className="font-display mt-4 text-[clamp(2.6rem,5.5vw,4.6rem)] leading-[1.02] tracking-[-0.03em] text-ink">
              Chosen With Thought.
              <span className="mt-1 block text-burgundy">Given With Meaning.</span>
            </h2>
          </div>
          <div className="max-w-lg lg:justify-self-end">
            <p className="text-[15px] font-light leading-[1.8] text-ink/85 md:text-base">
              Corporate gifting, considered beyond the expected.
            </p>
            <p className="mt-5 text-[15px] font-light leading-[1.8] text-ink/85">
              At Velvet Shell, we believe a memorable gift should feel chosen, not distributed. From
              clients and partners to teams, leaders and wedding favours, we curate gifts that bring
              together thoughtful design, beauty and the pleasure of discovery.
            </p>
            <button
              type="button"
              onClick={scrollToBrief}
              className="mt-9 inline-flex items-center gap-3 font-label text-[11px] tracking-[0.2em] text-ink transition-colors duration-500 hover:text-burgundy"
            >
              Begin A Conversation
              <span aria-hidden className="text-gold">
                →
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Official packaging — single row of 3 */}
      <section className="border-b border-ink/8 bg-pearl">
        <div className="mx-auto max-w-[1600px] px-5 py-16 md:px-10 md:py-24">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="font-label text-gold">Packaging</p>
              <h2 className="font-display mt-3 text-[clamp(2.2rem,4.5vw,3.6rem)] leading-[1.05] tracking-[-0.02em] text-ink">
                A treasure in every reveal.
              </h2>
              <p className="mt-5 max-w-xl text-[15px] font-light leading-[1.8] text-ink/80">
                Our official gifting presentation — white gift bag, burgundy Velvet Shell ribbon, and
                scallop shell cases. Also available as wedding favours.
              </p>
            </div>
            <a
              href={whatsappGiftingHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-full border border-ink/15 px-6 py-3 font-label text-[11px] tracking-[0.18em] text-ink transition-colors hover:border-burgundy/40 hover:text-burgundy"
            >
              Enquire on WhatsApp
              <span aria-hidden className="text-gold">
                →
              </span>
            </a>
          </div>

          <ul className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            {packagingShots.map((shot) => (
              <li key={shot.src} className="group relative overflow-hidden bg-ivory">
                <div className="relative aspect-[4/3] w-full">
                  <AppImage
                    src={shot.src}
                    alt={shot.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                  />
                </div>
                <p className="absolute bottom-3 left-3 font-label text-[10px] tracking-[0.18em] text-ivory uppercase drop-shadow-[0_1px_8px_rgba(0,0,0,0.45)]">
                  {shot.label}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* More Than A Gesture */}
      <section className="grid lg:grid-cols-2">
        <div className="relative min-h-[42vh] md:min-h-[58vh] lg:min-h-[88vh]">
          <AppImage
            src="/images/gifting/selection-packaging.jpg"
            alt="Velvet Shell gift bag and open shell case"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center"
          />
        </div>
        <div className="flex flex-col justify-center bg-pearl px-6 py-16 md:px-14 lg:px-16 xl:px-24">
          <p className="font-label text-gold">The approach</p>
          <h2 className="font-display mt-4 max-w-md text-[clamp(2.2rem,4vw,3.5rem)] leading-[1.05] tracking-[-0.02em] text-ink">
            More Than A Gesture
          </h2>
          <div className="mt-8 h-px w-12 bg-gold/70" />
          <p className="mt-8 max-w-md text-[15px] font-light leading-[1.85] text-ink/80">
            A corporate gift can acknowledge a relationship, mark a milestone or simply say, we value
            this.
          </p>
          <p className="mt-5 max-w-md text-[15px] font-light leading-[1.85] text-ink/80">
            Our approach begins with understanding the occasion, the recipient and the sentiment behind
            the gesture — then finding something that feels genuinely worth receiving.
          </p>
        </div>
      </section>

      {/* Curated For The Occasion */}
      <section className="bg-ivory">
        <div className="relative min-h-[40vh] overflow-hidden md:min-h-[46vh]">
          <AppImage
            src="/images/gifting/occasion-packaging.jpg"
            alt="Velvet Shell wedding favours and occasion packaging"
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/35 to-ink/15" aria-hidden />
          <div className="relative z-10 flex min-h-[40vh] items-end px-5 py-12 md:min-h-[46vh] md:px-10 md:py-16">
            <div className="mx-auto w-full max-w-[1600px]">
              <p className="font-label text-gold">The edit</p>
              <h2 className="font-display mt-3 max-w-2xl text-[clamp(2.4rem,5vw,4rem)] leading-[1.02] tracking-[-0.03em] text-ivory">
                Curated For The Occasion
              </h2>
              <p className="mt-4 max-w-lg text-[15px] font-light leading-relaxed text-ivory/80">
                Corporate edits, wedding favours, and festive moments — each tuned to the relationship.
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-[1600px] px-5 py-14 md:px-10 md:py-20">
          <ul className="grid grid-cols-2 gap-0 lg:grid-cols-3">
            {occasions.map((item, index) => (
              <li
                key={item.title}
                className="border-t border-ink/10 py-6 pr-3 sm:py-8 sm:pr-8 lg:border-ink/10 [&:nth-child(3n)]:lg:pr-0"
              >
                <span className="font-label text-[10px] text-gold">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="font-display mt-4 text-[1.55rem] leading-[1.15] tracking-[-0.02em] text-ink md:text-[1.75rem]">
                  {item.title}
                </h3>
                <p className="mt-3 max-w-xs text-[14px] font-light leading-relaxed text-ink/80">
                  {item.line}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Made For Your Occasion */}
      <section className="bg-velvet-texture text-ivory">
        <div className="mx-auto flex max-w-[1600px] flex-col items-start justify-between gap-10 px-5 py-20 md:flex-row md:items-end md:gap-16 md:px-10 md:py-24">
          <div className="max-w-2xl">
            <p className="font-label text-gold">Made For Your Occasion</p>
            <h2 className="font-display mt-4 text-[clamp(2rem,4vw,3.4rem)] leading-[1.08] tracking-[-0.02em] text-ivory">
              Whether you are gifting one meaningful piece or curating for an entire team, we work with
              you to create a considered gifting experience.
            </h2>
            <p className="mt-6 text-[15px] font-light leading-relaxed text-ivory/65">
              Share your occasion with us.
            </p>
          </div>
          <button
            type="button"
            onClick={scrollToBrief}
            className="inline-flex shrink-0 items-center gap-3 rounded-full border border-ivory/30 px-7 py-3.5 font-label text-[11px] tracking-[0.2em] text-ivory transition-colors duration-500 hover:border-gold hover:text-gold"
          >
            Enquire For Corporate Gifting
            <span aria-hidden>→</span>
          </button>
        </div>
      </section>

      {/* Brief / Enquiry */}
      <section id="gifting-brief" className="scroll-mt-28 bg-pearl md:scroll-mt-32">
        <div className="mx-auto grid max-w-[1600px] gap-14 px-5 py-20 md:px-10 md:py-28 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-24">
          <div>
            <p className="font-label text-gold">Enquiry</p>
            <h2 className="font-display mt-4 text-[clamp(2.4rem,5vw,3.8rem)] leading-[1.05] tracking-[-0.03em] text-ink">
              Have A Gifting Brief?
            </h2>
            <p className="mt-6 max-w-md text-[15px] font-light leading-[1.8] text-ink/85">
              A few details are enough — we will write back with considered options.
            </p>
            <p className="mt-10 text-[13px] font-light text-ink/80">
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

          <GiftingEnquiryForm />
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
      <div className="border border-ink/10 bg-ivory px-6 py-10 md:px-10 md:py-12">
        <p className="font-display text-3xl text-ink md:text-4xl">We have your brief.</p>
        <p className="mt-4 max-w-sm text-[15px] font-light leading-relaxed text-ink/85">
          Our team will review your occasion and write back with considered options.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-7 border border-ink/10 bg-ivory px-6 py-8 md:space-y-8 md:px-10 md:py-10"
    >
      <Field label="Name" name="name" required autoComplete="name" />
      <Field label="Email" name="email" type="email" required autoComplete="email" />
      <label className="block">
        <span className="font-label text-[10px] text-ink/80">Occasion</span>
        <select
          name="occasion"
          required
          defaultValue=""
          className="mt-3 w-full appearance-none border-b border-ink/15 bg-transparent py-3 text-[15px] font-light text-ink outline-none"
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
        <span className="font-label text-[10px] text-ink/80">Note</span>
        <textarea
          name="note"
          rows={3}
          placeholder="Quantity, timeline, or anything we should know…"
          className="mt-3 w-full resize-none border-b border-ink/15 bg-transparent py-3 text-[15px] font-light text-ink outline-none placeholder:text-ink/25"
        />
      </label>
      {error ? <p className="text-sm text-burgundy">{error}</p> : null}
      <button
        type="submit"
        disabled={status === 'sending'}
        className="bg-velvet-texture mt-2 inline-flex h-12 items-center rounded-full px-8 font-label text-[11px] tracking-[0.2em] text-ivory transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {status === 'sending' ? 'Sending…' : 'Send enquiry'}
      </button>
    </form>
  );
}

function Field({ label, name, type = 'text', required, placeholder, autoComplete }) {
  return (
    <label className="block">
      <span className="font-label text-[10px] text-ink/80">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="mt-3 w-full border-b border-ink/15 bg-transparent py-3 text-[15px] font-light text-ink outline-none placeholder:text-ink/25"
      />
    </label>
  );
}
