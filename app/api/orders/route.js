import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { createAuthRouteClient } from '@/lib/supabase/route';
import { createAdminSupabase } from '@/lib/supabase/admin';
import { sendOrderEmails } from '@/lib/auth/mail';
import { fromDbOrder, generateOrderNumber } from '@/lib/orders';
import { loadCatalog, productFromCatalog } from '@/lib/catalog';
import { getProduct } from '@/lib/products';
import { applyPromoCode, recordPromoRedemption } from '@/lib/discounts/apply';

function skuFromFeatures(features) {
  if (!Array.isArray(features)) return '';
  const hit = features.find((f) => /^SKU\s/i.test(String(f)));
  return hit ? String(hit).replace(/^SKU\s+/i, '').trim() : '';
}

function resolveSku(product, item) {
  return String(
    item?.sku ||
      product?.sku ||
      skuFromFeatures(product?.details) ||
      skuFromFeatures(product?.features) ||
      '',
  ).trim();
}

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
      discountCode = '',
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

    const catalog = await loadCatalog().catch(() => null);

    const lineRows = items.map((item) => {
      const live = catalog ? productFromCatalog(catalog, item.slug) : null;
      const product = live || getProduct(item.slug) || {};
      const unit = Number(item.price ?? product.price) || 0;
      const qty = Math.max(1, Number(item.qty) || 1);
      const customization = Array.isArray(item.customization)
        ? item.customization
            .map((entry) => ({
              id: String(entry?.id || ''),
              label: String(entry?.label || '').trim(),
              value: String(entry?.value ?? '').trim(),
            }))
            .filter((entry) => entry.label && entry.value)
        : [];
      const sku = resolveSku(product, item);
      const colorLabel = String(
        item.colorLabel || item.color || product.colorLabel || '',
      ).trim();
      return {
        product_slug: item.slug,
        product_name: item.name || product.name || item.slug,
        image_url: item.image || product.image || product.image_url || null,
        size: item.size || 'OS',
        metal: item.metal || item.color || product.material || '—',
        sku,
        color_label: colorLabel,
        unit_price: unit,
        qty,
        line_total: unit * qty,
        customization,
      };
    });

    const computedSubtotal = lineRows.reduce((s, l) => s + l.line_total, 0);
    const finalSubtotal = computedSubtotal;
    const finalShipping = Number(shippingFee) || 0;

    let discountAmount = 0;
    let appliedCode = '';
    let discountId = null;
    if (discountCode) {
      const promo = await applyPromoCode({
        code: discountCode,
        lines: lineRows.map((row) => {
          const live = catalog ? productFromCatalog(catalog, row.product_slug) : null;
          return {
            slug: row.product_slug,
            qty: row.qty,
            price: row.unit_price,
            category: live?.category || '',
            collection: live?.collection || '',
          };
        }),
        customerEmail: orderEmail,
      });
      if (promo.ok) {
        discountAmount = promo.discountAmount;
        appliedCode = promo.code;
        discountId = promo.discountId;
      }
    }

    const finalTotal = Math.max(0, finalSubtotal - discountAmount + finalShipping);
    // Ignore client total/subtotal — server recomputes from catalog + promo.
    void subtotal;
    void total;

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

    const orderPayload = {
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
      notes: [
        demo ? 'Demo payment' : '',
        appliedCode ? `Promo ${appliedCode} (−₹${discountAmount})` : '',
      ]
        .filter(Boolean)
        .join(' · '),
      discount_code: appliedCode,
      discount_amount: discountAmount,
      discount_id: discountId,
    };

    let { data: orderRow, error: orderErr } = await admin
      .from('orders')
      .insert(orderPayload)
      .select('*')
      .single();

    if (orderErr && /discount_code|discount_amount|discount_id/i.test(orderErr.message || '')) {
      const {
        discount_code: _dc,
        discount_amount: _da,
        discount_id: _di,
        ...withoutDiscountCols
      } = orderPayload;
      const retry = await admin.from('orders').insert(withoutDiscountCols).select('*').single();
      orderRow = retry.data
        ? { ...retry.data, discount_code: appliedCode, discount_amount: discountAmount }
        : retry.data;
      orderErr = retry.error;
    }

    if (orderErr) throw orderErr;

    const itemsWithOrder = lineRows.map((row) => ({ ...row, order_id: orderRow.id }));
    let { data: insertedItems, error: itemsErr } = await admin
      .from('order_items')
      .insert(itemsWithOrder)
      .select('*');

    if (itemsErr && /sku|color_label/i.test(itemsErr.message || '')) {
      // Migration 011 not applied yet — still place the order without those columns.
      const stripped = itemsWithOrder.map(({ sku: _s, color_label: _c, ...rest }) => rest);
      const retry = await admin.from('order_items').insert(stripped).select('*');
      insertedItems = (retry.data || []).map((row, i) => ({
        ...row,
        sku: itemsWithOrder[i]?.sku || '',
        color_label: itemsWithOrder[i]?.color_label || '',
      }));
      itemsErr = retry.error;
    }

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

    if (discountId && discountAmount > 0) {
      try {
        await recordPromoRedemption({
          discountId,
          orderId: orderRow.id,
          orderNumber,
          customerEmail: orderEmail,
          discountAmount,
          orderSubtotal: finalSubtotal,
          orderTotal: finalTotal,
        });
      } catch (redErr) {
        console.error('[orders] discount redemption failed', redErr);
      }
    }

    try {
      await sendOrderEmails({
        order: {
          ...orderRow,
          discount_code: orderRow.discount_code || appliedCode || '',
          discount_amount: orderRow.discount_amount ?? discountAmount ?? 0,
          razorpay_payment_id: paymentId || orderRow.razorpay_payment_id || null,
          razorpay_order_id: razorpayOrderId || orderRow.razorpay_order_id || null,
          paymentId: paymentId || null,
          paymentMethod: demo ? 'Demo (Razorpay)' : 'Razorpay',
          demo: Boolean(demo),
        },
        items: insertedItems || itemsWithOrder,
        customerName: shippingPayload.fullName,
      });
    } catch (mailErr) {
      console.error('[orders] email failed', mailErr);
    }

    const order = fromDbOrder(orderRow, insertedItems || itemsWithOrder);
    order.paymentId = paymentId || null;
    order.discountCode = appliedCode;
    order.discountAmount = discountAmount;

    return json({ ok: true, order }, { status: 201 });
  } catch (err) {
    console.error('[orders] create failed', err);
    return NextResponse.json(
      { error: err.message || 'Could not place order.' },
      { status: 500 },
    );
  }
}
