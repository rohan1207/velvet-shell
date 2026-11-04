import { NextResponse } from 'next/server';
import { sendContactEnquiryEmail } from '@/lib/auth/mail';

export const runtime = 'nodejs';

function clean(value) {
  return String(value || '').trim();
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const name = clean(body.name);
    const email = clean(body.email).toLowerCase();
    const phone = clean(body.phone);
    const interest = clean(body.interest);
    const message = clean(body.message || body.note);

    if (!name || name.length < 2) {
      return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email.' }, { status: 400 });
    }
    if (!message || message.length < 4) {
      return NextResponse.json({ error: 'Please write a short message.' }, { status: 400 });
    }

    await sendContactEnquiryEmail({ name, email, phone, interest, message });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[contact/enquiry]', err);
    return NextResponse.json(
      { error: err.message || 'Could not send enquiry. Please try again.' },
      { status: 500 },
    );
  }
}
