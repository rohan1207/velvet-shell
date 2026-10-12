const buckets = new Map();

/**
 * Simple sliding window limiter (per-process).
 * Prefer Upstash in production when UPSTASH_* env is set.
 */
export function rateLimit({ key, limit = 8, windowMs = 15 * 60 * 1000 }) {
  const now = Date.now();
  const row = buckets.get(key) || { count: 0, start: now };

  if (now - row.start > windowMs) {
    buckets.set(key, { count: 1, start: now });
    return { ok: true, remaining: limit - 1 };
  }

  row.count += 1;
  buckets.set(key, row);

  if (row.count > limit) {
    return { ok: false, remaining: 0 };
  }
  return { ok: true, remaining: limit - row.count };
}

export function clientIp(request) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'local'
  );
}
