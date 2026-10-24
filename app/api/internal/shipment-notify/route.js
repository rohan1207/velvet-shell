import { NextResponse } from 'next/server';
import { createAdminSupabase } from '@/lib/supabase/admin';
import { allowInsecureTlsIfConfigured } from '@/lib/supabase/tls';
import { sendShipmentEmails } from '@/lib/auth/mail';

function authorized(request) {
  const secret = process.env.ADMIN_SESSION_SECRET || '';
  if (!secret) return false;
  const header = request.headers.get('x-velvet-secret') || '';
  return header && header === secret;
}

export async function POST(request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  allowInsecureTlsIfConfigured();

  try {
    const body = await request.json().catch(() => ({}));
    const orderId = body.orderId || body.id;
    const event = body.event === 'delivered' ? 'delivered' : 'shipped';
    if (!orderId) {
      return NextResponse.json({ error: 'orderId required' }, { status: 400 });
    }

    const db = createAdminSupabase();
    const { data: row, error } = await db
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', orderId)
      .maybeSingle();
    if (error) throw error;
    if (!row) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const ship = row.shipping || {};
    const customerName =
      ship.fullName ||
      [ship.firstName, ship.lastName].filter(Boolean).join(' ') ||
      '';

    await sendShipmentEmails({
      order: row,
      items: row.order_items || [],
      event,
      customerName,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[shipment-notify]', err);
    return NextResponse.json({ error: err.message || 'Failed' }, { status: 500 });
  }
}
