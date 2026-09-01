/*
 * Open-Label Digital Product Passport Engine
 * Copyright (C) 2026 Open-Label.eu
 *
 * Licensed under the Open-Label Public License (OLPL) v1.0.
 * See LICENSE and NOTICE files for details.
 */

/**
 * Dedicated, fully enclosed i18n namespace for the Cypheme landing page.
 *
 * These strings live in their own files and their own i18next namespace
 * ("cypheme") so they can never collide with, or corrupt, the main app
 * locales in `src/i18n/locales`.
 */

import bg from './bg.json';
import cs from './cs.json';
import da from './da.json';
import de from './de.json';
import el from './el.json';
import en from './en.json';
import es from './es.json';
import et from './et.json';
import fi from './fi.json';
import fr from './fr.json';
import ga from './ga.json';
import hr from './hr.json';
import hu from './hu.json';
import it from './it.json';
import lt from './lt.json';
import lv from './lv.json';
import mt from './mt.json';
import nl from './nl.json';
import pl from './pl.json';
import pt from './pt.json';
import ro from './ro.json';
import sk from './sk.json';
import sl from './sl.json';
import sv from './sv.json';
import zhCN from './zh-CN.json';

export const CYPHEME_NAMESPACE = 'cypheme';

export const cyphemeResources: Record<string, Record<string, unknown>> = {
  bg, cs, da, de, el, en, es, et, fi, fr, ga, hr, hu, it, lt, lv, mt, nl,
  pl, pt, ro, sk, sl, sv, 'zh-CN': zhCN,
};
