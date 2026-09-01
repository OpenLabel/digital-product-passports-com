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
 * Google Ads tag (AW-672872996) — manual install, no connector.
 * Loads gtag.js exactly once and exposes page_view / conversion helpers.
 *
 * NOTE: consent handling for regulated regions (EEA/UK/CH) is not yet
 * implemented; see ads tracking plan. Consent setup stays available.
 */

export const GOOGLE_ADS_TAG_ID = 'AW-672872996';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let loaded = false;

/** Inject the gtag.js script and configure the tag. Idempotent. */
export function initGoogleAdsTag(tagId: string = GOOGLE_ADS_TAG_ID): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (loaded) return;
  loaded = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag(...args: unknown[]) {
      window.dataLayer!.push(args);
    };

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(tagId)}`;
  document.head.appendChild(script);

  window.gtag('js', new Date());
  window.gtag('config', tagId);
}

/** Test-only: reset the idempotency guard between tests. */
export function __resetGoogleAdsTagForTests(): void {
  loaded = false;
}

/** Report a SPA route change as a page_view. */
export function trackPageView(path: string, tagId: string = GOOGLE_ADS_TAG_ID): void {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', 'page_view', {
    send_to: tagId,
    page_path: path,
  });
}

/** Fire a conversion event once per browser session. */
export function trackConversionOnce(sendTo: string): void {
  if (typeof window === 'undefined' || !window.gtag) return;
  const key = `ga_conv_${sendTo}`;
  try {
    if (window.sessionStorage.getItem(key)) return;
    window.sessionStorage.setItem(key, '1');
  } catch {
    // sessionStorage unavailable (private mode); fire anyway once per page load
  }
  window.gtag('event', 'conversion', { send_to: sendTo });
}

const AD_PARAMS = ['gclid', 'gclsrc', 'dclid', 'wbraid', 'gbraid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

/**
 * Append current ad click / campaign parameters to a destination URL so
 * cross-page attribution survives the jump (e.g. landing page -> /auth).
 */
export function withAdParams(url: string, currentSearch?: string): string {
  const search =
    currentSearch ?? (typeof window !== 'undefined' ? window.location.search : '');
  if (!search || search.length < 2) return url;
  const params = new URLSearchParams(search);
  const picked = new URLSearchParams();
  for (const key of AD_PARAMS) {
    const value = params.get(key);
    if (value) picked.set(key, value);
  }
  const qs = picked.toString();
  if (!qs) return url;
  const [base, hash] = url.split('#');
  const sep = base.includes('?') ? '&' : '?';
  return `${base}${sep}${qs}${hash ? `#${hash}` : ''}`;
}
