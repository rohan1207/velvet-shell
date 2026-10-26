import { NextResponse } from 'next/server';
import { createAdminSupabase } from '@/lib/supabase/admin';
import { allowInsecureTlsIfConfigured } from '@/lib/supabase/tls';

function lookLikeEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
}

export async function POST(request) {
  allowInsecureTlsIfConfigured();
  try {
    const body = await request.json().catch(() => ({}));
    const email = String(body.email || '')
      .trim()
      .toLowerCase();
    const slug = String(body.slug || '')
      .trim()
      .toLowerCase();
    const kind = body.kind === 'set' ? 'set' : 'product';
    const name = String(body.name || '').trim().slice(0, 200);

    if (!lookLikeEmail(email)) {
      return NextResponse.json({ error: 'Enter a valid email.' }, { status: 400 });
    }
    if (!slug) {
      return NextResponse.json({ error: 'Missing product.' }, { status: 400 });
    }

    const db = createAdminSupabase();
    const { error } = await db.from('stock_notify_requests').upsert(
      {
        email,
        kind,
        target_slug: slug,
        product_name: name,
      },
      { onConflict: 'email,kind,target_slug' },
    );
    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[stock-notify]', err);
    return NextResponse.json(
      { error: err.message || 'Could not save request.' },
      { status: 500 },
    );
  }
}
