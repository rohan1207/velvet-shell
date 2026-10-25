import Image from 'next/image';
import Link from 'next/link';
import { socialLinks, whatsappHref } from '@/lib/social';
import { IconWhatsApp } from '@/components/WhatsAppFloat';

const columns = [
  {
    title: 'Shop',
    links: [
      { href: '/shop?category=earrings', label: 'Earrings' },
      { href: '/shop?category=bracelets', label: 'Bracelets' },
      { href: '/shop?category=necklaces', label: 'Necklaces' },
      { href: '/shop?category=pendants', label: 'Pendants' },
      { href: '/shop?category=chokers', label: 'Chokers' },
      { href: '/shop?category=rings', label: 'Rings' },
      { href: '/shop?category=chains', label: 'Chains' },
      { href: '/shop?category=brooches', label: 'Brooches' },
      { href: '/shop?category=anklets', label: 'Anklets' },
      { href: '/shop?category=sets', label: 'Sets' },
      { href: '/shop', label: 'Shop all' },
    ],
  },
  {
    title: 'Collections',
    links: [
      { href: '/shop?collection=the-shell-edit', label: 'The Shell Edit' },
      { href: '/shop?collection=pearls-of-nacre', label: 'Lumen Line' },
      { href: '/shop?collection=gilded-tide', label: 'Gilded Tide' },
      { href: '/shop?collection=private-atelier', label: 'Private Atelier' },
      { href: '/shop?collection=lotus-whispers', label: 'Lotus Whispers' },
      { href: '/shop?collection=soft-rain-garden', label: 'Soft Rain Garden' },
      { href: '/#festive-edit', label: 'Festive Edit' },
      { href: '/#best-of', label: 'Best of Velvet Shell' },
      { href: '/gifting', label: 'Corporate Gifting' },
      { href: '/gifting', label: 'Wedding Favours' },
    ],
  },
  {
    title: 'Brand',
    links: [
      { href: '/about', label: 'About us' },
      { href: '/blogs', label: 'Blogs' },
      { href: '/#testimonials', label: 'Testimonials' },
      { href: '/contact', label: 'Contact us' },
      { href: '/faq', label: 'FAQs' },
      { href: '/wishlist', label: 'Saved' },
      { href: '/account', label: 'Account' },
    ],
  },
  {
    title: 'Policies',
    links: [
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms & Conditions' },
      { href: '/returns', label: 'Returns & Refunds' },
      { href: '/shipping', label: 'Shipping' },
    ],
  },
];

function SocialIconLink({ href, label, children, external }) {
  const isExternal = external || /^https?:\/\//.test(href);
  const className =
    'inline-flex h-10 w-10 items-center justify-center rounded-full border border-ivory/20 text-ivory/85 transition-colors duration-300 hover:border-gold/60 hover:text-gold';
  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} aria-label={label} className={className}>
      {children}
    </Link>
  );
}

function IconInstagram({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
    </svg>
  );
}

function IconFacebook({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M14.5 8.5V6.8c0-.7.5-1.1 1.2-1.1h1.8V3h-2.5C12.2 3 11 4.4 11 6.6v1.9H9v2.7h2V21h3.5v-9.8h2.4l.4-2.7h-2.8Z" />
    </svg>
  );
}

function IconPinterest({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 3a9 9 0 0 0-3.3 17.4c-.05-.9-.1-2.3.02-3.3.11-.9.72-3.85.72-3.85s-.18-.37-.18-.9c0-.85.49-1.48 1.1-1.48.52 0 .77.39.77.86 0 .52-.33 1.3-.5 2.02-.14.6.3 1.1.9 1.1 1.08 0 1.9-1.14 1.9-2.78 0-1.45-1.04-2.47-2.53-2.47-1.72 0-2.73 1.29-2.73 2.63 0 .52.2 1.08.45 1.38.05.06.06.11.04.17l-.17.7c-.03.11-.09.14-.2.09-1.05-.49-1.71-2.02-1.71-3.25 0-2.65 1.93-5.08 5.55-5.08 2.92 0 5.18 2.08 5.18 4.86 0 2.9-1.83 5.23-4.37 5.23-.85 0-1.66-.45-1.93-1l-.53 2c-.2.77-.74 1.74-1.1 2.33A9 9 0 1 0 12 3Z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-velvet-texture text-ivory">
      <div className="mx-auto max-w-[1600px] px-5 py-14 md:px-10 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 md:gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block" aria-label="Velvet Shell home">
              <Image
                src="/logo-splash.png"
                alt="Velvet Shell"
                width={200}
                height={200}
                className="h-16 w-16 object-contain md:h-[6.5rem] md:w-[6.5rem]"
              />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ivory/85 md:mt-5">
              Jewellery, gifting & lifestyle creations, shaped by considered design and quiet intrigue.
            </p>
            <form className="mt-6 max-w-sm md:mt-8" action="/contact">
              <label className="font-label text-gold">Stay in touch</label>
              <p className="mt-2 text-sm leading-relaxed text-ivory/80">
                A little from Velvet Shell, occasionally.
              </p>
              <div className="mt-3 flex border-b border-ivory/20 pb-2">
                <input
                  type="email"
                  name="email"
                  placeholder="Your email"
                  className="w-full bg-transparent text-sm text-ivory outline-none placeholder:text-ivory/80"
                />
                <button type="submit" className="font-label text-gold">
                  Join
                </button>
              </div>
            </form>
            <div className="mt-8">
              <p className="font-label text-[10px] tracking-[0.18em] text-gold">Follow</p>
              <ul className="mt-3 flex flex-wrap items-center gap-2.5">
                <li>
                  <SocialIconLink href={socialLinks.instagram} label="Instagram">
                    <IconInstagram className="h-[18px] w-[18px]" />
                  </SocialIconLink>
                </li>
                <li>
                  <SocialIconLink href={socialLinks.facebook} label="Facebook">
                    <IconFacebook className="h-[18px] w-[18px]" />
                  </SocialIconLink>
                </li>
                <li>
                  <SocialIconLink href={socialLinks.pinterest} label="Pinterest">
                    <IconPinterest className="h-[18px] w-[18px]" />
                  </SocialIconLink>
                </li>
                <li>
                  <SocialIconLink href={whatsappHref()} label="WhatsApp" external>
                    <IconWhatsApp className="h-[18px] w-[18px]" />
                  </SocialIconLink>
                </li>
              </ul>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-10 md:contents">
            {columns.map((col) => (
              <div key={col.title} className="lg:col-span-2">
                <p className="font-label text-[10px] tracking-[0.18em] text-gold md:text-[11px]">
                  {col.title}
                </p>
                <ul className="mt-3 space-y-2.5 md:mt-4 md:space-y-3">
                  {col.links.map((link) => (
                    <li key={`${col.title}-${link.label}`}>
                      <Link
                        href={link.href}
                        className="text-[13px] text-ivory/80 transition-colors hover:text-ivory md:text-sm"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 overflow-hidden border-t border-ivory/10 pt-6 md:mt-14 md:pt-7">
          <p className="font-display text-[clamp(2.5rem,10vw,5.5rem)] leading-[0.85] tracking-[-0.04em] text-ivory/[0.08] uppercase select-none">
            Velvet Shell
          </p>
          <div className="mt-5 flex flex-col justify-between gap-3 text-[10px] tracking-[0.22em] text-ivory/80 uppercase sm:flex-row">
            <span>© {new Date().getFullYear()} Velvet Shell. All rights reserved.</span>
            <span>Jewellery · Gifting · Lifestyle</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
