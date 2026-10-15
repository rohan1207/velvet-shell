import { NextResponse } from 'next/server';
import { createAuthRouteClient } from '@/lib/supabase/route';
import { clientIp, rateLimit } from '@/lib/auth/rate-limit';
import { getPublicUser, resolveEmailFromIdentifier } from '@/lib/auth/profile';

export async function POST(request) {
  const ip = clientIp(request);
  const limited = rateLimit({ key: `login:${ip}`, limit: 20 });
  if (!limited.ok) {
    return NextResponse.json(
      { error: 'Too many attempts. Please try again later.' },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const identifier = String(body.identifier || body.email || body.phone || '').trim();
  const password = String(body.password || '');

  if (!identifier || !password) {
    return NextResponse.json(
      { error: 'Email or phone and password are required.' },
      { status: 400 }
    );
  }

  try {
    const email = await resolveEmailFromIdentifier(identifier);
    if (!email) {
      return NextResponse.json(
        {
          error: 'No account found with that email or phone.',
          code: 'NO_ACCOUNT',
          identifier,
        },
        { status: 404 }
      );
    }

    const { supabase, json } = createAuthRouteClient(request);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.user) {
      return NextResponse.json(
        { error: 'Incorrect password. Please try again.', code: 'BAD_PASSWORD' },
        { status: 401 }
      );
    }

    const user = await getPublicUser(data.user);
    return json({ ok: true, user });
  } catch (err) {
    console.error('[auth/login]', err);
    return NextResponse.json(
      { error: 'Sign-in failed. Please try again.' },
      { status: 500 }
    );
  }
}
