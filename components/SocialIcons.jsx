import { socialLinks, whatsappHref } from '@/lib/social';
import { IconWhatsApp } from '@/components/WhatsAppFloat';

export function IconInstagram({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
    </svg>
  );
}

export function IconFacebook({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M14.5 8.5V6.8c0-.7.5-1.1 1.2-1.1h1.8V3h-2.5C12.2 3 11 4.4 11 6.6v1.9H9v2.7h2V21h3.5v-9.8h2.4l.4-2.7h-2.8Z" />
    </svg>
  );
}

export function IconLinkedIn({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M6.5 9.5H3.7V20.3h2.8V9.5ZM5.1 3.7a1.65 1.65 0 1 0 0 3.3 1.65 1.65 0 0 0 0-3.3ZM20.3 20.3h-2.8v-5.4c0-1.29-.02-2.94-1.79-2.94-1.8 0-2.07 1.4-2.07 2.85v5.49H10.8V9.5h2.7v1.48h.04c.37-.71 1.29-1.46 2.65-1.46 2.84 0 3.36 1.87 3.36 4.3v6.48Z" />
    </svg>
  );
}

export function IconYouTube({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M21.6 7.2a2.7 2.7 0 0 0-1.9-1.9C18.1 4.9 12 4.9 12 4.9s-6.1 0-7.7.4A2.7 2.7 0 0 0 2.4 7.2 28.3 28.3 0 0 0 2 12a28.3 28.3 0 0 0 .4 4.8 2.7 2.7 0 0 0 1.9 1.9c1.6.4 7.7.4 7.7.4s6.1 0 7.7-.4a2.7 2.7 0 0 0 1.9-1.9A28.3 28.3 0 0 0 22 12a28.3 28.3 0 0 0-.4-4.8ZM10 15.2V8.8l5.2 3.2L10 15.2Z" />
    </svg>
  );
}

/** Ordered public channels shown in chrome. */
export const SOCIAL_CHANNELS = [
  {
    key: 'instagram',
    label: 'Instagram',
    href: () => socialLinks.instagram,
    Icon: IconInstagram,
  },
  {
    key: 'facebook',
    label: 'Facebook',
    href: () => socialLinks.facebook,
    Icon: IconFacebook,
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    href: () => socialLinks.linkedin,
    Icon: IconLinkedIn,
  },
  {
    key: 'youtube',
    label: 'YouTube',
    href: () => socialLinks.youtube,
    Icon: IconYouTube,
  },
];

/**
 * @param {'footer' | 'navbar' | 'drawer'} variant
 * @param {boolean} [includeWhatsApp]
 */
export default function SocialLinks({
  variant = 'footer',
  includeWhatsApp = false,
  className = '',
  iconClassName,
}) {
  const channels = [
    ...SOCIAL_CHANNELS,
    ...(includeWhatsApp
      ? [
          {
            key: 'whatsapp',
            label: 'WhatsApp',
            href: () => whatsappHref(),
            Icon: IconWhatsApp,
          },
        ]
      : []),
  ];

  const linkClass =
    variant === 'footer'
      ? 'inline-flex h-10 w-10 items-center justify-center rounded-full border border-ivory/20 text-ivory/85 transition-colors duration-300 hover:border-gold/60 hover:text-gold'
      : variant === 'drawer'
        ? 'inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white/85 transition-colors hover:border-gold/50 hover:text-gold'
        : 'inline-flex h-8 w-8 items-center justify-center rounded-full text-white/65 transition-colors duration-300 hover:bg-white/10 hover:text-white';

  const iconSize =
    iconClassName ||
    (variant === 'navbar' ? 'h-[15px] w-[15px]' : 'h-[18px] w-[18px]');

  return (
    <ul
      className={`flex flex-wrap items-center ${
        variant === 'navbar' ? 'gap-0.5' : 'gap-2.5'
      } ${className}`}
      aria-label="Social media"
    >
      {channels.map(({ key, label, href, Icon }) => {
        const url = href();
        if (!url) return null;
        return (
        <li key={key}>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className={linkClass}
          >
            <Icon className={iconSize} />
          </a>
        </li>
        );
      })}
    </ul>
  );
}
