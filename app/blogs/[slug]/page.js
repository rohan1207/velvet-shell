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
  if (!post) return { title: 'Blogs' };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogArticle({ params }) {
  const { slug } = await params;
  const post = getJournal(slug);
  if (!post) notFound();

  return (
    <article className="bg-ivory pt-28 pb-24 md:pt-36">
      <div className="mx-auto max-w-3xl px-5 md:px-0">
        <Link href="/blogs" className="font-label text-gold transition-opacity hover:opacity-70">
          Blogs
        </Link>
        <p className="mt-6 font-label text-[10px] text-ink/80">
          {post.eyebrow} · {post.date} · {post.read}
        </p>
        <h1 className="font-display mt-4 text-[clamp(2.6rem,5vw,4.5rem)] leading-[1.05] tracking-[-0.03em] text-ink">
          {post.title}
        </h1>
        <p className="mt-6 text-[17px] font-light leading-relaxed text-ink/85">{post.excerpt}</p>
      </div>

      <div className="relative mx-auto mt-12 aspect-[16/8] max-w-5xl overflow-hidden bg-pearl">
        <Image src={post.image} alt="" fill className="object-cover" sizes="100vw" priority />
      </div>

      <div className="mx-auto mt-12 max-w-2xl space-y-6 px-5 text-[17px] font-light leading-[1.85] text-ink/80 md:px-0">
        {post.body.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    </article>
  );
}
