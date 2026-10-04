import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'About Us',
  description:
    'Where a pearl begins and a dream takes shape — the story, mission and vision of Velvet Shell.',
};

export default function AboutPage() {
  return (
    <div className="bg-ivory">
      {/* Intro */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <p className="font-label text-gold">About Us</p>
          <h1 className="font-display mt-4 max-w-4xl text-[clamp(2.8rem,7vw,5.8rem)] leading-[0.98] tracking-[-0.03em] text-ink">
            Where A Pearl Begins.
            <span className="mt-1 block">Where A Dream Takes Shape.</span>
          </h1>
          <div className="mt-10 max-w-2xl space-y-5 text-[15px] font-light leading-[1.8] text-ink/80 md:text-base">
            <p>
              A pearl begins with something unexpected - a tiny irritant entering the shell. Layer by
              layer, the shell responds, forming something rare around it.
            </p>
            <p>
              For us, that holds a deeper thought: beautiful things can emerge from beginnings that are
              not always perfect or planned.
            </p>
            <p>
              Velvet Shell also grew from our founder&apos;s desire to build something of her own - a
              creative pursuit shaped by independence, purpose and the belief that women can create,
              lead and build on their own terms.
            </p>
          </div>
        </div>
      </section>

      {/* Visual break */}
      <section className="relative min-h-[55vh] md:min-h-[70vh]">
        <Image
          src="/images/atelier-daylight.png"
          alt="Velvet Shell atelier"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent" aria-hidden />
      </section>

      {/* Our story */}
      <section className="border-b border-ink/8 bg-pearl">
        <div className="mx-auto grid max-w-[1600px] gap-12 px-5 py-20 md:px-10 md:py-28 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <p className="font-label text-gold">Our story</p>
            <h2 className="font-display mt-4 text-[clamp(2rem,3.8vw,3.2rem)] leading-[1.08] tracking-[-0.02em] text-ink">
              From A Small Beginning, Something Precious.
            </h2>
          </div>
          <div className="space-y-5 text-[15px] font-light leading-[1.85] text-ink/80 lg:col-span-7 lg:col-start-6 md:text-base">
            <p>
              After nearly 20 years in business, our founder, Mrs. Smita Eghe wanted to explore a more
              creative side of her journey - one rooted in jewellery, styling, gifting and beauty.
            </p>
            <p>
              Her background is in Instrumentation Engineering, with years spent in technical and
              project-led businesses. Yet jewellery was always a personal interest. She loved choosing
              pieces for herself, and friends would often notice her choices and ask where she had found
              them.
            </p>
            <p>
              Over time, one simple thought began to take shape: if this is something we love choosing,
              why not create something of our own? That thought became the beginning of Velvet Shell.
            </p>
            <p>
              The name draws from something that has always fascinated us - the making of a pearl. When
              an unexpected particle enters an oyster, it responds layer by layer, eventually creating
              something rare and beautiful.
            </p>
            <p>
              That idea became more than an inspiration. It became a philosophy we hold close: we cannot
              always choose what enters our lives, but we can choose what we create from it.
            </p>
            <p>
              And that is what Velvet Shell is about - bringing together jewellery, gifting and lifestyle
              creations with curiosity, thought and a deep appreciation for the beauty that can emerge
              along the way.
            </p>
          </div>
        </div>
      </section>

      {/* Mission + Vision */}
      <section
        id="mission"
        className="mx-auto max-w-[1600px] scroll-mt-28 px-5 py-20 md:scroll-mt-32 md:px-10 md:py-28"
      >
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
          <div className="border-t border-ink/10 pt-10">
            <p className="font-label text-gold">Mission</p>
            <h2 className="font-display mt-4 text-[clamp(2rem,3.5vw,3rem)] leading-[1.08] tracking-[-0.02em] text-ink">
              To Create. To Empower. To Inspire.
            </h2>
            <p className="mt-7 max-w-md text-[15px] font-light leading-[1.85] text-ink/80 md:text-base">
              To create thoughtfully designed jewellery and gifting experiences that carry beauty,
              meaning and individuality while nurturing a culture where women feel empowered to create,
              lead and build with confidence.
            </p>
          </div>

          <div className="border-t border-ink/10 pt-10">
            <p className="font-label text-gold">Vision</p>
            <h2 className="font-display mt-4 text-[clamp(2rem,3.5vw,3rem)] leading-[1.08] tracking-[-0.02em] text-ink">
              To Build A World Of Meaningful Luxury.
            </h2>
            <p className="mt-7 max-w-md text-[15px] font-light leading-[1.85] text-ink/80 md:text-base">
              To grow Velvet Shell into a distinctive contemporary luxury house, where thoughtful design,
              refined craft and the spirit of discovery come together while creating an ecosystem that
              encourages women to pursue their own ideas, ambitions and journeys.
            </p>
          </div>
        </div>
      </section>

      {/* Closing visual */}
      <section className="relative min-h-[60vh] md:min-h-[70vh]">
        <Image
          src="/images/salon-viewing.png"
          alt="Velvet Shell private viewing"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-burgundy/50" aria-hidden />
        <div className="relative z-10 flex min-h-[60vh] items-end px-5 py-14 md:min-h-[70vh] md:px-10 md:py-20">
          <div className="mx-auto w-full max-w-[1600px]">
            <p className="font-label text-gold">Velvet Shell</p>
            <h2 className="font-display mt-4 max-w-2xl text-[clamp(2.2rem,5vw,4rem)] leading-[1.05] tracking-[-0.03em] text-ivory">
              We cannot always choose what enters our lives, but we can choose what we create from it.
            </h2>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-3 font-label text-[11px] tracking-[0.2em] text-ivory transition-colors hover:text-gold"
            >
              Begin a conversation
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
