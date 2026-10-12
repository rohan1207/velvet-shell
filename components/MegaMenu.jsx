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
        { href: '/shop?category=pendants', label: 'Pendants' },
        { href: '/shop?category=chains', label: 'Chains' },
        { href: '/shop?category=chokers', label: 'Chokers' },
        { href: '/shop?category=bracelets', label: 'Bracelets' },
        { href: '/shop?category=anklets', label: 'Anklets' },
        { href: '/shop?category=sets', label: 'Sets' },
        { href: '/shop', label: 'Shop all' },
      ],
    },
    {
      title: 'Collections',
      links: [
        { href: '/shop?collection=bamboo-grove', label: 'Bamboo Grove' },
        { href: '/shop?collection=birds-on-branch', label: 'Birds on Branch' },
        { href: '/shop?collection=butterfly-meadow', label: 'Butterfly Meadow' },
        { href: '/shop?collection=clover-lumen', label: 'Clover Lumen' },
        { href: '/shop?collection=crystal-berry', label: 'Crystal Berry' },
        { href: '/shop?collection=feather-sky', label: 'Feather Sky' },
        { href: '/shop?collection=frost-bloom', label: 'Frost Bloom' },
        { href: '/shop?collection=garden-path', label: 'Garden Path' },
        { href: '/shop?collection=gilded-tide', label: 'Gilded Tide' },
        { href: '/shop?collection=heart-tokens', label: 'Heart Tokens' },
        { href: '/shop?collection=honey-atelier', label: 'Honey Atelier' },
        { href: '/shop?collection=leaf-whisper', label: 'Leaf Whisper' },
      ],
    },
    {
      title: 'More collections',
      links: [
        { href: '/shop?collection=lotus-whispers', label: 'Lotus Whispers' },
        { href: '/shop?collection=pearls-of-nacre', label: 'Lumen Line' },
        { href: '/shop?collection=nacre-line', label: 'Nacre Line' },
        { href: '/shop?collection=pearl-meadow', label: 'Pearl Meadow' },
        { href: '/shop?collection=plum-blossom', label: 'Plum Blossom' },
        { href: '/shop?collection=private-atelier', label: 'Private Atelier' },
        { href: '/shop?collection=serpentine-bar', label: 'Serpentine Bar' },
        { href: '/shop?collection=shell-shore', label: 'Shell Shore' },
        { href: '/shop?collection=soft-rain-garden', label: 'Soft Rain Garden' },
        { href: '/shop?collection=starlight-tide', label: 'Starlight Tide' },
        { href: '/shop?collection=tea-garden', label: 'Tea Garden' },
        { href: '/shop?collection=the-shell-edit', label: 'The Shell Edit' },
      ],
    },
    {
      title: 'Edits',
      links: [
        { href: '/#festive-edit', label: 'Festive Edit' },
        { href: '/#best-of', label: 'Best of Velvet Shell' },
        { href: '/shop', label: 'Shop all' },
        { href: '/wishlist', label: 'Saved pieces' },
      ],
    },
  ],
  features: [
    {
      href: '/#festive-edit',
      image: '/images/category-banner-earrings.jpg',
      label: 'Festive Edit',
    },
    {
      href: '/#best-of',
      image: '/images/category-banner-rings.jpg',
      label: 'Best of Velvet Shell',
    },
  ],
};

const giftingMenu = {
  columns: [
    {
      title: 'Gifting',
      links: [
        { href: '/gifting', label: 'Corporate gifting' },
        { href: '/shop?category=sets', label: 'Gift sets' },
        { href: '/shop', label: 'Shop all' },
        { href: '/contact', label: 'Contact us' },
      ],
    },
    {
      title: 'Gift ideas',
      links: [
        { href: '/shop?category=earrings', label: 'Earrings' },
        { href: '/shop?category=necklaces', label: 'Necklaces' },
        { href: '/shop?category=bracelets', label: 'Bracelets' },
        { href: '/shop?category=rings', label: 'Rings' },
        { href: '/shop?category=pendants', label: 'Pendants' },
      ],
    },
  ],
  features: [
    {
      href: '/gifting',
      image: '/images/category-banner-gifting.jpg',
      label: 'Corporate gifting',
    },
    {
      href: '/shop?category=sets',
      image: '/images/category-banner-shop.jpg',
      label: 'Gift sets',
    },
  ],
};

const brandMenu = {
  columns: [
    {
      title: 'The brand',
      links: [
        { href: '/about', label: 'About us' },
        { href: '/blogs', label: 'Blogs' },
        { href: '/#testimonials', label: 'Testimonials' },
        { href: '/contact', label: 'Contact us' },
        { href: '/faq', label: 'FAQs' },
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
  ],
  features: [
    {
      href: '/about',
      image: '/images/home-slide-meadow.jpg',
      label: 'About us',
    },
    {
      href: '/blogs',
      image: '/images/category-banner-shop.jpg',
      label: 'Blogs',
    },
  ],
};

function MegaPanel({ menu, onNavigate }) {
  const dense = menu.columns.length >= 4;
  const colClass = dense
    ? 'col-span-6 sm:col-span-3 lg:col-span-2'
    : 'col-span-6 sm:col-span-4 lg:col-span-2';
  const featureClass = dense
    ? 'col-span-12 grid grid-cols-2 gap-5 lg:col-span-4 lg:pl-4'
    : 'col-span-12 grid grid-cols-2 gap-5 lg:col-span-8 lg:pl-6';

  return (
    <div className="border-t border-ink/8 bg-ivory shadow-[0_24px_48px_rgba(40,20,24,0.12)]">
      <div className="mx-auto grid max-w-[1600px] grid-cols-12 gap-8 px-6 py-10 md:px-10 lg:gap-8 lg:py-12">
        {menu.columns.map((col) => (
          <div key={col.title} className={colClass}>
            <p className="font-label text-[10px] tracking-[0.22em] text-ink/80">{col.title}</p>
            <ul className="mt-5 space-y-3">
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

        <div className={featureClass}>
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
  const menu =
    open === 'shop' ? shopMenu : open === 'brand' ? brandMenu : open === 'gifting' ? giftingMenu : null;

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

export { shopMenu, brandMenu, giftingMenu };
