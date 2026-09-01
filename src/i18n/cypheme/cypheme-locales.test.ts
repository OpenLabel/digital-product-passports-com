import { describe, it, expect } from 'vitest';
import { cyphemeResources, CYPHEME_NAMESPACE } from './index';
import enApp from '../locales/en.json';

type Obj = Record<string, unknown>;

function flatten(obj: Obj, prefix = ''): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) Object.assign(out, flatten(v as Obj, key));
    else if (typeof v === 'string') out[key] = v;
  }
  return out;
}

const enFlat = flatten(cyphemeResources.en as Obj);
const codes = Object.keys(cyphemeResources).filter((c) => c !== 'en');

describe('Cypheme landing locales', () => {
  it('covers all 25 supported languages', () => {
    expect(Object.keys(cyphemeResources)).toHaveLength(25);
  });

  it('uses a dedicated namespace name', () => {
    expect(CYPHEME_NAMESPACE).toBe('cypheme');
  });

  it('does not collide with main app translation keys', () => {
    const appTop = new Set(Object.keys(enApp as Obj));
    // The cypheme bundle is a separate namespace; ensure the two are not merged
    // by checking the landing keys are absent from the main English bundle.
    for (const key of Object.keys(cyphemeResources.en as Obj)) {
      expect(appTop.has(key) && key !== 'landing').toBe(false);
    }
  });

  it.each(codes)("locale '%s' has the same keys as English", (code) => {
    const flat = flatten(cyphemeResources[code] as Obj);
    const missing = Object.keys(enFlat).filter((k) => !(k in flat));
    const extra = Object.keys(flat).filter((k) => !(k in enFlat));
    expect(missing, `missing: ${missing.join(', ')}`).toHaveLength(0);
    expect(extra, `extra: ${extra.join(', ')}`).toHaveLength(0);
  });

  it.each(codes)("locale '%s' has no empty values", (code) => {
    const flat = flatten(cyphemeResources[code] as Obj);
    const empty = Object.entries(flat).filter(([, v]) => v.trim() === '');
    expect(empty.map(([k]) => k)).toHaveLength(0);
  });
});
