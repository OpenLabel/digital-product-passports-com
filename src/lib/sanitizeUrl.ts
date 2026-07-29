/*
 * Open-Label Digital Product Passport Engine
 * Copyright (C) 2026 Open-Label.eu
 *
 * Licensed under the Open-Label Public License (OLPL) v1.0.
 * See LICENSE and NOTICE files for details.
 */

/**
 * Sanitize a URL for use in an anchor `href`. Uses a strict scheme
 * allowlist: only `http:`, `https:`, `mailto:`, `tel:` and relative /
 * scheme-relative URLs are preserved. Everything else (including
 * `javascript:`, `data:`, `vbscript:`, `file:`, `blob:`, `intent:`,
 * custom schemes, etc.) is rejected — this function returns `'#'` for
 * back-compat so `href` remains a string. Prefer `sanitizeUrlOrNull` at
 * call sites that can omit the anchor.
 */
const ALLOWED_SCHEMES = new Set(['http:', 'https:', 'mailto:', 'tel:']);

export function sanitizeUrlOrNull(url: string | null | undefined): string | null {
  if (!url) return null;
  const raw = String(url);
  // Strip control chars for scheme detection but preserve the original for return.
  // eslint-disable-next-line no-control-regex
  const cleaned = raw.replace(/[\u0000-\u001F\u007F]/g, '').trim();
  if (!cleaned) return null;

  // Relative or scheme-relative URLs (no scheme prefix) are safe as-is.
  // Scheme detection: leading letter followed by letters/digits/+/-/. and a colon
  const schemeMatch = cleaned.match(/^([a-zA-Z][a-zA-Z0-9+\-.]*):/);
  if (!schemeMatch) return cleaned;

  const scheme = schemeMatch[1].toLowerCase() + ':';
  if (ALLOWED_SCHEMES.has(scheme)) return cleaned;
  return null;
}

export function sanitizeUrl(url: string | null | undefined): string {
  return sanitizeUrlOrNull(url) ?? '#';
}
