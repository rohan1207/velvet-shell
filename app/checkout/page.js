'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { getProduct, collectionName } from '@/lib/products';
import { money } from '@/lib/format';
import { loadRazorpayScript } from '@/lib/razorpay-client';

const emptyForm = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  cityPin: '',
};

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, cartCount, user, selectedAddress, placeOrder } = useStore();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const nameFromAddress = selectedAddress?.fullName || '';
    const nameFromUser = [user?.firstName, user?.lastName].filter(Boolean).join(' ');
    setForm((current) => ({
      ...current,
      fullName: nameFromAddress || nameFromUser || current.fullName,
      email: user?.email || current.email,
      phone: user?.phone || selectedAddress?.phone || current.phone,
      address: selectedAddress
        ? [selectedAddress.line1, selectedAddress.line2].filter(Boolean).join(', ')
        : current.address,
      cityPin: selectedAddress
        ? [selectedAddress.city, selectedAddress.state, selectedAddress.postal]
            .filter(Boolean)
            .join(', ')
        : current.cityPin,
    }));
  }, [user, selectedAddress]);

  const lines = useMemo(
    () =>
      cart
        .map((item) => {
          const product = getProduct(item.slug);
          if (!product) return null;
          return { item, product, lineTotal: product.price * item.qty };
        })
        .filter(Boolean),
    [cart]
  );

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function splitName(fullName) {
    const parts = fullName.trim().split(/\s+/);
    return {
      firstName: parts[0] || 'Guest',
      lastName: parts.slice(1).join(' ') || '',
    };
  }

  async function finalizeOrder({ paymentId, paymentMethod, demo = false }) {
    const { firstName, lastName } = splitName(form.fullName);
    const [city = '', state = '', postal = ''] = form.cityPin.split(',').map((s) => s.trim());

    const shipping = {
      firstName,
      lastName,
      email: form.email,
      phone: form.phone,
      address: form.address,
      city,
      state,
      postal,
      country: 'India',
    };

    const order = placeOrder({
      id: `VS${Date.now().toString().slice(-8)}`,
      total: cartTotal,
      items: cart,
      shipping,
      paymentId,
      paymentMethod: demo ? 'Demo (Razorpay pending keys)' : paymentMethod,
      email: form.email,
      status: 'Confirmed',
    });

    sessionStorage.setItem('vs-order', JSON.stringify(order));
    router.push('/order-confirmation');
  }

  async function onPay(event) {
    event.preventDefault();
    setError('');

    if (!cart.length) {
      setError('Your bag is empty.');
      return;
    }

    setPaying(true);
    try {
      const orderRes = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: cartTotal,
          currency: 'INR',
          receipt: `vs_${Date.now()}`,
        }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || 'Could not start payment');

      if (orderData.demo || !orderData.orderId) {
        await finalizeOrder({
          paymentId: `demo_${Date.now()}`,
          paymentMethod: 'Demo checkout',
          demo: true,
        });
        return;
      }

      const ready = await loadRazorpayScript();
      if (!ready || !window.Razorpay) {
        throw new Error('Razorpay failed to load. Check your connection.');
      }

      const { firstName, lastName } = splitName(form.fullName);
      const rzp = new window.Razorpay({
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Velvet Shell',
        description: 'Jewellery order',
        order_id: orderData.orderId,
        prefill: {
          name: `${firstName} ${lastName}`.trim(),
          email: form.email,
          contact: form.phone,
        },
        notes: { address: form.address },
        theme: { color: '#5E062A' },
        handler: async (response) => {
          try {
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response),
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || !verifyData.ok) {
              throw new Error(verifyData.error || 'Payment verification failed');
            }
            await finalizeOrder({
              paymentId: response.razorpay_payment_id,
              paymentMethod: 'Razorpay',
            });
          } catch (err) {
            setError(err.message || 'Payment could not be verified');
            setPaying(false);
          }
        },
        modal: {
          ondismiss: () => setPaying(false),
        },
      });

      rzp.on('payment.failed', (response) => {
        setError(response?.error?.description || 'Payment failed. Please try again.');
        setPaying(false);
      });

      rzp.open();
    } catch (err) {
      setError(err.message || 'Something went wrong');
      setPaying(false);
    }
  }

  if (!cart.length) {
    return (
      <div className="bg-ivory pt-28 pb-24 md:pt-36">
        <div className="mx-auto max-w-xl px-5 text-center md:px-10">
          <p className="font-label text-gold">Checkout</p>
          <h1 className="font-display mt-3 text-5xl text-ink">Your bag is empty</h1>
          <p className="mt-4 text-sm font-light text-ink/80">Add a piece before checkout.</p>
          <Link
            href="/shop"
            className="bg-velvet-texture mt-8 inline-flex h-12 items-center rounded-full px-8 font-label text-[11px] tracking-[0.2em] text-ivory"
          >
            Browse the shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100svh] bg-ivory pt-28 pb-20 md:pt-32">
      {/* items-stretch so the summary column matches form height — sticky then releases before footer */}
      <div className="mx-auto grid max-w-[1400px] gap-10 px-5 md:grid-cols-12 md:gap-12 md:px-10 lg:gap-16">
        {/* Form */}
        <form onSubmit={onPay} className="md:col-span-6 lg:col-span-5">
          <p className="font-label text-gold">Checkout</p>
          <h1 className="font-display mt-3 text-4xl tracking-[-0.03em] text-ink md:text-5xl">
            Almost yours.
          </h1>
          <p className="mt-3 max-w-sm text-sm font-light text-ink/80">
            A short form — then Razorpay. Complimentary insured shipping across India.
          </p>

          {selectedAddress && (
            <div className="mt-8 rounded-2xl border border-gold/30 bg-pearl px-5 py-4">
              <p className="font-label text-[10px] text-gold">Delivering to saved address</p>
              <p className="mt-2 text-sm text-ink">{selectedAddress.fullName}</p>
              <p className="mt-1 text-xs font-light text-ink/80">
                {selectedAddress.line1}
                {selectedAddress.city ? `, ${selectedAddress.city}` : ''}
              </p>
              <Link
                href="/account"
                className="mt-2 inline-block font-label text-[10px] tracking-[0.14em] text-burgundy"
              >
                Change in account
              </Link>
            </div>
          )}

          <div className="mt-8 space-y-5 rounded-3xl border border-ink/8 bg-pearl/60 p-6 md:p-8">
            <Field
              label="Full name"
              value={form.fullName}
              onChange={(v) => updateField('fullName', v)}
              required
              placeholder="As on the parcel"
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Email"
                type="email"
                value={form.email}
                onChange={(v) => updateField('email', v)}
                required
                placeholder="you@email.com"
              />
              <Field
                label="Phone"
                type="tel"
                value={form.phone}
                onChange={(v) => updateField('phone', v)}
                required
                placeholder="+91 …"
              />
            </div>
            <Field
              label="Street address"
              value={form.address}
              onChange={(v) => updateField('address', v)}
              required
              placeholder="House, street, landmark"
            />
            <Field
              label="City, state & PIN"
              value={form.cityPin}
              onChange={(v) => updateField('cityPin', v)}
              required
              placeholder="Jaipur, Rajasthan, 302001"
            />
          </div>

          {error && <p className="mt-5 text-sm text-burgundy">{error}</p>}

          <button
            type="submit"
            disabled={paying}
            className="bg-velvet-texture mt-8 inline-flex h-13 w-full items-center justify-center rounded-full px-8 font-label text-[11px] tracking-[0.2em] text-ivory disabled:opacity-60 sm:w-auto sm:min-w-[260px]"
            style={{ height: 52 }}
          >
            {paying ? (
              'Opening Razorpay…'
            ) : (
              <>
                Pay securely · <span className="font-num">{money(cartTotal)}</span>
              </>
            )}
          </button>
          <p className="mt-3 text-xs font-light text-ink/80">
            Card details are collected by Razorpay — never on this page.
          </p>
        </form>

        {/* Sticky under navbar while scrolling the form; unsticks at column end (before footer) */}
        <aside className="md:col-span-6 lg:col-span-7">
          <div className="md:sticky md:top-[7.25rem]">
            <OrderSummaryCard
              lines={lines}
              cartCount={cartCount}
              cartTotal={cartTotal}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}

function OrderSummaryCard({ lines, cartCount, cartTotal }) {
  return (
    <div className="flex max-h-[calc(100svh-8.5rem)] flex-col overflow-hidden rounded-[1.75rem] border border-ink/8 bg-pearl shadow-[0_20px_60px_rgba(40,20,24,0.06)]">
      <div className="shrink-0 border-b border-ink/8 px-6 py-5 md:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-label text-[11px] text-ink/80">Order summary</p>
            <p className="font-num mt-2 text-xl text-ink md:text-2xl">
              {cartCount} {cartCount === 1 ? 'piece' : 'pieces'}
            </p>
          </div>
          <Link href="/cart" className="font-label text-[10px] tracking-[0.14em] text-burgundy">
            Edit bag
          </Link>
        </div>
      </div>

      <ul className="min-h-0 flex-1 space-y-0 overflow-y-auto overscroll-contain px-6 md:px-8">
        {lines.map(({ item, product, lineTotal }) => (
          <li key={item.id} className="flex gap-4 border-b border-ink/6 py-5 last:border-b-0">
            <Link
              href={`/shop/${product.slug}`}
              className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-ivory"
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="80px"
              />
            </Link>
            <div className="min-w-0 flex-1">
              <p className="font-label text-[9px] text-gold">
                {collectionName(product.collection) || product.category}
              </p>
              <Link
                href={`/shop/${product.slug}`}
                className="font-display mt-1 block text-xl leading-tight text-ink hover:text-burgundy"
              >
                {product.name}
              </Link>
              <p className="mt-1.5 text-xs font-light text-ink/85">
                {item.metal} · Size {item.size}
              </p>
              <div className="mt-2 flex items-center justify-between gap-3">
                <span className="font-num text-xs font-light text-ink/80">
                  Qty {item.qty} · {money(product.price)} each
                </span>
                <span className="font-num text-sm text-ink">{money(lineTotal)}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="shrink-0 space-y-3 border-t border-ink/8 bg-ivory/50 px-6 py-6 md:px-8">
        <div className="flex justify-between text-sm text-ink/85">
          <span>Subtotal</span>
          <span className="font-num">{money(cartTotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-ink/85">
          <span>Shipping</span>
          <span className="text-gold">Complimentary</span>
        </div>
        <div className="flex justify-between text-sm text-ink/85">
          <span>Duties & taxes</span>
          <span>Included where applicable</span>
        </div>
        <div className="flex items-end justify-between border-t border-ink/8 pt-4">
          <span className="text-sm text-ink">Total due</span>
          <span className="font-num text-2xl text-ink md:text-3xl">{money(cartTotal)}</span>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', required, placeholder }) {
  return (
    <label className="block">
      <span className="font-label text-[10px] text-ink/80">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-full border border-ink/10 bg-ivory px-4 py-3.5 text-[15px] font-light text-ink outline-none placeholder:text-ink/80 focus:border-burgundy/40"
      />
    </label>
  );
}
