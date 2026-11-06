import Legal from '@/components/Legal';

export const metadata = { title: 'Returns' };

export default function ReturnsPage() {
  return (
    <Legal title="Returns">
      <p>If you need to change or cancel an order, write to us as soon as possible. Once an order has been processed or dispatched, changes may not be possible.</p>
      <p>If you receive a damaged or incorrect piece, contact us with your order number and clear photographs of the jewellery and packaging. We will review it and tell you the next step. Please contact us before sending anything back.</p>
      <p>
        Begin a return at{' '}
        <a
          href="mailto:sales@velvetshell.in?subject=Return%20request"
          className="font-medium text-burgundy underline decoration-burgundy/40 underline-offset-4 hover:decoration-burgundy"
        >
          sales@velvetshell.in
        </a>{' '}
        with your order number.
      </p>
    </Legal>
  );
}
