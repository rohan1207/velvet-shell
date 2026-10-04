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
        { href: '/shop?category=necklaces', label: 'Pendants' },
        { href: '/shop?category=bracelets', label: 'Bracelets' },
        { href: '/shop?category=cuffs', label: 'Brooches' },
        { href: '/shop', label: 'View all' },
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
        { href: '/gifting', label: 'Gifting' },
      ],
    },
    {
      title: 'The edit',
      links: [
        { href: '/shop', label: 'New arrivals' },
        { href: '/shop', label: 'Best of Velvet Shell' },
        { href: '/wishlist', label: 'Saved pieces' },
        { href: '/blogs', label: 'Blogs' },
        { href: '/contact', label: 'Private appointment' },
        { href: '/faq', label: 'FAQs' },
      ],
    },
  ],
  features: [
    {
      href: '/shop?collection=the-shell-edit',
      image: '/images/category-banner-rings.jpg',
      label: 'The Shell Edit',
    },
    {
      href: '/shop?collection=gilded-tide',
      image: '/images/category-banner-earrings.jpg',
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
        { href: '/about#mission', label: 'Our mission' },
        { href: '/blogs', label: 'Blogs' },
        { href: '/lookbook', label: 'Lookbook' },
        { href: '/contact', label: 'Contact us' },
        { href: '/faq', label: 'FAQs' },
      ],
    },
    {
      title: 'Brand themes',
      links: [
        { href: '/shop', label: 'Floral' },
        { href: '/shop', label: 'Botanical' },
        { href: '/shop?collection=the-shell-edit', label: 'Shell & nacre' },
        { href: '/shop?collection=pearls-of-nacre', label: 'Pearls' },
        { href: '/shop?collection=private-atelier', label: 'Atelier made' },
        { href: '/gifting', label: 'Festive gifting' },
      ],
    },
    {
      title: 'Materials',
      links: [
        { href: '/about', label: '925 silver' },
        { href: '/about', label: '18K gold-plated' },
        { href: '/about', label: 'Freshwater pearls' },
        { href: '/shipping', label: 'Care guide' },
        { href: '/returns', label: 'Returns' },
        { href: '/shipping', label: 'Shipping' },
      ],
    },
  ],
  features: [
    {
      href: '/blogs',
      image: '/images/look-collar-lapel.jpg',
      label: 'Our blogs',
    },
    {
      href: '/about',
      image: '/images/gifting-gesture.jpg',
      label: 'Our story',
    },
  ],
};

function MegaPanel({ menu, onNavigate }) {
  return (
    <div className="border-t border-ink/8 bg-ivory shadow-[0_24px_48px_rgba(40,20,24,0.12)]">
      <div className="mx-auto grid max-w-[1600px] grid-cols-12 gap-8 px-6 py-10 md:px-10 lg:gap-10 lg:py-12">
        {menu.columns.map((col) => (
          <div key={col.title} className="col-span-12 sm:col-span-4 lg:col-span-2">
            <p className="font-label text-[10px] tracking-[0.22em] text-ink/80">{col.title}</p>
            <ul className="mt-5 space-y-3.5">
              {col.links.map((link) => (
                <li key={`${col.title}-${link.label}`}>
                  <Link
                    href={link.href}
                    onClick={onNavigate}
                    className="text-[14px] font-light tracking-[-0.01em] text-ink/80 transition-colors duration-300 hover:text-burgundy"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="col-span-12 grid grid-cols-2 gap-5 lg:col-span-6 lg:pl-6">
          {menu.features.map((feature) => (
            <Link
              key={feature.label}
              href={feature.href}
              onClick={onNavigate}
              className="group block"
            >
              <span className="relative block aspect-[4/5] overflow-hidden bg-pearl sm:aspect-[5/6]">
                <Image
                  src={feature.image}
                  alt=""
                  fill
                  sizes="280px"
                  className="object-cover transition-transform duration-[1.1s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                />
              </span>
              <span className="mt-4 block text-center font-label text-[10px] tracking-[0.22em] text-ink/85 transition-colors group-hover:text-burgundy">
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
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
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
