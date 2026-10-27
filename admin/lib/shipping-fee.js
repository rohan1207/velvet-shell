/**
 * Mirror of storefront lib/shipping-fee.js — keep in sync.
 * Below ₹3999 → ₹99 · ₹3999 and above → free.
 */
export const FREE_SHIPPING_MIN_INR = 3999;
export const SHIPPING_FEE_INR = 99;

export function shippingFeeForAmount(merchandisePayable) {
  const amount = Math.max(0, Number(merchandisePayable) || 0);
  return amount >= FREE_SHIPPING_MIN_INR ? 0 : SHIPPING_FEE_INR;
}

export function computeOrderMoney({ subtotal, discountAmount = 0 } = {}) {
  const goods = Math.max(0, Number(subtotal) || 0);
  const discount = Math.min(goods, Math.max(0, Number(discountAmount) || 0));
  const merchandisePayable = Math.max(0, goods - discount);
  const shippingFee = shippingFeeForAmount(merchandisePayable);
  const total = merchandisePayable + shippingFee;
  return {
    subtotal: goods,
    discountAmount: discount,
    merchandisePayable,
    shippingFee,
    total,
    freeShipping: shippingFee === 0,
  };
}
