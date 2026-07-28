/*
 * Open-Label Digital Product Passport Engine
 * Copyright (C) 2026 Open-Label.eu
 *
 * Licensed under the Open-Label Public License (OLPL) v1.0.
 * See LICENSE and NOTICE files for details.
 */

/**
 * Normalize an i18next `language` string into the DPP language code used across
 * translation lookups, public views, and the translate-text edge function.
 *
 * Region tags are stripped (e.g. `en-GB` → `en`) EXCEPT for `zh-CN`, which is
 * a first-class supported language and must be preserved verbatim.
 */
export function toDppLanguage(i18nLanguage: string | undefined | null): string {
  if (!i18nLanguage) return 'en';
  if (i18nLanguage.toLowerCase() === 'zh-cn') return 'zh-CN';
  return i18nLanguage.split('-')[0];
}
