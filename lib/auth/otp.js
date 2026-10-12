import { createHash, randomInt, timingSafeEqual } from 'crypto';

const OTP_TTL_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export function generateOtpCode() {
  return String(randomInt(100000, 999999));
}

export function hashOtpCode(code) {
  const pepper = process.env.AUTH_OTP_PEPPER || process.env.SUPABASE_SERVICE_ROLE_KEY || 'dev-otp-pepper';
  return createHash('sha256').update(`${pepper}:${code}`).digest('hex');
}

export function otpExpiresAt(from = Date.now()) {
  return new Date(from + OTP_TTL_MS).toISOString();
}

export function safeEqualHash(a, b) {
  const aa = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (aa.length !== bb.length) {
    timingSafeEqual(aa, aa);
    return false;
  }
  return timingSafeEqual(aa, bb);
}

export { OTP_TTL_MS, MAX_ATTEMPTS };
