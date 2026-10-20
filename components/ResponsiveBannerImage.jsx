'use client';

import Image from 'next/image';
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
  const phone = mobileSrc || mobileBannerSrc(src);

  if (!fill) {
    return (
      <picture>
        <source media="(max-width: 767px)" srcSet={phone} />
        <img src={src} alt={alt} className={className} />
      </picture>
    );
  }

  return (
    <>
      {/* Phone */}
      <Image
        src={phone}
        alt={alt}
        fill
        priority={priority}
        quality={quality}
        sizes="100vw"
        className={`md:hidden ${className}`}
      />
      {/* Desktop / tablet */}
      <Image
        src={src}
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
