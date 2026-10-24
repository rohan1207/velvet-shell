'use client';

import { useEffect, useState } from 'react';
import AppImage from '@/components/AppImage';
import {
  PRODUCT_PLACEHOLDER,
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

  useEffect(() => {
    setSrc(initial);
  }, [initial]);

  return (
    <AppImage
      src={src || PRODUCT_PLACEHOLDER}
      alt={alt || product?.name || item?.name || 'Product'}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
      onError={() => {
        if (src !== PRODUCT_PLACEHOLDER) setSrc(PRODUCT_PLACEHOLDER);
      }}
    />
  );
}
