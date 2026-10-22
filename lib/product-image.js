/** Resolve a displayable product image for cart, checkout, and thumbnails. */

import { withAssetVersion } from '@/lib/asset-version';

export const PRODUCT_PLACEHOLDER = '/images/product-placeholder.svg';

function firstGalleryUrl(gallery) {
  if (!Array.isArray(gallery) || !gallery.length) return '';
  const first = gallery[0];
  if (typeof first === 'string') return first.trim();
  if (first && typeof first.url === 'string') return first.url.trim();
  return '';
}

export function productImageSrc(product, item) {
  const candidates = [
    item?.image,
    product?.image,
    product?.image_url,
    product?.heroUrl,
    product?.hoverImage,
    firstGalleryUrl(product?.gallery),
    firstGalleryUrl(product?.media),
  ];

  for (const value of candidates) {
    if (typeof value === 'string' && value.trim()) {
      const src = value.trim();
      return isRemoteImageSrc(src) ? src : withAssetVersion(src);
    }
  }
  return withAssetVersion(PRODUCT_PLACEHOLDER);
}

export function isRemoteImageSrc(src) {
  return /^https?:\/\//i.test(String(src || ''));
}
