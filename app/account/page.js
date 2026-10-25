'use client';

import { useEffect, useMemo, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { money } from '@/lib/format';
import AuthFlow from '@/components/auth/AuthFlow';

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'orders', label: 'Orders' },
  { id: 'profile', label: 'Personal details' },
  { id: 'addresses', label: 'Addresses' },
  { id: 'password', label: 'Password' },
];

const emptyAddress = {
  label: 'Home',
  fullName: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postal: '',
  country: 'India',
  isDefault: true,
};

export default function AccountPage() {
  return (
    <Suspense fallback={<AccountShell />}>
      <AccountInner />
    </Suspense>
  );
}

function AccountShell() {
  return (
    <div className="relative min-h-[70svh] overflow-hidden bg-gradient-to-b from-[#faf6f1] to-ivory pt-28 pb-24 md:pt-36">
      <div className="mx-auto max-w-md px-5">
        <p className="font-label text-gold">Account</p>
        <h1 className="font-display mt-3 text-5xl text-ink">Welcome</h1>
      </div>
    </div>
  );
}

function AccountInner() {
  const search = useSearchParams();
  const {
    user,
    ready,
    logout,
    updateProfile,
    changePassword,
    orders,
    addresses,
    selectedAddressId,
    addAddress,
    updateAddress,
    removeAddress,
    selectAddress,
    wishlist,
    refreshOrders,
  } = useStore();

  const returnUrl = search.get('next') || '';
  const initialMode = search.get('mode') === 'reset' ? 'reset' : 'enter';
  const [tab, setTab] = useState(search.get('tab') || 'overview');
  const [profileForm, setProfileForm] = useState(null);
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    next: '',
    confirm: '',
  });
  const [addressForm, setAddressForm] = useState(emptyAddress);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const t = search.get('tab');
    if (t && tabs.some((x) => x.id === t)) setTab(t);
  }, [search]);

  useEffect(() => {
    if (user && tab === 'orders' && refreshOrders) {
      refreshOrders();
    }
  }, [user, tab, refreshOrders]);

  const displayProfile = useMemo(() => {
    if (!user) return null;
    return (
      profileForm || {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        fullName: user.fullName || [user.firstName, user.lastName].filter(Boolean).join(' '),
        email: user.email || '',
        phone: user.phone || '',
      }
    );
  }, [user, profileForm]);

  if (!ready) return <AccountShell />;

  if (!user) {
    return (
      <div className="relative min-h-[100svh] overflow-hidden bg-gradient-to-br from-[#faf6f1] via-[#f5eee8] to-[#ebe3da] pt-28 pb-24 md:pt-36">
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute top-20 left-[10%] h-64 w-64 rounded-full bg-blush/30 blur-3xl" />
          <div className="absolute right-[8%] bottom-32 h-72 w-72 rounded-full bg-burgundy/5 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-lg px-5">
          <AuthFlow initialMode={initialMode} returnUrl={returnUrl} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100svh] bg-gradient-to-b from-[#faf6f1] to-ivory pt-[calc(var(--site-chrome-offset)+1.25rem)] pb-[calc(5rem+env(safe-area-inset-bottom))] md:pt-36 md:pb-24">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-5 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-burgundy/10 pb-6 sm:gap-6 sm:pb-8">
          <div className="min-w-0">
            <p className="font-label text-[10px] tracking-[0.24em] text-gold uppercase">My account</p>
            <h1 className="font-display mt-2 text-[1.85rem] tracking-[-0.03em] text-burgundy sm:mt-3 sm:text-4xl md:text-5xl">
              Hello, {user.firstName || user.fullName?.split(' ')[0] || 'there'}
            </h1>
            <p className="mt-1.5 truncate text-[13px] font-light text-ink/70 sm:mt-2 sm:text-sm">
              {user.email}
            </p>
          </div>
          <button
            type="button"
            onClick={async () => {
              await logout();
              setNotice('');
            }}
            className="rounded-full border border-ink/12 px-4 py-2.5 font-label text-[10px] tracking-[0.16em] text-ink/70 hover:border-burgundy/30 hover:text-burgundy sm:px-5 sm:text-[11px] sm:tracking-[0.18em]"
          >
            Log out
          </button>
        </div>

        <div className="mt-6 grid gap-6 sm:mt-10 sm:gap-10 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-14">
          <aside className="-mx-4 sm:mx-0">
            <nav className="chip-scroll-wrap flex gap-2 pb-1 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0">
              {tabs.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setTab(item.id);
                    setNotice('');
                    setError('');
                    if (item.id === 'profile') setProfileForm(null);
                  }}
                  className={`shrink-0 whitespace-nowrap rounded-full px-3.5 py-2 text-left text-[13px] transition-colors sm:px-4 sm:py-2.5 sm:text-sm lg:w-full ${
                    tab === item.id
                      ? 'bg-burgundy text-ivory'
                      : 'text-ink/70 hover:bg-cream/80 hover:text-ink'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="mt-8 hidden space-y-3 border-t border-ink/8 pt-6 text-sm lg:block">
              <Link href="/wishlist" className="block text-ink/70 hover:text-burgundy">
                Wishlist ({wishlist.length})
              </Link>
              <Link href="/shop" className="block text-ink/70 hover:text-burgundy">
                Continue shopping
              </Link>
            </div>
          </aside>

          <div>
            {(notice || error) && (
              <p
                className={`mb-6 rounded-2xl px-4 py-3 text-sm ${
                  error ? 'bg-burgundy/8 text-burgundy' : 'bg-shell/10 text-shell'
                }`}
              >
                {error || notice}
              </p>
            )}

            {tab === 'overview' && (
              <div className="space-y-10">
                <section className="grid gap-4 sm:grid-cols-3">
                  <Stat label="Orders" value={String(orders.length)} />
                  <Stat label="Saved pieces" value={String(wishlist.length)} />
                  <Stat label="Addresses" value={String(addresses.length)} />
                </section>
                <section>
                  <div className="flex items-end justify-between gap-4">
                    <h2 className="font-display text-3xl text-ink">Recent orders</h2>
                    <button
                      type="button"
                      className="font-label text-[10px] tracking-[0.16em] text-burgundy"
                      onClick={() => setTab('orders')}
                    >
                      View all
                    </button>
                  </div>
                  {orders.length === 0 ? (
                    <p className="mt-4 text-sm font-light text-ink/70">
                      No orders yet.{' '}
                      <Link href="/shop" className="text-burgundy">
                        Browse the shop
                      </Link>
                    </p>
                  ) : (
                    <ul className="mt-6 space-y-4">
                      {orders.slice(0, 3).map((order) => (
                        <OrderRow key={order.id} order={order} />
                      ))}
                    </ul>
                  )}
                </section>
              </div>
            )}

            {tab === 'orders' && (
              <div>
                <h2 className="font-display text-3xl text-ink">Order history</h2>
                <p className="mt-2 text-sm font-light text-ink/70">
                  Confirmation emails are sent when each order is placed.
                </p>
                {orders.length === 0 ? (
                  <p className="mt-6 text-sm font-light text-ink/70">You have no orders yet.</p>
                ) : (
                  <ul className="mt-8 space-y-5">
                    {orders.map((order) => (
                      <OrderRow key={order.id} order={order} detailed />
                    ))}
                  </ul>
                )}
              </div>
            )}

            {tab === 'profile' && displayProfile && (
              <form
                className="max-w-xl space-y-5"
                onSubmit={async (event) => {
                  event.preventDefault();
                  setError('');
                  setBusy(true);
                  try {
                    await updateProfile({
                      fullName:
                        displayProfile.fullName ||
                        [displayProfile.firstName, displayProfile.lastName]
                          .filter(Boolean)
                          .join(' '),
                      phone: displayProfile.phone,
                    });
                    setProfileForm(null);
                    setNotice('Personal details saved.');
                  } catch (err) {
                    setError(err.message || 'Could not save details.');
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                <h2 className="font-display text-3xl text-ink">Personal details</h2>
                <Field
                  label="Full name"
                  value={
                    displayProfile.fullName ||
                    [displayProfile.firstName, displayProfile.lastName].filter(Boolean).join(' ')
                  }
                  onChange={(v) => setProfileForm({ ...displayProfile, fullName: v })}
                  required
                />
                <Field
                  label="Email"
                  type="email"
                  value={displayProfile.email}
                  onChange={() => {}}
                  disabled
                  hint="Email is used for login and cannot be changed here."
                />
                <Field
                  label="Phone"
                  type="tel"
                  value={displayProfile.phone}
                  onChange={(v) => setProfileForm({ ...displayProfile, phone: v })}
                  required
                />
                <button type="submit" disabled={busy} className={pillBtn}>
                  {busy ? 'Saving…' : 'Save details'}
                </button>
              </form>
            )}

            {tab === 'addresses' && (
              <div className="space-y-10">
                <div>
                  <h2 className="font-display text-3xl text-ink">Saved addresses</h2>
                  <p className="mt-2 text-sm font-light text-ink/70">
                    Select a default for faster checkout — you can change it anytime.
                  </p>
                  {addresses.length === 0 ? (
                    <p className="mt-6 text-sm font-light text-ink/70">No addresses saved yet.</p>
                  ) : (
                    <ul className="mt-6 grid gap-4 md:grid-cols-2">
                      {addresses.map((address) => {
                        const selected = address.id === selectedAddressId || address.isDefault;
                        return (
                          <li
                            key={address.id}
                            className={`rounded-2xl border px-5 py-5 ${
                              selected
                                ? 'border-burgundy/40 bg-white shadow-[0_8px_30px_rgba(94,6,42,0.06)]'
                                : 'border-ink/8 bg-white/60'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="font-label text-[10px] tracking-[0.16em] text-gold uppercase">
                                  {address.label}
                                </p>
                                <p className="mt-2 text-sm text-ink">{address.fullName}</p>
                                <p className="mt-1 text-sm font-light text-ink/70">
                                  {address.line1}
                                  {address.line2 ? `, ${address.line2}` : ''}
                                </p>
                                <p className="text-sm font-light text-ink/70">
                                  {address.city}, {address.state} {address.postal}
                                </p>
                                <p className="mt-2 text-xs text-ink/60">{address.phone}</p>
                              </div>
                              {selected && (
                                <span className="rounded-full bg-burgundy/8 px-2.5 py-1 font-label text-[9px] tracking-[0.14em] text-burgundy">
                                  Default
                                </span>
                              )}
                            </div>
                            <div className="mt-4 flex flex-wrap gap-3 font-label text-[10px] tracking-[0.14em] uppercase">
                              {!selected && (
                                <button
                                  type="button"
                                  onClick={() => selectAddress(address.id)}
                                  className="text-ink/60 hover:text-burgundy"
                                >
                                  Use this
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingAddressId(address.id);
                                  setAddressForm({
                                    label: address.label,
                                    fullName: address.fullName,
                                    phone: address.phone,
                                    line1: address.line1,
                                    line2: address.line2 || '',
                                    city: address.city,
                                    state: address.state,
                                    postal: address.postal,
                                    country: address.country,
                                    isDefault: Boolean(address.isDefault),
                                  });
                                }}
                                className="text-ink/60 hover:text-burgundy"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={async () => {
                                  try {
                                    await removeAddress(address.id);
                                    setNotice('Address removed.');
                                  } catch (err) {
                                    setError(err.message || 'Could not remove.');
                                  }
                                }}
                                className="text-ink/60 hover:text-burgundy"
                              >
                                Remove
                              </button>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                <form
                  className="max-w-2xl space-y-5 rounded-3xl border border-ink/8 bg-white/70 p-6 md:p-8"
                  onSubmit={async (event) => {
                    event.preventDefault();
                    setError('');
                    setBusy(true);
                    try {
                      if (editingAddressId) {
                        await updateAddress(editingAddressId, addressForm);
                        setNotice('Address updated.');
                      } else {
                        await addAddress(addressForm);
                        setNotice('Address saved.');
                      }
                      setEditingAddressId(null);
                      setAddressForm(emptyAddress);
                    } catch (err) {
                      setError(err.message || 'Could not save address.');
                    } finally {
                      setBusy(false);
                    }
                  }}
                >
                  <h3 className="font-display text-2xl text-ink">
                    {editingAddressId ? 'Edit address' : 'Add address'}
                  </h3>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field
                      label="Label"
                      value={addressForm.label}
                      onChange={(v) => setAddressForm((f) => ({ ...f, label: v }))}
                      required
                    />
                    <Field
                      label="Full name"
                      value={addressForm.fullName}
                      onChange={(v) => setAddressForm((f) => ({ ...f, fullName: v }))}
                      required
                    />
                    <div className="sm:col-span-2">
                      <Field
                        label="Phone"
                        value={addressForm.phone}
                        onChange={(v) => setAddressForm((f) => ({ ...f, phone: v }))}
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Field
                        label="Address line 1"
                        value={addressForm.line1}
                        onChange={(v) => setAddressForm((f) => ({ ...f, line1: v }))}
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Field
                        label="Address line 2"
                        value={addressForm.line2}
                        onChange={(v) => setAddressForm((f) => ({ ...f, line2: v }))}
                      />
                    </div>
                    <Field
                      label="City"
                      value={addressForm.city}
                      onChange={(v) => setAddressForm((f) => ({ ...f, city: v }))}
                      required
                    />
                    <Field
                      label="State"
                      value={addressForm.state}
                      onChange={(v) => setAddressForm((f) => ({ ...f, state: v }))}
                      required
                    />
                    <Field
                      label="Postal code"
                      value={addressForm.postal}
                      onChange={(v) => setAddressForm((f) => ({ ...f, postal: v }))}
                      required
                    />
                    <Field
                      label="Country"
                      value={addressForm.country}
                      onChange={(v) => setAddressForm((f) => ({ ...f, country: v }))}
                      required
                    />
                  </div>
                  <label className="flex items-center gap-3 text-sm text-ink/70">
                    <input
                      type="checkbox"
                      checked={addressForm.isDefault}
                      onChange={(event) =>
                        setAddressForm((f) => ({ ...f, isDefault: event.target.checked }))
                      }
                    />
                    Set as default address
                  </label>
                  <div className="flex flex-wrap gap-3">
                    <button type="submit" disabled={busy} className={pillBtn}>
                      {busy
                        ? 'Saving…'
                        : editingAddressId
                          ? 'Update address'
                          : 'Save address'}
                    </button>
                    {editingAddressId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingAddressId(null);
                          setAddressForm(emptyAddress);
                        }}
                        className="h-12 px-4 font-label text-[11px] tracking-[0.16em] text-ink/60"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            )}

            {tab === 'password' && (
              <form
                className="max-w-md space-y-5"
                onSubmit={async (event) => {
                  event.preventDefault();
                  setError('');
                  setNotice('');
                  if (passwordForm.next !== passwordForm.confirm) {
                    setError('New passwords do not match.');
                    return;
                  }
                  setBusy(true);
                  const result = await changePassword(passwordForm.current, passwordForm.next);
                  setBusy(false);
                  if (!result.ok) {
                    setError(result.error);
                    return;
                  }
                  setPasswordForm({ current: '', next: '', confirm: '' });
                  setNotice('Password updated.');
                }}
              >
                <h2 className="font-display text-3xl text-ink">Manage password</h2>
                <p className="text-sm font-light text-ink/70">
                  Choose a strong password (8+ characters, letters and a number).
                </p>
                <Field
                  label="Current password"
                  type="password"
                  required
                  value={passwordForm.current}
                  onChange={(v) => setPasswordForm((f) => ({ ...f, current: v }))}
                  autoComplete="current-password"
                />
                <Field
                  label="New password"
                  type="password"
                  required
                  value={passwordForm.next}
                  onChange={(v) => setPasswordForm((f) => ({ ...f, next: v }))}
                  autoComplete="new-password"
                />
                <Field
                  label="Confirm new password"
                  type="password"
                  required
                  value={passwordForm.confirm}
                  onChange={(v) => setPasswordForm((f) => ({ ...f, confirm: v }))}
                  autoComplete="new-password"
                />
                <button type="submit" disabled={busy} className={pillBtn}>
                  {busy ? 'Updating…' : 'Update password'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const pillBtn =
  'bg-velvet-texture inline-flex h-12 items-center justify-center rounded-full px-8 font-label text-[11px] tracking-[0.2em] text-ivory disabled:opacity-60';

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border border-ink/8 bg-white/80 px-5 py-6">
      <p className="font-label text-[10px] tracking-[0.14em] text-ink/50 uppercase">{label}</p>
      <p className="font-display mt-2 text-3xl text-burgundy">{value}</p>
    </div>
  );
}

function OrderRow({ order, detailed = false }) {
  const { getProduct } = useStore();
  const label = order.orderNumber || order.id;
  const ship = order.shipping || {};
  return (
    <li className="rounded-2xl border border-ink/8 bg-white/80 px-5 py-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-label text-[10px] tracking-[0.16em] text-gold uppercase">
            Order {label}
          </p>
          <p className="mt-2 text-sm text-ink">
            {new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
          <p className="mt-1 text-xs font-light text-ink/60">
            {order.status} · {order.paymentMethod || 'Razorpay'}
          </p>
        </div>
        <p className="font-num text-2xl text-ink">{money(order.total)}</p>
      </div>
      {detailed && (
        <ul className="mt-4 space-y-2 border-t border-ink/8 pt-4 text-sm text-ink/70">
          {(order.items || []).map((item, idx) => {
            const product = getProduct(item.slug);
            const name = item.name || product?.name || item.slug;
            const line = item.lineTotal ?? (product ? product.price * item.qty : null);
            return (
              <li key={item.id || `${item.slug}-${idx}`} className="flex justify-between gap-3">
                <span>
                  {name} · {item.size} · Qty {item.qty}
                </span>
                {line != null && <span className="font-num">{money(line)}</span>}
              </li>
            );
          })}
          {(ship.fullName || ship.firstName || ship.line1 || ship.address) && (
            <li className="pt-2 text-xs text-ink/60">
              Ship to {ship.fullName || `${ship.firstName || ''} ${ship.lastName || ''}`.trim()},{' '}
              {ship.line1 || ship.address}
              {ship.city ? `, ${ship.city}` : ''}
            </li>
          )}
          {order.paymentId && (
            <li className="text-xs text-ink/50">Payment ID: {order.paymentId}</li>
          )}
        </ul>
      )}
    </li>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required,
  disabled,
  hint,
  autoComplete,
  placeholder,
}) {
  return (
    <label className="block">
      <span className="font-label text-[10px] tracking-[0.14em] text-ink/50 uppercase">{label}</span>
      <input
        type={type}
        required={required}
        disabled={disabled}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(event) => onChange?.(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-ink/10 bg-white/80 px-4 py-3.5 text-[15px] font-light text-ink outline-none transition focus:border-burgundy/35 disabled:opacity-60"
      />
      {hint && <span className="mt-2 block text-xs font-light text-ink/55">{hint}</span>}
    </label>
  );
}
