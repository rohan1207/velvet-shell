import Legal from '@/components/Legal';

export const metadata = { title: 'Terms' };

export default function TermsPage() {
  return (
    <Legal title="Terms">
      <p>Velvet Shell sells jewellery online at velvetshell.com. Pieces are made in 925 sterling silver, 18K gold-plated finishes and freshwater pearls. Natural pearls can vary slightly in shape, tone and surface.</p>
      <p>Orders placed on this website are real purchases. Payment is collected at checkout. A confirmed order is prepared for dispatch across India.</p>
      <p>
        Photography, writing and marks on this website belong to Velvet Shell. Questions:{' '}
        <a
          href="mailto:sales@velvetshell.in"
          className="font-medium text-burgundy underline decoration-burgundy/40 underline-offset-4 hover:decoration-burgundy"
        >
          sales@velvetshell.in
        </a>{' '}
        or{' '}
        <a
          href="mailto:info.velvetshell@gmail.com"
          className="font-medium text-burgundy underline decoration-burgundy/40 underline-offset-4 hover:decoration-burgundy"
        >
          info.velvetshell@gmail.com
        </a>
        .
      </p>
    </Legal>
  );
}
