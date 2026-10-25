'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname, useSearchParams } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import MegaMenu from './MegaMenu';

/** Top row — house links (left of logo) */
const houseLinks = [
  { href: '/', label: 'Home', match: 'home', icon: 'home' },
  { href: '/gifting', label: 'Gifting', match: 'gifting', mega: 'gifting', icon: 'gifting' },
  // Shop mega — paused for now
  // { href: '/shop', label: 'Shop', match: 'shop', mega: 'shop' },
  { href: '/about', label: 'Brand', match: 'brand', mega: 'brand', icon: 'brand' },
];

/** Second row — product categories (full width, desktop) */
const categoryLinks = [
  { href: '/shop?category=earrings', label: 'Earrings', match: 'earrings' },
  { href: '/shop?category=bracelets', label: 'Bracelets', match: 'bracelets' },
  { href: '/shop?category=necklaces', label: 'Necklaces', match: 'necklaces' },
  { href: '/shop?category=pendants', label: 'Pendants', match: 'pendants' },
  { href: '/shop?category=chokers', label: 'Chokers', match: 'chokers' },
  { href: '/shop?category=rings', label: 'Rings', match: 'rings' },
  {
    href: '/shop?category=cuffs',
    label: 'Accessories',
    match: 'accessories',
    mega: 'accessories',
    children: [
      { href: '/shop?category=cuffs', label: 'Brooches', match: 'cuffs' },
      { href: '/shop?category=charms', label: 'Charms', match: 'charms' },
    ],
  },
  { href: '/shop?category=anklets', label: 'Anklets', match: 'anklets' },
  { href: '/shop?category=sets', label: 'Sets', match: 'sets' },
];

/** Mobile drawer — house + categories; Accessories expands to Brooches / Charms */
const mobileLinks = [
  ...houseLinks,
  ...categoryLinks.flatMap((link) =>
    link.children?.length
      ? [
          { href: link.href, label: link.label, match: link.match, section: true },
          ...link.children,
        ]
      : [link],
  ),
];

function HouseIcon({ name, className = 'h-4 w-4' }) {
  if (name === 'home') return <IconHome className={className} />;
  if (name === 'gifting') return <IconGift className={className} />;
  if (name === 'brand') return <IconBrand className={className} />;
  return null;
}

function HouseLink({ link, active, onOpenMega, onCloseMega }) {
  return (
    <Link
      href={link.href}
      aria-label={link.icon ? link.label : undefined}
      onMouseEnter={() => {
        if (link.mega) onOpenMega(link.mega);
        else onCloseMega();
      }}
      className={`relative inline-flex shrink-0 items-center gap-1.5 px-2 py-1 font-label text-[10px] font-semibold tracking-[0.14em] uppercase transition-colors duration-300 xl:px-2.5 xl:text-[11px] xl:tracking-[0.16em] ${
        active ? 'text-white' : 'text-white/75 hover:text-white'
      }`}
    >
      {link.icon ? <HouseIcon name={link.icon} className="h-4 w-4 xl:h-[1.1rem] xl:w-[1.1rem]" /> : null}
      <span>{link.label}</span>
      {active ? (
        <motion.span
          layoutId="nav-house-underline"
          className="absolute inset-x-2 -bottom-0.5 h-px bg-gold"
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
        />
      ) : null}
    </Link>
  );
}

function CategoryLink({ link, active, onOpenMega, onCloseMega }) {
  return (
    <Link
      href={link.href}
      onMouseEnter={() => {
        if (link.mega) onOpenMega(link.mega);
        else onCloseMega();
      }}
      className={`relative shrink-0 px-2.5 py-2.5 font-label text-[11px] font-medium tracking-[0.14em] uppercase transition-colors duration-300 sm:px-3 md:px-3.5 xl:px-4 xl:text-[12px] xl:tracking-[0.16em] ${
        active ? 'text-white' : 'text-white/70 hover:text-white'
      }`}
    >
      {link.label}
      {active ? (
        <motion.span
          layoutId="nav-category-underline"
          className="absolute inset-x-2.5 bottom-1 h-px bg-gold md:inset-x-3"
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
        />
      ) : null}
    </Link>
  );
}

function IconHome({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M4.5 10.8 12 4.5l7.5 6.3V19a1.5 1.5 0 0 1-1.5 1.5h-3.75v-5.25h-4.5V20.5H6A1.5 1.5 0 0 1 4.5 19v-8.2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconGift({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M4.5 10.5h15v9.2a1.3 1.3 0 0 1-1.3 1.3H5.8a1.3 1.3 0 0 1-1.3-1.3v-9.2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M3.8 7.2h16.4v3.3H3.8V7.2Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12 7.2v13.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path
        d="M12 7.2c-.9-1.9-2.5-2.9-4-2.4s-2.3 2.2-1.5 3.5L12 7.2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M12 7.2c.9-1.9 2.5-2.9 4-2.4s2.3 2.2 1.5 3.5L12 7.2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconBrand({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 3.5c2.4 2.1 4.8 3.7 7.2 4.6-.4 5.4-2.8 9.1-7.2 12.1-4.4-3-6.8-6.7-7.2-12.1 2.4-.9 4.8-2.5 7.2-4.6Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M12 8.2c.9.8 1.9 1.4 2.9 1.8-.2 2.1-1.1 3.5-2.9 4.7-1.8-1.2-2.7-2.6-2.9-4.7 1-.4 2-1 2.9-1.8Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconSearch({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="11" cy="11" r="6.25" stroke="currentColor" strokeWidth="1.6" />
      <path d="M16.2 16.2L20 20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconAccount({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="12" cy="8.2" r="3.1" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M5.5 19.2c1.4-3.2 3.7-4.8 6.5-4.8s5.1 1.6 6.5 4.8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconBag({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M7.2 8.5h9.6l.7 11.2H6.5L7.2 8.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M9.2 8.5V7.2a2.8 2.8 0 0 1 5.6 0v1.3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M10.4 13.2c.5.7 1 .9 1.6.9s1.1-.2 1.6-.9"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconWishlist({ className = 'h-5 w-5', filled = false }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} className={className} aria-hidden>
      <path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconButton({ className = '', children, ...props }) {
  return (
    <button
      type="button"
      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center text-white/85 transition-colors hover:text-white md:h-10 md:w-10 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const { cartCount, wishlist, setCartOpen, setSearchOpen, menuOpen, setMenuOpen } = useStore();
  const wishlistCount = wishlist?.length ?? 0;
  const [scrolled, setScrolled] = useState(false);
  const [mega, setMega] = useState(null);
  const closeTimer = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setMega(null);
  }, [pathname, searchParams, setMenuOpen]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = () => {
      if (mq.matches) setMenuOpen(false);
    };
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [setMenuOpen]);

  function openMega(key) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMega(key);
  }

  function scheduleCloseMega() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMega(null), 140);
  }

  function closeMega() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMega(null);
  }

  function isActive(link) {
    if (link.mega && mega === link.mega) return true;
    if (link.match === 'home') return pathname === '/';
    if (link.match === 'brand') {
      return (
        pathname.startsWith('/about') ||
        pathname.startsWith('/blogs') ||
        pathname.startsWith('/journal')
      );
    }
    if (link.match === 'gifting') return pathname.startsWith('/gifting');
    if (link.match === 'shop') return pathname === '/shop' && !category;
    if (link.match === 'accessories') {
      return pathname.startsWith('/shop') && (category === 'cuffs' || category === 'charms');
    }
    if (pathname.startsWith('/shop')) return category === link.match;
    return false;
  }

  return (
    <>
      <header
        className={`relative w-full transition-[box-shadow,border-radius] duration-500 ${
          mega
            ? 'overflow-visible rounded-none'
            : 'overflow-hidden rounded-b-[1.35rem] md:rounded-b-[1.6rem]'
        }`}
        style={{
          backgroundColor: '#5E062A',
          backgroundImage: "url('/images/navbar-velvet.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          boxShadow:
            scrolled || mega
              ? '0 14px 40px rgba(74, 14, 19, 0.45)'
              : '0 6px 22px rgba(74, 14, 19, 0.28)',
        }}
        onMouseLeave={scheduleCloseMega}
      >
        {/* ——— Row 1: house links · logo · utilities ——— */}
        <div className="relative mx-auto grid h-[4.65rem] max-w-[1600px] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-1 px-3.5 sm:h-[5.1rem] sm:gap-2 sm:px-4 md:h-[5.25rem] md:px-6 lg:px-8">
          <nav
            className="relative z-10 hidden min-w-0 items-center justify-start lg:flex"
            aria-label="House"
          >
            <div className="flex items-center gap-0.5">
              {houseLinks.map((link) => (
                <HouseLink
                  key={link.label}
                  link={link}
                  active={isActive(link)}
                  onOpenMega={openMega}
                  onCloseMega={scheduleCloseMega}
                />
              ))}
            </div>
          </nav>
          <div className="lg:hidden" aria-hidden />

          <Link
            href="/"
            aria-label="Velvet Shell home"
            className="relative z-20 justify-self-center"
            onMouseEnter={scheduleCloseMega}
          >
            <span className="relative block h-[3.85rem] w-[3.85rem] overflow-visible sm:h-[4.75rem] sm:w-[4.75rem] md:h-[5rem] md:w-[5rem] lg:h-[4.85rem] lg:w-[4.85rem] xl:h-[5.25rem] xl:w-[5.25rem]">
              <Image
                src="/logo-splash.png"
                alt="Velvet Shell"
                fill
                priority
                className="origin-center object-contain scale-[1.18] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.28] sm:scale-[1.26] lg:scale-[1.2] xl:scale-[1.28]"
                sizes="(max-width: 1024px) 88px, 110px"
                style={{ mixBlendMode: 'screen' }}
              />
            </span>
          </Link>

          {/* Phone: search · bag · menu only — wishlist/account live in the drawer */}
          <div className="relative z-10 flex min-w-0 items-center justify-end gap-0 sm:gap-1.5">
            <button
              type="button"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
              onMouseEnter={scheduleCloseMega}
              className="group inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white/85 transition-colors hover:text-white sm:h-9 sm:w-auto sm:max-w-none sm:gap-2.5 sm:border sm:border-white/20 sm:bg-white/10 sm:px-3.5 sm:text-white/80 sm:hover:border-white/35 sm:hover:bg-white/15 md:min-w-[10.5rem]"
            >
              <IconSearch className="h-[1.15rem] w-[1.15rem] shrink-0 sm:h-4 sm:w-4" />
              <span className="hidden truncate font-label text-[10px] tracking-[0.12em] text-white/55 uppercase transition-colors group-hover:text-white/75 sm:inline sm:text-[11px]">
                Search
              </span>
            </button>
            <Link
              href="/wishlist"
              aria-label={`Wishlist (${wishlistCount})`}
              className="relative hidden h-10 w-10 shrink-0 items-center justify-center text-white/85 transition-colors hover:text-white md:inline-flex"
            >
              <IconWishlist className="h-5 w-5" />
              {wishlistCount > 0 ? (
                <span className="absolute top-1.5 right-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-white px-1 text-[9px] font-semibold text-[#5E062A]">
                  {wishlistCount}
                </span>
              ) : null}
            </Link>
            <Link
              href="/account"
              aria-label="Account"
              className="hidden h-10 w-10 shrink-0 items-center justify-center text-white/85 transition-colors hover:text-white md:inline-flex"
            >
              <IconAccount className="h-5 w-5" />
            </Link>
            <IconButton
              data-nav-cart
              aria-label={`Bag (${cartCount})`}
              onClick={() => setCartOpen(true)}
              className="relative h-10 w-10 sm:h-11 sm:w-11"
            >
              <IconBag className="h-[1.15rem] w-[1.15rem] sm:h-5 sm:w-5" />
              <span className="absolute top-1 right-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-white px-1 text-[9px] font-semibold text-[#5E062A] sm:top-1.5 sm:right-1">
                {cartCount}
              </span>
            </IconButton>
            <IconButton
              aria-label="Open menu"
              className="h-10 w-10 lg:hidden"
              onClick={() => setMenuOpen(true)}
            >
              <span className="flex w-[1.15rem] flex-col gap-1.5">
                <span className="h-px w-full bg-white" />
                <span className="h-px w-full bg-white" />
              </span>
            </IconButton>
          </div>
        </div>

        {/* ——— Row 2: categories (desktop / laptop) ——— */}
        <nav
          className="relative z-10 hidden border-t border-white/12 lg:block"
          aria-label="Categories"
        >
          <div className="mx-auto flex max-w-[1600px] items-center justify-center overflow-x-auto px-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden xl:px-8">
            <div className="flex w-max min-w-0 flex-nowrap items-center justify-center gap-x-1 xl:gap-x-1.5">
              {categoryLinks.map((link) => (
                <CategoryLink
                  key={link.label}
                  link={link}
                  active={isActive(link)}
                  onOpenMega={openMega}
                  onCloseMega={scheduleCloseMega}
                />
              ))}
            </div>
          </div>
        </nav>

        <MegaMenu open={mega} onOpen={openMega} onClose={closeMega} />
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
            style={{
              backgroundColor: '#5E062A',
              backgroundImage: "url('/images/navbar-velvet.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="mx-auto flex h-[4.65rem] max-w-[1600px] items-center justify-between px-3 sm:h-[5.1rem] sm:px-4 md:px-8">
              <Link
                href="/"
                aria-label="Velvet Shell home"
                className="relative block h-[4.1rem] w-[4.1rem] overflow-visible sm:h-[4.75rem] sm:w-[4.75rem]"
                onClick={() => setMenuOpen(false)}
              >
                <Image
                  src="/logo-splash.png"
                  alt=""
                  fill
                  className="origin-center object-contain scale-[1.22] sm:scale-[1.26]"
                  sizes="88px"
                  style={{ mixBlendMode: 'screen' }}
                />
              </Link>
              <button
                type="button"
                className="text-[15px] font-medium text-white/80"
                onClick={() => setMenuOpen(false)}
              >
                Close
              </button>
            </div>

            <div className="flex h-[calc(100%-7rem)] flex-col justify-between overflow-y-auto px-6 pb-12">
              <nav className="mt-4 flex flex-col gap-0.5 sm:mt-6 sm:gap-1">
                <p className="mb-2 font-label text-[10px] tracking-[0.22em] text-gold/90 uppercase">
                  Menu
                </p>
                {mobileLinks.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ y: 28, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.04 * i, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-2.5 py-2 text-[1.55rem] font-semibold tracking-[0.04em] uppercase sm:py-2.5 sm:text-3xl ${
                        link.section
                          ? 'mt-3 text-[0.95rem] tracking-[0.18em] text-gold/90 sm:text-base'
                          : isActive(link)
                            ? 'text-white'
                            : 'text-white/75'
                      } ${link.match === 'cuffs' || link.match === 'charms' ? 'pl-3 text-[1.25rem] sm:text-2xl' : ''}`}
                    >
                      {link.icon ? <HouseIcon name={link.icon} className="h-6 w-6" /> : null}
                      <span>{link.label}</span>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="flex items-center gap-6 border-t border-white/10 pt-8 text-white/80">
                <button
                  type="button"
                  aria-label="Search"
                  onClick={() => {
                    setMenuOpen(false);
                    setSearchOpen(true);
                  }}
                >
                  <IconSearch className="h-6 w-6" />
                </button>
                <Link href="/wishlist" aria-label="Wishlist" onClick={() => setMenuOpen(false)}>
                  <IconWishlist className="h-6 w-6" />
                </Link>
                <Link href="/account" aria-label="Account" onClick={() => setMenuOpen(false)}>
                  <IconAccount className="h-6 w-6" />
                </Link>
                <button
                  type="button"
                  aria-label="Bag"
                  onClick={() => {
                    setMenuOpen(false);
                    setCartOpen(true);
                  }}
                >
                  <IconBag className="h-6 w-6" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
