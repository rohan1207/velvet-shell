'use client';

import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';

/** Temporary: all destinations point home while only the homepage is live. */
const HOME = '/';

const shopMenu = {
  columns: [
    {
      title: 'Categories',
      links: [
        { href: HOME, label: 'Rings' },
        { href: HOME, label: 'Earrings' },
        { href: HOME, label: 'Necklaces' },
        { href: HOME, label: 'Pendants' },
        { href: HOME, label: 'Bracelets' },
        { href: HOME, label: 'Brooches' },
      ],
    },
    {
      title: 'Collections',
      links: [
        { href: HOME, label: 'The Shell Edit' },
        { href: HOME, label: 'Lumen Line' },
        { href: HOME, label: 'Gilded Tide' },
        { href: HOME, label: 'Private Atelier' },
        { href: HOME, label: 'Lookbook' },
        { href: HOME, label: 'View all' },
      ],
    },
    {
      title: 'The edit',
      links: [
        { href: HOME, label: 'New arrivals' },
        { href: HOME, label: 'Limited pieces' },
        { href: HOME, label: 'Atelier made' },
        { href: HOME, label: 'Saved pieces' },
        { href: HOME, label: 'Gifting' },
        { href: HOME, label: 'Private appointment' },
      ],
    },
  ],
  features: [
    {
      href: HOME,
      image: '/images/product-nacre-collar.png',
      label: 'The Shell Edit',
    },
    {
      href: HOME,
      image: '/images/product-tide-drops.png',
      label: 'Gilded Tide',
    },
  ],
};

const brandMenu = {
  columns: [
    {
      title: 'About us',
      links: [
        { href: HOME, label: 'Our story' },
        { href: HOME, label: 'The atelier' },
        { href: HOME, label: 'Journal' },
        { href: HOME, label: 'Contact' },
        { href: HOME, label: 'Shipping' },
        { href: HOME, label: 'FAQs' },
      ],
    },
    {
      title: 'The house',
      links: [
        { href: HOME, label: 'Materials' },
        { href: HOME, label: 'Craft' },
        { href: HOME, label: 'Floral theme' },
        { href: HOME, label: 'Lookbook' },
        { href: HOME, label: 'Notes from Jaipur' },
        { href: HOME, label: 'Appointments' },
      ],
    },
    {
      title: 'Materials',
      links: [
        { href: HOME, label: 'S925 silver' },
        { href: HOME, label: '18k gold' },
        { href: HOME, label: 'Champagne finish' },
        { href: HOME, label: 'Diamonds' },
        { href: HOME, label: 'Care guide' },
        { href: HOME, label: 'Returns' },
      ],
    },
  ],
  features: [
    {
      href: HOME,
      image: '/images/look-neck-ears.png',
      label: 'Our journal',
    },
    {
      href: HOME,
      image: '/images/banner-bracelets.jpg',
      label: 'Our story',
    },
  ],
};

function MegaPanel({ menu, onNavigate }) {
  return (
    <div className="relative overflow-hidden border-t border-ink/6 bg-ivory">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <Image
          src="/images/hero-floral.png"
          alt=""
          fill
          className="object-contain object-[92%_60%] opacity-[0.12]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ivory via-ivory/90 to-ivory/55" />
      </div>

      <div className="relative mx-auto grid max-w-[1600px] grid-cols-12 gap-8 px-8 py-10 lg:gap-10 lg:px-10 lg:py-12">
        {menu.columns.map((col) => (
          <div key={col.title} className="col-span-2">
            <p className="font-label text-[10px] text-ink/40">{col.title}</p>
            <ul className="mt-5 space-y-3">
              {col.links.map((link) => (
                <li key={`${col.title}-${link.label}`}>
                  <Link
                    href={link.href}
                    onClick={onNavigate}
                    className="text-[14px] font-light tracking-[-0.01em] text-ink/75 transition-colors duration-300 hover:text-burgundy"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="col-span-6 grid grid-cols-2 gap-5 pl-4">
          {menu.features.map((feature) => (
            <Link key={feature.label} href={feature.href} onClick={onNavigate} className="group block">
              <span className="relative block aspect-[4/3] overflow-hidden rounded-[1.1rem] bg-pearl">
                <Image
                  src={feature.image}
                  alt=""
                  fill
                  sizes="280px"
                  className="object-cover transition-transform duration-[1.1s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                />
              </span>
              <span className="mt-4 block text-center font-label text-[10px] tracking-[0.2em] text-ink/70 transition-colors group-hover:text-burgundy">
                {feature.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MegaMenu({ open, onOpen, onClose }) {
  const menu = open === 'shop' ? shopMenu : open === 'brand' ? brandMenu : null;

  return (
    <AnimatePresence>
      {menu && (
        <motion.div
          key={open}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-x-0 top-full z-40"
          onMouseEnter={() => onOpen(open)}
          onMouseLeave={onClose}
        >
          <MegaPanel menu={menu} onNavigate={onClose} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export { shopMenu, brandMenu };
