/**
 * Delhivery helpers shared by storefront webhooks / tracking links.
 */

export function trackingUrlForAwb(awb) {
  const waybill = String(awb || '').trim();
  if (!waybill) return '';
  return `https://www.delhivery.com/track/package/${encodeURIComponent(waybill)}`;
}

/**
 * Map Delhivery webhook / scan status → our order_status enum (+ shipment_status label).
 */
export function mapDelhiveryStatus(statusRaw) {
  const s = String(statusRaw || '')
    .toLowerCase()
    .trim();

  if (!s) return { dbStatus: null, label: '' };

  if (/\bdelivered\b/.test(s) && !/\brto\b/.test(s)) {
    return { dbStatus: 'delivered', label: 'Delivered' };
  }
  if (/\brto\b/.test(s)) {
    // Keep shipped locally; surface carrier label for admin
    return { dbStatus: null, label: statusRaw };
  }
  if (/out\s*for\s*delivery|ofd/.test(s)) {
    return { dbStatus: 'shipped', label: 'Out for Delivery' };
  }
  if (/in\s*transit|pending|manifest|dispatched|left.origin|reached|transit/.test(s)) {
    return { dbStatus: 'shipped', label: statusRaw || 'In Transit' };
  }
  if (/ndr|exception|failed/.test(s)) {
    return { dbStatus: null, label: statusRaw };
  }

  return { dbStatus: null, label: statusRaw };
}

/** Normalize webhook body (object or array) → list of events. */
export function normalizeWebhookEvents(body) {
  if (!body) return [];
  if (Array.isArray(body)) return body;
  if (Array.isArray(body.Shipment)) return body.Shipment;
  if (Array.isArray(body.shipments)) return body.shipments;
  return [body];
}

export function extractEventFields(event) {
  const awb =
    event?.waybill ||
    event?.Waybill ||
    event?.AWB ||
    event?.wbn ||
    event?.Shipment?.AWB ||
    '';
  const status =
    event?.status ||
    event?.Status ||
    event?.Scan ||
    event?.ShipmentStatus ||
    event?.Shipment?.Status ||
    event?.status_type ||
    '';
  const orderId =
    event?.order ||
    event?.Order ||
    event?.order_id ||
    event?.refnum ||
    event?.Shipment?.Order ||
    '';
  return {
    awb: String(awb || '').trim(),
    status: String(status || '').trim(),
    orderId: String(orderId || '').trim(),
  };
}
