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
  /** Digits only, country code included. A 10-digit Indian mobile is prefixed with 91. */
  whatsappNumber: cleanWhatsapp(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER),
};

function cleanWhatsapp(raw) {
  let digits = String(raw || '').replace(/\D/g, '');
  if (digits.length === 10) digits = `91${digits}`;
  return digits;
}

export const WHATSAPP_PREFILL =
  process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ||
  'Hello Velvet Shell — I would like help with jewellery / gifting.';

export function whatsappHref(message = WHATSAPP_PREFILL) {
  const phone = socialLinks.whatsappNumber;
  if (!phone) return '';
  const text = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${text}`;
}

export function whatsappGiftingHref() {
  return whatsappHref(
    'Hello Velvet Shell — I am enquiring about corporate gifting / wedding favours.',
  );
}
