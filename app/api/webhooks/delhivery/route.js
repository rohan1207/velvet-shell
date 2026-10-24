import { NextResponse } from 'next/server';
import { createAdminSupabase } from '@/lib/supabase/admin';
import { allowInsecureTlsIfConfigured } from '@/lib/supabase/tls';
import { sendShipmentEmails } from '@/lib/auth/mail';
import {
  extractEventFields,
  mapDelhiveryStatus,
  normalizeWebhookEvents,
  trackingUrlForAwb,
} from '@/lib/delivery/delhivery';

function webhookAuthorized(request) {
  const expected = String(process.env.DELHIVERY_WEBHOOK_SECRET || '').trim();
  if (!expected) return true; // optional — enable once Delhivery gives a secret
  const header =
    request.headers.get('x-delhivery-secret') ||
    request.headers.get('authorization') ||
    '';
  return header.includes(expected);
}

export async function POST(request) {
  if (!webhookAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  allowInsecureTlsIfConfigured();

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const events = normalizeWebhookEvents(body);
  const db = createAdminSupabase();
  const results = [];

  for (const event of events) {
    const { awb, status, orderId } = extractEventFields(event);
    if (!awb && !orderId) {
      results.push({ ok: false, reason: 'no awb/order' });
      continue;
    }

    const mapped = mapDelhiveryStatus(status);
    let query = db.from('orders').select('*, order_items(*)');
    if (awb) query = query.eq('awb', awb);
    else query = query.eq('order_number', orderId);

    const { data: row, error } = await query.maybeSingle();
    if (error) {
      results.push({ ok: false, awb, error: error.message });
      continue;
    }
    if (!row) {
      results.push({ ok: false, awb, reason: 'order not found' });
      continue;
    }

    // Don't regress delivered / cancelled
    if (row.status === 'delivered' || row.status === 'cancelled' || row.status === 'refunded') {
      results.push({ ok: true, awb, skipped: row.status });
      continue;
    }

    const patch = {
      shipment_status: mapped.label || status || row.shipment_status || '',
      updated_at: new Date().toISOString(),
    };
    if (!row.tracking_url && awb) {
      patch.tracking_url = trackingUrlForAwb(awb);
    }
    if (mapped.dbStatus === 'shipped' && row.status !== 'shipped') {
      patch.status = 'shipped';
      if (!row.shipped_at) patch.shipped_at = new Date().toISOString();
    }
    if (mapped.dbStatus === 'delivered') {
      patch.status = 'delivered';
      patch.delivered_at = new Date().toISOString();
      if (!row.shipped_at) patch.shipped_at = patch.delivered_at;
    }

    const { data: updated, error: upErr } = await db
      .from('orders')
      .update(patch)
      .eq('id', row.id)
      .select('*, order_items(*)')
      .single();

    if (upErr) {
      results.push({ ok: false, awb, error: upErr.message });
      continue;
    }

    if (mapped.dbStatus === 'delivered' && row.status !== 'delivered') {
      const ship = updated.shipping || {};
      const customerName =
        ship.fullName ||
        [ship.firstName, ship.lastName].filter(Boolean).join(' ') ||
        '';
      try {
        await sendShipmentEmails({
          order: updated,
          items: updated.order_items || [],
          event: 'delivered',
          customerName,
        });
      } catch (mailErr) {
        console.error('[delhivery webhook] mail', mailErr);
      }
    }

    results.push({
      ok: true,
      awb: updated.awb,
      status: updated.status,
      shipmentStatus: updated.shipment_status,
    });
  }

  // Always 200 so Delhivery does not retry storms on business skips
  return NextResponse.json({ ok: true, results });
}

/** Health check for Delhivery portal URL validation */
export async function GET() {
  return NextResponse.json({
    ok: true,
    service: 'delhivery-webhook',
    hint: 'POST shipment status events here',
  });
}
