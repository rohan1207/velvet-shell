import { socialLinks, whatsappHref } from '@/lib/social';

/** Public storefront contact — email matches Resend / owner inboxes. */
const DEFAULT_EMAIL = 'sales@velvetshell.in';
const DEFAULT_EMAIL_ALT = 'info.velvetshell@gmail.com';

function digitsOnly(value) {
  return String(value || '').replace(/\D/g, '');
}

export function formatPhoneDisplay(raw) {
  const d = digitsOnly(raw);
  if (!d) return '';
  if (d.length === 12 && d.startsWith('91')) {
    return `+91 ${d.slice(2, 7)} ${d.slice(7)}`;
  }
  if (d.length === 10) {
    return `+91 ${d.slice(0, 5)} ${d.slice(5)}`;
  }
  if (d.startsWith('91')) return `+${d}`;
  return `+${d}`;
}

export function phoneTelHref(raw) {
  const d = digitsOnly(raw);
  if (!d) return '';
  return `tel:+${d.startsWith('91') || d.length > 10 ? d : `91${d}`}`;
}

/**
 * Details shown on Contact / Enquire and policies.
 * Override via NEXT_PUBLIC_CONTACT_EMAIL / NEXT_PUBLIC_CONTACT_PHONE.
 */
export function getContactDetails() {
  const email = String(
    process.env.NEXT_PUBLIC_CONTACT_EMAIL || DEFAULT_EMAIL,
  )
    .trim()
    .toLowerCase();
  const emailAlt = String(
    process.env.NEXT_PUBLIC_CONTACT_EMAIL_ALT || DEFAULT_EMAIL_ALT,
  )
    .trim()
    .toLowerCase();
  const phoneRaw =
    process.env.NEXT_PUBLIC_CONTACT_PHONE || socialLinks.whatsappNumber || '';

  return {
    email,
    emailAlt: emailAlt && emailAlt !== email ? emailAlt : '',
    phoneRaw: digitsOnly(phoneRaw),
    phoneDisplay: formatPhoneDisplay(phoneRaw),
    phoneHref: phoneTelHref(phoneRaw),
    whatsappHref: whatsappHref(),
    mailtoHref: email ? `mailto:${email}` : '',
  };
}

export const CONTACT_INTERESTS = [
  'Orders & shipping',
  'Product details',
  'Gifting',
  'Collaborations',
  'General enquiry',
];
