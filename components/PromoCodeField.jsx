'use client';

import { useEffect, useState } from 'react';
import { money } from '@/lib/format';
import { useStore } from '@/context/StoreContext';

export default function PromoCodeField({ email, compact = false }) {
  const {
    cart,
    promo,
    promoError,
    promoBusy,
    applyPromoCode,
    clearPromo,
    discountAmount,
    getProduct,
    user,
  } = useStore();

  const [code, setCode] = useState(promo?.code || '');
  const [coupons, setCoupons] = useState([]);
  const [listBusy, setListBusy] = useState(false);
  const [listError, setListError] = useState('');
  const [sheetOpen, setSheetOpen] = useState(false);

  const cartKey = cart.map((i) => `${i.slug}:${i.qty}`).join('|');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setListBusy(true);
      setListError('');
      try {
        const items = cart.map((item) => {
          const product = getProduct?.(item.slug);
          return {
            slug: item.slug,
            qty: item.qty,
            price: product?.price ?? item.price ?? 0,
            category: product?.category || '',
            collection: product?.collection || '',
          };
        });
        const res = await fetch('/api/discounts/available', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items,
            email: email || user?.email || '',
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (!res.ok || !data.ok) {
          setCoupons([]);
          setListError(data.error || 'Could not load coupons.');
          return;
        }
        setCoupons(Array.isArray(data.coupons) ? data.coupons : []);
      } catch (err) {
        if (!cancelled) {
          setCoupons([]);
          setListError(err.message || 'Could not load coupons.');
        }
      } finally {
        if (!cancelled) setListBusy(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- cartKey covers bag changes
  }, [cartKey, email, user?.email]);

  useEffect(() => {
    if (!sheetOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sheetOpen]);

  async function onApply(e) {
    e?.preventDefault?.();
    const result = await applyPromoCode(code, email);
    if (result?.ok) setSheetOpen(false);
  }

  async function onPick(couponCode) {
    setCode(couponCode);
    const result = await applyPromoCode(couponCode, email);
    if (result?.ok) setSheetOpen(false);
  }

  if (promo?.code) {
    return (
      <div
        className={`rounded-2xl border border-emerald-200/80 bg-emerald-50/50 ${
          compact ? 'px-3 py-2.5' : 'px-4 py-3'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-label text-[10px] tracking-[0.14em] text-emerald-800 uppercase">
              Coupon applied
            </p>
            <p className="mt-1 truncate font-num text-sm text-ink">
              {promo.code}
              {promo.label ? (
                <span className="text-ink/55"> · {promo.label}</span>
              ) : null}
            </p>
            {discountAmount > 0 ? (
              <p className="mt-0.5 text-xs text-emerald-800">−{money(discountAmount)}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={clearPromo}
            className="font-label shrink-0 text-[10px] tracking-[0.12em] text-ink/55 uppercase hover:text-burgundy"
          >
            Remove
          </button>
        </div>
      </div>
    );
  }

  const eligibleCount = coupons.filter((c) => c.eligible).length;

  return (
    <div className={compact ? 'space-y-2' : 'space-y-3'}>
      <button
        type="button"
        onClick={() => setSheetOpen(true)}
        className={`flex w-full items-center justify-between gap-3 rounded-2xl border border-dashed border-ink/15 bg-white/80 text-left transition hover:border-burgundy/30 ${
          compact ? 'px-3 py-2.5' : 'px-4 py-3'
        }`}
      >
        <div className="min-w-0">
          <p className="font-label text-[10px] tracking-[0.14em] text-ink/55 uppercase">
            Apply coupon
          </p>
          <p className="mt-0.5 truncate text-sm text-ink">
            {listBusy
              ? 'Loading offers…'
              : eligibleCount > 0
                ? `${eligibleCount} offer${eligibleCount === 1 ? '' : 's'} available`
                : coupons.length
                  ? 'Enter a code or browse offers'
                  : 'Have a promo code?'}
          </p>
        </div>
        <span className="font-label shrink-0 text-[10px] tracking-[0.14em] text-burgundy uppercase">
          View
        </span>
      </button>

      {sheetOpen ? (
        <CouponSheet
          code={code}
          setCode={setCode}
          onApply={onApply}
          onPick={onPick}
          onClose={() => setSheetOpen(false)}
          coupons={coupons}
          listBusy={listBusy}
          listError={listError}
          promoBusy={promoBusy}
          promoError={promoError}
          compact={compact}
        />
      ) : null}
    </div>
  );
}

function CouponSheet({
  code,
  setCode,
  onApply,
  onPick,
  onClose,
  coupons,
  listBusy,
  listError,
  promoBusy,
  promoError,
  compact,
}) {
  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close coupons"
        className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Available coupons"
        className={`relative z-10 flex w-full max-h-[88svh] flex-col overflow-hidden bg-[#faf7f3] shadow-[0_-12px_40px_rgba(40,20,24,0.18)] sm:max-h-[min(82svh,36rem)] sm:max-w-md sm:rounded-[1.5rem] sm:shadow-[0_24px_60px_rgba(40,20,24,0.2)] ${
          compact ? 'rounded-t-[1.25rem]' : 'rounded-t-[1.5rem]'
        }`}
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-ink/8 px-4 py-3.5 sm:px-5">
          <div>
            <p className="font-label text-[10px] tracking-[0.16em] text-gold uppercase">
              Coupons
            </p>
            <h3 className="font-display mt-0.5 text-xl text-ink sm:text-2xl">Apply offer</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 text-ink/60 hover:text-burgundy"
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-5">
          <form onSubmit={onApply} className="space-y-2">
            <label className="block">
              <span className="font-label text-[10px] tracking-[0.14em] text-ink/50 uppercase">
                Enter coupon code
              </span>
              <div className="mt-1.5 flex gap-2">
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="ENTER CODE"
                  autoComplete="off"
                  autoCapitalize="characters"
                  className="min-w-0 flex-1 rounded-full border border-ink/10 bg-white px-4 py-3 font-num text-sm tracking-wide uppercase outline-none focus:border-burgundy/40"
                />
                <button
                  type="submit"
                  disabled={promoBusy || !code.trim()}
                  className="shrink-0 rounded-full bg-ink px-4 py-3 font-label text-[10px] tracking-[0.14em] text-ivory uppercase disabled:opacity-50 sm:px-5"
                >
                  {promoBusy ? '…' : 'Apply'}
                </button>
              </div>
            </label>
            {promoError ? <p className="text-xs text-burgundy">{promoError}</p> : null}
          </form>

          <div className="mt-5">
            <p className="font-label text-[10px] tracking-[0.14em] text-ink/50 uppercase">
              Available coupons
            </p>

            {listBusy && !coupons.length ? (
              <p className="mt-3 text-sm text-ink/55">Fetching offers…</p>
            ) : null}
            {listError ? <p className="mt-3 text-xs text-burgundy">{listError}</p> : null}
            {!listBusy && !listError && !coupons.length ? (
              <p className="mt-3 text-sm text-ink/55">No public offers right now.</p>
            ) : null}

            <ul className="mt-3 space-y-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
              {coupons.map((coupon) => (
                <li key={coupon.code}>
                  <CouponCard
                    coupon={coupon}
                    busy={promoBusy}
                    onApply={() => onPick(coupon.code)}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function CouponCard({ coupon, busy, onApply }) {
  const disabled = !coupon.eligible || busy;
  return (
    <div
      className={`overflow-hidden rounded-2xl border bg-white ${
        coupon.eligible ? 'border-ink/10' : 'border-ink/6 opacity-70'
      }`}
    >
      <div className="flex gap-0">
        <div
          className={`flex w-14 shrink-0 flex-col items-center justify-center px-1 py-3 text-center sm:w-16 ${
            coupon.eligible ? 'bg-burgundy text-ivory' : 'bg-ink/10 text-ink/45'
          }`}
        >
          <span className="font-label text-[9px] leading-tight tracking-[0.12em] uppercase">
            {coupon.discountType === 'fixed' ? 'FLAT' : 'SAVE'}
          </span>
          <span className="font-num mt-1 text-sm leading-none sm:text-base">
            {coupon.discountType === 'fixed' ? `₹${coupon.value}` : `${coupon.value}%`}
          </span>
        </div>
        <div className="min-w-0 flex-1 px-3 py-3 sm:px-3.5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate font-num text-sm tracking-wide text-ink uppercase">
                {coupon.code}
              </p>
              <p className="mt-0.5 truncate text-sm text-ink/80">{coupon.name}</p>
            </div>
            <button
              type="button"
              disabled={disabled}
              onClick={onApply}
              className="font-label shrink-0 text-[10px] tracking-[0.14em] text-burgundy uppercase disabled:text-ink/35"
            >
              Apply
            </button>
          </div>
          <p className="mt-1.5 text-[11px] leading-snug text-ink/55">
            {coupon.label}
            {coupon.scopeHint ? ` · ${coupon.scopeHint}` : ''}
            {coupon.minOrderAmount > 0
              ? ` · Min order ${money(coupon.minOrderAmount)}`
              : ''}
          </p>
          {coupon.description ? (
            <p className="mt-1 line-clamp-2 text-[11px] text-ink/45">{coupon.description}</p>
          ) : null}
          {coupon.eligible && coupon.discountAmount > 0 ? (
            <p className="mt-1.5 text-xs text-emerald-800">
              You save {money(coupon.discountAmount)}
            </p>
          ) : null}
          {!coupon.eligible && coupon.reason ? (
            <p className="mt-1.5 text-[11px] text-burgundy/90">{coupon.reason}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
