import { describe, it, expect } from 'vitest';
import { toDppLanguage } from './dppLanguage';

describe('toDppLanguage', () => {
  it('preserves zh-CN verbatim (case-insensitive input)', () => {
    expect(toDppLanguage('zh-CN')).toBe('zh-CN');
    expect(toDppLanguage('zh-cn')).toBe('zh-CN');
  });

  it('strips region for other codes', () => {
    expect(toDppLanguage('en-GB')).toBe('en');
    expect(toDppLanguage('en-US')).toBe('en');
    expect(toDppLanguage('pt-BR')).toBe('pt');
  });

  it('passes through 2-letter codes', () => {
    expect(toDppLanguage('pt')).toBe('pt');
    expect(toDppLanguage('fr')).toBe('fr');
  });

  it('falls back to en for empty/nullish input', () => {
    expect(toDppLanguage('')).toBe('en');
    expect(toDppLanguage(undefined)).toBe('en');
    expect(toDppLanguage(null)).toBe('en');
  });
});
