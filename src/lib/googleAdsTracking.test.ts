/*
 * Open-Label Digital Product Passport Engine
 * Copyright (C) 2026 Open-Label.eu
 *
 * Licensed under the Open-Label Public License (OLPL) v1.0.
 * You may use, modify, and distribute this software under the terms
 * of the OLPL license.
 *
 * Interfaces displaying Digital Product Passports generated using
 * this software must display:
 *
 *     Powered by Open-Label.eu
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  GOOGLE_ADS_TAG_ID,
  initGoogleAdsTag,
  __resetGoogleAdsTagForTests,
  trackPageView,
  trackConversionOnce,
  withAdParams,
} from './googleAdsTracking';

describe('googleAdsTracking', () => {
  beforeEach(() => {
    __resetGoogleAdsTagForTests();
    document.head.innerHTML = '';
    delete window.gtag;
    delete window.dataLayer;
    window.sessionStorage.clear();
  });

  it('targets the connected Google Ads account tag', () => {
    expect(GOOGLE_ADS_TAG_ID).toBe('AW-672872996');
  });

  it('injects gtag.js exactly once with the tag id', () => {
    initGoogleAdsTag();
    initGoogleAdsTag();
    const scripts = document.head.querySelectorAll('script[src*="googletagmanager.com/gtag/js"]');
    expect(scripts).toHaveLength(1);
    expect(scripts[0].getAttribute('src')).toContain(`id=${GOOGLE_ADS_TAG_ID}`);
    expect(window.dataLayer!.length).toBeGreaterThan(0);
  });

  it('sends page_view events with the current path', () => {
    initGoogleAdsTag();
    const calls: unknown[][] = [];
    window.gtag = (...args: unknown[]) => {
      calls.push(args);
    };
    trackPageView('/cypheme/passport?gclid=abc');
    expect(calls).toEqual([
      ['event', 'page_view', { send_to: GOOGLE_ADS_TAG_ID, page_path: '/cypheme/passport?gclid=abc' }],
    ]);
  });

  it('fires a conversion only once per session', () => {
    initGoogleAdsTag();
    const calls: unknown[][] = [];
    window.gtag = (...args: unknown[]) => {
      calls.push(args);
    };
    trackConversionOnce('AW-672872996/label');
    trackConversionOnce('AW-672872996/label');
    expect(calls).toEqual([['event', 'conversion', { send_to: 'AW-672872996/label' }]]);
  });

  it('does not throw when gtag is not loaded', () => {
    expect(() => trackPageView('/x')).not.toThrow();
    expect(() => trackConversionOnce('AW-1/x')).not.toThrow();
  });

  describe('withAdParams', () => {
    const target = 'https://open-label.eu/auth';

    it('forwards gclid and utm parameters', () => {
      const result = withAdParams(target, '?gclid=abc123&utm_source=GoogleAds&utm_medium=Search');
      expect(result).toBe('https://open-label.eu/auth?gclid=abc123&utm_source=GoogleAds&utm_medium=Search');
    });

    it('drops unrelated parameters', () => {
      expect(withAdParams(target, '?gclid=abc&ref=xyz')).toBe(`${target}?gclid=abc`);
    });

    it('returns the URL unchanged when no ad params are present', () => {
      expect(withAdParams(target, '?ref=xyz')).toBe(target);
      expect(withAdParams(target, '')).toBe(target);
    });

    it('appends to an existing query string', () => {
      expect(withAdParams(`${target}?lang=fr`, '?gclid=abc')).toBe(`${target}?lang=fr&gclid=abc`);
    });
  });
});

describe('conversion registry', () => {
  beforeEach(() => {
    __resetGoogleAdsTagForTests();
    document.head.innerHTML = '';
    delete window.gtag;
    delete window.dataLayer;
    window.sessionStorage.clear();
  });

  it('defines all six planned conversion actions', async () => {
    const { CONVERSION_LABELS } = await import('./googleAdsTracking');
    expect(Object.keys(CONVERSION_LABELS).sort()).toEqual([
      'click_openlabel_landing_final_get_dpp',
      'click_openlabel_landing_hero_get_dpp',
      'click_openlabel_landing_prepare_products',
      'click_openlabel_landing_secure_products',
      'click_openlabel_landing_stay_compliant',
      'openlabel_accountcreation',
    ]);
  });

  it('skips button conversions whose label is not yet configured', async () => {
    const { trackButtonConversion } = await import('./googleAdsTracking');
    initGoogleAdsTag();
    const calls: unknown[][] = [];
    window.gtag = (...args: unknown[]) => {
      calls.push(args);
    };
    trackButtonConversion('click_openlabel_landing_hero_get_dpp');
    expect(calls).toEqual([]);
  });

  it('fires button conversions on every click once a label is configured', async () => {
    const mod = await import('./googleAdsTracking');
    (mod.CONVERSION_LABELS as Record<string, string>).click_openlabel_landing_stay_compliant =
      'AW-672872996/btnlabel';
    initGoogleAdsTag();
    const calls: unknown[][] = [];
    window.gtag = (...args: unknown[]) => {
      calls.push(args);
    };
    mod.trackButtonConversion('click_openlabel_landing_stay_compliant');
    mod.trackButtonConversion('click_openlabel_landing_stay_compliant');
    expect(calls).toEqual([
      ['event', 'conversion', { send_to: 'AW-672872996/btnlabel' }],
      ['event', 'conversion', { send_to: 'AW-672872996/btnlabel' }],
    ]);
  });

  it('fires account creation once per session and only when configured', async () => {
    const mod = await import('./googleAdsTracking');
    initGoogleAdsTag();
    const calls: unknown[][] = [];
    window.gtag = (...args: unknown[]) => {
      calls.push(args);
    };
    mod.trackAccountCreation();
    expect(calls).toEqual([]);
    (mod.CONVERSION_LABELS as Record<string, string>).openlabel_accountcreation =
      'AW-672872996/signup';
    mod.trackAccountCreation();
    mod.trackAccountCreation();
    expect(calls).toEqual([['event', 'conversion', { send_to: 'AW-672872996/signup' }]]);
  });
});
