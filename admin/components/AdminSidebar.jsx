'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { pendingOrderCount } from '@/lib/repository';

const links = [
  { href: '/', label: 'Dashboard' },
  { href: '/products', label: 'Products' },
  { href: '/orders', label: 'Orders', badge: true },
  { href: '/customers', label: 'Customers' },
  { href: '/looks', label: 'Shop by look' },
  { href: '/blogs', label: 'Blogs' },
  { href: '/testimonials', label: 'Testimonials' },
];

export default function AdminSidebar({ open, onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const [pending, setPending] = useState(0);

  useEffect(() => {
    function refresh() {
      setPending(pendingOrderCount());
    }
    refresh();
    window.addEventListener('vs-admin-store', refresh);
    return () => window.removeEventListener('vs-admin-store', refresh);
  }, [pathname]);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/login');
    router.refresh();
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-ink/30 lg:hidden ${open ? '' : 'pointer-events-none opacity-0'}`}
        onClick={onClose}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[#2d2b2b]/8 bg-[#5e062a] text-[#f5eee8] transition-transform duration-300 lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="border-b border-white/10 px-5 py-6">
          <p className="font-label text-[10px] tracking-[0.22em] text-[#d4af64]">Velvet Shell</p>
          <p className="font-display mt-2 text-2xl">Admin</p>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {links.map((link) => {
            const active =
              link.href === '/'
                ? pathname === '/'
                : pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`flex items-center justify-between rounded-full px-4 py-2.5 text-sm transition ${
                  active ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/8 hover:text-white'
                }`}
              >
                <span>{link.label}</span>
                {link.badge && pending > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d4af64] px-1.5 text-[10px] font-semibold text-[#5e062a]">
                    {pending}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-4">
          <button
            type="button"
            onClick={logout}
            className="w-full rounded-full border border-white/20 py-2.5 text-[11px] font-semibold tracking-[0.16em] text-white/85 uppercase transition hover:border-[#d4af64] hover:text-[#d4af64]"
          >
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}
