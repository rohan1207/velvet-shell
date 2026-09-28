'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  function onSubmit(event) {
    event.preventDefault();
    setSent(true);
  }

  if (sent) {
    return (
      <div className="border border-cream p-10">
        <p className="font-display text-4xl">We have the note.</p>
        <p className="mt-4 text-stone">The house will write back within two days. Private viewings are confirmed by hand.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <Field label="Name" name="name" required />
      <Field label="Email" name="email" type="email" required />
      <Field label="Interest" name="interest" placeholder="A viewing, a collar, a private piece…" />
      <label className="block">
        <span className="text-[10px] tracking-[0.28em] uppercase">Message</span>
        <textarea name="message" rows={5} required className="mt-3 w-full resize-none border-b border-cream bg-transparent py-3 outline-none" />
      </label>
      <button type="submit" className="h-12 bg-ink px-10 text-[11px] tracking-[0.28em] text-ivory uppercase">
        Send
      </button>
    </form>
  );
}

function Field({ label, name, type = 'text', required, placeholder }) {
  return (
    <label className="block">
      <span className="text-[10px] tracking-[0.28em] uppercase">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-3 w-full border-b border-cream bg-transparent py-3 outline-none placeholder:text-stone/50"
      />
    </label>
  );
}
