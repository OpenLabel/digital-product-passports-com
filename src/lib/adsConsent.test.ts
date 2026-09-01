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

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import {
  CONSENT_STORAGE_KEY,
  REGULATED_REGIONS,
  applyStoredConsent,
  clearStoredConsent,
  detectCountry,
  getStoredConsent,
  isRegulatedCountry,
  setConsent,
  setConsentDefaults,
  shouldShowConsentBanner,
} from './adsConsent';

function captureGtag() {
  const calls: unknown[][] = [];
  window.gtag = (...args: unknown[]) => {
    calls.push(args);
  };
  return calls;
}

describe('adsConsent', () => {
  beforeEach(() => {
    window.localStorage.clear();
    delete window.gtag;
    delete window.dataLayer;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('denies ad signals by default in the regulated regions only', () => {
    const calls = captureGtag();
    setConsentDefaults();
    expect(calls).toHaveLength(2);
    const [regional, global] = calls as [unknown[], unknown[]];
    const regionalPayload = regional[2] as Record<string, unknown>;
    expect(regionalPayload.ad_storage).toBe('denied');
    expect(regionalPayload.ad_user_data).toBe('denied');
    expect(regionalPayload.ad_personalization).toBe('denied');
    expect(regionalPayload.analytics_storage).toBe('denied');
    expect(regionalPayload.region).toEqual([...REGULATED_REGIONS]);
    expect((global[2] as Record<string, unknown>).ad_storage).toBe('granted');
    expect((global[2] as Record<string, unknown>).region).toBeUndefined();
  });

  it('queues consent defaults on dataLayer when gtag is not ready', () => {
    setConsentDefaults();
    expect(window.dataLayer).toHaveLength(2);
  });

  it('stores and applies an acceptance', () => {
    const calls = captureGtag();
    setConsent('granted');
    expect(window.localStorage.getItem(CONSENT_STORAGE_KEY)).toBe('granted');
    expect(calls[0]).toEqual([
      'consent',
      'update',
      {
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
        analytics_storage: 'granted',
      },
    ]);
  });

  it('stores and applies a rejection', () => {
    const calls = captureGtag();
    setConsent('denied');
    expect(getStoredConsent()).toBe('denied');
    expect((calls[0][2] as Record<string, unknown>).ad_storage).toBe('denied');
  });

  it('re-applies a stored decision and can clear it', () => {
    setConsent('granted');
    const calls = captureGtag();
    applyStoredConsent();
    expect(calls).toHaveLength(1);
    clearStoredConsent();
    expect(getStoredConsent()).toBeNull();
    applyStoredConsent();
    expect(calls).toHaveLength(1);
  });

  it('treats EEA, UK, CH and unknown countries as regulated, others not', () => {
    expect(isRegulatedCountry('FR')).toBe(true);
    expect(isRegulatedCountry('gb')).toBe(true);
    expect(isRegulatedCountry('CH')).toBe(true);
    expect(isRegulatedCountry('XX')).toBe(true);
    expect(isRegulatedCountry('T1')).toBe(true);
    expect(isRegulatedCountry(null)).toBe(true);
    expect(isRegulatedCountry('US')).toBe(false);
    expect(isRegulatedCountry('JP')).toBe(false);
  });

  it('reads the country from the Cloudflare trace endpoint', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, text: async () => 'fl=1\nloc=US\ntls=1' }),
    );
    await expect(detectCountry()).resolves.toBe('US');
  });

  it('fails open when the trace endpoint is unavailable', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    await expect(detectCountry()).resolves.toBeNull();
    await expect(shouldShowConsentBanner()).resolves.toBe(true);
  });

  it('fails open on a non-OK trace response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, text: async () => '' }));
    await expect(detectCountry()).resolves.toBeNull();
  });

  it('does not show the banner outside the regulated regions', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, text: async () => 'loc=US' }),
    );
    await expect(shouldShowConsentBanner()).resolves.toBe(false);
  });

  it('does not show the banner once a decision is stored', async () => {
    setConsent('denied');
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    await expect(shouldShowConsentBanner()).resolves.toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
