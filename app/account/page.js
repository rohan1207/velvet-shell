'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
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
  return (
    <Suspense fallback={<AccountShell />}>
      <AccountInner />
    </Suspense>
  );
}

function AccountShell() {
  return (
    <div className="bg-ivory pt-28 pb-24 md:pt-36">
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
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    requestPasswordReset,
    resetPassword,
    orders,
    addresses,
    selectedAddressId,
    addAddress,
    updateAddress,
    removeAddress,
    selectAddress,
    wishlist,
  } = useStore();

  const initialMode = search.get('mode') === 'reset' ? 'reset' : 'enter';
  const [mode, setMode] = useState(initialMode);
  const [tab, setTab] = useState('overview');
  const [authForm, setAuthForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    identifier: '',
    password: '',
    code: '',
    newPassword: '',
    confirmPassword: '',
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
  const [busy, setBusy] = useState(false);
  const [resetStep, setResetStep] = useState('request');

  useEffect(() => {
    if (search.get('mode') === 'reset') {
      setMode('reset');
      setResetStep('code');
    }
  }, [search]);

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

  async function onAuthSubmit(event) {
    event.preventDefault();
    setError('');
    setNotice('');
    setBusy(true);
    try {
      if (mode === 'enter') {
        await login({
          identifier: authForm.identifier,
          password: authForm.password,
        });
        setNotice('Signed in.');
      } else if (mode === 'create') {
        await register({
          fullName: authForm.fullName,
          email: authForm.email,
          phone: authForm.phone,
          password: authForm.password,
        });
        setNotice('Welcome — your account is ready.');
      } else if (mode === 'reset' && resetStep === 'request') {
        await requestPasswordReset(authForm.identifier);
        setResetStep('code');
        setNotice('If that account exists, we emailed a 6-digit code. Enter it below.');
      } else if (mode === 'reset' && resetStep === 'code') {
        if (authForm.newPassword !== authForm.confirmPassword) {
          throw new Error('New passwords do not match.');
        }
        const data = await resetPassword({
          identifier: authForm.identifier,
          code: authForm.code,
          password: authForm.newPassword,
          signIn: true,
        });
        setNotice(data.message || 'Password updated.');
        setMode('enter');
        setResetStep('request');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  }

  if (!ready) {
    return <AccountShell />;
  }

  if (!user) {
    const titles = {
      enter: 'Welcome back',
      create: 'Create account',
      reset: 'Reset password',
    };
    const copy = {
      enter: 'Sign in with your email or phone number and password.',
      create: 'Join Velvet Shell with your name, email, phone, and a secure password.',
      reset:
        resetStep === 'request'
          ? 'Enter the email or phone on your account. We will send a one-time code.'
          : 'Enter the code from your email and choose a new password. You will be signed in after a successful reset.',
    };

    return (
      <div className="bg-ivory pt-28 pb-24 md:pt-36">
        <div className="mx-auto max-w-md px-5">
          <p className="font-label text-gold">Account</p>
          <h1 className="font-display mt-3 text-5xl text-ink">{titles[mode]}</h1>
          <p className="mt-4 text-sm font-light text-ink/80">{copy[mode]}</p>

          <form className="mt-10 space-y-5" onSubmit={onAuthSubmit}>
            {mode === 'create' && (
              <>
                <Field
                  label="Full name"
                  required
                  value={authForm.fullName}
                  onChange={(v) => setAuthForm((f) => ({ ...f, fullName: v }))}
                  autoComplete="name"
                />
                <Field
                  label="Email"
                  type="email"
                  required
                  value={authForm.email}
                  onChange={(v) => setAuthForm((f) => ({ ...f, email: v }))}
                  autoComplete="email"
                />
                <Field
                  label="Phone"
                  type="tel"
                  required
                  value={authForm.phone}
                  onChange={(v) => setAuthForm((f) => ({ ...f, phone: v }))}
                  autoComplete="tel"
                  placeholder="10-digit mobile"
                />
                <Field
                  label="Password"
                  type="password"
                  required
                  value={authForm.password}
                  onChange={(v) => setAuthForm((f) => ({ ...f, password: v }))}
                  autoComplete="new-password"
                  hint="At least 8 characters, with letters and a number."
                />
              </>
            )}

            {mode === 'enter' && (
              <>
                <Field
                  label="Email or phone"
                  required
                  value={authForm.identifier}
                  onChange={(v) => setAuthForm((f) => ({ ...f, identifier: v }))}
                  autoComplete="username"
                />
                <Field
                  label="Password"
                  type="password"
                  required
                  value={authForm.password}
                  onChange={(v) => setAuthForm((f) => ({ ...f, password: v }))}
                  autoComplete="current-password"
                />
              </>
            )}

            {mode === 'reset' && resetStep === 'request' && (
              <Field
                label="Email or phone"
                required
                value={authForm.identifier}
                onChange={(v) => setAuthForm((f) => ({ ...f, identifier: v }))}
                autoComplete="username"
              />
            )}

            {mode === 'reset' && resetStep === 'code' && (
              <>
                <Field
                  label="Email or phone"
                  required
                  value={authForm.identifier}
                  onChange={(v) => setAuthForm((f) => ({ ...f, identifier: v }))}
                />
                <Field
                  label="6-digit code"
                  required
                  value={authForm.code}
                  onChange={(v) => setAuthForm((f) => ({ ...f, code: v.replace(/\D/g, '').slice(0, 6) }))}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                />
                <Field
                  label="New password"
                  type="password"
                  required
                  value={authForm.newPassword}
                  onChange={(v) => setAuthForm((f) => ({ ...f, newPassword: v }))}
                  autoComplete="new-password"
                />
                <Field
                  label="Confirm new password"
                  type="password"
                  required
                  value={authForm.confirmPassword}
                  onChange={(v) => setAuthForm((f) => ({ ...f, confirmPassword: v }))}
                  autoComplete="new-password"
                />
              </>
            )}

            {(notice || error) && (
              <p className={`text-sm ${error ? 'text-burgundy' : 'text-ink/85'}`}>
                {error || notice}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="bg-velvet-texture h-12 w-full rounded-full font-label text-[11px] tracking-[0.2em] text-ivory disabled:opacity-60"
            >
              {busy
                ? 'Please wait…'
                : mode === 'enter'
                  ? 'Sign in'
                  : mode === 'create'
                    ? 'Create account'
                    : resetStep === 'request'
                      ? 'Send reset code'
                      : 'Reset & sign in'}
            </button>
          </form>

          <div className="mt-8 space-y-3">
            {mode === 'enter' && (
              <>
                <button
                  type="button"
                  className="block font-label text-[11px] tracking-[0.16em] text-ink/85 hover:text-burgundy"
                  onClick={() => {
                    setMode('reset');
                    setResetStep('request');
                    setError('');
                    setNotice('');
                  }}
                >
                  Forgot password?
                </button>
                <button
                  type="button"
                  className="block font-label text-[11px] tracking-[0.16em] text-ink/85 hover:text-burgundy"
                  onClick={() => {
                    setMode('create');
                    setError('');
                    setNotice('');
                  }}
                >
                  Need an account? Create one
                </button>
              </>
            )}
            {mode === 'create' && (
              <button
                type="button"
                className="font-label text-[11px] tracking-[0.16em] text-ink/85 hover:text-burgundy"
                onClick={() => {
                  setMode('enter');
                  setError('');
                  setNotice('');
                }}
              >
                Already with us? Sign in
              </button>
            )}
            {mode === 'reset' && (
              <div className="space-y-3">
                {resetStep === 'code' && (
                  <button
                    type="button"
                    className="block font-label text-[11px] tracking-[0.16em] text-ink/85 hover:text-burgundy"
                    onClick={() => {
                      setResetStep('request');
                      setNotice('');
                      setError('');
                    }}
                  >
                    Resend a new code
                  </button>
                )}
                <button
                  type="button"
                  className="block font-label text-[11px] tracking-[0.16em] text-ink/85 hover:text-burgundy"
                  onClick={() => {
                    setMode('enter');
                    setResetStep('request');
                    setError('');
                    setNotice('');
                  }}
                >
                  Back to sign in
                </button>
              </div>
            )}
          </div>
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
              Hello, {user.firstName || user.fullName?.split(' ')[0] || 'there'}
            </h1>
            <p className="mt-2 text-sm font-light text-ink/85">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={async () => {
              await logout();
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
                <button
                  type="submit"
                  disabled={busy}
                  className="bg-velvet-texture h-12 rounded-full px-8 font-label text-[11px] tracking-[0.2em] text-ivory disabled:opacity-60"
                >
                  {busy ? 'Saving…' : 'Save details'}
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
                <p className="text-sm font-light text-ink/80">
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
                <button
                  type="submit"
                  disabled={busy}
                  className="bg-velvet-texture h-12 rounded-full px-8 font-label text-[11px] tracking-[0.2em] text-ivory disabled:opacity-60"
                >
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
  inputMode,
}) {
  return (
    <label className="block">
      <span className="font-label text-[10px] text-ink/80">{label}</span>
      <input
        type={type}
        required={required}
        disabled={disabled}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        onChange={(event) => onChange?.(event.target.value)}
        className="mt-2 w-full border-b border-ink/15 bg-transparent py-3 text-[15px] font-light text-ink outline-none disabled:opacity-60"
      />
      {hint && <span className="mt-2 block text-xs font-light text-ink/70">{hint}</span>}
    </label>
  );
}
