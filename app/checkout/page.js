'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { collectionName } from '@/lib/products';
import { money } from '@/lib/format';
import { loadRazorpayScript } from '@/lib/razorpay-client';
import ProductThumb from '@/components/ProductThumb';
import FallingPetals from '@/components/FallingPetals';

const emptyForm = {
  fullName: '',
  email: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postal: '',
  country: 'India',
};

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    cartTotal,
    cartCount,
    user,
    ready,
    addresses,
    selectedAddress,
    selectedAddressId,
    selectAddress,
    addAddress,
    placeOrder,
    getProduct,
  } = useStore();

  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [paying, setPaying] = useState(false);
  const [successOrder, setSuccessOrder] = useState(null);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [savingAddr, setSavingAddr] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace('/account?next=/checkout');
    }
  }, [ready, user, router]);

  useEffect(() => {
    if (!user) return;
    const a = selectedAddress;
    const nameFromUser = [user?.firstName, user?.lastName].filter(Boolean).join(' ');
    setForm((current) => ({
      ...current,
      fullName: a?.fullName || nameFromUser || current.fullName,
      email: user?.email || current.email,
      phone: a?.phone || user?.phone || current.phone,
      line1: a?.line1 || current.line1,
      line2: a?.line2 || current.line2,
      city: a?.city || current.city,
      state: a?.state || current.state,
      postal: a?.postal || current.postal,
      country: a?.country || current.country || 'India',
    }));
  }, [user, selectedAddress]);

  const lines = useMemo(
    () =>
      cart.map((item) => {
        const product = getProduct(item.slug);
        const price = product?.price ?? item.price ?? 0;
        return {
          item,
          product: product || {
            slug: item.slug,
            name: item.name || item.slug,
            image: item.image,
            price,
            collection: '',
          },
          lineTotal: price * item.qty,
        };
      }),
    [cart, getProduct],
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

  async function saveAsNewAddress() {
    setSavingAddr(true);
    setError('');
    try {
      await addAddress({
        label: 'Home',
        fullName: form.fullName,
        phone: form.phone,
        line1: form.line1,
        line2: form.line2,
        city: form.city,
        state: form.state,
        postal: form.postal,
        country: form.country,
        isDefault: true,
      });
      setShowNewAddress(false);
    } catch (err) {
      setError(err.message || 'Could not save address.');
    } finally {
      setSavingAddr(false);
    }
  }

  async function finalizeOrder({
    paymentId,
    paymentMethod,
    demo = false,
    razorpayOrderId,
    razorpaySignature,
  }) {
    const { firstName, lastName } = splitName(form.fullName);

    const shipping = {
      firstName,
      lastName,
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      line1: form.line1,
      line2: form.line2,
      address: [form.line1, form.line2].filter(Boolean).join(', '),
      city: form.city,
      state: form.state,
      postal: form.postal,
      country: form.country || 'India',
      addressId: selectedAddressId || null,
    };

    const order = await placeOrder({
      total: cartTotal,
      subtotal: cartTotal,
      items: cart,
      shipping,
      paymentId,
      paymentMethod: demo ? 'Demo (Razorpay pending keys)' : paymentMethod,
      email: form.email,
      status: 'Confirmed',
      demo,
      razorpayOrderId,
      razorpaySignature,
    });

    sessionStorage.setItem('vs-order', JSON.stringify(order));
    setSuccessOrder(order);
    setPaying(false);
  }

  async function onPay(event) {
    event.preventDefault();
    setError('');

    if (!user) {
      router.replace('/account?next=/checkout');
      return;
    }

    if (!cart.length) {
      setError('Your bag is empty.');
      return;
    }

    if (!form.fullName || !form.email || !form.phone || !form.line1 || !form.city || !form.postal) {
      setError('Please complete your delivery details.');
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

      const scriptReady = await loadRazorpayScript();
      if (!scriptReady || !window.Razorpay) {
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
        notes: { address: form.line1 },
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
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
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

  if (!ready || !user) {
    return (
      <div className="bg-ivory pt-28 pb-24 md:pt-36">
        <div className="mx-auto max-w-md px-5 text-center">
          <p className="font-label text-gold">Checkout</p>
          <h1 className="font-display mt-3 text-4xl text-ink">Signing you in…</h1>
          <p className="mt-3 text-sm font-light text-ink/70">
            You’ll return here with your bag intact.
          </p>
        </div>
      </div>
    );
  }

  if (!cart.length && !successOrder) {
    return (
      <div className="bg-ivory pt-28 pb-24 md:pt-36">
        <div className="mx-auto max-w-xl px-5 text-center md:px-10">
          <p className="font-label text-gold">Checkout</p>
          <h1 className="font-display mt-3 text-4xl tracking-[-0.03em] text-ink md:text-5xl">
            Your bag is empty
          </h1>
          <p className="mt-4 text-sm font-light text-ink/70">Add a piece before checkout.</p>
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
    <div className="min-h-[100svh] bg-gradient-to-b from-[#faf6f1] to-ivory pt-28 pb-[calc(5rem+env(safe-area-inset-bottom))] md:pt-32 md:pb-20">
      {successOrder && (
        <SuccessModal
          order={successOrder}
          onContinue={() => router.push('/account?tab=orders')}
        />
      )}

      <div className="mx-auto grid max-w-[1400px] gap-10 px-5 md:grid-cols-12 md:gap-12 md:px-10 lg:gap-16">
        <form onSubmit={onPay} className="md:col-span-6 lg:col-span-5">
          <p className="font-label text-[10px] tracking-[0.24em] text-gold uppercase">Checkout</p>
          <h1 className="font-display mt-3 text-4xl tracking-[-0.03em] text-burgundy md:text-5xl">
            Almost yours.
          </h1>
          <p className="mt-3 max-w-sm text-sm font-light text-ink/70">
            Confirm delivery, then pay securely with Razorpay. Complimentary insured shipping across
            India.
          </p>

          {addresses.length > 0 && (
            <div className="mt-8 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <p className="font-label text-[10px] tracking-[0.16em] text-ink/50 uppercase">
                  Deliver to
                </p>
                <button
                  type="button"
                  className="font-label text-[10px] tracking-[0.14em] text-burgundy"
                  onClick={() => setShowNewAddress((v) => !v)}
                >
                  {showNewAddress ? 'Use saved' : 'Add new address'}
                </button>
              </div>
              {!showNewAddress && (
                <div className="space-y-2">
                  {addresses.map((addr) => {
                    const active = addr.id === selectedAddressId;
                    return (
                      <button
                        key={addr.id}
                        type="button"
                        onClick={() => selectAddress(addr.id)}
                        className={`w-full rounded-2xl border px-4 py-3.5 text-left transition ${
                          active
                            ? 'border-burgundy/40 bg-white shadow-[0_8px_24px_rgba(94,6,42,0.06)]'
                            : 'border-ink/8 bg-white/50 hover:border-ink/15'
                        }`}
                      >
                        <p className="text-sm text-ink">
                          <span className="font-label text-[10px] tracking-[0.12em] text-gold uppercase">
                            {addr.label}
                          </span>
                          <span className="mt-1 block">{addr.fullName}</span>
                        </p>
                        <p className="mt-1 text-xs font-light text-ink/60">
                          {addr.line1}
                          {addr.city ? `, ${addr.city}` : ''} · {addr.postal}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {(showNewAddress || addresses.length === 0) && (
            <div className="mt-8 space-y-5 rounded-3xl border border-ink/8 bg-white/70 p-6 md:p-8">
              <p className="font-label text-[10px] tracking-[0.16em] text-ink/50 uppercase">
                Delivery details
              </p>
              <Field
                label="Full name"
                value={form.fullName}
                onChange={(v) => updateField('fullName', v)}
                required
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={(v) => updateField('email', v)}
                  required
                />
                <Field
                  label="Phone"
                  type="tel"
                  value={form.phone}
                  onChange={(v) => updateField('phone', v)}
                  required
                />
              </div>
              <Field
                label="Street address"
                value={form.line1}
                onChange={(v) => updateField('line1', v)}
                required
                placeholder="House, street, landmark"
              />
              <Field
                label="Apartment / floor"
                value={form.line2}
                onChange={(v) => updateField('line2', v)}
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="City"
                  value={form.city}
                  onChange={(v) => updateField('city', v)}
                  required
                />
                <Field
                  label="State"
                  value={form.state}
                  onChange={(v) => updateField('state', v)}
                  required
                />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="PIN code"
                  value={form.postal}
                  onChange={(v) => updateField('postal', v)}
                  required
                />
                <Field
                  label="Country"
                  value={form.country}
                  onChange={(v) => updateField('country', v)}
                  required
                />
              </div>
              {showNewAddress && (
                <button
                  type="button"
                  disabled={savingAddr}
                  onClick={saveAsNewAddress}
                  className="font-label text-[11px] tracking-[0.14em] text-burgundy disabled:opacity-60"
                >
                  {savingAddr ? 'Saving…' : 'Save this address to my account'}
                </button>
              )}
            </div>
          )}

          {!showNewAddress && addresses.length > 0 && (
            <div className="mt-6 rounded-2xl border border-ink/8 bg-white/50 px-5 py-4">
              <p className="text-xs font-light text-ink/60">
                Shipping to the selected address. Need a tweak?{' '}
                <button
                  type="button"
                  className="text-burgundy"
                  onClick={() => setShowNewAddress(true)}
                >
                  Edit details
                </button>
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <Field
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={(v) => updateField('email', v)}
                  required
                />
                <Field
                  label="Phone"
                  type="tel"
                  value={form.phone}
                  onChange={(v) => updateField('phone', v)}
                  required
                />
              </div>
            </div>
          )}

          {error && (
            <p className="mt-5 rounded-2xl bg-burgundy/8 px-4 py-3 text-sm text-burgundy">{error}</p>
          )}

          <button
            type="submit"
            disabled={paying || Boolean(successOrder)}
            className="bg-velvet-texture mt-8 inline-flex w-full items-center justify-center rounded-full px-8 font-label text-[11px] tracking-[0.2em] text-ivory disabled:opacity-60 sm:w-auto sm:min-w-[260px]"
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
          <p className="mt-3 text-xs font-light text-ink/55">
            Card details are collected by Razorpay — never on this page.
          </p>
        </form>

        <aside className="md:col-span-6 lg:col-span-7">
          <div className="md:sticky md:top-[7.25rem]">
            <OrderSummaryCard lines={lines} cartCount={cartCount} cartTotal={cartTotal} />
          </div>
        </aside>
      </div>
    </div>
  );
}

const SUCCESS_MIN_MS = 2800;
const SUCCESS_AUTO_MS = 3500;

function SuccessModal({ order, onContinue }) {
  const [canLeave, setCanLeave] = useState(false);

  useEffect(() => {
    const unlock = setTimeout(() => setCanLeave(true), SUCCESS_MIN_MS);
    const auto = setTimeout(onContinue, SUCCESS_AUTO_MS);
    return () => {
      clearTimeout(unlock);
      clearTimeout(auto);
    };
  }, [onContinue]);

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/40 p-5 backdrop-blur-sm">
      <FallingPetals count={22} />
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-[2rem] border border-burgundy/10 bg-gradient-to-br from-[#faf6f1] to-[#efe4da] p-8 text-center shadow-[0_30px_80px_rgba(40,20,24,0.25)]">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-burgundy text-ivory">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M5 12.5l4.5 4.5L19 7.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="font-label mt-6 text-[10px] tracking-[0.24em] text-gold uppercase">
          Order confirmed
        </p>
        <h2 className="font-display mt-3 text-3xl text-burgundy">Thank you</h2>
        <p className="mt-3 text-sm font-light text-ink/70">
          {order.orderNumber || order.id} · {money(order.total)}
        </p>
        <p className="mt-2 text-xs font-light text-ink/55">
          A confirmation email is on its way. Taking you to order history…
        </p>
        <button
          type="button"
          onClick={() => {
            if (canLeave) onContinue();
          }}
          disabled={!canLeave}
          className="bg-velvet-texture mt-8 inline-flex h-12 w-full items-center justify-center rounded-full font-label text-[11px] tracking-[0.2em] text-ivory disabled:opacity-70"
        >
          View orders
        </button>
      </div>
    </div>
  );
}

function OrderSummaryCard({ lines, cartCount, cartTotal }) {
  return (
    <div className="flex max-h-[calc(100svh-8.5rem)] flex-col overflow-hidden rounded-[1.75rem] border border-ink/8 bg-white/80 shadow-[0_20px_60px_rgba(40,20,24,0.06)]">
      <div className="border-b border-ink/8 px-6 py-5">
        <p className="font-label text-[10px] tracking-[0.18em] text-gold uppercase">Your bag</p>
        <p className="mt-1 text-sm text-ink/70">
          {cartCount} {cartCount === 1 ? 'piece' : 'pieces'}
        </p>
      </div>
      <ul className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
        {lines.map(({ item, product, lineTotal }) => (
          <li key={item.id} className="flex gap-4">
            <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-cream ring-1 ring-ink/6">
              <ProductThumb
                product={product}
                item={item}
                alt={product.name || item.name}
                sizes="64px"
                className="object-cover object-center"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-ink">{product.name || item.name}</p>
              <p className="mt-0.5 text-[11px] font-light text-ink/55">
                {collectionName(
                  typeof product.collection === 'string'
                    ? product.collection
                    : product.collection_slug || product.collection?.slug || '',
                )}{' '}
                · {item.metal} · {item.size}
              </p>
              {Array.isArray(item.customization) && item.customization.length > 0 ? (
                <ul className="mt-1.5 space-y-0.5 text-[11px] text-ink/65">
                  {item.customization.map((entry, i) => (
                    <li key={`${entry.id || entry.label}-${i}`}>
                      {entry.label}: {entry.value}
                    </li>
                  ))}
                </ul>
              ) : null}
              <p className="mt-1 text-xs text-ink/60">Qty {item.qty}</p>
            </div>
            <p className="font-num text-sm text-ink">{money(lineTotal)}</p>
          </li>
        ))}
      </ul>
      <div className="border-t border-ink/8 px-6 py-5">
        <div className="flex items-center justify-between">
          <span className="font-label text-[10px] tracking-[0.16em] text-ink/50 uppercase">
            Total
          </span>
          <span className="font-num text-2xl text-burgundy">{money(cartTotal)}</span>
        </div>
        <p className="mt-2 text-xs font-light text-ink/50">Incl. complimentary shipping</p>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', required, placeholder }) {
  return (
    <label className="block">
      <span className="font-label text-[10px] tracking-[0.14em] text-ink/50 uppercase">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-2xl border border-ink/10 bg-white/80 px-4 py-3.5 text-sm text-ink outline-none transition focus:border-burgundy/35"
      />
    </label>
  );
}
