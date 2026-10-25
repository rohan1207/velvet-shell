import { unstable_cache } from 'next/cache';
import { cache } from 'react';
import { fetchRemoteCatalog } from '@/lib/catalog/remote';

/** Shared across a single request (metadata + page). */
export const getRemoteCatalogCached = cache(async () => getRemoteCatalogRevalidated());

/**
 * Cross-request cache on Vercel — avoids a cold Supabase round-trip on every click.
 * Tag lets admin revalidate after catalog edits if wired later.
 */
const getRemoteCatalogRevalidated = unstable_cache(
  async () => fetchRemoteCatalog(),
  ['velvet-shell-catalog-v1'],
  { revalidate: 60, tags: ['catalog'] },
);
