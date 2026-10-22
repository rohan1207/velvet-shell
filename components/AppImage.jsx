'use client';

import Image from 'next/image';
import { withAssetVersion } from '@/lib/asset-version';
import { isRemoteImageSrc } from '@/lib/product-image';

/**
 * next/image wrapper that cache-busts local public/ assets via ?v=.
 * Bump IMAGE_ASSET_VERSION in lib/asset-version.js after replacing files in place.
 */
export default function AppImage({ src, ...props }) {
  const resolved =
    typeof src === 'string' && src && !isRemoteImageSrc(src)
      ? withAssetVersion(src)
      : src;

  return <Image src={resolved} {...props} />;
}
