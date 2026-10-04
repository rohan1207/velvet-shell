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

        <div className="mt-14 grid gap-12 md:mt-16 md:grid-cols-2 md:gap-x-10 md:gap-y-16">
          {journal.map((post, index) => (
            <Link
              key={post.slug}
              href={`/blogs/${post.slug}`}
              className={`group ${index === 0 ? 'md:col-span-2' : ''}`}
            >
              <div
                className={`relative overflow-hidden bg-pearl ${
                  index === 0 ? 'aspect-[16/8]' : 'aspect-[16/10]'
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
              <p className="mt-5 font-label text-[10px] text-gold">
                {post.eyebrow} · {post.date}
              </p>
              <h2
                className={`font-display mt-2 tracking-[-0.02em] text-ink transition-colors group-hover:text-burgundy ${
                  index === 0 ? 'text-3xl md:text-5xl' : 'text-2xl md:text-3xl'
                }`}
              >
                {post.title}
              </h2>
              <p className="mt-3 max-w-xl text-[15px] font-light leading-relaxed text-ink/80">
                {post.excerpt}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
