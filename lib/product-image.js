/** Resolve a displayable product image for cart, checkout, and thumbnails. */

import { withAssetVersion } from '@/lib/asset-version';

export const PRODUCT_PLACEHOLDER = '/images/product-placeholder.svg';

export function isRemoteImageSrc(src) {
  return /^https?:\/\//i.test(String(src || ''));
}

function firstGalleryUrl(gallery) {
  if (!Array.isArray(gallery) || !gallery.length) return '';
  const first = gallery[0];
  if (typeof first === 'string') return first.trim();
  if (first && typeof first.url === 'string') return first.url.trim();
  return '';
}

function isUsableSrc(value) {
  if (typeof value !== 'string') return false;
  const src = value.trim();
  if (!src || src === PRODUCT_PLACEHOLDER) return false;
  // Prefer live catalog / R2 over blank or known-broken snapshots
  return true;
}

/**
 * Resolve a product image for cart / checkout / thumbs.
 * Live catalog fields win over cart `item.image` snapshots so R2 URLs
 * replace stale local `/products/...` paths after a reimport.
 */
export function productImageSrc(product, item) {
  const candidates = [
    product?.image,
    product?.image_url,
    product?.heroUrl,
    product?.hoverImage,
    firstGalleryUrl(product?.gallery),
    firstGalleryUrl(product?.media),
    item?.image,
  ];

  for (const value of candidates) {
    if (!isUsableSrc(value)) continue;
    const src = value.trim();
    return isRemoteImageSrc(src) ? src : withAssetVersion(src);
  }
  return withAssetVersion(PRODUCT_PLACEHOLDER);
}
