'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { getProduct } from '@/lib/products';
import { money } from '@/lib/format';

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
  const {
    user,
    login,
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
  } = useStore();

  const [mode, setMode] = useState('enter');
  const [tab, setTab] = useState('overview');
  const [authForm, setAuthForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
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

  const displayProfile = useMemo(() => {
    if (!user) return null;
    return (
      profileForm || {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
      }
    );
  }, [user, profileForm]);

  if (!user) {
    return (
      <div className="bg-ivory pt-28 pb-24 md:pt-36">
        <div className="mx-auto max-w-md px-5">
          <p className="font-label text-gold">Account</p>
          <h1 className="font-display mt-3 text-5xl text-ink">
            {mode === 'enter' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="mt-4 text-sm font-light text-ink/80">
            Demo sign-in: any email and any password will work. Your session stays in this browser.
          </p>
          <form
            className="mt-10 space-y-5"
            onSubmit={(event) => {
              event.preventDefault();
              login(authForm);
              setNotice('Signed in.');
              setError('');
            }}
          >
            {mode === 'create' && (
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="First name"
                  value={authForm.firstName}
                  onChange={(v) => setAuthForm((f) => ({ ...f, firstName: v }))}
                />
                <Field
                  label="Last name"
                  value={authForm.lastName}
                  onChange={(v) => setAuthForm((f) => ({ ...f, lastName: v }))}
                />
              </div>
            )}
            <Field
              label="Email"
              type="email"
              required
              value={authForm.email}
              onChange={(v) => setAuthForm((f) => ({ ...f, email: v }))}
            />
            <Field
              label="Password"
              type="password"
              required
              value={authForm.password}
              onChange={(v) => setAuthForm((f) => ({ ...f, password: v }))}
            />
            <button
              type="submit"
              className="bg-velvet-texture h-12 w-full rounded-full font-label text-[11px] tracking-[0.2em] text-ivory"
            >
              {mode === 'enter' ? 'Sign in' : 'Create account'}
            </button>
          </form>
          <button
            type="button"
            className="mt-8 font-label text-[11px] tracking-[0.16em] text-ink/85 hover:text-burgundy"
            onClick={() => setMode(mode === 'enter' ? 'create' : 'enter')}
          >
            {mode === 'enter' ? 'Need an account? Create one' : 'Already with us? Sign in'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-ivory pt-28 pb-24 md:pt-36">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-ink/10 pb-8">
          <div>
            <p className="font-label text-gold">My account</p>
            <h1 className="font-display mt-3 text-4xl text-ink md:text-5xl">
              Hello, {user.firstName || 'there'}
            </h1>
            <p className="mt-2 text-sm font-light text-ink/85">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              logout();
              setNotice('');
            }}
            className="font-label text-[11px] tracking-[0.18em] text-ink/80 hover:text-burgundy"
          >
            Log out
          </button>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
          <aside>
            <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-1">
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
                  className={`whitespace-nowrap rounded-full px-4 py-2.5 text-left text-sm transition-colors lg:w-full ${
                    tab === item.id
                      ? 'bg-ink text-ivory'
                      : 'text-ink/80 hover:bg-pearl hover:text-ink'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="mt-8 hidden space-y-3 border-t border-ink/10 pt-6 text-sm lg:block">
              <Link href="/wishlist" className="block text-ink/85 hover:text-burgundy">
                Wishlist ({wishlist.length})
              </Link>
              <Link href="/shop" className="block text-ink/85 hover:text-burgundy">
                Continue shopping
              </Link>
            </div>
          </aside>

          <div>
            {(notice || error) && (
              <p className={`mb-6 text-sm ${error ? 'text-burgundy' : 'text-ink/85'}`}>
                {error || notice}
              </p>
            )}

            {tab === 'overview' && (
              <div className="space-y-8">
                <section className="grid gap-4 sm:grid-cols-3">
                  <Stat label="Orders" value={String(orders.length)} />
                  <Stat label="Saved pieces" value={String(wishlist.length)} />
                  <Stat label="Addresses" value={String(addresses.length)} />
                </section>
                <section>
                  <h2 className="font-display text-3xl text-ink">Recent orders</h2>
                  {orders.length === 0 ? (
                    <p className="mt-4 text-sm font-light text-ink/80">
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
                {orders.length === 0 ? (
                  <p className="mt-4 text-sm font-light text-ink/80">You have no orders yet.</p>
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
                onSubmit={(event) => {
                  event.preventDefault();
                  updateProfile({
                    firstName: displayProfile.firstName,
                    lastName: displayProfile.lastName,
                    phone: displayProfile.phone,
                    email: displayProfile.email.trim().toLowerCase(),
                  });
                  setProfileForm(null);
                  setNotice('Personal details saved.');
                }}
              >
                <h2 className="font-display text-3xl text-ink">Personal details</h2>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    label="First name"
                    value={displayProfile.firstName}
                    onChange={(v) =>
                      setProfileForm({ ...displayProfile, firstName: v })
                    }
                    required
                  />
                  <Field
                    label="Last name"
                    value={displayProfile.lastName}
                    onChange={(v) => setProfileForm({ ...displayProfile, lastName: v })}
                  />
                </div>
                <Field
                  label="Email"
                  type="email"
                  value={displayProfile.email}
                  onChange={(v) => setProfileForm({ ...displayProfile, email: v })}
                  required
                />
                <Field
                  label="Phone"
                  type="tel"
                  value={displayProfile.phone}
                  onChange={(v) => setProfileForm({ ...displayProfile, phone: v })}
                />
                <button
                  type="submit"
                  className="bg-velvet-texture h-12 rounded-full px-8 font-label text-[11px] tracking-[0.2em] text-ivory"
                >
                  Save details
                </button>
              </form>
            )}

            {tab === 'addresses' && (
              <div className="space-y-10">
                <div>
                  <h2 className="font-display text-3xl text-ink">Saved addresses</h2>
                  <p className="mt-2 text-sm font-light text-ink/80">
                    Select a default address for faster checkout.
                  </p>
                  {addresses.length === 0 ? (
                    <p className="mt-6 text-sm font-light text-ink/85">No addresses saved yet.</p>
                  ) : (
                    <ul className="mt-6 grid gap-4 md:grid-cols-2">
                      {addresses.map((address) => {
                        const selected = address.id === selectedAddressId || address.isDefault;
                        return (
                          <li
                            key={address.id}
                            className={`border px-5 py-5 ${
                              selected ? 'border-burgundy bg-pearl' : 'border-ink/10'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="font-label text-[10px] text-gold">{address.label}</p>
                                <p className="mt-2 text-sm text-ink">{address.fullName}</p>
                                <p className="mt-1 text-sm font-light text-ink/85">
                                  {address.line1}
                                  {address.line2 ? `, ${address.line2}` : ''}
                                </p>
                                <p className="text-sm font-light text-ink/85">
                                  {address.city}, {address.state} {address.postal}
                                </p>
                                <p className="text-sm font-light text-ink/85">{address.country}</p>
                                <p className="mt-2 text-xs text-ink/80">{address.phone}</p>
                              </div>
                              {selected && (
                                <span className="font-label text-[9px] tracking-[0.14em] text-burgundy">
                                  Selected
                                </span>
                              )}
                            </div>
                            <div className="mt-4 flex flex-wrap gap-3 text-[11px] tracking-[0.14em] uppercase">
                              {!selected && (
                                <button
                                  type="button"
                                  onClick={() => selectAddress(address.id)}
                                  className="text-ink/80 hover:text-burgundy"
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
                                className="text-ink/80 hover:text-burgundy"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => removeAddress(address.id)}
                                className="text-ink/80 hover:text-burgundy"
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
                  className="max-w-2xl space-y-5 border-t border-ink/10 pt-8"
                  onSubmit={(event) => {
                    event.preventDefault();
                    if (editingAddressId) {
                      updateAddress(editingAddressId, addressForm);
                      setNotice('Address updated.');
                    } else {
                      addAddress(addressForm);
                      setNotice('Address saved.');
                    }
                    setEditingAddressId(null);
                    setAddressForm(emptyAddress);
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
                  <label className="flex items-center gap-3 text-sm text-ink/80">
                    <input
                      type="checkbox"
                      checked={addressForm.isDefault}
                      onChange={(event) =>
                        setAddressForm((f) => ({ ...f, isDefault: event.target.checked }))
                      }
                    />
                    Set as default / selected address
                  </label>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="submit"
                      className="bg-velvet-texture h-12 rounded-full px-8 font-label text-[11px] tracking-[0.2em] text-ivory"
                    >
                      {editingAddressId ? 'Update address' : 'Save address'}
                    </button>
                    {editingAddressId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingAddressId(null);
                          setAddressForm(emptyAddress);
                        }}
                        className="h-12 px-4 font-label text-[11px] tracking-[0.16em] text-ink/85"
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
                onSubmit={(event) => {
                  event.preventDefault();
                  setError('');
                  setNotice('');
                  if (passwordForm.next !== passwordForm.confirm) {
                    setError('New passwords do not match.');
                    return;
                  }
                  const result = changePassword(passwordForm.current, passwordForm.next);
                  if (!result.ok) {
                    setError(result.error);
                    return;
                  }
                  setPasswordForm({ current: '', next: '', confirm: '' });
                  setNotice('Password updated for this demo account.');
                }}
              >
                <h2 className="font-display text-3xl text-ink">Manage password</h2>
                <p className="text-sm font-light text-ink/80">
                  Demo only — passwords are stored locally in this browser.
                </p>
                <Field
                  label="Current password"
                  type="password"
                  required
                  value={passwordForm.current}
                  onChange={(v) => setPasswordForm((f) => ({ ...f, current: v }))}
                />
                <Field
                  label="New password"
                  type="password"
                  required
                  value={passwordForm.next}
                  onChange={(v) => setPasswordForm((f) => ({ ...f, next: v }))}
                />
                <Field
                  label="Confirm new password"
                  type="password"
                  required
                  value={passwordForm.confirm}
                  onChange={(v) => setPasswordForm((f) => ({ ...f, confirm: v }))}
                />
                <button
                  type="submit"
                  className="bg-velvet-texture h-12 rounded-full px-8 font-label text-[11px] tracking-[0.2em] text-ivory"
                >
                  Update password
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="border border-ink/10 bg-pearl px-5 py-6">
      <p className="font-label text-[10px] text-ink/80">{label}</p>
      <p className="font-display mt-2 text-3xl text-ink">{value}</p>
    </div>
  );
}

function OrderRow({ order, detailed = false }) {
  return (
    <li className="border border-ink/10 px-5 py-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-label text-[10px] text-gold">Order {order.id}</p>
          <p className="mt-2 text-sm text-ink">
            {new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
          <p className="mt-1 text-xs font-light text-ink/85">
            {order.status} · {order.paymentMethod}
          </p>
        </div>
        <p className="font-num text-2xl text-ink">{money(order.total)}</p>
      </div>
      {detailed && (
        <ul className="mt-4 space-y-2 border-t border-ink/8 pt-4 text-sm text-ink/80">
          {order.items.map((item) => {
            const product = getProduct(item.slug);
            return (
              <li key={item.id} className="flex justify-between gap-3">
                <span>
                  {product?.name || item.slug} · {item.size} · Qty {item.qty}
                </span>
                {product && <span className="font-num">{money(product.price * item.qty)}</span>}
              </li>
            );
          })}
          {order.shipping && (
            <li className="pt-2 text-xs text-ink/80">
              Ship to {order.shipping.firstName} {order.shipping.lastName}, {order.shipping.address},{' '}
              {order.shipping.city}
            </li>
          )}
          {order.paymentId && (
            <li className="text-xs text-ink/80">Payment ID: {order.paymentId}</li>
          )}
        </ul>
      )}
    </li>
  );
}

function Field({ label, value, onChange, type = 'text', required }) {
  return (
    <label className="block">
      <span className="font-label text-[10px] text-ink/80">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full border-b border-ink/15 bg-transparent py-3 text-[15px] font-light text-ink outline-none"
      />
    </label>
  );
}
