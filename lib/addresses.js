/** Map DB row ↔ client address shape */

export function fromDbAddress(row) {
  if (!row) return null;
  return {
    id: row.id,
    label: row.label || 'Home',
    fullName: row.full_name || '',
    phone: row.phone || '',
    line1: row.line1 || '',
    line2: row.line2 || '',
    city: row.city || '',
    state: row.state || '',
    postal: row.postal || '',
    country: row.country || 'India',
    isDefault: Boolean(row.is_default),
  };
}

export function toDbAddress(body, userId) {
  return {
    user_id: userId,
    label: String(body.label || 'Home').trim() || 'Home',
    full_name: String(body.fullName || body.full_name || '').trim(),
    phone: String(body.phone || '').trim(),
    line1: String(body.line1 || '').trim(),
    line2: String(body.line2 || '').trim(),
    city: String(body.city || '').trim(),
    state: String(body.state || '').trim(),
    postal: String(body.postal || body.pin || '').trim(),
    country: String(body.country || 'India').trim() || 'India',
    is_default: Boolean(body.isDefault ?? body.is_default ?? false),
  };
}

export function validateAddressInput(body) {
  const row = toDbAddress(body, null);
  if (!row.full_name || row.full_name.length < 2) {
    return { ok: false, error: 'Please enter the recipient name.' };
  }
  if (!row.phone || row.phone.replace(/\D/g, '').length < 10) {
    return { ok: false, error: 'Please enter a valid phone number.' };
  }
  if (!row.line1) return { ok: false, error: 'Please enter street address.' };
  if (!row.city) return { ok: false, error: 'Please enter city.' };
  if (!row.state) return { ok: false, error: 'Please enter state.' };
  if (!row.postal || row.postal.length < 4) {
    return { ok: false, error: 'Please enter a valid PIN / postal code.' };
  }
  return { ok: true, data: row };
}
