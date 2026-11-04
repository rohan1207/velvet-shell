import ContactForm from '@/components/ContactForm';

export const metadata = {
  title: 'Contact',
  description:
    'Write to Velvet Shell for orders, product details, gifting, collaborations or general enquiries.',
};

export default function ContactPage() {
  return (
    <div className="bg-ivory pt-28 pb-24 md:pt-36">
      <div className="mx-auto grid max-w-[1600px] gap-16 px-5 md:grid-cols-2 md:px-10">
        <div>
          <p className="text-[11px] tracking-[0.28em] text-gold uppercase">Contact</p>
          <h1 className="font-display mt-4 text-4xl tracking-[-0.03em] md:text-7xl">
            Write to Velvet Shell.
          </h1>
          <p className="mt-6 max-w-md text-stone">
            Discover handcrafted jewellery, freshwater pearls and nature-inspired pieces made for
            gifting, celebrating and wearing on repeat.
          </p>
          <div className="mt-12 space-y-8 text-sm">
            <div>
              <p className="text-[10px] tracking-[0.28em] text-gold uppercase">Shop online</p>
              <p className="mt-2 max-w-md leading-relaxed">
                Explore the collection anytime, anywhere.
                <br />
                Thoughtfully curated jewellery, delivered to your door.
              </p>
            </div>
            <div>
              <p className="text-[10px] tracking-[0.28em] text-gold uppercase">
                For collaborations
              </p>
              <p className="mt-2 max-w-md leading-relaxed">
                Have an idea in mind?
                <br />
                We&apos;d love to hear from you.
              </p>
            </div>
            <div>
              <p className="text-[10px] tracking-[0.28em] text-gold uppercase">
                For gifting &amp; queries
              </p>
              <p className="mt-2 max-w-md leading-relaxed">
                Looking for something special to gift or need help choosing a piece?
                <br />
                Write to us and let&apos;s find the right one.
              </p>
            </div>
            <div>
              <p className="text-[10px] tracking-[0.28em] text-gold uppercase">Notes</p>
              <p className="mt-2 max-w-md leading-relaxed">
                For orders, product details, gifting, collaborations or general enquiries, get in
                touch with the Velvet Shell team.
              </p>
              <p className="mt-3 max-w-md italic leading-relaxed text-stone">
                Made with a little more meaning.
              </p>
            </div>
          </div>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
