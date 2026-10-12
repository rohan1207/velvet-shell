'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname, useSearchParams } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import MegaMenu from './MegaMenu';

const leftLinks = [
  { href: '/shop?category=rings', label: 'Rings', match: 'rings' },
  { href: '/shop?category=earrings', label: 'Earrings', match: 'earrings' },
  { href: '/shop?category=necklaces', label: 'Necklace', match: 'necklaces' },
  { href: '/shop?category=pendants', label: 'Pendant', match: 'pendants' },
  { href: '/shop?category=chains', label: 'Chain', match: 'chains' },
  { href: '/shop?category=chokers', label: 'Choker', match: 'chokers' },
  { href: '/shop?category=bracelets', label: 'Bracelets', match: 'bracelets' },
];

const rightLinks = [
  { href: '/shop?category=anklets', label: 'Anklet', match: 'anklets' },
  { href: '/shop?category=sets', label: 'Sets', match: 'sets' },
  { href: '/gifting', label: 'Gifting', match: 'gifting', mega: 'gifting' },
  { href: '/shop', label: 'Shop', match: 'shop', mega: 'shop' },
  { href: '/about', label: 'Brand', match: 'brand', mega: 'brand' },
];

const links = [...leftLinks, ...rightLinks];

function NavLink({ link, active, onOpenMega, onCloseMega }) {
  return (
    <Link
      href={link.href}
      onMouseEnter={() => {
        if (link.mega) onOpenMega(link.mega);
        else onCloseMega();
      }}
      className={`relative px-2 py-1.5 text-[12px] font-semibold tracking-[0.1em] uppercase transition-colors duration-300 lg:px-2.5 lg:text-[13px] xl:text-[14px] ${
        active ? 'text-white' : 'text-white/75 hover:text-white'
      }`}
    >
      {link.label}
      {active && (
        <motion.span
          layoutId="nav-underline"
          className="absolute inset-x-2 -bottom-0.5 h-px bg-gold lg:inset-x-2.5"
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
          boxShadow: scrolled || mega ? '0 14px 40px rgba(74, 14, 19, 0.45)' : '0 6px 22px rgba(74, 14, 19, 0.28)',
        }}
        onMouseLeave={scheduleCloseMega}
      >
        <div className="relative mx-auto grid h-[5.25rem] max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 md:h-[5.85rem] md:gap-4 md:px-8">
          {/* Left — product menus */}
          <nav className="relative z-10 hidden min-w-0 items-center justify-start xl:flex">
            {leftLinks.map((link) => (
              <NavLink
                key={link.label}
                link={link}
                active={isActive(link)}
                onOpenMega={openMega}
                onCloseMega={scheduleCloseMega}
              />
            ))}
          </nav>
          <div className="xl:hidden" aria-hidden />

          {/* Center — logo */}
          <Link
            href="/"
            aria-label="Velvet Shell home"
            className="relative z-10 justify-self-center"
            onMouseEnter={scheduleCloseMega}
          >
            <span className="relative block h-[5.1rem] w-[5.1rem] overflow-visible md:h-[6.25rem] md:w-[6.25rem]">
              <Image
                src="/logo-splash.png"
                alt="Velvet Shell"
                fill
                priority
                className="origin-center object-contain scale-[1.36] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.42]"
                sizes="(max-width: 768px) 100px, 120px"
                style={{ mixBlendMode: 'screen' }}
              />
            </span>
          </Link>

          {/* Right — Gifting, Shop, Brand + icons */}
          <div className="relative z-10 flex min-w-0 items-center justify-end gap-0.5 sm:gap-1">
            <nav className="mr-1 hidden items-center xl:flex">
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
              className="inline-flex h-11 w-11 items-center justify-center text-white/85 transition-colors hover:text-white"
            >
              <IconSearch className="h-[1.35rem] w-[1.35rem]" />
            </button>
            <Link
              href="/wishlist"
              aria-label={`Wishlist (${wishlistCount})`}
              className="relative inline-flex h-11 w-11 items-center justify-center text-white/85 transition-colors hover:text-white"
            >
              <IconWishlist className="h-[1.35rem] w-[1.35rem]" />
              {wishlistCount > 0 && (
                <span className="absolute top-1.5 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 text-[10px] font-semibold text-[#5E062A]">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              href="/account"
              aria-label="Account"
              className="inline-flex h-11 w-11 items-center justify-center text-white/85 transition-colors hover:text-white"
            >
              <IconAccount className="h-[1.35rem] w-[1.35rem]" />
            </Link>
            <button
              type="button"
              aria-label={`Bag (${cartCount})`}
              onClick={() => setCartOpen(true)}
              className="relative inline-flex h-11 w-11 items-center justify-center text-white/85 transition-colors hover:text-white"
            >
              <IconBag className="h-[1.4rem] w-[1.4rem]" />
              <span className="absolute top-1.5 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 text-[10px] font-semibold text-[#5E062A]">
                {cartCount}
              </span>
            </button>
            <button
              type="button"
              aria-label="Open menu"
              className="ml-0.5 inline-flex h-11 w-11 items-center justify-center text-white xl:hidden"
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
            className="fixed inset-0 z-40"
            style={{
              backgroundColor: '#5E062A',
              backgroundImage: "url('/images/navbar-velvet.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="mx-auto flex h-[5.25rem] max-w-[1600px] items-center justify-between px-4 md:h-[5.85rem] md:px-8">
              <Link
                href="/"
                aria-label="Velvet Shell home"
                className="relative block h-[5.1rem] w-[5.1rem] overflow-visible md:h-[6.25rem] md:w-[6.25rem]"
                onClick={() => setMenuOpen(false)}
              >
                <Image
                  src="/logo-splash.png"
                  alt=""
                  fill
                  className="origin-center object-contain scale-[1.36]"
                  sizes="(max-width: 768px) 100px, 120px"
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

            <div className="flex h-[calc(100%-7rem)] flex-col justify-between px-6 pb-12">
              <nav className="mt-6 flex flex-col gap-1">
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
                      className={`block py-2.5 text-3xl font-semibold tracking-[0.04em] uppercase sm:text-4xl ${
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
                            className={`py-2 text-lg font-medium tracking-[0.06em] uppercase ${
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
