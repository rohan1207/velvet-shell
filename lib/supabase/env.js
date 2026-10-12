export function getSupabasePublicEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  // New dashboard uses PUBLISHABLE_KEY; older projects use ANON_KEY (JWT).
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    '';
  return { url, anonKey };
}

export function getSupabaseServiceKey() {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    ''
  );
}

export function assertSupabasePublicEnv() {
  const { url, anonKey } = getSupabasePublicEnv();
  if (!url || !anonKey) {
    throw new Error(
      'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY).'
    );
  }
  return { url, anonKey };
}

export function assertSupabaseAdminEnv() {
  const { url, anonKey } = assertSupabasePublicEnv();
  const serviceKey = getSupabaseServiceKey();
  if (!serviceKey) {
    throw new Error('Supabase service role is not configured. Set SUPABASE_SERVICE_ROLE_KEY.');
  }
  return { url, anonKey, serviceKey };
}
