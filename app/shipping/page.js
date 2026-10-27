import Legal from '@/components/Legal';

export const metadata = { title: 'Shipping' };

export default function ShippingPage() {
  return (
    <Legal title="Shipping">
      <p>Orders of ₹3,999 and above (after any discounts) ship free. Orders below ₹3,999 include a flat shipping charge of ₹99. Ready pieces leave within three days. Made-to-order work follows the atelier: two to three weeks, then the same quiet path to your door.</p>
      <p>We ship from Jaipur and Paris. Duties, where they apply, are the responsibility of the client. A tracking note is sent the morning a piece leaves.</p>
      <p>White-glove delivery can be arranged for collars, cuffs, and private commissions.</p>
    </Legal>
  );
}
