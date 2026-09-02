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
 * Consent Mode v2 defaults are pushed before the tag is configured:
 * denied in the regions that require consent (EEA/UK/CH), granted
 * elsewhere. See `@/lib/adsConsent` and the ConsentBanner component.
 */

import { applyStoredConsent, setConsentDefaults } from './adsConsent';

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
  // gtag.js only processes dataLayer entries that are real `arguments`
  // objects — pushing a plain array makes every command a silent no-op.
  if (!window.gtag) {
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
  }


  // Consent defaults MUST be set before the tag is configured.
  setConsentDefaults();
  applyStoredConsent();

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

/**
 * Conversion actions from the approved tracking plan.
 * Values are the Google Ads send-to labels (`AW-672872996/xxxxx`).
 * Empty string = not yet created in Google Ads; events for it are skipped
 * until the label is pasted here.
 */
export const CONVERSION_LABELS = {
  click_openlabel_landing_hero_get_dpp: '',
  click_openlabel_landing_stay_compliant: '',
  click_openlabel_landing_prepare_products: '',
  click_openlabel_landing_secure_products: '',
  click_openlabel_landing_final_get_dpp: '',
  openlabel_accountcreation: '',
} as const;

export type ConversionAction = keyof typeof CONVERSION_LABELS;

/** Fire a button-click conversion (secondary). No-op until its label is set. */
export function trackButtonConversion(action: ConversionAction): void {
  const sendTo = CONVERSION_LABELS[action];
  if (!sendTo) return;
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', 'conversion', { send_to: sendTo });
}

/** Fire the primary account-creation conversion, once per session. */
export function trackAccountCreation(): void {
  const sendTo = CONVERSION_LABELS.openlabel_accountcreation;
  if (!sendTo) return;
  trackConversionOnce(sendTo);
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
