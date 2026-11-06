import Legal from '@/components/Legal';

export const metadata = { title: 'Shipping' };

export default function ShippingPage() {
  return (
    <Legal title="Shipping">
      <p>Velvet Shell delivers across India. Orders of ₹3,999 and above (after discounts) include complimentary shipping. Orders below ₹3,999 have a flat shipping charge of ₹99.</p>
      <p>Once your order and payment are confirmed, we prepare it for dispatch. Processing time depends on the piece and order volume. Estimated delivery is shared with your order confirmation.</p>
      <p>
        After dispatch, tracking details are sent to you. For a delivery question, write to{' '}
        <a
          href="mailto:sales@velvetshell.in?subject=Delivery%20question"
          className="font-medium text-burgundy underline decoration-burgundy/40 underline-offset-4 hover:decoration-burgundy"
        >
          sales@velvetshell.in
        </a>
        .
      </p>
    </Legal>
  );
}
