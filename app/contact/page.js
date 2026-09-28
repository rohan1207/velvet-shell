import ContactForm from '@/components/ContactForm';

export const metadata = { title: 'Contact' };

export default function ContactPage() {
  return (
    <div className="bg-ivory pt-28 pb-24 md:pt-36">
      <div className="mx-auto grid max-w-[1600px] gap-16 px-5 md:grid-cols-2 md:px-10">
        <div>
          <p className="text-[11px] tracking-[0.28em] text-gold uppercase">Contact</p>
          <h1 className="font-display mt-4 text-5xl md:text-7xl">Write to the house.</h1>
          <p className="mt-6 max-w-md text-stone">
            Viewings are by appointment in Jaipur and Paris. Private commissions begin with a conversation, not a formality.
          </p>
          <div className="mt-12 space-y-8 text-sm">
            <div>
              <p className="text-[10px] tracking-[0.28em] text-gold uppercase">Jaipur</p>
              <p className="mt-2">The Atelier, Old City<br />By daylight, Tuesday to Saturday</p>
            </div>
            <div>
              <p className="text-[10px] tracking-[0.28em] text-gold uppercase">Paris</p>
              <p className="mt-2">Salon, 3rd arrondissement<br />Thursday to Saturday, by appointment</p>
            </div>
            <div>
              <p className="text-[10px] tracking-[0.28em] text-gold uppercase">Notes</p>
              <p className="mt-2">atelier@velvetshell.com<br />+33 1 84 80 00 27</p>
            </div>
          </div>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
