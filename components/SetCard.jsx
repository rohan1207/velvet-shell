'use client';

import Link from 'next/link';
import AppImage from '@/components/AppImage';
import { money } from '@/lib/format';

export default function SetCard({ set }) {
  const href = set.href || `/sets/${set.slug}`;
  return (
    <Link href={href} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-cream">
        <AppImage
          src={set.image}
          alt={set.name}
          fill
          className="object-cover transition duration-700 group-hover:scale-[1.03]"
          sizes="(max-width:768px) 50vw, 25vw"
        />
        {set.outOfStock ? (
          <span className="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-1 font-label text-[9px] tracking-[0.14em] text-burgundy uppercase">
            Out of stock
          </span>
        ) : set.badge ? (
          <span className="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-1 font-label text-[9px] tracking-[0.14em] text-ink uppercase">
            {set.badge}
          </span>
        ) : null}
      </div>
      <div className="mt-3 px-0.5">
        <p className="font-label text-[9px] tracking-[0.16em] text-gold uppercase">Set</p>
        <h3 className="mt-1 line-clamp-2 text-sm text-ink md:text-[15px]">{set.name}</h3>
        <p className="font-num mt-1.5 text-sm text-burgundy">{money(set.price)}</p>
      </div>
    </Link>
  );
}
