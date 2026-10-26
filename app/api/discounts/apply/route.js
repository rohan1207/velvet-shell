import { NextResponse } from 'next/server';
import { applyPromoCode } from '@/lib/discounts/apply';
import { loadCatalog, productFromCatalog } from '@/lib/catalog';

/**
 * POST { code, items: [{ slug, qty, price? }], email? }
 * Returns discount amount for the cart (server-authoritative).
 */
export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const code = body.code;
    const rawItems = Array.isArray(body.items) ? body.items : [];
    if (!rawItems.length) {
      return NextResponse.json({ ok: false, error: 'Cart is empty.' }, { status: 400 });
    }

    const catalog = await loadCatalog().catch(() => null);
    const lines = rawItems.map((item) => {
      const live = catalog ? productFromCatalog(catalog, item.slug) : null;
      return {
        slug: item.slug,
        qty: Math.max(1, Number(item.qty) || 1),
        price: Number(item.price ?? live?.price) || 0,
        category: live?.category || item.category || '',
        collection: live?.collection || item.collection || '',
      };
    });

    const result = await applyPromoCode({
      code,
      lines,
      customerEmail: body.email,
    });

    if (!result.ok) {
      return NextResponse.json(result, { status: 400 });
    }
    return NextResponse.json(result);
  } catch (err) {
    console.error('[discounts/apply]', err);
    return NextResponse.json(
      { ok: false, error: err.message || 'Could not apply code.' },
      { status: 500 },
    );
  }
}
