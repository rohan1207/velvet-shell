'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname, useSearchParams } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import MegaMenu from './MegaMenu';

const leftLinks = [
  { href: '/', label: 'Home', match: 'home' },
  { href: '/shop?category=earrings', label: 'Earrings', match: 'earrings' },
  { href: '/shop?category=bracelets', label: 'Bracelets', match: 'bracelets' },
  { href: '/shop?category=necklaces', label: 'Necklaces', match: 'necklaces' },
  { href: '/shop?category=pendants', label: 'Pendants', match: 'pendants' },
  { href: '/shop?category=chokers', label: 'Chokers', match: 'chokers' },
  { href: '/shop?category=rings', label: 'Rings', match: 'rings' },
];

const rightLinks = [
  { href: '/shop?category=anklets', label: 'Anklets', match: 'anklets' },
  { href: '/shop?category=sets', label: 'Sets', match: 'sets' },
  { href: '/shop?category=cuffs', label: 'Brooches', match: 'cuffs' },
  { href: '/gifting', label: 'Gifting', match: 'gifting', mega: 'gifting' },
  { href: '/shop', label: 'Shop', match: 'shop', mega: 'shop' },
  { href: '/about', label: 'Brand', match: 'brand', mega: 'brand' },
];

const links = [...leftLinks, ...rightLinks];

/**
 * Desktop nav link — fluid type/padding so small laptops never collide with the logo.
 * lg (~1024–1279): compact · xl (~1280–1535): mid · 2xl (1536+): full
 */
function NavLink({ link, active, onOpenMega, onCloseMega }) {
  return (
    <Link
      href={link.href}
      onMouseEnter={() => {
        if (link.mega) onOpenMega(link.mega);
        else onCloseMega();
      }}
      className={`relative shrink-0 px-1 py-1 text-[10px] font-semibold tracking-[0.06em] uppercase transition-colors duration-300 xl:px-1.5 xl:text-[11px] xl:tracking-[0.08em] 2xl:px-2.5 2xl:text-[13px] 2xl:tracking-[0.1em] ${
        active ? 'text-white' : 'text-white/75 hover:text-white'
      }`}
    >
      {link.label}
      {active && (
        <motion.span
          layoutId="nav-underline"
          className="absolute inset-x-1 -bottom-0.5 h-px bg-gold xl:inset-x-1.5 2xl:inset-x-2.5"
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
        />
      )}
    </Link>
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

function IconWishlist({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 20s-6.5-4.1-8.7-7.6C1.7 9.8 2.8 6.8 5.6 6.1c1.6-.4 3.3.2 4.4 1.5L12 9.4l1.9-1.8c1.2-1.3 2.9-1.9 4.5-1.5 2.8.7 3.9 3.7 2.3 6.3C18.5 15.9 12 20 12 20Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
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

  // Clear hamburger drawer if viewport grows into desktop nav
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
    if (link.match === 'home') {
      return pathname === '/';
    }
    if (link.match === 'brand') {
      return (
        pathname.startsWith('/about') ||
        pathname.startsWith('/blogs') ||
        pathname.startsWith('/journal')
      );
    }
    if (link.match === 'gifting') {
      return pathname.startsWith('/gifting');
    }
    if (link.match === 'shop') return pathname === '/shop' && !category;
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
        {/*
          Breakpoints:
          - < lg (phones + tablets): hamburger
          - lg+: desktop menus, fluid type so small/mid laptops never hit the logo
        */}
        <div className="relative mx-auto grid h-[4.65rem] max-w-[1600px] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-1 px-3 sm:h-[5.25rem] sm:px-4 md:h-[5.85rem] md:px-5 lg:gap-2 lg:px-4 xl:gap-3 xl:px-6 2xl:gap-4 2xl:px-8">
          {/* Left — product menus (desktop only) */}
          <nav className="relative z-10 hidden min-w-0 items-center justify-start overflow-hidden lg:flex lg:pr-2 xl:pr-3">
            <div className="flex min-w-0 flex-nowrap items-center">
              {leftLinks.map((link) => (
                <NavLink
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

          {/* Center — logo (reserved column, above menus) */}
          <Link
            href="/"
            aria-label="Velvet Shell home"
            className="relative z-20 justify-self-center"
            onMouseEnter={scheduleCloseMega}
          >
            <span className="relative block h-[4.25rem] w-[4.25rem] overflow-visible sm:h-[5.1rem] sm:w-[5.1rem] md:h-[5.5rem] md:w-[5.5rem] lg:h-[5.25rem] lg:w-[5.25rem] xl:h-[5.75rem] xl:w-[5.75rem] 2xl:h-[6.25rem] 2xl:w-[6.25rem]">
              <Image
                src="/logo-splash.png"
                alt="Velvet Shell"
                fill
                priority
                className="origin-center object-contain scale-[1.22] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.32] sm:scale-[1.28] lg:scale-[1.2] xl:scale-[1.28] 2xl:scale-[1.36]"
                sizes="(max-width: 1024px) 88px, 120px"
                style={{ mixBlendMode: 'screen' }}
              />
            </span>
          </Link>

          {/* Right — Gifting, Shop, Brand + icons */}
          <div className="relative z-10 flex min-w-0 items-center justify-end gap-0 sm:gap-0.5 lg:pl-2 xl:pl-3">
            <nav className="mr-0.5 hidden min-w-0 items-center overflow-hidden lg:flex">
              {rightLinks.map((link) => (
                <NavLink
                  key={link.label}
                  link={link}
                  active={isActive(link)}
                  onOpenMega={openMega}
                  onCloseMega={scheduleCloseMega}
                />
              ))}
            </nav>
            <button
              type="button"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center text-white/85 transition-colors hover:text-white sm:h-10 sm:w-10 xl:h-11 xl:w-11"
            >
              <IconSearch className="h-5 w-5 xl:h-[1.35rem] xl:w-[1.35rem]" />
            </button>
            <Link
              href="/wishlist"
              aria-label={`Wishlist (${wishlistCount})`}
              className="relative inline-flex h-9 w-9 shrink-0 items-center justify-center text-white/85 transition-colors hover:text-white sm:h-10 sm:w-10 xl:h-11 xl:w-11"
            >
              <IconWishlist className="h-5 w-5 xl:h-[1.35rem] xl:w-[1.35rem]" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-white px-1 text-[9px] font-semibold text-[#5E062A] sm:top-1.5 sm:right-1 sm:h-4 sm:min-w-4 sm:text-[10px]">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              href="/account"
              aria-label="Account"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center text-white/85 transition-colors hover:text-white sm:h-10 sm:w-10 xl:h-11 xl:w-11"
            >
              <IconAccount className="h-5 w-5 xl:h-[1.35rem] xl:w-[1.35rem]" />
            </Link>
            <button
              type="button"
              data-nav-cart
              aria-label={`Bag (${cartCount})`}
              onClick={() => setCartOpen(true)}
              className="relative inline-flex h-9 w-9 shrink-0 items-center justify-center text-white/85 transition-colors hover:text-white sm:h-10 sm:w-10 xl:h-11 xl:w-11"
            >
              <IconBag className="h-5 w-5 xl:h-[1.4rem] xl:w-[1.4rem]" />
              <span className="absolute top-1 right-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-white px-1 text-[9px] font-semibold text-[#5E062A] sm:top-1.5 sm:right-1 sm:h-4 sm:min-w-4 sm:text-[10px]">
                {cartCount}
              </span>
            </button>
            {/* Hamburger: phones + tablets only */}
            <button
              type="button"
              aria-label="Open menu"
              className="ml-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center text-white sm:h-10 sm:w-10 lg:hidden"
              onClick={() => setMenuOpen(true)}
            >
              <span className="flex w-5 flex-col gap-1.5">
                <span className="h-px w-full bg-white" />
                <span className="h-px w-full bg-white" />
              </span>
            </button>
          </div>
        </div>

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
            <div className="mx-auto flex h-[4.65rem] max-w-[1600px] items-center justify-between px-3 sm:h-[5.25rem] sm:px-4 md:h-[5.85rem] md:px-8">
              <Link
                href="/"
                aria-label="Velvet Shell home"
                className="relative block h-[4.25rem] w-[4.25rem] overflow-visible sm:h-[5.1rem] sm:w-[5.1rem] md:h-[5.5rem] md:w-[5.5rem]"
                onClick={() => setMenuOpen(false)}
              >
                <Image
                  src="/logo-splash.png"
                  alt=""
                  fill
                  className="origin-center object-contain scale-[1.22] sm:scale-[1.28]"
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
                {links.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ y: 28, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.05 * i, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={`block py-2 text-[1.65rem] font-semibold tracking-[0.04em] uppercase sm:py-2.5 sm:text-3xl md:text-4xl ${
                        isActive(link) ? 'text-white' : 'text-white/75'
                      }`}
                    >
                      {link.label}
                    </Link>
                    {link.children?.length > 0 && (
                      <div className="mb-2 ml-1 flex flex-col border-l border-white/20 pl-4">
                        {link.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            onClick={() => setMenuOpen(false)}
                            className={`py-2 text-base font-medium tracking-[0.06em] uppercase sm:text-lg ${
                              category === child.match ? 'text-white' : 'text-white/65'
                            }`}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
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
