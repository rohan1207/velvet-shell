'use client';

import { createBrowserClient } from '@supabase/ssr';
import { getSupabasePublicEnv } from './env';

export function createBrowserSupabase() {
  const { url, anonKey } = getSupabasePublicEnv();
  if (!url || !anonKey) {
    throw new Error('Supabase public env vars are missing.');
  }
  return createBrowserClient(url, anonKey);
}
