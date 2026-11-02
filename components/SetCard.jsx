'use client';

import Link from 'next/link';
import AppImage from '@/components/AppImage';
import { money } from '@/lib/format';

export default function SetCard({ set, index = 0, className = '' }) {
  const href = set.href || `/sets/${set.slug}`;
  const pieceCount = Array.isArray(set.members) ? set.members.length : 0;

  return (
    <article
      data-restore-id={set.slug || undefined}
      className={`group flex h-full animate-[fade-up_0.9s_var(--ease-luxe)_both] flex-col ${className}`}
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <Link href={href} className="block" aria-label={`View ${set.name}`}>
        <div className="relative isolate aspect-square overflow-hidden bg-white">
          <AppImage
            src={set.image}
            alt={set.name}
            fill
            className="object-contain object-center transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] [@media(hover:hover)]:group-hover:scale-[1.03]"
            sizes="(max-width:768px) 50vw, 25vw"
          />
          {set.outOfStock ? (
            <span className="absolute top-2.5 left-2.5 rounded-full bg-white/95 px-2.5 py-1 font-label text-[9px] tracking-[0.14em] text-burgundy uppercase ring-1 ring-ink/6">
              Out of stock
            </span>
          ) : set.badge ? (
            <span className="absolute top-2.5 left-2.5 rounded-full bg-white/95 px-2.5 py-1 font-label text-[9px] tracking-[0.14em] text-ink uppercase ring-1 ring-ink/6">
              {set.badge}
            </span>
          ) : null}
        </div>
      </Link>

      <div className="relative mt-2.5 flex flex-1 flex-col md:mt-3">
        <Link
          href={href}
          className="font-label line-clamp-2 min-h-[2.6em] w-full px-0.5 text-center text-[10px] leading-[1.25] tracking-[0.08em] text-ink uppercase transition-colors hover:text-burgundy md:text-[11px] md:tracking-[0.14em]"
        >
          {set.name}
        </Link>
        <p className="font-num mt-1.5 text-center text-[13px] tracking-[0.04em] text-ink/75 md:mt-2">
          {money(set.price)}
          {pieceCount ? (
            <span className="ml-1.5 text-[11px] tracking-normal text-ink/45">
              · {pieceCount} pcs
            </span>
          ) : null}
        </p>
      </div>
    </article>
  );
}
