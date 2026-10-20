import Image from 'next/image';
import Link from 'next/link';
import { journal } from '@/lib/journal';

export const metadata = { title: 'Journal' };

export default function JournalPage() {
  return (
    <div className="bg-ivory pt-28 pb-24 md:pt-36">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <p className="text-[11px] tracking-[0.28em] text-gold uppercase">Journal</p>
        <h1 className="font-display mt-4 text-4xl tracking-[-0.03em] md:text-8xl">
          Notes from the house
        </h1>
        <div className="mt-10 grid grid-cols-2 gap-x-3 gap-y-8 md:mt-16 md:gap-x-10 md:gap-y-12">
          {journal.map((post, index) => (
            <Link
              key={post.slug}
              href={`/journal/${post.slug}`}
              className={`group ${index === 0 ? 'col-span-2' : ''}`}
            >
              <div
                className={`relative overflow-hidden rounded-xl bg-cream md:rounded-none ${
                  index === 0 ? 'aspect-[16/9] md:aspect-[16/8]' : 'aspect-[4/3] md:aspect-[16/10]'
                }`}
              >
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes={index === 0 ? '100vw' : '50vw'}
                />
              </div>
              <p className="mt-3 text-[9px] tracking-[0.22em] text-gold uppercase md:mt-5 md:text-[10px] md:tracking-[0.28em]">
                {post.eyebrow} · {post.date}
              </p>
              <h2
                className={`font-display mt-1.5 text-ink md:mt-2 ${
                  index === 0 ? 'text-2xl md:text-4xl' : 'text-base leading-snug md:text-4xl'
                }`}
              >
                {post.title}
              </h2>
              <p
                className={`mt-2 font-light text-stone md:mt-3 md:max-w-xl ${
                  index === 0 ? 'text-sm' : 'line-clamp-3 text-xs md:line-clamp-none'
                }`}
              >
                {post.excerpt}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
