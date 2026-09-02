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

/**
 * Region-gated advertising consent (Google Consent Mode v2).
 *
 * Defaults deny ad/analytics storage in the regions that require consent
 * (EEA + UK + CH) and grant it everywhere else. A banner is shown only to
 * visitors in those regions, and lifts the denial when they accept.
 * Country detection reads Cloudflare's same-origin /cdn-cgi/trace and
 * fails open (banner shown) on any doubt.
 */

export const CONSENT_STORAGE_KEY = 'openlabel_ads_consent';

export type ConsentDecision = 'granted' | 'denied';

/** EEA (EU 27 + EFTA) + United Kingdom + Switzerland. */
export const REGULATED_REGIONS = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR',
  'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK',
  'SI', 'ES', 'SE', 'IS', 'LI', 'NO', 'CH', 'GB',
] as const;

const AD_SIGNALS = {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
} as const;

function gtag(...args: unknown[]): void {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  if (window.gtag) {
    window.gtag(...args);
  } else {
    // gtag.js ignores plain arrays: push a real `arguments` object.
    (function pushArgs() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    }).apply(null, args as []);
  }
}


/**
 * Push Consent Mode defaults. MUST run before the tag is configured.
 * Denied in the regulated regions, granted elsewhere.
 */
export function setConsentDefaults(): void {
  if (typeof window === 'undefined') return;
  gtag('consent', 'default', {
    ...AD_SIGNALS,
    region: [...REGULATED_REGIONS],
    wait_for_update: 500,
  });
  gtag('consent', 'default', {
    ad_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
    analytics_storage: 'granted',
  });
}

/** Read the visitor's stored decision, if any. */
export function getStoredConsent(): ConsentDecision | null {
  if (typeof window === 'undefined') return null;
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return value === 'granted' || value === 'denied' ? value : null;
  } catch {
    return null;
  }
}

/** Persist and apply a decision. */
export function setConsent(decision: ConsentDecision): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, decision);
  } catch {
    // storage unavailable (private mode): the choice applies for this page load only
  }
  gtag('consent', 'update', {
    ad_storage: decision,
    ad_user_data: decision,
    ad_personalization: decision,
    analytics_storage: decision,
  });
}

/** Re-apply a previously stored decision on a later visit. */
export function applyStoredConsent(): void {
  const stored = getStoredConsent();
  if (stored) setConsent(stored);
}

/** Clear the stored decision so the visitor can choose again. */
export function clearStoredConsent(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function isRegulatedCountry(code: string | null): boolean {
  if (!code) return true; // fail open: unknown country -> ask for consent
  const upper = code.toUpperCase();
  if (upper === 'XX' || upper === 'T1') return true; // unknown / Tor
  return (REGULATED_REGIONS as readonly string[]).includes(upper);
}

/**
 * Resolve the visitor's country client-side via Cloudflare's same-origin
 * trace endpoint. Returns null on any failure (caller fails open).
 */
export async function detectCountry(timeoutMs = 2000): Promise<string | null> {
  if (typeof fetch === 'undefined') return null;
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
  try {
    const response = await fetch('/cdn-cgi/trace', {
      signal: controller?.signal,
      cache: 'no-store',
    });
    if (!response.ok) return null;
    const text = await response.text();
    const match = /^loc=([A-Z]{2})$/m.exec(text.trim());
    return match ? match[1] : null;
  } catch {
    return null;
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/** True when the banner must be shown to this visitor. */
export async function shouldShowConsentBanner(): Promise<boolean> {
  if (getStoredConsent()) return false;
  const country = await detectCountry();
  return isRegulatedCountry(country);
}
