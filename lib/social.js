/** Public social + WhatsApp links for storefront chrome. */

export const socialLinks = {
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://www.instagram.com/',
  facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || 'https://www.facebook.com/',
  pinterest: process.env.NEXT_PUBLIC_PINTEREST_URL || 'https://www.pinterest.com/',
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
