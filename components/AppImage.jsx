'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { withAssetVersion } from '@/lib/asset-version';
import { isRemoteImageSrc, PRODUCT_PLACEHOLDER } from '@/lib/product-image';

/**
 * next/image wrapper:
 * - cache-busts local public/ assets via ?v=
 * - serves remote (R2), AVIF, and /products/** without the optimizer
 *   (optimizer often fails on large LotusFun JPGs → false "placeholder")
 * - falls back to placeholder if load fails
 */
export default function AppImage({ src, alt = '', onError, ...props }) {
  const incoming = typeof src === 'string' ? src.trim() : '';
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [incoming]);

  const raw = failed || !incoming ? PRODUCT_PLACEHOLDER : incoming;
  const remote = isRemoteImageSrc(raw);
  const pathOnly = raw.split(/[?#]/)[0] || raw;
  const resolved = remote ? raw : withAssetVersion(raw);
  // Skip optimizer for product media — large LotusFun JPGs/PNGs often 400
  // through /_next/image while ring AVIFs (already unoptimized) look fine.
  const skipOptimize =
    remote ||
    pathOnly.startsWith('/products/') ||
    pathOnly.endsWith('.svg') ||
    /\.avif$/i.test(pathOnly) ||
    /\.gif$/i.test(pathOnly) ||
    /\.jpe?g$/i.test(pathOnly) ||
    /\.png$/i.test(pathOnly);

  return (
    <Image
      alt={alt}
      {...props}
      src={resolved}
      unoptimized={skipOptimize || props.unoptimized}
      onError={(event) => {
        if (!failed) setFailed(true);
        onError?.(event);
      }}
    />
  );
}
