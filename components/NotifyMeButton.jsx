'use client';

import { useState } from 'react';

/**
 * Back-in-stock waitlist for a product or set slug.
 */
export default function NotifyMeButton({
  slug,
  kind = 'product',
  name = '',
  className = '',
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/stock-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, slug, kind, name }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Could not save your request');
      setDone(true);
      setOpen(false);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <p className="rounded-full border border-emerald-200 bg-emerald-50 px-5 py-3 text-center text-sm text-emerald-900">
        We’ll email you when this is back.
      </p>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          className ||
          'flex h-[52px] flex-1 items-center justify-center rounded-full border border-ink/20 bg-white text-[11px] tracking-[0.28em] text-ink uppercase'
        }
      >
        Notify me
      </button>
    );
  }

  return (
    <form onSubmit={onSubmit} className="w-full space-y-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        className="w-full rounded-full border border-ink/15 bg-white px-4 py-3 text-sm outline-none focus:border-burgundy/40"
      />
      {error ? <p className="text-xs text-burgundy">{error}</p> : null}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={busy}
          className="flex h-11 flex-1 items-center justify-center rounded-full bg-ink text-[10px] tracking-[0.2em] text-ivory uppercase disabled:opacity-60"
        >
          {busy ? '…' : 'Notify me'}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="h-11 rounded-full px-4 text-[10px] tracking-[0.16em] text-ink/55 uppercase"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
