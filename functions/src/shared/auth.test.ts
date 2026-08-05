import { describe, it, expect } from 'vitest';
import { hashPin, pinMatches, cleanKenyanPhone } from './auth.js';

describe('hashPin / pinMatches', () => {
  it('is deterministic for the same pin+salt', () => {
    const salt = 'abc123';
    expect(hashPin('1234', salt)).toBe(hashPin('1234', salt));
  });

  it('matches a correct pin and rejects a wrong one', () => {
    const salt = 'deadbeef';
    const stored = hashPin('4321', salt);
    expect(pinMatches('4321', salt, stored)).toBe(true);
    expect(pinMatches('0000', salt, stored)).toBe(false);
  });

  it('does not throw when the stored hash length differs', () => {
    expect(pinMatches('1234', 'salt', 'short')).toBe(false);
  });
});

describe('cleanKenyanPhone', () => {
  it('accepts 07XXXXXXXX and +2547XXXXXXXX', () => {
    expect(cleanKenyanPhone('0712345678')).toBe('0712345678');
    expect(cleanKenyanPhone('+254712345678')).toBe('+254712345678');
    expect(cleanKenyanPhone('07 1234 5678')).toBe('0712345678');
  });

  it('rejects invalid numbers', () => {
    expect(cleanKenyanPhone('12345')).toBeNull();
    expect(cleanKenyanPhone('0812345678')).toBeNull();
    expect(cleanKenyanPhone('')).toBeNull();
  });
});
