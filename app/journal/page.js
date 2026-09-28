import Image from 'next/image';
import Link from 'next/link';
import { journal } from '@/lib/journal';

export const metadata = { title: 'Journal' };

export default function JournalPage() {
  return (
    <div className="bg-ivory pt-28 pb-24 md:pt-36">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <p className="text-[11px] tracking-[0.28em] text-gold uppercase">Journal</p>
        <h1 className="font-display mt-4 text-5xl md:text-8xl">Notes from the house</h1>
        <div className="mt-16 grid gap-12 md:grid-cols-2">
          {journal.map((post, index) => (
            <Link key={post.slug} href={`/journal/${post.slug}`} className={`group ${index === 0 ? 'md:col-span-2' : ''}`}>
              <div className={`relative overflow-hidden bg-cream ${index === 0 ? 'aspect-[16/8]' : 'aspect-[16/10]'}`}>
                <Image src={post.image} alt={post.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="80vw" />
              </div>
              <p className="mt-5 text-[10px] tracking-[0.28em] text-gold uppercase">
                {post.eyebrow} · {post.date}
              </p>
              <h2 className="font-display mt-2 text-3xl md:text-4xl">{post.title}</h2>
              <p className="mt-3 max-w-xl text-stone">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
