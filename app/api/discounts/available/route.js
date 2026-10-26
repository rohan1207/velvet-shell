import { NextResponse } from 'next/server';
import { listAvailablePromos } from '@/lib/discounts/apply';
import { loadCatalog, productFromCatalog } from '@/lib/catalog';

/**
 * POST { items?: [{ slug, qty, price? }], email? }
 * Lists active admin promo codes with eligibility vs the bag.
 */
export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const rawItems = Array.isArray(body.items) ? body.items : [];

    const catalog = rawItems.length ? await loadCatalog().catch(() => null) : null;
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

    const result = await listAvailablePromos({
      lines,
      customerEmail: body.email,
    });

    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error('[discounts/available]', err);
    return NextResponse.json(
      { ok: false, error: err.message || 'Could not load coupons.', coupons: [] },
      { status: 500 },
    );
  }
}
