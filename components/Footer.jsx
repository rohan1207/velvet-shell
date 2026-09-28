import Link from 'next/link';
import { ShellMark } from './ShellMark';

const columns = [
  {
    title: 'House',
    links: [
      { href: '/shop', label: 'The Shop' },
      { href: '/lookbook', label: 'Lookbook' },
      { href: '/about', label: 'Atelier' },
      { href: '/journal', label: 'Journal' },
    ],
  },
  {
    title: 'Client',
    links: [
      { href: '/account', label: 'Account' },
      { href: '/wishlist', label: 'Saved' },
      { href: '/contact', label: 'Private appointment' },
      { href: '/shipping', label: 'Shipping' },
    ],
  },
  {
    title: 'Notes',
    links: [
      { href: '/returns', label: 'Returns' },
      { href: '/privacy', label: 'Privacy' },
      { href: '/terms', label: 'Terms' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="box-border flex min-h-[100svh] flex-col bg-velvet text-ivory">
      <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col px-5 py-10 md:px-10 md:py-12">
        <div className="grid flex-1 content-center gap-10 md:grid-cols-2 md:gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 text-gold">
              <ShellMark className="h-8 w-8" />
              <span className="font-display text-3xl tracking-[-0.03em] text-ivory">Velvet Shell</span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ivory/60 md:mt-6">
              A treasure in every reveal. Jewellery, gifting and lifestyle creations designed for
              curiosity, discovery, delight and memory.
            </p>
            <form className="mt-8 max-w-sm md:mt-10" action="/contact">
              <label className="font-label text-gold">Private notes</label>
              <div className="mt-3 flex border-b border-ivory/20 pb-2">
                <input
                  type="email"
                  name="email"
                  placeholder="Your email"
                  className="w-full bg-transparent text-sm text-ivory outline-none placeholder:text-ivory/30"
                />
                <button type="submit" className="font-label text-gold">
                  Join
                </button>
              </div>
            </form>
          </div>
          {columns.map((col) => (
            <div key={col.title} className="lg:col-span-2">
              <p className="font-label text-gold">{col.title}</p>
              <ul className="mt-4 space-y-3 md:mt-5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-ivory/70 transition-colors hover:text-ivory">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 shrink-0 overflow-hidden border-t border-ivory/10 pt-6 md:mt-12 md:pt-8">
          <p className="font-display text-[clamp(3.5rem,16vw,12rem)] leading-[0.8] tracking-[-0.04em] text-ivory/[0.06] select-none">
            Velvet Shell
          </p>
          <div className="mt-6 flex flex-col justify-between gap-3 text-[10px] tracking-[0.22em] text-ivory/40 uppercase sm:flex-row md:mt-8">
            <span>© {new Date().getFullYear()} Velvet Shell. All rights reserved.</span>
            <span>Jaipur · Paris · By appointment</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
