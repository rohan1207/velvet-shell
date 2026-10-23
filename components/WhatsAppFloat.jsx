'use client';

import { usePathname } from 'next/navigation';
import { whatsappHref } from '@/lib/social';

/** Hide on routes where a primary sticky CTA already owns the bottom-right. */
const HIDDEN_PREFIXES = ['/checkout', '/cart', '/account'];

export default function WhatsAppFloat() {
  const pathname = usePathname() || '';
  const hidden = HIDDEN_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (hidden) return null;

  return (
    <a
      href={whatsappHref()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="group fixed right-3 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-[60] flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_28px_rgba(37,211,102,0.45)] transition-transform duration-300 hover:scale-105 hover:shadow-[0_14px_36px_rgba(37,211,102,0.55)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366] sm:right-4 sm:h-14 sm:w-14 md:right-6 md:bottom-6 md:h-[3.75rem] md:w-[3.75rem]"
    >
      <span className="pointer-events-none absolute inset-0 rounded-full bg-white/15 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <IconWhatsApp className="relative h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />
    </a>
  );
}

export function IconWhatsApp({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12.04 2.00c-5.52 0-10 4.45-10 9.94 0 1.75.46 3.45 1.34 4.95L2 22l5.27-1.38a10.1 10.1 0 0 0 4.77 1.21h.01c5.52 0 10-4.45 10-9.94S17.56 2 12.04 2Zm0 18.16h-.01a8.3 8.3 0 0 1-4.22-1.16l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.37c0-4.54 3.72-8.23 8.29-8.23 4.56 0 8.28 3.69 8.28 8.23 0 4.54-3.72 8.24-8.28 8.24Zm4.55-6.17c-.25-.12-1.47-.72-1.7-.81-.23-.08-.4-.12-.56.13-.17.25-.64.8-.79.97-.14.16-.29.18-.54.06-.25-.12-1.05-.38-2-1.23-.74-.65-1.24-1.46-1.38-1.71-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.41-.56-.42h-.48c-.17 0-.43.06-.66.31-.23.25-.87.84-.87 2.06 0 1.21.89 2.39 1.01 2.55.12.17 1.75 2.67 4.24 3.74 1.49.64 2.08.7 2.83.59.46-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.11-.23-.17-.48-.29Z" />
    </svg>
  );
}
