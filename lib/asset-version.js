/**
 * Bump IMAGE_ASSET_VERSION whenever local public/ images are replaced in place.
 * Appended as ?v=N so next/image treats them as a new cache key.
 */
export const IMAGE_ASSET_VERSION = '2';

/** Add or refresh ?v= for local paths. Remote URLs are left unchanged. */
export function withAssetVersion(src) {
  if (!src || typeof src !== 'string') return src;
  const trimmed = src.trim();
  if (!trimmed.startsWith('/') || trimmed.startsWith('//')) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  const hashIndex = trimmed.indexOf('#');
  const hash = hashIndex >= 0 ? trimmed.slice(hashIndex) : '';
  const beforeHash = hashIndex >= 0 ? trimmed.slice(0, hashIndex) : trimmed;
  const qIndex = beforeHash.indexOf('?');
  const pathOnly = qIndex >= 0 ? beforeHash.slice(0, qIndex) : beforeHash;
  const params = new URLSearchParams(qIndex >= 0 ? beforeHash.slice(qIndex + 1) : '');
  params.set('v', IMAGE_ASSET_VERSION);
  const qs = params.toString();
  return `${pathOnly}?${qs}${hash}`;
}
