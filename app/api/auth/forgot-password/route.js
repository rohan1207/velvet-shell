import { NextResponse } from 'next/server';
import { createAdminSupabase } from '@/lib/supabase/admin';
import { clientIp, rateLimit } from '@/lib/auth/rate-limit';
import { sendPasswordResetEmail } from '@/lib/auth/mail';
import { generateOtpCode, hashOtpCode, otpExpiresAt } from '@/lib/auth/otp';
import { resolveEmailFromIdentifier } from '@/lib/auth/profile';
import { normalizeEmail } from '@/lib/auth/validators';

/**
 * Always returns a generic success message to avoid account enumeration,
 * except when email delivery is clearly misconfigured in production.
 */
export async function POST(request) {
  const ip = clientIp(request);
  const limited = rateLimit({ key: `forgot:${ip}`, limit: 6 });
  if (!limited.ok) {
    return NextResponse.json(
      { error: 'Too many attempts. Please try again later.' },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const identifier = String(body.identifier || body.email || body.phone || '').trim();

  if (!identifier) {
    return NextResponse.json(
      { error: 'Enter the email or phone on your account.' },
      { status: 400 }
    );
  }

  const generic = {
    ok: true,
    message:
      'If an account exists for that email or phone, we sent a reset code. Check your inbox.',
  };

  try {
    const email = await resolveEmailFromIdentifier(identifier);
    if (!email) {
      return NextResponse.json(generic);
    }

    const admin = createAdminSupabase();
    const { data: profile } = await admin
      .from('profiles')
      .select('id, email, full_name, first_name')
      .ilike('email', email)
      .maybeSingle();

    if (!profile?.id) {
      return NextResponse.json(generic);
    }

    // Invalidate prior unused codes
    await admin
      .from('password_reset_codes')
      .update({ consumed_at: new Date().toISOString() })
      .eq('user_id', profile.id)
      .is('consumed_at', null);

    const code = generateOtpCode();
    const { error: insertError } = await admin.from('password_reset_codes').insert({
      user_id: profile.id,
      email: normalizeEmail(profile.email || email),
      code_hash: hashOtpCode(code),
      expires_at: otpExpiresAt(),
    });

    if (insertError) {
      console.error('[forgot-password] insert', insertError);
      return NextResponse.json(
        { error: 'Could not start password reset. Please try again.' },
        { status: 500 }
      );
    }

    await sendPasswordResetEmail({
      to: normalizeEmail(profile.email || email),
      code,
      fullName: profile.full_name || profile.first_name || '',
    });

    return NextResponse.json(generic);
  } catch (err) {
    console.error('[forgot-password]', err);
    if (
      process.env.NODE_ENV === 'production' &&
      /RESEND_API_KEY|Email is not configured/i.test(err.message || '')
    ) {
      return NextResponse.json(
        { error: 'Password reset email is not configured yet.' },
        { status: 500 }
      );
    }
    return NextResponse.json(generic);
  }
}
