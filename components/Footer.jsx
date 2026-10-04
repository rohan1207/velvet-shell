import Image from 'next/image';
import Link from 'next/link';

const columns = [
  {
    title: 'House',
    links: [
      { href: '/shop', label: 'The Shop' },
      { href: '/gifting', label: 'Corporate Gifting' },
      { href: '/lookbook', label: 'Lookbook' },
      { href: '/about', label: 'Atelier' },
      { href: '/blogs', label: 'Blogs' },
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
      { href: '/faq', label: 'FAQs' },
      { href: '/returns', label: 'Returns' },
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-velvet-texture text-ivory">
      <div className="mx-auto max-w-[1600px] px-5 py-14 md:px-10 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 md:gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Link href="/" className="inline-block" aria-label="Velvet Shell home">
              <Image
                src="/logo-splash.png"
                alt="Velvet Shell"
                width={200}
                height={200}
                className="h-[5.5rem] w-[5.5rem] object-contain md:h-[6.5rem] md:w-[6.5rem]"
              />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ivory/85">
              Jewellery, gifting & lifestyle creations, shaped by considered design and quiet intrigue.
            </p>
            <form className="mt-8 max-w-sm" action="/contact">
              <label className="font-label text-gold">Private Notes</label>
              <p className="mt-2 text-sm leading-relaxed text-ivory/80">
                A little from Velvet Shell, occasionally.
              </p>
              <div className="mt-3 flex border-b border-ivory/20 pb-2">
                <input
                  type="email"
                  name="email"
                  placeholder="Your email"
                  className="w-full bg-transparent text-sm text-ivory outline-none placeholder:text-ivory/80"
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
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-ivory/80 transition-colors hover:text-ivory">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 overflow-hidden border-t border-ivory/10 pt-6 md:mt-14 md:pt-7">
          <p className="font-display text-[clamp(2.5rem,10vw,5.5rem)] leading-[0.85] tracking-[-0.04em] text-ivory/[0.08] uppercase select-none">
            Velvet Shell
          </p>
          <div className="mt-5 flex flex-col justify-between gap-3 text-[10px] tracking-[0.22em] text-ivory/80 uppercase sm:flex-row">
            <span>© {new Date().getFullYear()} Velvet Shell. All rights reserved.</span>
            <span>Jaipur · Paris · By appointment</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
