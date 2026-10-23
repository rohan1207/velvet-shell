'use client';

import { useState } from 'react';
import Image from 'next/image';
import { withAssetVersion } from '@/lib/asset-version';
import { isRemoteImageSrc, PRODUCT_PLACEHOLDER } from '@/lib/product-image';

/**
 * next/image wrapper:
 * - cache-busts local public/ assets via ?v=
 * - serves remote (R2) + AVIF without the optimizer (avoids blank images)
 * - falls back to placeholder if load fails
 */
export default function AppImage({ src, alt = '', onError, ...props }) {
  const incoming = typeof src === 'string' ? src.trim() : '';
  const [failed, setFailed] = useState(false);

  const raw = failed || !incoming ? PRODUCT_PLACEHOLDER : incoming;
  const remote = isRemoteImageSrc(raw);
  const resolved = remote ? raw : withAssetVersion(raw);
  const skipOptimize =
    remote ||
    resolved.endsWith('.svg') ||
    /\.avif(\?|$)/i.test(resolved) ||
    /\.gif(\?|$)/i.test(resolved);

  return (
    <Image
      src={resolved}
      alt={alt}
      unoptimized={skipOptimize}
      onError={(event) => {
        if (!failed) setFailed(true);
        onError?.(event);
      }}
      {...props}
    />
  );
}
