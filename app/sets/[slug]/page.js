import { notFound } from 'next/navigation';
import SetExperience from '@/components/SetExperience';
import { getSetBySlug, listActiveSets, setToListingCard } from '@/lib/sets';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const set = await getSetBySlug(slug);
  if (!set) return { title: 'Set' };
  return {
    title: set.name,
    description: set.description?.slice(0, 160),
  };
}

export default async function SetDetailPage({ params }) {
  const { slug } = await params;
  const [set, allSets] = await Promise.all([getSetBySlug(slug), listActiveSets()]);
  if (!set) notFound();
  const otherSets = (allSets || [])
    .filter((s) => s.slug !== set.slug)
    .map(setToListingCard);
  return <SetExperience set={set} otherSets={otherSets} />;
}
