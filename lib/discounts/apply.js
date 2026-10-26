/**
 * Server-side discount evaluation for cart / checkout.
 * Never trust client-computed totals — re-run this when placing an order.
 */

import { createAdminSupabase } from '@/lib/supabase/admin';
import { allowInsecureTlsIfConfigured } from '@/lib/supabase/tls';

function normalizeCode(code) {
  return String(code || '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '');
}

function isActiveWindow(row, now = new Date()) {
  if (!row) return false;
  if (row.active === false) return false;
  if (row.status && row.status !== 'active') return false;
  if (row.starts_at && new Date(row.starts_at) > now) return false;
  if (row.ends_at && new Date(row.ends_at) < now) return false;
  return true;
}

function moneyOff({ discountType, value }, eligibleSubtotal) {
  const base = Math.max(0, Number(eligibleSubtotal) || 0);
  if (base <= 0) return 0;
  const v = Math.max(0, Number(value) || 0);
  if (discountType === 'fixed') return Math.min(base, Math.round(v));
  // percent
  const pct = Math.min(100, Math.max(0, v));
  return Math.min(base, Math.round((base * pct) / 100));
}

/**
 * @param {Array<{ slug: string, qty: number, price: number, category?: string, collection?: string }>} lines
 * @param {{ scope: string, scope_values?: any[] }} rule
 */
export function eligibleSubtotal(lines, rule) {
  const scope = rule.scope || 'all';
  const values = Array.isArray(rule.scope_values)
    ? rule.scope_values.map((v) => String(v).toLowerCase())
    : [];

  const match = (line) => {
    if (scope === 'all') return true;
    if (scope === 'category') {
      return values.includes(String(line.category || '').toLowerCase());
    }
    if (scope === 'collection') {
      return values.includes(String(line.collection || '').toLowerCase());
    }
    if (scope === 'products') {
      return values.includes(String(line.slug || '').toLowerCase());
    }
    return false;
  };

  return (lines || []).reduce((sum, line) => {
    if (!match(line)) return sum;
    const price = Number(line.price) || 0;
    const qty = Math.max(0, Number(line.qty) || 0);
    return sum + price * qty;
  }, 0);
}

export function cartSubtotal(lines) {
  return (lines || []).reduce((sum, line) => {
    const price = Number(line.price) || 0;
    const qty = Math.max(0, Number(line.qty) || 0);
    return sum + price * qty;
  }, 0);
}

/**
 * Resolve a promo code against cart lines.
 * @returns {{ ok: boolean, error?: string, code?: string, discountId?: string, discountAmount?: number, label?: string, subtotal?: number, payable?: number }}
 */
export async function applyPromoCode({ code, lines, customerEmail }) {
  allowInsecureTlsIfConfigured();
  const normalized = normalizeCode(code);
  if (!normalized) {
    return { ok: false, error: 'Enter a promo code.' };
  }

  const db = createAdminSupabase();
  const { data: row, error } = await db
    .from('discount_codes')
    .select('*')
    .eq('code', normalized)
    .maybeSingle();

  if (error) throw error;
  if (!row || !isActiveWindow(row)) {
    return { ok: false, error: 'This code is not valid or has expired.' };
  }

  const subtotal = cartSubtotal(lines);
  const minOrder = Math.max(0, Number(row.min_order_amount) || 0);
  if (subtotal < minOrder) {
    return {
      ok: false,
      error: `Add items worth at least ₹${minOrder.toLocaleString('en-IN')} to use this code.`,
    };
  }

  if (row.max_uses != null) {
    const { count } = await db
      .from('discount_redemptions')
      .select('id', { count: 'exact', head: true })
      .eq('discount_id', row.id);
    if ((count || 0) >= Number(row.max_uses)) {
      return { ok: false, error: 'This code has reached its usage limit.' };
    }
  }

  if (row.max_uses_per_customer != null && customerEmail) {
    const email = String(customerEmail).trim().toLowerCase();
    const { count } = await db
      .from('discount_redemptions')
      .select('id', { count: 'exact', head: true })
      .eq('discount_id', row.id)
      .eq('customer_email', email);
    if ((count || 0) >= Number(row.max_uses_per_customer)) {
      return { ok: false, error: 'You have already used this code the maximum times.' };
    }
  }

  const eligible = eligibleSubtotal(lines, row);
  if (eligible <= 0) {
    return {
      ok: false,
      error: 'This code does not apply to the items in your bag.',
    };
  }

  const discountAmount = moneyOff(
    { discountType: row.discount_type, value: row.value },
    eligible,
  );
  if (discountAmount <= 0) {
    return { ok: false, error: 'This code does not reduce your total.' };
  }

  const label =
    row.discount_type === 'fixed'
      ? `₹${row.value} off`
      : `${row.value}% off`;

  return {
    ok: true,
    code: row.code,
    discountId: row.id,
    discountAmount,
    label,
    name: row.name || row.code,
    scope: row.scope,
    subtotal,
    payable: Math.max(0, subtotal - discountAmount),
  };
}

export async function recordPromoRedemption({
  discountId,
  orderId,
  orderNumber,
  customerEmail,
  discountAmount,
  orderSubtotal,
  orderTotal,
}) {
  if (!discountId) return;
  allowInsecureTlsIfConfigured();
  const db = createAdminSupabase();
  await db.from('discount_redemptions').insert({
    discount_id: discountId,
    order_id: orderId || null,
    order_number: orderNumber || '',
    customer_email: String(customerEmail || '').toLowerCase(),
    discount_amount: Math.max(0, Number(discountAmount) || 0),
    order_subtotal: Math.max(0, Number(orderSubtotal) || 0),
    order_total: Math.max(0, Number(orderTotal) || 0),
  });
}

function scopeLabel(row) {
  const scope = row.scope || 'all';
  if (scope === 'all') return 'On your full bag';
  if (scope === 'category') return 'On selected categories';
  if (scope === 'collection') return 'On selected collections';
  if (scope === 'products') return 'On selected pieces';
  return '';
}

function offerLabel(row) {
  return row.discount_type === 'fixed' ? `₹${row.value} off` : `${row.value}% off`;
}

async function evaluateRowAgainstCart(db, row, lines, customerEmail) {
  const subtotal = cartSubtotal(lines);
  const minOrder = Math.max(0, Number(row.min_order_amount) || 0);
  if (subtotal < minOrder) {
    return {
      ok: false,
      error: `Add items worth at least ₹${minOrder.toLocaleString('en-IN')} to use this code.`,
    };
  }

  if (row.max_uses != null) {
    const { count } = await db
      .from('discount_redemptions')
      .select('id', { count: 'exact', head: true })
      .eq('discount_id', row.id);
    if ((count || 0) >= Number(row.max_uses)) {
      return { ok: false, error: 'This code has reached its usage limit.' };
    }
  }

  if (row.max_uses_per_customer != null && customerEmail) {
    const email = String(customerEmail).trim().toLowerCase();
    const { count } = await db
      .from('discount_redemptions')
      .select('id', { count: 'exact', head: true })
      .eq('discount_id', row.id)
      .eq('customer_email', email);
    if ((count || 0) >= Number(row.max_uses_per_customer)) {
      return { ok: false, error: 'You have already used this code the maximum times.' };
    }
  }

  const eligible = eligibleSubtotal(lines, row);
  if (eligible <= 0) {
    return { ok: false, error: 'This code does not apply to the items in your bag.' };
  }

  const discountAmount = moneyOff(
    { discountType: row.discount_type, value: row.value },
    eligible,
  );
  if (discountAmount <= 0) {
    return { ok: false, error: 'This code does not reduce your total.' };
  }

  return { ok: true, discountAmount };
}

/**
 * Public list of active promo codes, with eligibility vs current cart.
 */
export async function listAvailablePromos({ lines = [], customerEmail } = {}) {
  allowInsecureTlsIfConfigured();
  const db = createAdminSupabase();
  const { data, error } = await db
    .from('discount_codes')
    .select(
      'id,code,name,description,discount_type,value,scope,scope_values,min_order_amount,max_uses,max_uses_per_customer,starts_at,ends_at,status,active',
    )
    .eq('status', 'active')
    .eq('active', true)
    .order('created_at', { ascending: false })
    .limit(40);

  if (error) throw error;

  const now = new Date();
  const subtotal = cartSubtotal(lines);
  const coupons = [];

  for (const row of data || []) {
    if (!isActiveWindow(row, now)) continue;

    const base = {
      code: row.code,
      name: row.name || row.code,
      description: row.description || '',
      label: offerLabel(row),
      discountType: row.discount_type,
      value: row.value,
      scope: row.scope,
      scopeHint: scopeLabel(row),
      minOrderAmount: Math.max(0, Number(row.min_order_amount) || 0),
      endsAt: row.ends_at || null,
    };

    if (!lines.length) {
      coupons.push({ ...base, eligible: true, discountAmount: 0, reason: '' });
      continue;
    }

    const result = await evaluateRowAgainstCart(db, row, lines, customerEmail);
    if (result.ok) {
      coupons.push({
        ...base,
        eligible: true,
        discountAmount: result.discountAmount,
        reason: '',
      });
    } else {
      coupons.push({
        ...base,
        eligible: false,
        discountAmount: 0,
        reason: result.error || 'Not available for this bag.',
      });
    }
  }

  coupons.sort((a, b) => {
    if (a.eligible !== b.eligible) return a.eligible ? -1 : 1;
    return (b.discountAmount || 0) - (a.discountAmount || 0);
  });

  return { coupons, subtotal };
}
