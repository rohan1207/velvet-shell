'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AccountPage() {
  const [mode, setMode] = useState('enter');
  const [signed, setSigned] = useState(false);

  if (signed) {
    return (
      <div className="bg-ivory pt-28 pb-24 md:pt-36">
        <div className="mx-auto max-w-xl px-5">
          <h1 className="font-display text-5xl">Your house book</h1>
          <p className="mt-6 text-stone">Orders, viewings, and saved pieces live here when you shop with us.</p>
          <div className="mt-10 space-y-4 text-sm">
            <p>No orders yet.</p>
            <Link href="/wishlist" className="block text-[11px] tracking-[0.28em] uppercase">
              Saved pieces
            </Link>
            <Link href="/shop" className="block text-[11px] tracking-[0.28em] uppercase">
              The shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-ivory pt-28 pb-24 md:pt-36">
      <div className="mx-auto max-w-md px-5">
        <h1 className="font-display text-5xl">{mode === 'enter' ? 'Enter' : 'Open an account'}</h1>
        <form
          className="mt-10 space-y-6"
          onSubmit={(event) => {
            event.preventDefault();
            setSigned(true);
          }}
        >
          <label className="block">
            <span className="text-[10px] tracking-[0.28em] uppercase">Email</span>
            <input type="email" required className="mt-3 w-full border-b border-cream bg-transparent py-3 outline-none" />
          </label>
          <label className="block">
            <span className="text-[10px] tracking-[0.28em] uppercase">Password</span>
            <input type="password" required className="mt-3 w-full border-b border-cream bg-transparent py-3 outline-none" />
          </label>
          <button type="submit" className="h-12 w-full bg-ink text-[11px] tracking-[0.28em] text-ivory uppercase">
            {mode === 'enter' ? 'Enter' : 'Create'}
          </button>
        </form>
        <button
          type="button"
          className="mt-8 text-[11px] tracking-[0.24em] text-stone uppercase"
          onClick={() => setMode(mode === 'enter' ? 'create' : 'enter')}
        >
          {mode === 'enter' ? 'Open an account' : 'Already with us'}
        </button>
      </div>
    </div>
  );
}
