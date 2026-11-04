import Link from 'next/link';
import ContactForm from '@/components/ContactForm';
import { getContactDetails } from '@/lib/contact';

export const metadata = {
  title: 'Contact',
  description:
    'Write to Velvet Shell for orders, product details, gifting, collaborations or general enquiries.',
};

export default function ContactPage() {
  const contact = getContactDetails();

  return (
    <div className="overflow-x-hidden bg-ivory pt-28 pb-24 md:pt-36">
      <div className="mx-auto grid w-full max-w-[1600px] gap-10 px-5 md:grid-cols-2 md:items-start md:gap-12 md:px-10 lg:gap-16">
        <div className="min-w-0">
          <p className="text-[11px] tracking-[0.28em] text-gold uppercase">Contact</p>
          <h1 className="font-display mt-4 text-[2.15rem] leading-[1.05] tracking-[-0.03em] sm:text-4xl md:text-5xl lg:text-6xl">
            Write to Velvet Shell.
          </h1>
          <p className="mt-5 max-w-md text-[15px] font-light leading-relaxed text-stone sm:mt-6">
            Discover handcrafted jewellery, freshwater pearls and nature-inspired pieces made for
            gifting, celebrating and wearing on repeat.
          </p>

          <div className="mt-8 space-y-5 border-y border-ink/8 py-6 text-sm sm:mt-10 sm:space-y-6 sm:py-7">
            {contact.email ? (
              <div>
                <p className="text-[10px] tracking-[0.28em] text-gold uppercase">Email</p>
                <a
                  href={contact.mailtoHref}
                  className="mt-2 inline-block break-all text-ink transition-opacity hover:opacity-70"
                >
                  {contact.email}
                </a>
                {contact.emailAlt ? (
                  <a
                    href={`mailto:${contact.emailAlt}`}
                    className="mt-1 block break-all text-ink/70 transition-opacity hover:opacity-70"
                  >
                    {contact.emailAlt}
                  </a>
                ) : null}
              </div>
            ) : null}
            {contact.phoneDisplay ? (
              <div>
                <p className="text-[10px] tracking-[0.28em] text-gold uppercase">Phone</p>
                <a
                  href={contact.phoneHref}
                  className="mt-2 inline-block text-ink transition-opacity hover:opacity-70"
                >
                  {contact.phoneDisplay}
                </a>
              </div>
            ) : null}
            <div>
              <p className="text-[10px] tracking-[0.28em] text-gold uppercase">WhatsApp</p>
              <a
                href={contact.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-2 text-ink transition-opacity hover:opacity-70"
              >
                Chat with us
                <span aria-hidden>↗</span>
              </a>
            </div>
          </div>

          <div className="mt-8 space-y-7 text-sm sm:mt-10 sm:space-y-8">
            <div>
              <p className="text-[10px] tracking-[0.28em] text-gold uppercase">Shop online</p>
              <p className="mt-2 max-w-md leading-relaxed text-ink/80">
                Explore the collection anytime, anywhere.
                <br />
                Thoughtfully curated jewellery, delivered to your door.
              </p>
              <Link
                href="/shop"
                className="mt-3 inline-flex text-[11px] tracking-[0.2em] text-burgundy uppercase transition-opacity hover:opacity-70"
              >
                Shop now →
              </Link>
            </div>
            <div>
              <p className="text-[10px] tracking-[0.28em] text-gold uppercase">
                For collaborations
              </p>
              <p className="mt-2 max-w-md leading-relaxed text-ink/80">
                Have an idea in mind?
                <br />
                We&apos;d love to hear from you.
              </p>
            </div>
            <div>
              <p className="text-[10px] tracking-[0.28em] text-gold uppercase">
                For gifting &amp; queries
              </p>
              <p className="mt-2 max-w-md leading-relaxed text-ink/80">
                Looking for something special to gift or need help choosing a piece?
                <br />
                Write to us and let&apos;s find the right one.
              </p>
              <Link
                href="/gifting"
                className="mt-3 inline-flex text-[11px] tracking-[0.2em] text-burgundy uppercase transition-opacity hover:opacity-70"
              >
                Corporate gifting →
              </Link>
            </div>
            <div>
              <p className="text-[10px] tracking-[0.28em] text-gold uppercase">Notes</p>
              <p className="mt-2 max-w-md leading-relaxed text-ink/80">
                For orders, product details, gifting, collaborations or general enquiries, get in
                touch with the Velvet Shell team.
              </p>
              <p className="mt-3 max-w-md italic leading-relaxed text-stone">
                Made with a little more meaning.
              </p>
            </div>
          </div>
        </div>

        <div className="min-w-0 w-full">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
