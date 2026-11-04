'use client';

import { useState } from 'react';
import { CONTACT_INTERESTS } from '@/lib/contact';

export default function ContactForm() {
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
      phone: String(form.get('phone') || '').trim(),
      interest: String(form.get('interest') || '').trim(),
      message: String(form.get('message') || '').trim(),
    };

    try {
      const res = await fetch('/api/contact/enquiry', {
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
      <div className="w-full min-w-0 rounded-[1.25rem] bg-white px-5 py-8 ring-1 ring-ink/8 sm:rounded-[1.5rem] sm:px-6 sm:py-10 md:px-8 md:py-12">
        <p className="font-display text-[1.75rem] text-ink sm:text-3xl md:text-4xl">
          Thank you for writing.
        </p>
        <p className="mt-3 max-w-sm text-[14px] font-light leading-relaxed text-ink/75 sm:mt-4 sm:text-[15px]">
          The Velvet Shell team will get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="box-border w-full min-w-0 space-y-6 rounded-[1.25rem] bg-white px-5 py-7 ring-1 ring-ink/8 sm:space-y-7 sm:rounded-[1.5rem] sm:px-6 sm:py-8 md:space-y-8 md:px-8 md:py-10"
    >
      <Field label="Name" name="name" required autoComplete="name" />
      <Field label="Email" name="email" type="email" required autoComplete="email" />
      <Field
        label="Phone"
        name="phone"
        type="tel"
        autoComplete="tel"
        placeholder="Optional"
      />
      <label className="block min-w-0">
        <span className="text-[10px] tracking-[0.28em] uppercase">Interest</span>
        <select
          name="interest"
          defaultValue="General enquiry"
          className="mt-3 w-full max-w-full appearance-none border-b border-ink/12 bg-transparent py-3 text-[15px] font-light text-ink outline-none"
        >
          {CONTACT_INTERESTS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
      <label className="block min-w-0">
        <span className="text-[10px] tracking-[0.28em] uppercase">Message</span>
        <textarea
          name="message"
          rows={5}
          required
          placeholder="How can we help?"
          className="mt-3 w-full max-w-full resize-y border-b border-ink/12 bg-transparent py-3 text-[15px] font-light text-ink outline-none placeholder:text-ink/30"
        />
      </label>
      {error ? <p className="text-sm text-burgundy">{error}</p> : null}
      <button
        type="submit"
        disabled={status === 'sending'}
        className="inline-flex h-12 w-full items-center justify-center rounded-full bg-ink px-10 text-[11px] tracking-[0.28em] text-ivory uppercase transition-opacity hover:opacity-90 disabled:opacity-60 sm:w-auto"
      >
        {status === 'sending' ? 'Sending…' : 'Send'}
      </button>
    </form>
  );
}

function Field({ label, name, type = 'text', required, placeholder, autoComplete }) {
  return (
    <label className="block min-w-0">
      <span className="text-[10px] tracking-[0.28em] uppercase">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="mt-3 w-full max-w-full border-b border-ink/12 bg-transparent py-3 text-[15px] font-light text-ink outline-none placeholder:text-ink/30"
      />
    </label>
  );
}
