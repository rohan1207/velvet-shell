import { NextResponse } from 'next/server';
import { createAdminSupabase } from '@/lib/supabase/admin';
import { createAuthRouteClient } from '@/lib/supabase/route';
import { clientIp, rateLimit } from '@/lib/auth/rate-limit';
import { getPublicUser } from '@/lib/auth/profile';
import { validatePassword } from '@/lib/auth/validators';

export async function POST(request) {
  const ip = clientIp(request);
  const limited = rateLimit({ key: `change-pass:${ip}`, limit: 10 });
  if (!limited.ok) {
    return NextResponse.json(
      { error: 'Too many attempts. Please try again later.' },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const currentPassword = String(body.currentPassword || '');
  const nextPassword = String(body.nextPassword || body.newPassword || '');

  const pass = validatePassword(nextPassword);
  if (!pass.ok) {
    return NextResponse.json({ error: pass.error }, { status: 400 });
  }
  if (!currentPassword) {
    return NextResponse.json({ error: 'Current password is required.' }, { status: 400 });
  }

  try {
    const { supabase, json } = createAuthRouteClient(request);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      return NextResponse.json({ error: 'Please sign in first.' }, { status: 401 });
    }

    const { error: reauthError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });
    if (reauthError) {
      return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 400 });
    }

    const admin = createAdminSupabase();
    const { error: updateError } = await admin.auth.admin.updateUserById(user.id, {
      password: nextPassword,
    });
    if (updateError) {
      return NextResponse.json(
        { error: updateError.message || 'Could not update password.' },
        { status: 400 }
      );
    }

    await supabase.auth.signInWithPassword({
      email: user.email,
      password: nextPassword,
    });

    const publicUser = await getPublicUser(user);
    return json({ ok: true, user: publicUser });
  } catch (err) {
    console.error('[change-password]', err);
    return NextResponse.json(
      { error: 'Could not change password.' },
      { status: 500 }
    );
  }
}
