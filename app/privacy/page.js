import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy',
  description: 'How Velvet Shell collects, uses and protects your personal information.',
};

const lastUpdated = '3 October 2026';

export default function PrivacyPage() {
  return (
    <div className="bg-ivory pt-28 pb-24 md:pt-36">
      <div className="mx-auto max-w-3xl px-5 md:px-10">
        <p className="font-label text-gold">Legal</p>
        <h1 className="font-display mt-4 text-[clamp(2.8rem,6vw,4.5rem)] leading-[0.98] tracking-[-0.03em] text-ink">
          Privacy Policy
        </h1>
        <p className="mt-5 text-sm font-light text-ink/85">Last Updated: {lastUpdated}</p>
        <p className="mt-8 text-[15px] font-light leading-[1.8] text-ink/80">
          This Privacy Policy explains how Velvet Shell collects, uses, discloses and protects your
          personal information when you use our website and services.
        </p>

        <div className="mt-14 space-y-14">
          <Section number="01" title="What Do We Do With Your Information?">
            <p>
              When you place an order with Velvet Shell, we collect the personal information you
              provide, such as your name, email address, phone number, billing address and shipping
              address, as required to process and fulfil your order.
            </p>
            <p>
              When you browse our website, certain technical information such as your IP address,
              browser type, device information and website activity may be collected to help us
              improve the website and your experience.
            </p>
            <p>
              <span className="text-ink/80">Email Marketing (if applicable):</span> With your
              permission, we may send you emails about new collections, products, launches, offers,
              events and other Velvet Shell updates.
            </p>
          </Section>

          <Section number="02" title="Consent">
            <h3 className="font-display text-xl text-ink">How do you get my consent?</h3>
            <p className="mt-4">
              When you provide your personal information to place an order, arrange delivery, complete
              a purchase or contact us, you consent to us collecting and using that information for the
              specific purpose for which it was provided. If we require your information for another
              purpose, such as marketing communications, we will seek your consent where required.
            </p>
            <h3 className="mt-8 font-display text-xl text-ink">How do I withdraw my consent?</h3>
            <p className="mt-4">
              If you have opted in to receive communications from us and later change your mind, you
              may withdraw your consent at any time by contacting us at:
            </p>
            <ContactPlaceholders />
            <p>
              You may also unsubscribe from promotional emails using the unsubscribe option provided
              in the communication.
            </p>
          </Section>

          <Section number="03" title="Disclosure">
            <p>We may disclose your personal information where reasonably necessary to:</p>
            <ul className="mt-4 list-none space-y-2.5">
              {[
                'Process and fulfil your orders',
                'Arrange payment and delivery',
                'Provide customer support',
                'Manage returns or exchanges',
                'Provide corporate gifting services',
                'Operate and improve our website',
                'Comply with applicable laws or legal requirements',
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2.5 h-px w-4 shrink-0 bg-gold" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section number="04" title="Website & Payment Services">
            <p>
              Our website may use third-party platforms and service providers to facilitate online
              shopping, payment processing, order management and other website functions.
            </p>
            <p>
              When you make a payment, your payment information may be processed directly by the
              applicable payment service provider. Velvet Shell does not intentionally retain complete
              payment card information on its own systems unless required and permitted for a
              legitimate business purpose.
            </p>
            <p>
              The handling of payment information by third-party providers is also subject to their
              respective terms and privacy policies.
            </p>
            <p>
              We may also share information with trusted service providers who assist us with payment
              processing, shipping, website operations, analytics and other services necessary to run
              our business.
            </p>
          </Section>

          <Section number="05" title="Third-Party Services">
            <p>
              Our third-party service providers may collect, use or process information only to the
              extent necessary to provide the services they offer to us.
            </p>
            <p>
              These may include payment gateways, delivery partners, website hosting providers,
              analytics services, communication platforms and other technology providers. Third-party
              providers may have their own privacy policies and terms. We recommend reviewing those
              policies when using their services.
            </p>
            <h3 className="mt-8 font-display text-xl text-ink">Links</h3>
            <p className="mt-4">
              Our website may contain links to external websites or services. Once you leave the Velvet
              Shell website, their privacy practices will apply. We encourage you to review the privacy
              policies of any third-party websites you visit.
            </p>
            <h3 className="mt-8 font-display text-xl text-ink">Analytics</h3>
            <p className="mt-4">
              We may use analytics tools to understand how visitors interact with our website, which
              pages are viewed and how we can improve the overall experience.
            </p>
          </Section>

          <Section number="06" title="Security">
            <p>
              We take reasonable measures to protect your personal information from being lost,
              misused, accessed without authorisation, disclosed, altered or destroyed.
            </p>
            <p>
              Where payment or other sensitive information is handled by third-party service providers,
              appropriate security measures may be applied by those providers in accordance with their
              own policies and applicable standards.
            </p>
            <p>
              While we take reasonable precautions to protect your information, no method of
              transmission or electronic storage can be guaranteed to be completely secure.
            </p>
          </Section>

          <Section number="07" title="Cookies">
            <p>
              Our website may use cookies and similar technologies to improve website functionality,
              understand visitor behaviour, remember preferences and enhance your browsing experience.
            </p>
            <p>
              Cookies may also be used to help us understand website traffic and measure the
              effectiveness of our communications and marketing.
            </p>
            <p>
              You may manage or disable cookies through your browser settings. Disabling certain cookies
              may affect some website functionality.
            </p>
          </Section>

          <Section number="08" title="Age Of Consent">
            <p>
              By using this website, you confirm that you are legally permitted to use the website and
              provide your personal information under the applicable laws of your jurisdiction.
            </p>
            <p>
              We do not knowingly seek to collect personal information from individuals where such
              collection is not legally permitted.
            </p>
          </Section>

          <Section number="09" title="Your Information">
            <p>
              You may contact us to request information about the personal data we hold about you,
              request correction of inaccurate information, or request deletion where applicable.
            </p>
            <p>
              You may also withdraw consent for communications where consent is the basis for
              processing.
            </p>
            <p>For any such request, please contact:</p>
            <div className="mt-4 space-y-1 text-ink/80">
              <p className="font-display text-xl text-ink">Velvet Shell</p>
              <ContactPlaceholders />
            </div>
          </Section>

          <Section number="10" title="Changes To This Privacy Policy">
            <p>
              We may update this Privacy Policy from time to time to reflect changes to our business,
              website, services or applicable requirements.
            </p>
            <p>
              Any changes will be published on this page with the updated “Last Updated” date.
            </p>
            <p>
              We encourage you to review this page periodically to stay informed about how we handle
              your information.
            </p>
          </Section>

          <section className="border-t border-ink/10 pt-10">
            <p className="font-label text-gold">Contact</p>
            <h2 className="font-display mt-3 text-3xl text-ink">Velvet Shell</h2>
            <div className="mt-5 space-y-2 text-[15px] font-light leading-relaxed text-ink/80">
              <p>[BUSINESS / REGISTERED ADDRESS]</p>
              <p>
                Email:{' '}
                <span className="text-ink/85">[EMAIL]</span>
              </p>
              <p>
                Phone:{' '}
                <span className="text-ink/85">[NUMBER]</span>
              </p>
            </div>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-3 font-label text-[11px] tracking-[0.18em] text-burgundy transition-opacity hover:opacity-70"
            >
              Contact Us
              <span aria-hidden>→</span>
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}

function Section({ number, title, children }) {
  return (
    <section className="border-t border-ink/10 pt-10">
      <div className="flex items-baseline gap-4">
        <span className="font-label text-[10px] text-gold">{number}</span>
        <h2 className="font-display text-2xl tracking-[-0.02em] text-ink md:text-3xl">{title}</h2>
      </div>
      <div className="mt-6 space-y-4 text-[15px] font-light leading-[1.8] text-ink/80">{children}</div>
    </section>
  );
}

function ContactPlaceholders() {
  return (
    <div className="my-4 space-y-1 text-[15px] font-light text-ink/80">
      <p>
        Email: <span className="text-ink/80">[OFFICIAL EMAIL]</span>
      </p>
      <p>
        Phone: <span className="text-ink/80">[CONTACT NUMBER]</span>
      </p>
    </div>
  );
}
