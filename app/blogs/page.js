import Image from 'next/image';
import Link from 'next/link';
import { journal } from '@/lib/journal';

export const metadata = {
  title: 'Blogs',
  description:
    'Notes from Velvet Shell — materials, atelier days, wearing well, and the quiet craft behind each piece.',
};

export default function BlogsPage() {
  return (
    <div className="bg-ivory pt-28 pb-24 md:pt-36">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <p className="font-label text-gold">Blogs</p>
        <h1 className="font-display mt-4 max-w-3xl text-[clamp(2.8rem,6vw,5.2rem)] leading-[1.02] tracking-[-0.03em] text-ink">
          Notes from the house
        </h1>
        <p className="mt-5 max-w-xl text-[15px] font-light leading-relaxed text-ink/85">
          Stories of nacre, craft, and the quiet decisions that shape every Velvet Shell piece.
        </p>

        <div className="mt-10 grid grid-cols-2 gap-x-3 gap-y-8 md:mt-16 md:gap-x-10 md:gap-y-16">
          {journal.map((post, index) => (
            <Link
              key={post.slug}
              href={`/blogs/${post.slug}`}
              className={`group ${index === 0 ? 'col-span-2' : ''}`}
            >
              <div
                className={`relative overflow-hidden rounded-xl bg-pearl md:rounded-none ${
                  index === 0 ? 'aspect-[16/9] md:aspect-[16/8]' : 'aspect-[4/3] md:aspect-[16/10]'
                }`}
              >
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                  sizes={index === 0 ? '100vw' : '50vw'}
                  priority={index === 0}
                />
              </div>
              <p className="mt-3 font-label text-[9px] tracking-[0.14em] text-gold uppercase md:mt-5 md:text-[10px]">
                {post.eyebrow} · {post.date}
              </p>
              <h2
                className={`font-display mt-1.5 tracking-[-0.02em] text-ink transition-colors group-hover:text-burgundy md:mt-2 ${
                  index === 0
                    ? 'text-2xl md:text-5xl'
                    : 'text-base leading-snug md:text-3xl'
                }`}
              >
                {post.title}
              </h2>
              <p
                className={`mt-2 font-light leading-relaxed text-ink/80 md:mt-3 md:max-w-xl md:text-[15px] ${
                  index === 0 ? 'text-sm' : 'line-clamp-3 text-xs md:line-clamp-none md:text-[15px]'
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
