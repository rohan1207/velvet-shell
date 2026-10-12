import { NextResponse } from 'next/server';
import { createAdminSupabase } from '@/lib/supabase/admin';
import { createAuthRouteClient } from '@/lib/supabase/route';
import { clientIp, rateLimit } from '@/lib/auth/rate-limit';
import {
  assertEmailAvailable,
  assertPhoneAvailable,
  getPublicUser,
} from '@/lib/auth/profile';
import { validateRegisterInput } from '@/lib/auth/validators';

export async function POST(request) {
  const ip = clientIp(request);
  const limited = rateLimit({ key: `register:${ip}`, limit: 8 });
  if (!limited.ok) {
    return NextResponse.json(
      { error: 'Too many attempts. Please try again later.' },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const parsed = validateRegisterInput(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const { fullName, firstName, lastName, email, phone, phoneNormalized, password } =
    parsed.data;

  try {
    await assertEmailAvailable(email);
    await assertPhoneAvailable(phoneNormalized);

    const admin = createAdminSupabase();
    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        first_name: firstName,
        last_name: lastName,
        phone,
        phone_normalized: phoneNormalized,
        role: 'customer',
      },
    });

    if (createError) {
      const msg = createError.message || 'Could not create account.';
      const status = /already|registered|exists/i.test(msg) ? 409 : 400;
      return NextResponse.json({ error: msg }, { status });
    }

    await admin
      .from('profiles')
      .update({
        email,
        full_name: fullName,
        first_name: firstName,
        last_name: lastName,
        phone,
        phone_normalized: phoneNormalized,
        role: 'customer',
        updated_at: new Date().toISOString(),
      })
      .eq('id', created.user.id);

    const { supabase, json } = createAuthRouteClient(request);
    const { data: signedIn, error: signError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signError) {
      return NextResponse.json(
        {
          ok: true,
          user: null,
          message: 'Account created. Please sign in.',
        },
        { status: 201 }
      );
    }

    const user = await getPublicUser(signedIn.user);
    return json({ ok: true, user }, { status: 201 });
  } catch (err) {
    const status = err.status || 500;
    return NextResponse.json(
      { error: err.message || 'Registration failed.' },
      { status }
    );
  }
}
