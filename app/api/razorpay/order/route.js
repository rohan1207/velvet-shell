import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const amount = Number(body.amount);
    const currency = body.currency || 'INR';
    const receipt = body.receipt || `vs_${Date.now()}`;

    if (!amount || amount < 1) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json({
        demo: true,
        key: keyId || null,
        amount: Math.round(amount * 100),
        currency,
        receipt,
        message:
          'Razorpay keys missing. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env.local — demo checkout will simulate success.',
      });
    }

    const Razorpay = (await import('razorpay')).default;
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency,
      receipt,
      notes: {
        source: 'velvet-shell-demo',
      },
    });

    return NextResponse.json({
      demo: false,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: keyId,
      receipt,
    });
  } catch (error) {
    console.error('Razorpay order error:', error);
    return NextResponse.json(
      { error: error?.message || 'Unable to create payment order' },
      { status: 500 }
    );
  }
}
