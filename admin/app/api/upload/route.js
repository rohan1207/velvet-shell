import { NextResponse } from 'next/server';
import { readSessionFromRequest } from '@/lib/session';

/**
 * Media upload endpoint.
 * When Cloudflare R2 env vars are present, files will stream to R2.
 * Until then, accepts a public URL (paste) so the form stays usable.
 */
export async function POST(request) {
  if (!readSessionFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const contentType = request.headers.get('content-type') || '';

  // JSON: { url, kind } — paste existing CDN URL
  if (contentType.includes('application/json')) {
    const body = await request.json().catch(() => ({}));
    const url = String(body.url || '').trim();
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }
    const kind = body.kind === 'video' || /\.(mp4|webm|mov)(\?|$)/i.test(url) ? 'video' : 'image';
    return NextResponse.json({ ok: true, url, kind, source: 'url' });
  }

  // Multipart file — requires R2 (wired when you send Cloudflare credentials)
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const keyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
  const secret = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
  const bucket = process.env.CLOUDFLARE_R2_BUCKET;
  const publicBase = process.env.CLOUDFLARE_R2_PUBLIC_BASE_URL;

  if (!accountId || !keyId || !secret || !bucket || !publicBase) {
    return NextResponse.json(
      {
        error:
          'File upload needs Cloudflare R2. Paste a public URL for now, or add R2 keys to admin/.env.local (see docs/PRODUCT_CATALOG_PLAN.md).',
        code: 'R2_NOT_CONFIGURED',
      },
      { status: 503 }
    );
  }

  return NextResponse.json(
    {
      error: 'R2 direct upload is ready to wire — send Cloudflare keys and we will finish this route.',
      code: 'R2_PENDING_WIRE',
    },
    { status: 501 }
  );
}
