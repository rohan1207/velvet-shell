import { NextResponse } from 'next/server';
import { createAdminSupabase } from '@/lib/supabase/admin';
import { createAuthRouteClient } from '@/lib/supabase/route';
import {
  assertPhoneAvailable,
  getPublicUser,
} from '@/lib/auth/profile';
import {
  formatPhoneDisplay,
  normalizePhone,
  splitFullName,
} from '@/lib/auth/validators';

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const fullNameInput = body.fullName ?? [body.firstName, body.lastName].filter(Boolean).join(' ');
  const { firstName, lastName, fullName } = splitFullName(fullNameInput);
  const phoneNormalized = normalizePhone(body.phone);
  const phone = phoneNormalized ? formatPhoneDisplay(phoneNormalized) : '';

  if (!fullName) {
    return NextResponse.json({ error: 'Full name is required.' }, { status: 400 });
  }
  if (body.phone && phoneNormalized.length < 10) {
    return NextResponse.json({ error: 'Enter a valid 10-digit phone number.' }, { status: 400 });
  }

  try {
    const { supabase, json } = createAuthRouteClient(request);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Please sign in first.' }, { status: 401 });
    }

    if (phoneNormalized) {
      await assertPhoneAvailable(phoneNormalized, user.id);
    }

    const admin = createAdminSupabase();
    const { error } = await admin
      .from('profiles')
      .update({
        full_name: fullName,
        first_name: firstName,
        last_name: lastName,
        phone,
        phone_normalized: phoneNormalized,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    await admin.auth.admin.updateUserById(user.id, {
      user_metadata: {
        ...user.user_metadata,
        full_name: fullName,
        first_name: firstName,
        last_name: lastName,
        phone,
        phone_normalized: phoneNormalized,
      },
    });

    const publicUser = await getPublicUser(user);
    return json({ ok: true, user: publicUser });
  } catch (err) {
    const status = err.status || 500;
    return NextResponse.json(
      { error: err.message || 'Could not update profile.' },
      { status }
    );
  }
}
