'use client';

import AppImage from '@/components/AppImage';
import { withAssetVersion } from '@/lib/asset-version';
import { mobileBannerSrc } from '@/lib/mobile-banner';

/**
 * Full-bleed banner that swaps to a phone-framed asset below md.
 * Desktop keeps the original landscape artwork; phone uses /images/mobile/...
 */
export default function ResponsiveBannerImage({
  src,
  mobileSrc,
  alt = '',
  priority = false,
  quality = 90,
  className = 'object-cover object-center',
  sizes = '100vw',
  fill = true,
}) {
  const desktop = withAssetVersion(src);
  const phone = withAssetVersion(mobileSrc || mobileBannerSrc(src));

  if (!fill) {
    return (
      <picture>
        <source media="(max-width: 767px)" srcSet={phone} />
        <img src={desktop} alt={alt} className={className} />
      </picture>
    );
  }

  return (
    <>
      {/* Phone */}
      <AppImage
        src={phone}
        alt={alt}
        fill
        priority={priority}
        quality={quality}
        sizes="100vw"
        className={`md:hidden ${className}`}
      />
      {/* Desktop / tablet */}
      <AppImage
        src={desktop}
        alt={alt}
        fill
        priority={priority}
        quality={quality}
        sizes={sizes}
        className={`hidden md:block ${className}`}
      />
    </>
  );
}
