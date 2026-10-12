import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { assertSupabasePublicEnv } from './env';
import { allowInsecureTlsIfConfigured } from './tls';

/**
 * Builds a Supabase client that collects auth cookies, then attach them
 * to the final JSON response (avoids losing Set-Cookie when recreating NextResponse).
 */
export function createAuthRouteClient(request) {
  allowInsecureTlsIfConfigured();
  const { url, anonKey } = assertSupabasePublicEnv();
  const pending = [];

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        pending.push(...cookiesToSet);
      },
    },
  });

  function applyCookies(response) {
    pending.forEach(({ name, value, options }) => {
      response.cookies.set(name, value, options);
    });
    return response;
  }

  function json(body, init) {
    return applyCookies(NextResponse.json(body, init));
  }

  return { supabase, applyCookies, json };
}
