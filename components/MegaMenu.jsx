'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import ResponsiveBannerImage from '@/components/ResponsiveBannerImage';

const shopMenu = {
  eyebrow: 'Shop',
  line: 'Browse by form, collection, or house edit.',
  exploreHref: '/shop',
  exploreLabel: 'Shop all',
  columns: [
    {
      title: 'Categories',
      links: [
        { href: '/shop?category=earrings', label: 'Earrings' },
        { href: '/shop?category=bracelets', label: 'Bracelets' },
        { href: '/shop?category=necklaces', label: 'Necklaces' },
        // { href: '/shop?category=pendants', label: 'Pendants' },
        { href: '/shop?category=chokers', label: 'Chokers' },
        { href: '/shop?category=rings', label: 'Rings' },
        { href: '/shop?category=anklets', label: 'Anklets' },
        { href: '/shop?category=sets', label: 'Sets' },
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
    // Pendants folded into Necklaces
    // {
    //   href: '/shop?category=pendants',
    //   image: '/images/banners/necklaces/pomegranate.jpg',
    //   label: 'Pendants',
    //   note: 'A single quiet focus',
    // },
    {
      href: '/shop?category=necklaces',
      image: '/images/banners/necklaces/pomegranate.jpg',
      label: 'Necklaces',
      note: 'Worn at the collarbone',
    },
    {
      href: '/shop?category=chokers',
      image: '/images/banners/necklaces/flower.jpg',
      label: 'Chokers',
      note: 'Worn close to the neck',
    },
    {
      href: '/shop?category=earrings',
      image: '/images/banners/earrings/honeybee.jpg',
      label: 'Earrings',
      note: 'Nature at the ear',
    },
  ],
};

const giftingMenu = {
  eyebrow: 'Gifting',
  line: 'Thoughtful pieces for occasions, houses and teams.',
  exploreHref: '/gifting',
  exploreLabel: 'Explore gifting',
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
    {
      title: 'Occasions',
      links: [
        { href: '/gifting', label: 'Corporate' },
        { href: '/shop?category=sets', label: 'Wedding & sets' },
        { href: '/#festive-edit', label: 'Festive edit' },
        { href: '/contact', label: 'Custom enquire' },
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

const accessoriesMenu = {
  eyebrow: 'Accessories',
  line: 'Chains and brooches — finishing pieces with presence.',
  exploreHref: '/shop?category=brooches',
  exploreLabel: 'Browse accessories',
  columns: [
    {
      title: 'Accessories',
      links: [
        { href: '/shop?category=chains', label: 'Chains' },
        { href: '/shop?category=brooches', label: 'Brooches' },
      ],
    },
  ],
  features: [
    {
      href: '/shop?category=chains',
      image: '/images/banners/necklaces/bamboo.jpg',
      label: 'Chains',
      note: 'Fine links for everyday layering',
    },
    {
      href: '/shop?category=brooches',
      image: '/images/banners/brooches/calla.jpg',
      label: 'Brooches',
      note: 'Pinned to lapel or dress',
    },
  ],
};

const brandMenu = {
  eyebrow: 'Brand',
  line: 'The house, the story, and how we care for each piece.',
  exploreHref: '/about',
  exploreLabel: 'About us',
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
    {
      title: 'Visit',
      links: [
        { href: '/lookbook', label: 'Lookbook' },
        { href: '/wishlist', label: 'Saved pieces' },
        { href: '/account', label: 'Account' },
        { href: '/shop', label: 'Shop the edit' },
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

/** Compact vertical feature — image on top, label below (never cropped). */
function FeatureCard({ feature, onNavigate }) {
  return (
    <Link
      href={feature.href}
      onClick={onNavigate}
      className="group flex w-full max-w-[11.5rem] flex-col xl:max-w-[13rem]"
    >
      <span className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-ink">
        <ResponsiveBannerImage
          src={feature.image}
          alt=""
          sizes="220px"
          className="object-cover object-center transition-transform duration-[1.1s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
        />
      </span>
      <span className="mt-2.5 flex flex-col px-0.5">
        <span className="font-label text-[9px] tracking-[0.16em] text-ink uppercase transition-colors group-hover:text-burgundy xl:text-[10px]">
          {feature.label}
        </span>
        {feature.note ? (
          <span className="mt-1 text-[11px] font-light leading-snug text-ink/60">{feature.note}</span>
        ) : null}
      </span>
    </Link>
  );
}

function MegaPanel({ menu, onNavigate }) {
  return (
    <div className="flex h-full min-h-0 flex-col bg-ivory">
      <div className="mx-auto flex h-full min-h-0 w-full max-w-[1600px] flex-col px-5 py-6 md:px-10 md:py-8 lg:py-9">
        <div className="mb-5 flex shrink-0 flex-col gap-1 border-b border-ink/8 pb-4 md:mb-6 md:flex-row md:items-end md:justify-between md:pb-5">
          <div>
            <p className="font-label text-[10px] tracking-[0.22em] text-gold uppercase">{menu.eyebrow}</p>
            <p className="mt-1.5 max-w-md text-sm font-light text-ink/70">{menu.line}</p>
          </div>
          <Link
            href={menu.exploreHref || '/shop'}
            onClick={onNavigate}
            className="mt-3 font-label text-[10px] tracking-[0.16em] text-burgundy uppercase transition-opacity hover:opacity-70 md:mt-0"
          >
            {menu.exploreLabel || 'Explore'} →
          </Link>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8 xl:gap-10">
          {/* Link columns */}
          <div className="flex min-h-0 flex-col justify-start gap-8 overflow-y-auto sm:grid sm:grid-cols-3 sm:gap-8 lg:col-span-5 lg:gap-10 xl:col-span-4">
            {menu.columns.map((col) => (
              <div key={col.title}>
                <p className="font-label text-[10px] tracking-[0.2em] text-ink/45 uppercase">{col.title}</p>
                <ul className="mt-3.5 space-y-2.5 md:mt-4 md:space-y-3">
                  {col.links.map((link) => (
                    <li key={`${col.title}-${link.label}`}>
                      <Link
                        href={link.href}
                        onClick={onNavigate}
                        className="text-[13px] font-light tracking-[-0.01em] text-ink/80 transition-colors duration-300 hover:text-burgundy md:text-[14px]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Compact vertical cards — top right */}
          <div className="flex flex-wrap items-start justify-start gap-2.5 sm:gap-3 lg:col-span-7 lg:justify-end xl:col-span-8">
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
    open === 'shop'
      ? shopMenu
      : open === 'brand'
        ? brandMenu
        : open === 'gifting'
          ? giftingMenu
          : open === 'accessories'
            ? accessoriesMenu
            : null;

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
            className="fixed inset-0 z-30 cursor-default bg-ink/30 backdrop-blur-[1px]"
            style={{ top: 'var(--site-chrome-offset)' }}
            onClick={onClose}
            onMouseEnter={onClose}
          />
          <motion.div
            key={open}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 top-full z-40 overflow-hidden border-t border-ink/6 shadow-[0_28px_60px_rgba(40,20,24,0.16)]"
            style={{
              height: 'calc(100svh - var(--site-promo-h) - var(--site-nav-h))',
            }}
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

export { shopMenu, brandMenu, giftingMenu, accessoriesMenu };
