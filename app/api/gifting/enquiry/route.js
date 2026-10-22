import { NextResponse } from 'next/server';
import { sendGiftingEnquiryEmail } from '@/lib/auth/mail';

export const runtime = 'nodejs';

function clean(value) {
  return String(value || '').trim();
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const name = clean(body.name);
    const email = clean(body.email).toLowerCase();
    const occasion = clean(body.occasion);
    const note = clean(body.note || body.message);

    if (!name || name.length < 2) {
      return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email.' }, { status: 400 });
    }
    if (!occasion) {
      return NextResponse.json({ error: 'Please choose an occasion.' }, { status: 400 });
    }

    await sendGiftingEnquiryEmail({ name, email, occasion, note });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[gifting/enquiry]', err);
    return NextResponse.json(
      { error: err.message || 'Could not send enquiry. Please try again.' },
      { status: 500 },
    );
  }
}
