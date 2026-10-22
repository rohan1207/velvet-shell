'use client';

import { useState } from 'react';
import Image from 'next/image';
import { withAssetVersion } from '@/lib/asset-version';
import {
  PRODUCT_PLACEHOLDER,
  isRemoteImageSrc,
  productImageSrc,
} from '@/lib/product-image';

/**
 * Reliable product thumbnail for cart / checkout / drawers.
 * Falls back through product fields and a placeholder if anything fails.
 */
export default function ProductThumb({
  product,
  item,
  alt,
  className = 'object-cover',
  sizes = '96px',
  priority = false,
}) {
  const initial = productImageSrc(product, item);
  const [src, setSrc] = useState(initial);
  const [failed, setFailed] = useState(false);

  const raw = failed ? PRODUCT_PLACEHOLDER : src || PRODUCT_PLACEHOLDER;
  const remote = isRemoteImageSrc(raw);
  const displaySrc = remote ? raw : withAssetVersion(raw);

  return (
    <Image
      src={displaySrc}
      alt={alt || product?.name || item?.name || 'Product'}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={remote || displaySrc.endsWith('.svg')}
      className={className}
      onError={() => {
        if (!failed) {
          setFailed(true);
          setSrc(PRODUCT_PLACEHOLDER);
        }
      }}
    />
  );
}
