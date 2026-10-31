/** Public social + WhatsApp links for storefront chrome. */

export const socialLinks = {
  instagram:
    process.env.NEXT_PUBLIC_INSTAGRAM_URL ||
    'https://www.instagram.com/velvetshellshop/',
  facebook:
    process.env.NEXT_PUBLIC_FACEBOOK_URL ||
    'https://www.facebook.com/velvetshellshop/',
  linkedin:
    process.env.NEXT_PUBLIC_LINKEDIN_URL ||
    'https://www.linkedin.com/company/velvet-shell-shop',
  youtube:
    process.env.NEXT_PUBLIC_YOUTUBE_URL ||
    'https://www.youtube.com/@VelvetShell-Shop',
  /** Digits only, country code included — e.g. 9198XXXXXXXX */
  whatsappNumber: String(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210').replace(
    /\D/g,
    '',
  ),
};

export const WHATSAPP_PREFILL =
  process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ||
  'Hello Velvet Shell — I would like help with jewellery / gifting.';

export function whatsappHref(message = WHATSAPP_PREFILL) {
  const phone = socialLinks.whatsappNumber;
  const text = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${text}`;
}

export function whatsappGiftingHref() {
  return whatsappHref(
    'Hello Velvet Shell — I am enquiring about corporate gifting / wedding favours.',
  );
}
