import { createClient } from '@supabase/supabase-js';
import WS from 'ws';
import { assertSupabaseAdminEnv } from './env';
import { allowInsecureTlsIfConfigured } from './tls';

if (typeof globalThis.WebSocket === 'undefined') {
  globalThis.WebSocket = WS;
}

let cached = null;

/** Service-role client — bypasses RLS. Server-only. */
export function createAdminSupabase() {
  allowInsecureTlsIfConfigured();
  if (cached) return cached;
  const { url, serviceKey } = assertSupabaseAdminEnv();
  cached = createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  return cached;
}
