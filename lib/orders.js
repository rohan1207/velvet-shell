export function fromDbOrder(row, items = []) {
  if (!row) return null;
  return {
    id: row.id,
    orderNumber: row.order_number,
    createdAt: row.created_at,
    status: mapStatus(row.status),
    total: row.total,
    subtotal: row.subtotal,
    shippingFee: row.shipping_fee,
    email: row.email,
    shipping: row.shipping || {},
    paymentId: row.razorpay_payment_id || row.payments?.[0]?.razorpay_payment_id || null,
    paymentMethod: 'Razorpay',
    items: (items.length ? items : row.order_items || []).map(fromDbItem),
  };
}

function fromDbItem(item) {
  return {
    slug: item.product_slug,
    name: item.product_name,
    image: item.image_url,
    size: item.size,
    metal: item.metal,
    qty: item.qty,
    price: item.unit_price,
    lineTotal: item.line_total,
    customization: Array.isArray(item.customization) ? item.customization : [],
  };
}

function mapStatus(status) {
  const map = {
    pending_payment: 'Pending',
    paid: 'Confirmed',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    refunded: 'Refunded',
  };
  return map[status] || status || 'Confirmed';
}

export function generateOrderNumber() {
  const n = Date.now().toString(36).toUpperCase().slice(-6);
  const r = Math.random().toString(36).toUpperCase().slice(2, 5);
  return `VS-${n}${r}`;
}
