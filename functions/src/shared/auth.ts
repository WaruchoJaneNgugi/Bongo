// Shared auth primitives used by both student and seller sign-in.
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';

export function hashPin(pin: string, salt: string): string {
  return scryptSync(pin, salt, 64).toString('hex');
}

export function pinMatches(pin: string, salt: string, expected: string): boolean {
  const a = Buffer.from(hashPin(pin, salt), 'hex');
  const b = Buffer.from(expected, 'hex');
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Returns the normalised number (spaces stripped) if valid, else null. */
export function cleanKenyanPhone(phone: string): string | null {
  const p = (phone || '').replace(/\s/g, '');
  return /^(\+254|0)[7][0-9]{8}$/.test(p) ? p : null;
}

export function newSalt(): string {
  return randomBytes(16).toString('hex');
}

/** Normalise a Kenyan TSC number, returning the digits if valid, else null.
 *  Numbers are digit-only; length has varied across eras, so accept 5–9 digits. */
export function cleanTscNumber(tsc: string): string | null {
  const t = (tsc || '').trim();
  return /^\d{5,9}$/.test(t) ? t : null;
}
