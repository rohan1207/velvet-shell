import { NextResponse } from 'next/server';
import {
  createSessionToken,
  safeEqualString,
  sessionCookieOptions,
} from '@/lib/session';

const attempts = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const row = attempts.get(ip) || { count: 0, start: now };
  if (now - row.start > 15 * 60 * 1000) {
    attempts.set(ip, { count: 1, start: now });
    return false;
  }
  row.count += 1;
  attempts.set(ip, row);
  return row.count > 12;
}

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'local';
  if (rateLimited(ip)) {
    return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 });
  }

  const body = await request.json().catch(() => ({}));
  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');

  const adminEmail = String(process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const adminPassword = String(process.env.ADMIN_PASSWORD || '');

  if (!adminEmail || !adminPassword) {
    return NextResponse.json(
      { error: 'Admin credentials are not configured on the server.' },
      { status: 500 }
    );
  }

  const emailOk = safeEqualString(email, adminEmail);
  const passOk = safeEqualString(password, adminPassword);
  if (!emailOk || !passOk) {
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
  }

  const token = createSessionToken(email);
  const response = NextResponse.json({ ok: true, email });
  response.cookies.set(sessionCookieOptions(token));
  return response;
}
