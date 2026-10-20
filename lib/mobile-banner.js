/**
 * Maps a desktop banner path to its phone-framed counterpart.
 * `/images/foo.jpg` → `/images/mobile/foo.jpg`
 * Falls back to the desktop src when a mobile file is missing (caller handles).
 */
export function mobileBannerSrc(src) {
  if (!src || typeof src !== 'string') return src;
  if (src.includes('/mobile/')) return src;
  if (src.startsWith('/images/')) {
    return src.replace(/^\/images\//, '/images/mobile/');
  }
  // e.g. absolute R2 URLs — no mobile twin
  return src;
}

export function withMobileBanner(slide) {
  if (!slide) return slide;
  const desktop = slide.src || slide.image;
  return {
    ...slide,
    image: desktop,
    src: desktop,
    mobileSrc: slide.mobileSrc || mobileBannerSrc(desktop),
  };
}
