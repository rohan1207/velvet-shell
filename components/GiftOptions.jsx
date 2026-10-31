'use client';

import { useEffect, useId, useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { money } from '@/lib/format';

function IconGift({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M4 11h16v10H4V11Zm0 0V8h16v3M12 8v13M12 8c-2 0-3.5-1.2-3.5-2.7S10.2 3 12 4.2C13.8 3 15.5 3.8 15.5 5.3S14 8 12 8Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconChevron({ open, className = 'h-3.5 w-3.5' }) {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      className={`${className} transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
      aria-hidden
    >
      <path
        d="M2.5 4.5 6 8l3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Check({ checked }) {
  return (
    <span
      className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border transition-colors ${
        checked
          ? 'border-burgundy bg-burgundy text-ivory'
          : 'border-ink/20 bg-white text-transparent'
      }`}
      aria-hidden
    >
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
        <path
          d="M2.5 6.2 4.8 8.5 9.5 3.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

/**
 * Compact gift add-ons (Shopify / luxury cart pattern):
 * collapsed summary by default; wrap + note expand only when needed.
 */
export default function GiftOptions({ compact = false, className = '' }) {
  const {
    giftOptions,
    giftWrap,
    setGiftWrap,
    giftMessage,
    setGiftMessage,
    cartGiftWrapFee,
  } = useStore();
  const panelId = useId();

  const showWrap = Boolean(giftOptions?.giftWrapEnabled);
  const showMessage = Boolean(giftOptions?.messageEnabled);
  const hasSelection = giftWrap || Boolean(String(giftMessage || '').trim());

  const [open, setOpen] = useState(hasSelection);
  const [noteOn, setNoteOn] = useState(() => Boolean(String(giftMessage || '').trim()));

  useEffect(() => {
    if (hasSelection) setOpen(true);
  }, [hasSelection]);

  useEffect(() => {
    if (String(giftMessage || '').trim()) setNoteOn(true);
  }, [giftMessage]);

  if (!giftOptions) return null;
  if (!showWrap && !showMessage) return null;

  const maxLen = giftOptions.messageMaxLength || 200;
  const wrapFee = giftOptions.giftWrapFee || cartGiftWrapFee || 25;
  const wrapLabel = (giftOptions.giftWrapLabel || 'Gift wrap').replace(/\?$/, '');
  const messageLabel = (giftOptions.messageLabel || 'Gift message').replace(/\?$/, '');

  function summaryBits() {
    const bits = [];
    if (giftWrap) bits.push(`Wrap +${money(wrapFee)}`);
    if (String(giftMessage || '').trim()) bits.push('Note added');
    return bits;
  }

  function toggleNote(next) {
    setNoteOn(next);
    if (!next) setGiftMessage('');
  }

  const shell = compact
    ? 'rounded-xl border border-ink/10 bg-[#faf7f2]/90'
    : 'rounded-2xl border border-ink/8 bg-[#faf7f2]/70';

  return (
    <div className={`${shell} ${className}`}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full items-center gap-2.5 text-left transition-colors hover:bg-ink/[0.02] ${
          compact ? 'min-h-11 px-3 py-2.5' : 'min-h-12 px-4 py-3'
        }`}
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-burgundy/8 text-burgundy">
          <IconGift className="h-3.5 w-3.5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[13px] font-medium text-ink">
            {hasSelection ? 'Gift options' : 'This is a gift'}
          </span>
          <span className="mt-0.5 block truncate text-[11px] font-light text-ink/55">
            {hasSelection
              ? summaryBits().join(' · ')
              : showWrap
                ? `Wrap from ${money(wrapFee)}${showMessage ? ' · optional note' : ''}`
                : 'Add an optional note'}
          </span>
        </span>
        <IconChevron open={open} className="h-3.5 w-3.5 shrink-0 text-ink/45" />
      </button>

      {open ? (
        <div
          id={panelId}
          className={`space-y-2 border-t border-ink/8 ${compact ? 'px-3 pb-3 pt-2.5' : 'px-4 pb-4 pt-3'}`}
        >
          {showWrap ? (
            <label className="flex min-h-10 cursor-pointer items-center gap-2.5 rounded-lg px-1 py-1.5 hover:bg-white/60">
              <input
                type="checkbox"
                className="sr-only"
                checked={giftWrap}
                onChange={(e) => setGiftWrap(e.target.checked)}
              />
              <Check checked={giftWrap} />
              <span className="min-w-0 flex-1 text-[13px] text-ink">{wrapLabel}</span>
              <span className="font-num shrink-0 text-[12px] text-burgundy">
                +{money(wrapFee)}
              </span>
            </label>
          ) : null}

          {showMessage ? (
            <div>
              <label className="flex min-h-10 cursor-pointer items-center gap-2.5 rounded-lg px-1 py-1.5 hover:bg-white/60">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={noteOn}
                  onChange={(e) => toggleNote(e.target.checked)}
                />
                <Check checked={noteOn} />
                <span className="min-w-0 flex-1 text-[13px] text-ink">{messageLabel}</span>
                {noteOn ? (
                  <span className="font-num shrink-0 text-[11px] text-ink/40">
                    {giftMessage.length}/{maxLen}
                  </span>
                ) : null}
              </label>
              {noteOn ? (
                <textarea
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value.slice(0, maxLen))}
                  rows={compact ? 2 : 3}
                  maxLength={maxLen}
                  placeholder={giftOptions.messagePlaceholder || 'Write a short note…'}
                  className="mt-1 w-full resize-none rounded-lg border border-ink/10 bg-white px-3 py-2 text-[13px] leading-snug text-ink placeholder:text-ink/35 outline-none focus:border-burgundy/30 focus:ring-2 focus:ring-burgundy/10"
                />
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
