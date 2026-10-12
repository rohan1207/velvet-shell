import { Resend } from 'resend';

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

function fromAddress() {
  return process.env.RESEND_FROM_EMAIL || 'Velvet Shell <onboarding@resend.dev>';
}

function siteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    'http://localhost:3000'
  ).replace(/\/$/, '');
}

export async function sendPasswordResetEmail({ to, code, fullName }) {
  const resend = getResend();
  const name = fullName || 'there';
  const accountUrl = `${siteUrl()}/account?mode=reset`;
  const loginUrl = `${siteUrl()}/account`;

  const subject = 'Your Velvet Shell password reset code';
  const html = `
    <div style="font-family:Georgia,serif;background:#f5eee8;padding:32px;color:#2d2b2b;">
      <p style="letter-spacing:0.2em;font-size:11px;color:#d4af64;text-transform:uppercase;">Velvet Shell</p>
      <h1 style="font-weight:400;font-size:28px;margin:12px 0 8px;">Reset your password</h1>
      <p style="font-size:15px;line-height:1.6;color:#5a534c;">Hello ${escapeHtml(name)},</p>
      <p style="font-size:15px;line-height:1.6;color:#5a534c;">
        Use this one-time code to reset your password. It expires in 15 minutes.
      </p>
      <p style="font-size:32px;letter-spacing:0.35em;margin:28px 0;color:#5e062a;font-weight:600;">${escapeHtml(code)}</p>
      <p style="font-size:14px;line-height:1.6;color:#5a534c;">
        <a href="${accountUrl}" style="color:#5e062a;">Enter the code and choose a new password</a>
        &nbsp;·&nbsp;
        <a href="${loginUrl}" style="color:#5e062a;">Sign in to your account</a>
      </p>
      <p style="font-size:12px;color:#8a827a;margin-top:28px;">
        If you did not request this, you can ignore this email. Your password will stay the same.
      </p>
    </div>
  `;

  if (!resend) {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[auth] RESEND_API_KEY missing — reset code (dev only):', code, '→', to);
      return { ok: true, stub: true };
    }
    throw new Error('Email is not configured. Set RESEND_API_KEY.');
  }

  const { error } = await resend.emails.send({
    from: fromAddress(),
    to: [to],
    subject,
    html,
  });

  if (error) {
    throw new Error(error.message || 'Failed to send reset email.');
  }
  return { ok: true };
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
