import crypto from 'crypto';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, demo } =
      await request.json();

    if (demo) {
      return NextResponse.json({ ok: true, demo: true });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json({ ok: true, demo: true });
    }

    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto.createHmac('sha256', keySecret).update(payload).digest('hex');

    if (expected !== razorpay_signature) {
      return NextResponse.json({ ok: false, error: 'Invalid payment signature' }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error?.message || 'Verify failed' }, { status: 500 });
  }
}
