'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getDashboardStats } from '@/lib/repository';
import { money } from '@/lib/format';

function Kpi({ label, value, hint, href }) {
  const inner = (
    <div className="card p-5 transition hover:border-[#5e062a]/20">
      <p className="font-label text-[10px] text-[#7a736c]">{label}</p>
      <p className="font-display mt-3 text-3xl text-[#2d2b2b]">{value}</p>
      {hint && <p className="mt-2 text-xs text-[#7a736c]">{hint}</p>}
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

export default function DashboardPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    setStats(getDashboardStats());
  }, []);

  if (!stats) {
    return <p className="text-sm text-[#7a736c]">Loading dashboard…</p>;
  }

  const maxViews = Math.max(...stats.visits.map((v) => v.views), 1);

  return (
    <div className="space-y-8">
      <div>
        <p className="font-label text-[10px] text-[#d4af64]">Overview</p>
        <h1 className="font-display mt-2 text-4xl text-[#2d2b2b]">Dashboard</h1>
        <p className="mt-2 max-w-xl text-sm text-[#7a736c]">
          A clear view of the house — catalogue health, orders, revenue, and traffic.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Live products" value={stats.liveProducts} href="/products?status=active" />
        <Kpi label="Draft products" value={stats.draftProducts} href="/products?status=draft" />
        <Kpi label="Low stock" value={stats.lowStock} hint="≤ 3 units" href="/products?stock=low" />
        <Kpi label="Customers" value={stats.customers} href="/customers" />
        <Kpi label="Orders" value={stats.orders} href="/orders" />
        <Kpi
          label="Pending orders"
          value={stats.pendingOrders}
          hint="Needs attention"
          href="/orders?status=pending"
        />
        <Kpi label="Revenue this month" value={money(stats.revenueMonth)} />
        <Kpi label="Revenue this year" value={money(stats.revenueYear)} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-1">
          <p className="font-label text-[10px] text-[#7a736c]">Total revenue</p>
          <p className="font-display mt-3 text-4xl text-[#2d2b2b]">{money(stats.revenueAll)}</p>
          <p className="mt-3 text-xs text-[#7a736c]">All confirmed orders to date (demo data).</p>
        </div>

        <div className="card p-6 lg:col-span-2">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-label text-[10px] text-[#7a736c]">Site visits</p>
              <p className="mt-1 text-sm text-[#7a736c]">Google Analytics-ready (mock series for now)</p>
            </div>
            <p className="text-xs text-[#d4af64]">GA4 placeholder</p>
          </div>
          <div className="mt-6 flex h-40 items-end gap-2">
            {stats.visits.map((v) => (
              <div key={v.day} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-md bg-[#5e062a]/85"
                  style={{ height: `${(v.views / maxViews) * 100}%`, minHeight: 8 }}
                  title={`${v.views} views`}
                />
                <span className="text-[10px] text-[#7a736c]">{v.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-[#2d2b2b]/8 px-6 py-4">
          <p className="font-label text-[10px] text-[#7a736c]">Top pages</p>
        </div>
        <ul className="divide-y divide-[#2d2b2b]/6">
          {stats.topPages.map((page) => (
            <li key={page.path} className="flex items-center justify-between px-6 py-3 text-sm">
              <span className="font-mono text-[#2d2b2b]">{page.path}</span>
              <span className="text-[#7a736c]">{page.views.toLocaleString()} views</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
