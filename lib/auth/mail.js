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

function formatInr(paiseOrRupees) {
  const n = Number(paiseOrRupees) || 0;
  // amounts in this app are stored as whole INR rupees
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n);
}

export async function sendOrderEmails({ order, items = [], customerName }) {
  const resend = getResend();
  const toCustomer = order.email;
  const toOwner =
    process.env.ORDERS_NOTIFY_EMAIL ||
    process.env.ADMIN_EMAIL ||
    process.env.RESEND_TO_OWNER ||
    '';

  const name = customerName || order.shipping?.fullName || order.shipping?.firstName || 'there';
  const orderNo = order.order_number || order.orderNumber || order.id;
  const total = formatInr(order.total);
  const linesHtml = (items || [])
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #e8e0d8;">${escapeHtml(item.product_name || item.name)}</td>
          <td style="padding:8px 0;border-bottom:1px solid #e8e0d8;text-align:center;">×${item.qty}</td>
          <td style="padding:8px 0;border-bottom:1px solid #e8e0d8;text-align:right;">${formatInr(item.line_total || item.lineTotal)}</td>
        </tr>`,
    )
    .join('');

  const customerHtml = `
    <div style="font-family:Georgia,serif;background:#f5eee8;padding:32px;color:#2d2b2b;">
      <p style="letter-spacing:0.2em;font-size:11px;color:#d4af64;text-transform:uppercase;">Velvet Shell</p>
      <h1 style="font-weight:400;font-size:28px;margin:12px 0 8px;">Order confirmed</h1>
      <p style="font-size:15px;line-height:1.6;color:#5a534c;">Hello ${escapeHtml(name)},</p>
      <p style="font-size:15px;line-height:1.6;color:#5a534c;">
        Thank you for your order <strong>${escapeHtml(orderNo)}</strong>. Total ${escapeHtml(total)}.
      </p>
      <table style="width:100%;border-collapse:collapse;margin:24px 0;font-size:14px;">${linesHtml}</table>
      <p style="font-size:14px;line-height:1.6;color:#5a534c;">
        <a href="${siteUrl()}/account?tab=orders" style="color:#5e062a;">View your orders</a>
      </p>
    </div>
  `;

  const ownerHtml = `
    <div style="font-family:Georgia,serif;background:#f5eee8;padding:32px;color:#2d2b2b;">
      <p style="letter-spacing:0.2em;font-size:11px;color:#d4af64;text-transform:uppercase;">Velvet Shell · Orders</p>
      <h1 style="font-weight:400;font-size:26px;margin:12px 0 8px;">New order received</h1>
      <p style="font-size:15px;line-height:1.6;color:#5a534c;">
        <strong>${escapeHtml(orderNo)}</strong> · ${escapeHtml(total)} · ${escapeHtml(toCustomer)}
      </p>
      <table style="width:100%;border-collapse:collapse;margin:24px 0;font-size:14px;">${linesHtml}</table>
    </div>
  `;

  if (!resend) {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[orders] email stub', { toCustomer, toOwner, orderNo, total });
      return { ok: true, stub: true };
    }
    console.warn('[orders] RESEND_API_KEY missing — skipped order emails');
    return { ok: false, stub: true };
  }

  const sends = [];
  if (toCustomer) {
    sends.push(
      resend.emails.send({
        from: fromAddress(),
        to: [toCustomer],
        subject: `Order ${orderNo} confirmed · Velvet Shell`,
        html: customerHtml,
      }),
    );
  }
  if (toOwner) {
    sends.push(
      resend.emails.send({
        from: fromAddress(),
        to: [toOwner],
        subject: `New order ${orderNo} · Velvet Shell`,
        html: ownerHtml,
      }),
    );
  }

  const results = await Promise.allSettled(sends);
  const failed = results.find((r) => r.status === 'rejected' || r.value?.error);
  if (failed) {
    console.error('[orders] email error', failed);
  }
  return { ok: true };
}

function lookLikeEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
}

export async function sendGiftingEnquiryEmail({ name, email, occasion, note }) {
  const resend = getResend();
  const candidates = [
    process.env.GIFTING_NOTIFY_EMAIL,
    process.env.ORDERS_NOTIFY_EMAIL,
    process.env.RESEND_TO_OWNER,
  ];
  const toOwner = candidates.find((v) => lookLikeEmail(v)) || '';

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeOccasion = escapeHtml(occasion || 'Not specified');
  const safeNote = escapeHtml(note || '—').replace(/\n/g, '<br/>');

  const subject = `Gifting enquiry · ${String(occasion || 'Velvet Shell').slice(0, 48)}`;
  const html = `
    <div style="font-family:Georgia,serif;background:#f5eee8;padding:32px;color:#2d2b2b;">
      <p style="letter-spacing:0.2em;font-size:11px;color:#d4af64;text-transform:uppercase;">Velvet Shell · Gifting</p>
      <h1 style="font-weight:400;font-size:28px;margin:12px 0 8px;">New gifting enquiry</h1>
      <p style="font-size:15px;line-height:1.7;color:#5a534c;"><strong>Name:</strong> ${safeName}</p>
      <p style="font-size:15px;line-height:1.7;color:#5a534c;"><strong>Email:</strong> ${safeEmail}</p>
      <p style="font-size:15px;line-height:1.7;color:#5a534c;"><strong>Occasion:</strong> ${safeOccasion}</p>
      <p style="font-size:15px;line-height:1.7;color:#5a534c;margin-top:20px;"><strong>Note</strong></p>
      <p style="font-size:15px;line-height:1.7;color:#5a534c;">${safeNote}</p>
    </div>
  `;

  if (!resend) {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[gifting] RESEND_API_KEY missing — enquiry (dev only):', {
        name,
        email,
        occasion,
        note,
      });
      return { ok: true, stub: true };
    }
    throw new Error('Email is not configured. Set RESEND_API_KEY.');
  }

  if (!toOwner) {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[gifting] notify email missing — enquiry (dev only):', {
        name,
        email,
        occasion,
        note,
      });
      return { ok: true, stub: true };
    }
    throw new Error('Gifting inbox is not configured. Set GIFTING_NOTIFY_EMAIL.');
  }

  const { error } = await resend.emails.send({
    from: fromAddress(),
    to: [toOwner],
    replyTo: email,
    subject,
    html,
  });

  if (error) {
    throw new Error(error.message || 'Failed to send gifting enquiry.');
  }
  return { ok: true };
}
