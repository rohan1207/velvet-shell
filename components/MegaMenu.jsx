'use client';

import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';

const shopMenu = {
  columns: [
    {
      title: 'Categories',
      links: [
        { href: '/shop?category=rings', label: 'Rings' },
        { href: '/shop?category=earrings', label: 'Earrings' },
        { href: '/shop?category=necklaces', label: 'Necklaces' },
        { href: '/shop?category=necklaces', label: 'Pendants' },
        { href: '/shop?category=bracelets', label: 'Bracelets' },
        { href: '/shop?category=cuffs', label: 'Brooches' },
      ],
    },
    {
      title: 'Collections',
      links: [
        { href: '/shop?collection=the-shell-edit', label: 'The Shell Edit' },
        { href: '/shop?collection=pearls-of-nacre', label: 'Lumen Line' },
        { href: '/shop?collection=gilded-tide', label: 'Gilded Tide' },
        { href: '/shop?collection=private-atelier', label: 'Private Atelier' },
        { href: '/lookbook', label: 'Lookbook' },
        { href: '/shop', label: 'View all' },
      ],
    },
    {
      title: 'The edit',
      links: [
        { href: '/shop?badge=new', label: 'New arrivals' },
        { href: '/shop?badge=limited', label: 'Limited pieces' },
        { href: '/shop?badge=atelier', label: 'Atelier made' },
        { href: '/wishlist', label: 'Saved pieces' },
        { href: '/gifting', label: 'Gifting' },
        { href: '/contact', label: 'Private appointment' },
      ],
    },
  ],
  features: [
    {
      href: '/shop?collection=the-shell-edit',
      image: '/images/product-nacre-collar.png',
      label: 'The Shell Edit',
    },
    {
      href: '/shop?collection=gilded-tide',
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
        { href: '/about', label: 'Our story' },
        { href: '/about#atelier', label: 'The atelier' },
        { href: '/journal', label: 'Journal' },
        { href: '/contact', label: 'Contact' },
        { href: '/shipping', label: 'Shipping' },
        { href: '/faq', label: 'FAQs' },
      ],
    },
    {
      title: 'The house',
      links: [
        { href: '/about#materials', label: 'Materials' },
        { href: '/about#craft', label: 'Craft' },
        { href: '/about#floral', label: 'Floral theme' },
        { href: '/lookbook', label: 'Lookbook' },
        { href: '/journal', label: 'Notes from Jaipur' },
        { href: '/contact', label: 'Appointments' },
      ],
    },
    {
      title: 'Materials',
      links: [
        { href: '/about#materials', label: 'S925 silver' },
        { href: '/about#materials', label: '18k gold' },
        { href: '/about#materials', label: 'Champagne finish' },
        { href: '/about#materials', label: 'Diamonds' },
        { href: '/care', label: 'Care guide' },
        { href: '/returns', label: 'Returns' },
      ],
    },
  ],
  features: [
    {
      href: '/journal',
      image: '/images/look-neck-ears.png',
      label: 'Our journal',
    },
    {
      href: '/about',
      image: '/images/banner-bracelets.png',
      label: 'Our story',
    },
  ],
};

function MegaPanel({ menu, onNavigate }) {
  return (
    <div className="relative overflow-hidden border-t border-ink/6 bg-ivory">
      {/* Soft floral wash */}
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
            <Link
              key={feature.label}
              href={feature.href}
              onClick={onNavigate}
              className="group block"
            >
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
