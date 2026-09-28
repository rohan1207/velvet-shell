import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getJournal, journal } from '@/lib/journal';

export function generateStaticParams() {
  return journal.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getJournal(slug);
  if (!post) return { title: 'Journal' };
  return { title: post.title, description: post.excerpt };
}

export default async function JournalArticle({ params }) {
  const { slug } = await params;
  const post = getJournal(slug);
  if (!post) notFound();

  return (
    <article className="bg-ivory pt-28 pb-24 md:pt-36">
      <div className="mx-auto max-w-3xl px-5">
        <Link href="/journal" className="text-[11px] tracking-[0.28em] text-gold uppercase">
          Journal
        </Link>
        <p className="mt-6 text-[11px] tracking-[0.28em] text-stone uppercase">
          {post.eyebrow} · {post.date} · {post.read}
        </p>
        <h1 className="font-display mt-4 text-5xl md:text-7xl">{post.title}</h1>
        <p className="mt-6 text-lg text-stone">{post.excerpt}</p>
      </div>
      <div className="relative mx-auto mt-12 aspect-[16/8] max-w-5xl overflow-hidden bg-cream">
        <Image src={post.image} alt="" fill className="object-cover" sizes="100vw" />
      </div>
      <div className="mx-auto mt-12 max-w-2xl space-y-6 px-5 text-lg leading-relaxed text-ink-soft">
        {post.body.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    </article>
  );
}
