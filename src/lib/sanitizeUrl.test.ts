/*
 * Open-Label Digital Product Passport Engine
 * Copyright (C) 2026 Open-Label.eu
 * Licensed under OLPL v1.0.
 */
import { describe, it, expect } from 'vitest';
import { sanitizeUrl } from './sanitizeUrl';

describe('sanitizeUrl', () => {
  it('returns # for javascript: URLs', () => {
    expect(sanitizeUrl('javascript:alert(1)')).toBe('#');
    expect(sanitizeUrl('  JavaScript:alert(1)')).toBe('#');
  });
  it('rejects data:, vbscript:, file:', () => {
    expect(sanitizeUrl('data:text/html,x')).toBe('#');
    expect(sanitizeUrl('vbscript:msgbox')).toBe('#');
    expect(sanitizeUrl('file:///etc/passwd')).toBe('#');
  });
  it('preserves http/https/mailto/relative', () => {
    expect(sanitizeUrl('https://x.com')).toBe('https://x.com');
    expect(sanitizeUrl('mailto:a@b.c')).toBe('mailto:a@b.c');
    expect(sanitizeUrl('/foo')).toBe('/foo');
  });
  it('returns # for empty', () => {
    expect(sanitizeUrl('')).toBe('#');
    expect(sanitizeUrl(null)).toBe('#');
    expect(sanitizeUrl(undefined)).toBe('#');
  });
});
