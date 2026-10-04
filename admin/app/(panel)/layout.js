'use client';

import { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';

export default function PanelLayout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f5eee8]">
      <AdminSidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[#2d2b2b]/8 bg-[#f5eee8]/90 px-4 backdrop-blur md:px-6">
          <button
            type="button"
            className="rounded-full border border-[#2d2b2b]/12 px-3 py-1.5 text-xs lg:hidden"
            onClick={() => setOpen(true)}
          >
            Menu
          </button>
          <p className="font-label text-[10px] tracking-[0.18em] text-[#7a736c]">House operations</p>
          <p className="text-xs text-[#7a736c]">Mock data · Supabase-ready</p>
        </header>
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
