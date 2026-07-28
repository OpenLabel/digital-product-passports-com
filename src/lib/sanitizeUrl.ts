/*
 * Open-Label Digital Product Passport Engine
 * Copyright (C) 2026 Open-Label.eu
 *
 * Licensed under the Open-Label Public License (OLPL) v1.0.
 * See LICENSE and NOTICE files for details.
 */

/**
 * Sanitize a URL for use in an anchor `href`. Rejects dangerous schemes such
 * as `javascript:`, `data:`, `vbscript:`, or `file:` and returns `#` instead.
 * Preserves relative URLs and standard http(s)/mailto/tel schemes.
 */
export function sanitizeUrl(url: string | null | undefined): string {
  if (!url) return '#';
  const trimmed = String(url).trim();
  if (!trimmed) return '#';
  // Reject dangerous schemes (case-insensitive, allow leading whitespace/control chars)
  // eslint-disable-next-line no-control-regex
  const normalized = trimmed.replace(/[\u0000-\u001F\u007F]/g, '').toLowerCase();
  if (/^(javascript|data|vbscript|file):/i.test(normalized)) return '#';
  return trimmed;
}
