'use client';

import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';

const shopMenu = {
  eyebrow: 'Shop',
  line: 'Browse by form, collection, or house edit.',
  columns: [
    {
      title: 'Categories',
      links: [
        { href: '/shop?category=earrings', label: 'Earrings' },
        { href: '/shop?category=bracelets', label: 'Bracelets' },
        { href: '/shop?category=necklaces', label: 'Necklaces' },
        { href: '/shop?category=rings', label: 'Rings' },
        { href: '/shop?category=anklets', label: 'Anklets' },
        { href: '/shop?category=sets', label: 'Sets' },
        { href: '/shop?category=cuffs', label: 'Brooches' },
        { href: '/shop', label: 'Shop all' },
      ],
    },
    {
      title: 'Collections',
      links: [
        { href: '/shop?collection=lotus-whispers', label: 'Lotus Whispers' },
        { href: '/shop?collection=honey-atelier', label: 'Honey Atelier' },
        { href: '/shop?collection=soft-rain-garden', label: 'Soft Rain Garden' },
        { href: '/shop?collection=garden-path', label: 'Garden Path' },
        { href: '/shop?collection=butterfly-meadow', label: 'Butterfly Meadow' },
        { href: '/shop?collection=bamboo-grove', label: 'Bamboo Grove' },
        { href: '/shop?collection=plum-blossom', label: 'Plum Blossom' },
        { href: '/shop?collection=the-shell-edit', label: 'The Shell Edit' },
      ],
    },
    {
      title: 'Edits',
      links: [
        { href: '/#festive-edit', label: 'Festive Edit' },
        { href: '/#best-of', label: 'Best of Velvet Shell' },
        { href: '/wishlist', label: 'Saved pieces' },
        { href: '/shop', label: 'New arrivals' },
      ],
    },
  ],
  features: [
    {
      href: '/shop?category=earrings',
      image: '/images/banners/earrings/honeybee.jpg',
      label: 'Earrings',
      note: 'Nature at the ear',
    },
    {
      href: '/shop?category=rings',
      image: '/images/banners/rings/lotus.jpg',
      label: 'Rings',
      note: 'Petals for the hand',
    },
    {
      href: '/#festive-edit',
      image: '/images/banners/home-hero/garden.jpg',
      label: 'Festive Edit',
      note: 'Seasonal favourites',
    },
  ],
};

const giftingMenu = {
  eyebrow: 'Gifting',
  line: 'Thoughtful pieces for occasions, houses and teams.',
  columns: [
    {
      title: 'Gifting',
      links: [
        { href: '/gifting', label: 'Corporate gifting' },
        { href: '/shop?category=sets', label: 'Gift sets' },
        { href: '/shop', label: 'Shop all' },
        { href: '/contact', label: 'Enquire' },
      ],
    },
    {
      title: 'Gift ideas',
      links: [
        { href: '/shop?category=earrings', label: 'Earrings' },
        { href: '/shop?category=bracelets', label: 'Bracelets' },
        { href: '/shop?category=necklaces', label: 'Necklaces' },
        { href: '/shop?category=rings', label: 'Rings' },
        { href: '/shop?category=sets', label: 'Sets' },
      ],
    },
  ],
  features: [
    {
      href: '/gifting',
      image: '/images/category-banner-gifting.jpg',
      label: 'Corporate',
      note: 'Curated for teams',
    },
    {
      href: '/shop?category=sets',
      image: '/images/banners/sets/forget-me-not.jpg',
      label: 'Gift sets',
      note: 'Pieces meant together',
    },
    {
      href: '/shop?category=necklaces',
      image: '/images/banners/necklaces/pomegranate.jpg',
      label: 'Necklaces',
      note: 'Worn close',
    },
  ],
};

const brandMenu = {
  eyebrow: 'Brand',
  line: 'The house, the story, and how we care for each piece.',
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
      image: '/images/banners/home-hero/lotus-story.jpg',
      label: 'About us',
      note: 'Our atelier story',
    },
    {
      href: '/blogs',
      image: '/images/banners/home-hero/floral-whispers.jpg',
      label: 'Journal',
      note: 'Notes from the house',
    },
    {
      href: '/#testimonials',
      image: '/images/home-slide-meadow.jpg',
      label: 'Testimonials',
      note: 'Words from guests',
    },
  ],
};

function FeatureCard({ feature, onNavigate }) {
  return (
    <Link
      href={feature.href}
      onClick={onNavigate}
      className="group flex flex-col overflow-hidden rounded-2xl border border-ink/8 bg-white transition-all duration-500 hover:border-burgundy/20 hover:shadow-[0_12px_32px_rgba(45,43,43,0.08)]"
    >
      <span className="relative aspect-[16/10] overflow-hidden bg-pearl">
        <Image
          src={feature.image}
          alt=""
          fill
          sizes="(max-width: 1024px) 40vw, 220px"
          className="object-cover transition-transform duration-[1.1s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
        />
      </span>
      <span className="flex flex-1 flex-col px-3.5 py-3">
        <span className="font-label text-[10px] tracking-[0.16em] text-ink uppercase transition-colors group-hover:text-burgundy">
          {feature.label}
        </span>
        {feature.note ? (
          <span className="mt-1 text-[12px] font-light leading-snug text-ink/60">{feature.note}</span>
        ) : null}
      </span>
    </Link>
  );
}

function MegaPanel({ menu, onNavigate }) {
  return (
    <div className="border-t border-ink/6 bg-ivory/98 shadow-[0_28px_60px_rgba(40,20,24,0.14)] backdrop-blur-md">
      <div className="mx-auto max-w-[1600px] px-5 py-8 md:px-10 md:py-10">
        <div className="mb-7 flex flex-col gap-1 border-b border-ink/8 pb-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-label text-[10px] tracking-[0.22em] text-gold uppercase">{menu.eyebrow}</p>
            <p className="mt-1.5 max-w-md text-sm font-light text-ink/70">{menu.line}</p>
          </div>
          <Link
            href={menu.columns[0]?.links?.slice(-1)[0]?.href || '/shop'}
            onClick={onNavigate}
            className="mt-3 font-label text-[10px] tracking-[0.16em] text-burgundy uppercase transition-opacity hover:opacity-70 md:mt-0"
          >
            Explore →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          <div
            className={`grid gap-8 sm:grid-cols-2 lg:col-span-5 lg:gap-10 ${
              menu.columns.length >= 3 ? 'xl:grid-cols-3' : ''
            }`}
          >
            {menu.columns.map((col) => (
              <div key={col.title}>
                <p className="font-label text-[10px] tracking-[0.2em] text-ink/45 uppercase">{col.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={`${col.title}-${link.label}`}>
                      <Link
                        href={link.href}
                        onClick={onNavigate}
                        className="text-[13px] font-light tracking-[-0.01em] text-ink/80 transition-colors duration-300 hover:text-burgundy"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:col-span-7 lg:gap-4">
            {menu.features.map((feature) => (
              <FeatureCard key={feature.label} feature={feature} onNavigate={onNavigate} />
            ))}
          </div>
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
        <>
          <motion.button
            type="button"
            aria-label="Close menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-30 cursor-default bg-ink/25 backdrop-blur-[1px]"
            style={{ top: 'calc(var(--site-promo-h) + var(--site-nav-h))' }}
            onClick={onClose}
            onMouseEnter={onClose}
          />
          <motion.div
            key={open}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 top-full z-40"
            onMouseEnter={() => onOpen(open)}
            onMouseLeave={onClose}
          >
            <MegaPanel menu={menu} onNavigate={onClose} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export { shopMenu, brandMenu, giftingMenu };
