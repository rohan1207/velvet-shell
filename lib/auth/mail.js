import { Resend } from 'resend';
import {
  fromAddress,
  lookLikeEmail,
  ownerNotifyEmails,
  siteUrl,
  renderBuyerOrderEmail,
  renderOwnerOrderEmail,
  renderBuyerShipmentEmail,
  renderOwnerShipmentEmail,
  renderPasswordResetEmail,
  renderGiftingEnquiryEmail,
} from '@/lib/email/templates';

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

async function sendMany(jobs) {
  if (!jobs.length) return { ok: false, reason: 'no-recipients', sent: 0, total: 0 };
  const settled = await Promise.allSettled(jobs.map((j) => j.promise));
  let okCount = 0;
  settled.forEach((result, i) => {
    const job = jobs[i];
    const err =
      result.status === 'rejected' ? result.reason : result.value?.error || null;
    if (err) {
      console.error('[mail] send failed', {
        label: job.label,
        to: job.to,
        from: job.from,
        message: err?.message || err,
        statusCode: err?.statusCode,
      });
    } else {
      okCount += 1;
    }
  });
  return { ok: okCount > 0, sent: okCount, total: jobs.length };
}

export async function sendPasswordResetEmail({ to, code, fullName }) {
  const resend = getResend();
  const accountUrl = `${siteUrl()}/account?mode=reset`;
  const loginUrl = `${siteUrl()}/account`;
  const { subject, html } = renderPasswordResetEmail({
    fullName,
    code,
    accountUrl,
    loginUrl,
  });

  if (!resend) {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[auth] RESEND_API_KEY missing — reset code (dev only):', code, '→', to);
      return { ok: true, stub: true };
    }
    throw new Error('Email is not configured. Set RESEND_API_KEY.');
  }

  const from = fromAddress();
  const { error } = await resend.emails.send({
    from,
    to: [to],
    subject,
    html,
  });
  if (error) throw new Error(error.message || 'Failed to send reset email.');
  return { ok: true };
}

export async function sendOrderEmails({ order, items = [], customerName }) {
  const resend = getResend();
  const toCustomer = String(order.email || '').trim().toLowerCase();
  const ownerList = ownerNotifyEmails();
  const buyer = renderBuyerOrderEmail({ order, items, customerName });
  const owner = renderOwnerOrderEmail({ order, items });

  if (!resend) {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[orders] email stub', {
        toCustomer,
        ownerList,
        orderNo: order.order_number || order.orderNumber,
        from: fromAddress(),
      });
      return { ok: true, stub: true };
    }
    console.warn('[orders] RESEND_API_KEY missing — skipped order emails');
    return { ok: false, stub: true };
  }

  const from = fromAddress();
  const jobs = [];
  if (toCustomer && lookLikeEmail(toCustomer)) {
    jobs.push({
      label: 'customer',
      to: toCustomer,
      from,
      promise: resend.emails.send({
        from,
        to: [toCustomer],
        subject: buyer.subject,
        html: buyer.html,
      }),
    });
  } else {
    console.warn('[orders] invalid customer email', { toCustomer });
  }
  for (const ownerTo of ownerList) {
    jobs.push({
      label: 'owner',
      to: ownerTo,
      from,
      promise: resend.emails.send({
        from,
        to: [ownerTo],
        subject: owner.subject,
        html: owner.html,
      }),
    });
  }

  if (!jobs.length) {
    console.warn('[orders] no email recipients', { toCustomer, ownerList });
    return { ok: false, reason: 'no-recipients' };
  }

  return sendMany(jobs);
}

export async function sendShipmentEmails({
  order,
  items = [],
  event = 'shipped',
  customerName,
}) {
  const resend = getResend();
  const toCustomer = String(order.email || '').trim().toLowerCase();
  const ownerList = ownerNotifyEmails();
  const buyer = renderBuyerShipmentEmail({ order, items, event, customerName });
  const owner = renderOwnerShipmentEmail({ order, event });

  if (!resend) {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[shipment] email stub', {
        event,
        toCustomer,
        ownerList,
        from: fromAddress(),
      });
      return { ok: true, stub: true };
    }
    console.warn('[shipment] RESEND_API_KEY missing — skipped');
    return { ok: false, stub: true };
  }

  const from = fromAddress();
  const jobs = [];
  if (toCustomer && lookLikeEmail(toCustomer)) {
    jobs.push({
      label: 'customer',
      to: toCustomer,
      from,
      promise: resend.emails.send({
        from,
        to: [toCustomer],
        subject: buyer.subject,
        html: buyer.html,
      }),
    });
  }
  for (const ownerTo of ownerList) {
    jobs.push({
      label: 'owner',
      to: ownerTo,
      from,
      promise: resend.emails.send({
        from,
        to: [ownerTo],
        subject: owner.subject,
        html: owner.html,
      }),
    });
  }

  if (!jobs.length) {
    console.warn('[shipment] no recipients', { toCustomer, ownerList });
    return { ok: false, reason: 'no-recipients' };
  }

  return sendMany(jobs);
}

export async function sendGiftingEnquiryEmail({ name, email, occasion, note }) {
  const resend = getResend();
  const fromGifting = String(process.env.GIFTING_NOTIFY_EMAIL || '')
    .split(/[,;]+/)
    .map((s) => s.trim().toLowerCase())
    .filter(lookLikeEmail);
  const owners = fromGifting.length ? fromGifting : ownerNotifyEmails().slice(0, 2);

  const rendered = renderGiftingEnquiryEmail({ name, email, occasion, note });

  if (!resend) {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[gifting] RESEND_API_KEY missing — enquiry (dev only):', {
        name,
        email,
        occasion,
      });
      return { ok: true, stub: true };
    }
    throw new Error('Email is not configured. Set RESEND_API_KEY.');
  }

  if (!owners.length) {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[gifting] notify email missing — enquiry (dev only)');
      return { ok: true, stub: true };
    }
    throw new Error('Gifting inbox is not configured. Set GIFTING_NOTIFY_EMAIL.');
  }

  const from = fromAddress();
  const { error } = await resend.emails.send({
    from,
    to: owners,
    replyTo: email,
    subject: rendered.subject,
    html: rendered.html,
  });
  if (error) throw new Error(error.message || 'Failed to send gifting enquiry.');
  return { ok: true };
}
