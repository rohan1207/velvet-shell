import Image from 'next/image';
import Link from 'next/link';

const columns = [
  {
    title: 'Shop',
    links: [
      { href: '/shop?category=earrings', label: 'Earrings' },
      { href: '/shop?category=bracelets', label: 'Bracelets' },
      { href: '/shop?category=necklaces', label: 'Necklaces' },
      { href: '/shop?category=pendants', label: 'Pendants' },
      { href: '/shop?category=chokers', label: 'Chokers' },
      { href: '/shop?category=rings', label: 'Rings' },
      { href: '/shop?category=cuffs', label: 'Brooches' },
      { href: '/shop?category=anklets', label: 'Anklets' },
      { href: '/shop?category=sets', label: 'Sets' },
      { href: '/shop', label: 'Shop all' },
    ],
  },
  {
    title: 'Collections',
    links: [
      { href: '/shop?collection=the-shell-edit', label: 'The Shell Edit' },
      { href: '/shop?collection=pearls-of-nacre', label: 'Lumen Line' },
      { href: '/shop?collection=gilded-tide', label: 'Gilded Tide' },
      { href: '/shop?collection=private-atelier', label: 'Private Atelier' },
      { href: '/shop?collection=lotus-whispers', label: 'Lotus Whispers' },
      { href: '/shop?collection=soft-rain-garden', label: 'Soft Rain Garden' },
      { href: '/#festive-edit', label: 'Festive Edit' },
      { href: '/#best-of', label: 'Best of Velvet Shell' },
      { href: '/gifting', label: 'Corporate Gifting' },
    ],
  },
  {
    title: 'Brand',
    links: [
      { href: '/about', label: 'About us' },
      { href: '/blogs', label: 'Blogs' },
      { href: '/#testimonials', label: 'Testimonials' },
      { href: '/contact', label: 'Contact us' },
      { href: '/faq', label: 'FAQs' },
      { href: '/wishlist', label: 'Saved' },
      { href: '/account', label: 'Account' },
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
];

export default function Footer() {
  return (
    <footer className="bg-velvet-texture text-ivory">
      <div className="mx-auto max-w-[1600px] px-5 py-14 md:px-10 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 md:gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block" aria-label="Velvet Shell home">
              <Image
                src="/logo-splash.png"
                alt="Velvet Shell"
                width={200}
                height={200}
                className="h-16 w-16 object-contain md:h-[6.5rem] md:w-[6.5rem]"
              />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ivory/85 md:mt-5">
              Jewellery, gifting & lifestyle creations, shaped by considered design and quiet intrigue.
            </p>
            <form className="mt-6 max-w-sm md:mt-8" action="/contact">
              <label className="font-label text-gold">Stay in touch</label>
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
          <div className="grid grid-cols-2 gap-8 sm:gap-10 md:contents">
            {columns.map((col) => (
              <div key={col.title} className="lg:col-span-2">
                <p className="font-label text-[10px] tracking-[0.18em] text-gold md:text-[11px]">
                  {col.title}
                </p>
                <ul className="mt-3 space-y-2.5 md:mt-4 md:space-y-3">
                  {col.links.map((link) => (
                    <li key={`${col.title}-${link.label}`}>
                      <Link
                        href={link.href}
                        className="text-[13px] text-ivory/80 transition-colors hover:text-ivory md:text-sm"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 overflow-hidden border-t border-ivory/10 pt-6 md:mt-14 md:pt-7">
          <p className="font-display text-[clamp(2.5rem,10vw,5.5rem)] leading-[0.85] tracking-[-0.04em] text-ivory/[0.08] uppercase select-none">
            Velvet Shell
          </p>
          <div className="mt-5 flex flex-col justify-between gap-3 text-[10px] tracking-[0.22em] text-ivory/80 uppercase sm:flex-row">
            <span>© {new Date().getFullYear()} Velvet Shell. All rights reserved.</span>
            <span>Jewellery · Gifting · Lifestyle</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
