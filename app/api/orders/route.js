import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { createAuthRouteClient } from '@/lib/supabase/route';
import { createAdminSupabase } from '@/lib/supabase/admin';
import { sendOrderEmails } from '@/lib/auth/mail';
import { fromDbOrder, generateOrderNumber } from '@/lib/orders';
import { getProduct } from '@/lib/products';

export async function GET(request) {
  try {
    const { supabase, json } = createAuthRouteClient(request);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Sign in required.', orders: [] }, { status: 401 });
    }

    const admin = createAdminSupabase();
    const { data, error } = await admin
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    const orders = (data || []).map((row) => fromDbOrder(row, row.order_items));
    return json({ orders });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || 'Could not load orders.', orders: [] },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const { supabase, json } = createAuthRouteClient(request);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const {
      items = [],
      shipping = {},
      email,
      paymentId,
      razorpayOrderId,
      razorpaySignature,
      demo = false,
      subtotal,
      shippingFee = 0,
      total,
    } = body;

    if (!Array.isArray(items) || !items.length) {
      return NextResponse.json({ error: 'Cart is empty.' }, { status: 400 });
    }

    const orderEmail = String(email || user.email || shipping.email || '').trim().toLowerCase();
    if (!orderEmail) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    // Verify Razorpay signature when keys exist and not demo
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!demo && keySecret && razorpayOrderId && paymentId && razorpaySignature) {
      const expected = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpayOrderId}|${paymentId}`)
        .digest('hex');
      if (expected !== razorpaySignature) {
        return NextResponse.json({ error: 'Invalid payment signature.' }, { status: 400 });
      }
    }

    const lineRows = items.map((item) => {
      const product = getProduct(item.slug) || {};
      const unit = Number(item.price ?? product.price) || 0;
      const qty = Math.max(1, Number(item.qty) || 1);
      return {
        product_slug: item.slug,
        product_name: item.name || product.name || item.slug,
        image_url: item.image || product.image || product.image_url || null,
        size: item.size || 'OS',
        metal: item.metal || item.color || '—',
        unit_price: unit,
        qty,
        line_total: unit * qty,
      };
    });

    const computedSubtotal = lineRows.reduce((s, l) => s + l.line_total, 0);
    const finalSubtotal = Number(subtotal) || computedSubtotal;
    const finalShipping = Number(shippingFee) || 0;
    const finalTotal = Number(total) || finalSubtotal + finalShipping;

    const shippingPayload = {
      fullName: shipping.fullName || [shipping.firstName, shipping.lastName].filter(Boolean).join(' '),
      firstName: shipping.firstName || '',
      lastName: shipping.lastName || '',
      email: orderEmail,
      phone: shipping.phone || '',
      line1: shipping.line1 || shipping.address || '',
      line2: shipping.line2 || '',
      city: shipping.city || '',
      state: shipping.state || '',
      postal: shipping.postal || '',
      country: shipping.country || 'India',
      addressId: shipping.addressId || null,
    };

    const admin = createAdminSupabase();
    const orderNumber = generateOrderNumber();

    const { data: orderRow, error: orderErr } = await admin
      .from('orders')
      .insert({
        order_number: orderNumber,
        user_id: user.id,
        email: orderEmail,
        status: 'paid',
        subtotal: finalSubtotal,
        shipping_fee: finalShipping,
        total: finalTotal,
        currency: 'INR',
        shipping: shippingPayload,
        razorpay_order_id: razorpayOrderId || null,
        notes: demo ? 'Demo payment' : '',
      })
      .select('*')
      .single();

    if (orderErr) throw orderErr;

    const itemsWithOrder = lineRows.map((row) => ({ ...row, order_id: orderRow.id }));
    const { data: insertedItems, error: itemsErr } = await admin
      .from('order_items')
      .insert(itemsWithOrder)
      .select('*');

    if (itemsErr) throw itemsErr;

    if (paymentId || razorpayOrderId) {
      await admin.from('payments').insert({
        order_id: orderRow.id,
        razorpay_order_id: razorpayOrderId || null,
        razorpay_payment_id: paymentId || null,
        razorpay_signature: razorpaySignature || null,
        amount: finalTotal,
        currency: 'INR',
        status: 'captured',
        raw: { demo: Boolean(demo) },
        idempotency_key: paymentId || `demo_${orderRow.id}`,
      });
    }

    try {
      await sendOrderEmails({
        order: orderRow,
        items: insertedItems || itemsWithOrder,
        customerName: shippingPayload.fullName,
      });
    } catch (mailErr) {
      console.error('[orders] email failed', mailErr);
    }

    const order = fromDbOrder(orderRow, insertedItems || itemsWithOrder);
    order.paymentId = paymentId || null;

    return json({ ok: true, order }, { status: 201 });
  } catch (err) {
    console.error('[orders] create failed', err);
    return NextResponse.json(
      { error: err.message || 'Could not place order.' },
      { status: 500 },
    );
  }
}
