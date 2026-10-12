import { createAdminSupabase } from '@/lib/supabase/admin';
import { normalizeEmail, normalizePhone, publicProfile } from './validators';

export async function fetchProfileByUserId(userId) {
  const admin = createAdminSupabase();
  const { data, error } = await admin
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function resolveEmailFromIdentifier(identifier) {
  const raw = String(identifier || '').trim();
  if (!raw) return null;

  if (raw.includes('@')) {
    return normalizeEmail(raw);
  }

  const phoneNormalized = normalizePhone(raw);
  if (!phoneNormalized) return null;

  const admin = createAdminSupabase();
  const { data, error } = await admin
    .from('profiles')
    .select('email')
    .eq('phone_normalized', phoneNormalized)
    .maybeSingle();

  if (error) throw error;
  return data?.email ? normalizeEmail(data.email) : null;
}

export async function assertPhoneAvailable(phoneNormalized, exceptUserId = null) {
  if (!phoneNormalized) return;
  const admin = createAdminSupabase();
  let query = admin
    .from('profiles')
    .select('id')
    .eq('phone_normalized', phoneNormalized)
    .limit(1);

  if (exceptUserId) {
    query = query.neq('id', exceptUserId);
  }

  const { data, error } = await query.maybeSingle();
  if (error && error.code !== 'PGRST116') throw error;
  if (data?.id) {
    const err = new Error('This phone number is already registered.');
    err.status = 409;
    throw err;
  }
}

export async function assertEmailAvailable(email) {
  const admin = createAdminSupabase();
  const { data, error } = await admin
    .from('profiles')
    .select('id')
    .ilike('email', email)
    .maybeSingle();
  if (error && error.code !== 'PGRST116') throw error;
  if (data?.id) {
    const err = new Error('An account with this email already exists.');
    err.status = 409;
    throw err;
  }
}

export async function getPublicUser(authUser) {
  if (!authUser) return null;
  const profile = await fetchProfileByUserId(authUser.id);
  return publicProfile(profile, authUser);
}
