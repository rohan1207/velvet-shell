'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';

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

/**
 * Floral multi-step login / signup / reset.
 * Modes: enter | create | reset
 * Create steps: details → address
 */
export default function AuthFlow({
  initialMode = 'enter',
  returnUrl = '',
  heading,
  subcopy,
}) {
  const router = useRouter();
  const { login, register, requestPasswordReset, resetPassword, addAddress } = useStore();

  const [mode, setMode] = useState(initialMode === 'reset' ? 'reset' : 'enter');
  const [createStep, setCreateStep] = useState(1);
  const [resetStep, setResetStep] = useState(initialMode === 'reset' ? 'code' : 'request');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    identifier: '',
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    code: '',
    newPassword: '',
  });
  const [address, setAddress] = useState(emptyAddress);

  useEffect(() => {
    if (initialMode === 'reset') {
      setMode('reset');
      setResetStep('code');
    }
  }, [initialMode]);

  function patch(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function patchAddr(key, value) {
    setAddress((a) => ({ ...a, [key]: value }));
  }

  function afterSuccess() {
    const next = returnUrl && returnUrl.startsWith('/') ? returnUrl : '';
    if (next) {
      router.replace(next);
      return;
    }
    router.refresh();
  }

  function switchToCreateFromIdentifier(identifier) {
    const id = String(identifier || '').trim();
    const isEmail = id.includes('@');
    setMode('create');
    setCreateStep(1);
    setError('');
    setNotice('No account yet — let’s create one. Your details are ready below.');
    setForm((f) => ({
      ...f,
      identifier: id,
      email: isEmail ? id : f.email,
      phone: !isEmail ? id : f.phone,
      password: '',
      confirmPassword: '',
    }));
  }

  async function onEnter(e) {
    e.preventDefault();
    setError('');
    setNotice('');
    setBusy(true);
    try {
      await login({ identifier: form.identifier, password: form.password });
      setNotice('Signed in.');
      afterSuccess();
    } catch (err) {
      if (err.data?.code === 'NO_ACCOUNT' || err.status === 404) {
        switchToCreateFromIdentifier(form.identifier || err.data?.identifier);
      } else {
        setError(err.message || 'Could not sign in.');
      }
    } finally {
      setBusy(false);
    }
  }

  async function onCreateDetails(e) {
    e.preventDefault();
    setError('');
    setNotice('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!form.fullName.trim() || form.fullName.trim().length < 2) {
      setError('Please enter your name.');
      return;
    }
    if (!form.email.includes('@')) {
      setError('Please enter a valid email.');
      return;
    }
    if (form.phone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid 10-digit phone.');
      return;
    }
    setAddress((a) => ({
      ...a,
      fullName: a.fullName || form.fullName,
      phone: a.phone || form.phone,
    }));
    setCreateStep(2);
  }

  async function onCreateAccount(e) {
    e.preventDefault();
    setError('');
    setNotice('');
    setBusy(true);
    try {
      await register({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });

      const addrPayload = {
        ...address,
        fullName: address.fullName || form.fullName,
        phone: address.phone || form.phone,
        isDefault: true,
      };
      await addAddress(addrPayload);

      setNotice('Welcome — your account is ready.');
      afterSuccess();
    } catch (err) {
      setError(err.message || 'Could not create account.');
      setCreateStep(1);
    } finally {
      setBusy(false);
    }
  }

  async function onReset(e) {
    e.preventDefault();
    setError('');
    setNotice('');
    setBusy(true);
    try {
      if (resetStep === 'request') {
        await requestPasswordReset(form.identifier);
        setResetStep('code');
        setNotice('If that account exists, we emailed a 6-digit code.');
      } else {
        if (form.newPassword !== form.confirmPassword) {
          throw new Error('New passwords do not match.');
        }
        const data = await resetPassword({
          identifier: form.identifier,
          code: form.code,
          password: form.newPassword,
          signIn: true,
        });
        setNotice(data.message || 'Password updated.');
        afterSuccess();
      }
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  }

  const title =
    heading ||
    (mode === 'enter'
      ? 'Welcome back'
      : mode === 'create'
        ? createStep === 1
          ? 'Create your account'
          : 'Where should we send it?'
        : 'Reset password');

  const copy =
    subcopy ||
    (mode === 'enter'
      ? 'Sign in with email or phone. New here? We’ll guide you.'
      : mode === 'create'
        ? createStep === 1
          ? 'A few details, then your first address — so checkout feels effortless.'
          : 'Saved to your account for every future order.'
        : resetStep === 'request'
          ? 'Enter the email or phone on your account.'
          : 'Enter the code from your email and choose a new password.');

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-burgundy/10 bg-gradient-to-br from-[#faf6f1] via-[#f3ebe3] to-[#efe4da] shadow-[0_24px_80px_rgba(94,6,42,0.08)]">
      <FloralBackdrop />

      <div className="relative z-10 px-6 py-10 sm:px-10 sm:py-12">
        <p className="font-label text-[10px] tracking-[0.28em] text-gold uppercase">Velvet Shell</p>
        <h1 className="font-display mt-3 text-4xl tracking-[-0.03em] text-burgundy sm:text-5xl">
          {title}
        </h1>
        <p className="mt-3 max-w-sm text-sm font-light leading-relaxed text-ink/75">{copy}</p>

        {mode === 'create' && (
          <div className="mt-6 flex items-center gap-3">
            <StepDot active={createStep >= 1} label="You" />
            <div className={`h-px flex-1 ${createStep >= 2 ? 'bg-burgundy/40' : 'bg-ink/15'}`} />
            <StepDot active={createStep >= 2} label="Address" />
          </div>
        )}

        {(notice || error) && (
          <p
            className={`mt-6 rounded-2xl px-4 py-3 text-sm ${
              error ? 'bg-burgundy/8 text-burgundy' : 'bg-shell/10 text-shell'
            }`}
          >
            {error || notice}
          </p>
        )}

        {mode === 'enter' && (
          <form className="mt-8 space-y-5" onSubmit={onEnter}>
            <Field
              label="Email or phone"
              value={form.identifier}
              onChange={(v) => patch('identifier', v)}
              required
              autoComplete="username"
            />
            <PasswordField
              label="Password"
              value={form.password}
              onChange={(v) => patch('password', v)}
              show={showPass}
              onToggle={() => setShowPass((s) => !s)}
              autoComplete="current-password"
              required
            />
            <button type="submit" disabled={busy} className={pillClass}>
              {busy ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        )}

        {mode === 'create' && createStep === 1 && (
          <form className="mt-8 space-y-5" onSubmit={onCreateDetails}>
            <Field
              label="Full name"
              value={form.fullName}
              onChange={(v) => patch('fullName', v)}
              required
              autoComplete="name"
            />
            <Field
              label="Email"
              type="email"
              value={form.email}
              onChange={(v) => patch('email', v)}
              required
              autoComplete="email"
            />
            <Field
              label="Phone"
              type="tel"
              value={form.phone}
              onChange={(v) => patch('phone', v)}
              required
              autoComplete="tel"
              placeholder="10-digit mobile"
            />
            <PasswordField
              label="Password"
              value={form.password}
              onChange={(v) => patch('password', v)}
              show={showPass}
              onToggle={() => setShowPass((s) => !s)}
              autoComplete="new-password"
              required
              hint="At least 8 characters, letters and a number."
            />
            <PasswordField
              label="Confirm password"
              value={form.confirmPassword}
              onChange={(v) => patch('confirmPassword', v)}
              show={showConfirm}
              onToggle={() => setShowConfirm((s) => !s)}
              autoComplete="new-password"
              required
            />
            <button type="submit" disabled={busy} className={pillClass}>
              Next — add address
            </button>
          </form>
        )}

        {mode === 'create' && createStep === 2 && (
          <form className="mt-8 space-y-5" onSubmit={onCreateAccount}>
            <Field
              label="Label"
              value={address.label}
              onChange={(v) => patchAddr('label', v)}
              placeholder="Home / Work"
            />
            <Field
              label="Recipient name"
              value={address.fullName}
              onChange={(v) => patchAddr('fullName', v)}
              required
            />
            <Field
              label="Phone"
              type="tel"
              value={address.phone}
              onChange={(v) => patchAddr('phone', v)}
              required
            />
            <Field
              label="Street address"
              value={address.line1}
              onChange={(v) => patchAddr('line1', v)}
              required
              placeholder="House no., street, landmark"
            />
            <Field
              label="Apartment / floor (optional)"
              value={address.line2}
              onChange={(v) => patchAddr('line2', v)}
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="City"
                value={address.city}
                onChange={(v) => patchAddr('city', v)}
                required
              />
              <Field
                label="State"
                value={address.state}
                onChange={(v) => patchAddr('state', v)}
                required
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="PIN code"
                value={address.postal}
                onChange={(v) => patchAddr('postal', v)}
                required
              />
              <Field
                label="Country"
                value={address.country}
                onChange={(v) => patchAddr('country', v)}
                required
              />
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                className="h-12 rounded-full border border-ink/15 px-6 font-label text-[11px] tracking-[0.16em] text-ink/80"
                onClick={() => setCreateStep(1)}
              >
                Back
              </button>
              <button type="submit" disabled={busy} className={`${pillClass} flex-1 sm:flex-none sm:min-w-[220px]`}>
                {busy ? 'Creating…' : 'Create account'}
              </button>
            </div>
          </form>
        )}

        {mode === 'reset' && (
          <form className="mt-8 space-y-5" onSubmit={onReset}>
            <Field
              label="Email or phone"
              value={form.identifier}
              onChange={(v) => patch('identifier', v)}
              required
            />
            {resetStep === 'code' && (
              <>
                <Field
                  label="6-digit code"
                  value={form.code}
                  onChange={(v) => patch('code', v.replace(/\D/g, '').slice(0, 6))}
                  required
                  inputMode="numeric"
                />
                <PasswordField
                  label="New password"
                  value={form.newPassword}
                  onChange={(v) => patch('newPassword', v)}
                  show={showPass}
                  onToggle={() => setShowPass((s) => !s)}
                  required
                />
                <PasswordField
                  label="Confirm password"
                  value={form.confirmPassword}
                  onChange={(v) => patch('confirmPassword', v)}
                  show={showConfirm}
                  onToggle={() => setShowConfirm((s) => !s)}
                  required
                />
              </>
            )}
            <button type="submit" disabled={busy} className={pillClass}>
              {busy
                ? 'Please wait…'
                : resetStep === 'request'
                  ? 'Send reset code'
                  : 'Reset & sign in'}
            </button>
          </form>
        )}

        <div className="mt-8 space-y-3 border-t border-ink/8 pt-6">
          {mode === 'enter' && (
            <>
              <button
                type="button"
                className="block font-label text-[11px] tracking-[0.16em] text-ink/70 hover:text-burgundy"
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
                className="block font-label text-[11px] tracking-[0.16em] text-ink/70 hover:text-burgundy"
                onClick={() => {
                  setMode('create');
                  setCreateStep(1);
                  setError('');
                  setNotice('');
                }}
              >
                Need an account? Create one
              </button>
            </>
          )}
          {(mode === 'create' || mode === 'reset') && (
            <button
              type="button"
              className="font-label text-[11px] tracking-[0.16em] text-ink/70 hover:text-burgundy"
              onClick={() => {
                setMode('enter');
                setCreateStep(1);
                setResetStep('request');
                setError('');
                setNotice('');
              }}
            >
              Already have an account? Sign in
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const pillClass =
  'bg-velvet-texture inline-flex h-12 w-full items-center justify-center rounded-full px-8 font-label text-[11px] tracking-[0.2em] text-ivory disabled:opacity-60';

function StepDot({ active, label }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-full font-label text-[10px] ${
          active ? 'bg-burgundy text-ivory' : 'bg-ink/10 text-ink/50'
        }`}
      >
        {active ? '✓' : '·'}
      </span>
      <span className={`font-label text-[10px] tracking-[0.14em] ${active ? 'text-burgundy' : 'text-ink/45'}`}>
        {label}
      </span>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required,
  autoComplete,
  placeholder,
  hint,
  inputMode,
}) {
  return (
    <label className="block">
      <span className="font-label text-[10px] tracking-[0.16em] text-ink/55 uppercase">{label}</span>
      <input
        className="mt-2 w-full rounded-2xl border border-ink/10 bg-white/70 px-4 py-3.5 text-sm text-ink outline-none transition focus:border-burgundy/40 focus:bg-white"
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        inputMode={inputMode}
      />
      {hint && <span className="mt-1.5 block text-xs font-light text-ink/55">{hint}</span>}
    </label>
  );
}

function PasswordField({ label, value, onChange, show, onToggle, required, autoComplete, hint }) {
  return (
    <label className="block">
      <span className="font-label text-[10px] tracking-[0.16em] text-ink/55 uppercase">{label}</span>
      <div className="relative mt-2">
        <input
          className="w-full rounded-2xl border border-ink/10 bg-white/70 px-4 py-3.5 pr-12 text-sm text-ink outline-none transition focus:border-burgundy/40 focus:bg-white"
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          autoComplete={autoComplete}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute top-1/2 right-3 -translate-y-1/2 font-label text-[10px] tracking-[0.12em] text-ink/50 hover:text-burgundy"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? 'Hide' : 'Show'}
        </button>
      </div>
      {hint && <span className="mt-1.5 block text-xs font-light text-ink/55">{hint}</span>}
    </label>
  );
}

function FloralBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg
        className="absolute -top-8 -right-6 h-48 w-48 text-burgundy/10"
        viewBox="0 0 200 200"
        fill="currentColor"
      >
        <ellipse cx="100" cy="100" rx="28" ry="48" transform="rotate(0 100 100)" />
        <ellipse cx="100" cy="100" rx="28" ry="48" transform="rotate(40 100 100)" />
        <ellipse cx="100" cy="100" rx="28" ry="48" transform="rotate(80 100 100)" />
        <ellipse cx="100" cy="100" rx="28" ry="48" transform="rotate(120 100 100)" />
        <ellipse cx="100" cy="100" rx="28" ry="48" transform="rotate(160 100 100)" />
        <circle cx="100" cy="100" r="14" className="text-gold/30" fill="currentColor" />
      </svg>
      <svg
        className="absolute -bottom-10 -left-8 h-56 w-56 text-blush/40"
        viewBox="0 0 200 200"
        fill="currentColor"
      >
        <ellipse cx="100" cy="100" rx="32" ry="54" transform="rotate(15 100 100)" />
        <ellipse cx="100" cy="100" rx="32" ry="54" transform="rotate(55 100 100)" />
        <ellipse cx="100" cy="100" rx="32" ry="54" transform="rotate(95 100 100)" />
        <ellipse cx="100" cy="100" rx="32" ry="54" transform="rotate(135 100 100)" />
        <ellipse cx="100" cy="100" rx="32" ry="54" transform="rotate(175 100 100)" />
        <circle cx="100" cy="100" r="16" className="text-gold/25" fill="currentColor" />
      </svg>
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/50 to-transparent" />
    </div>
  );
}
