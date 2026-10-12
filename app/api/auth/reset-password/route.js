import { NextResponse } from 'next/server';
import { createAdminSupabase } from '@/lib/supabase/admin';
import { createAuthRouteClient } from '@/lib/supabase/route';
import { clientIp, rateLimit } from '@/lib/auth/rate-limit';
import { MAX_ATTEMPTS, hashOtpCode, safeEqualHash } from '@/lib/auth/otp';
import { getPublicUser, resolveEmailFromIdentifier } from '@/lib/auth/profile';
import { normalizeEmail, validatePassword } from '@/lib/auth/validators';

export async function POST(request) {
  const ip = clientIp(request);
  const limited = rateLimit({ key: `reset:${ip}`, limit: 12 });
  if (!limited.ok) {
    return NextResponse.json(
      { error: 'Too many attempts. Please try again later.' },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const identifier = String(body.identifier || body.email || body.phone || '').trim();
  const code = String(body.code || '').trim();
  const password = String(body.password || body.newPassword || '');
  const signInAfter = body.signIn !== false;

  const pass = validatePassword(password);
  if (!pass.ok) {
    return NextResponse.json({ error: pass.error }, { status: 400 });
  }
  if (!/^\d{6}$/.test(code)) {
    return NextResponse.json({ error: 'Enter the 6-digit code from your email.' }, { status: 400 });
  }

  try {
    const email = await resolveEmailFromIdentifier(identifier);
    if (!email) {
      return NextResponse.json({ error: 'Invalid code or account.' }, { status: 400 });
    }

    const admin = createAdminSupabase();
    const { data: rows, error } = await admin
      .from('password_reset_codes')
      .select('*')
      .ilike('email', email)
      .is('consumed_at', null)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) throw error;
    const row = rows?.[0];
    if (!row) {
      return NextResponse.json(
        { error: 'Reset code expired or not found. Request a new one.' },
        { status: 400 }
      );
    }

    if (new Date(row.expires_at).getTime() < Date.now()) {
      await admin
        .from('password_reset_codes')
        .update({ consumed_at: new Date().toISOString() })
        .eq('id', row.id);
      return NextResponse.json(
        { error: 'That code has expired. Request a new one.' },
        { status: 400 }
      );
    }

    if (row.attempts >= MAX_ATTEMPTS) {
      await admin
        .from('password_reset_codes')
        .update({ consumed_at: new Date().toISOString() })
        .eq('id', row.id);
      return NextResponse.json(
        { error: 'Too many incorrect attempts. Request a new code.' },
        { status: 400 }
      );
    }

    const matches = safeEqualHash(row.code_hash, hashOtpCode(code));
    if (!matches) {
      await admin
        .from('password_reset_codes')
        .update({ attempts: row.attempts + 1 })
        .eq('id', row.id);
      return NextResponse.json({ error: 'Incorrect code. Please try again.' }, { status: 400 });
    }

    const { error: updateError } = await admin.auth.admin.updateUserById(row.user_id, {
      password,
    });
    if (updateError) {
      return NextResponse.json(
        { error: updateError.message || 'Could not update password.' },
        { status: 400 }
      );
    }

    // Consume this code and delete siblings for the user
    await admin
      .from('password_reset_codes')
      .update({ consumed_at: new Date().toISOString() })
      .eq('id', row.id);

    await admin.from('password_reset_codes').delete().eq('user_id', row.user_id);

    if (!signInAfter) {
      return NextResponse.json({
        ok: true,
        message: 'Password updated. You can sign in now.',
      });
    }

    const { supabase, json } = createAuthRouteClient(request);
    const { data: signedIn, error: signError } = await supabase.auth.signInWithPassword({
      email: normalizeEmail(email),
      password,
    });

    if (signError || !signedIn.user) {
      return NextResponse.json({
        ok: true,
        user: null,
        message: 'Password updated. Please sign in.',
      });
    }

    const user = await getPublicUser(signedIn.user);
    return json({
      ok: true,
      user,
      message: 'Password updated. You are signed in.',
    });
  } catch (err) {
    console.error('[reset-password]', err);
    return NextResponse.json(
      { error: 'Could not reset password. Please try again.' },
      { status: 500 }
    );
  }
}
