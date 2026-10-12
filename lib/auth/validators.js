const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

/** Digits only; strip leading 0; keep last 10 for IN mobiles when longer. */
export function normalizePhone(value) {
  const digits = String(value || '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.length > 10 && digits.startsWith('91')) {
    return digits.slice(-10);
  }
  if (digits.length > 10) return digits.slice(-10);
  return digits;
}

export function formatPhoneDisplay(normalized) {
  if (!normalized) return '';
  if (normalized.length === 10) return `+91 ${normalized}`;
  return normalized;
}

export function isEmail(value) {
  return EMAIL_RE.test(normalizeEmail(value));
}

export function isPhoneIdentifier(value) {
  const n = normalizePhone(value);
  return n.length >= 10;
}

export function splitFullName(fullName) {
  const trimmed = String(fullName || '').trim().replace(/\s+/g, ' ');
  if (!trimmed) return { firstName: '', lastName: '', fullName: '' };
  const parts = trimmed.split(' ');
  const firstName = parts[0] || '';
  const lastName = parts.slice(1).join(' ');
  return { firstName, lastName, fullName: trimmed };
}

export function validatePassword(password) {
  const value = String(password || '');
  if (value.length < 8) {
    return { ok: false, error: 'Password must be at least 8 characters.' };
  }
  if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) {
    return { ok: false, error: 'Password must include letters and a number.' };
  }
  return { ok: true };
}

export function validateRegisterInput({ fullName, email, phone, password }) {
  const name = splitFullName(fullName);
  if (!name.fullName || name.fullName.length < 2) {
    return { ok: false, error: 'Please enter your full name.' };
  }
  const normalizedEmail = normalizeEmail(email);
  if (!isEmail(normalizedEmail)) {
    return { ok: false, error: 'Please enter a valid email address.' };
  }
  const phoneNormalized = normalizePhone(phone);
  if (phoneNormalized.length < 10) {
    return { ok: false, error: 'Please enter a valid 10-digit phone number.' };
  }
  const pass = validatePassword(password);
  if (!pass.ok) return pass;

  return {
    ok: true,
    data: {
      fullName: name.fullName,
      firstName: name.firstName,
      lastName: name.lastName,
      email: normalizedEmail,
      phone: formatPhoneDisplay(phoneNormalized),
      phoneNormalized,
      password: String(password),
    },
  };
}

export function publicProfile(row, authUser) {
  if (!row && !authUser) return null;
  const firstName = row?.first_name || '';
  const lastName = row?.last_name || '';
  const fullName =
    row?.full_name ||
    [firstName, lastName].filter(Boolean).join(' ') ||
    '';
  return {
    id: row?.id || authUser?.id || null,
    email: row?.email || authUser?.email || '',
    firstName,
    lastName,
    fullName,
    phone: row?.phone || '',
    role: row?.role || 'customer',
    createdAt: row?.created_at || authUser?.created_at || null,
  };
}
