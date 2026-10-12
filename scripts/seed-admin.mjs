/**
 * Creates (or promotes) the Velvet Shell admin user in Supabase Auth + profiles.
 *
 * Usage:
 *   node --env-file=.env.local scripts/seed-admin.mjs
 *
 * Required env:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   ADMIN_EMAIL
 *   ADMIN_PASSWORD
 */

const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '');
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = String(process.env.ADMIN_EMAIL || '').trim().toLowerCase();
const password = String(process.env.ADMIN_PASSWORD || '');

if (!url || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}
if (!email || !password) {
  console.error('Missing ADMIN_EMAIL or ADMIN_PASSWORD');
  process.exit(1);
}
if (password.length < 8) {
  console.error('ADMIN_PASSWORD must be at least 8 characters');
  process.exit(1);
}

const authHeaders = {
  apikey: serviceKey,
  Authorization: `Bearer ${serviceKey}`,
  'Content-Type': 'application/json',
};

async function findUserByEmail(target) {
  let page = 1;
  const perPage = 200;
  while (page <= 20) {
    const res = await fetch(`${url}/auth/v1/admin/users?page=${page}&per_page=${perPage}`, {
      headers: authHeaders,
    });
    if (!res.ok) {
      throw new Error(`listUsers failed: ${res.status} ${await res.text()}`);
    }
    const data = await res.json();
    const users = data.users || [];
    const hit = users.find((u) => (u.email || '').toLowerCase() === target);
    if (hit) return hit;
    if (!users.length || users.length < perPage) return null;
    page += 1;
  }
  return null;
}

const meta = {
  role: 'admin',
  full_name: 'Velvet Admin',
  first_name: 'Velvet',
  last_name: 'Admin',
};

let userId;
const existing = await findUserByEmail(email);

if (existing) {
  userId = existing.id;
  const res = await fetch(`${url}/auth/v1/admin/users/${userId}`, {
    method: 'PUT',
    headers: authHeaders,
    body: JSON.stringify({
      password,
      email_confirm: true,
      user_metadata: { ...(existing.user_metadata || {}), ...meta },
    }),
  });
  if (!res.ok) {
    console.error('Failed to update admin user:', await res.text());
    process.exit(1);
  }
  console.log('Updated existing auth user:', email);
} else {
  const res = await fetch(`${url}/auth/v1/admin/users`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      email,
      password,
      email_confirm: true,
      user_metadata: meta,
    }),
  });
  if (!res.ok) {
    console.error('Failed to create admin user:', await res.text());
    process.exit(1);
  }
  const data = await res.json();
  userId = data.id;
  console.log('Created admin auth user:', email);
}

const profileRes = await fetch(`${url}/rest/v1/profiles?on_conflict=id`, {
  method: 'POST',
  headers: {
    ...authHeaders,
    Prefer: 'resolution=merge-duplicates,return=representation',
  },
  body: JSON.stringify({
    id: userId,
    email,
    role: 'admin',
    full_name: 'Velvet Admin',
    first_name: 'Velvet',
    last_name: 'Admin',
    updated_at: new Date().toISOString(),
  }),
});

if (!profileRes.ok) {
  console.error('Failed to upsert profile:', await profileRes.text());
  process.exit(1);
}

console.log('Admin profile ready with role=admin');
console.log('You can now sign in at http://localhost:3001/login');
