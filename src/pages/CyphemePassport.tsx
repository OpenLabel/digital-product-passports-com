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
 *
 * See LICENSE and NOTICE files for details.
 */

import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ShieldCheck,
  BadgeCheck,
  Globe,
  Layers,
  Leaf,
  Recycle,
  Wrench,
  ScrollText,
  Battery,
  Shirt,
  Smartphone,
  Puzzle,
  Package,
} from 'lucide-react';
import CyphemeThemeProvider from '@/components/cypheme/CyphemeThemeProvider';
import CySection from '@/components/cypheme/CySection';
import CyHeading from '@/components/cypheme/CyHeading';
import CyButton from '@/components/cypheme/CyButton';
import CyEyebrow from '@/components/cypheme/CyEyebrow';
import CyTimelineCard from '@/components/cypheme/CyTimelineCard';
import CyPassportShowcase, { type CyPassportFact } from '@/components/cypheme/CyPassportShowcase';
import CyComparisonTable, { type CyComparisonRow } from '@/components/cypheme/CyComparisonTable';
import { withAdParams } from '@/lib/googleAdsTracking';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';


/** Same-app account creation page. */
const CTA_TARGET = '/auth';

/** CTA href with ad click / campaign parameters forwarded for attribution. */
function ctaTarget(): string {
  return withAdParams(CTA_TARGET);
}


const factKeys = [
  { key: 'origin', icon: Globe },
  { key: 'materials', icon: Layers },
  { key: 'carbon', icon: Leaf },
  { key: 'recyclability', icon: Recycle },
  { key: 'maintenance', icon: Wrench },
  { key: 'compliance', icon: ScrollText },
] as const;

const timelineKeys = [
  { key: 'batteries', icon: Battery },
  { key: 'textiles', icon: Shirt },
  { key: 'electronics', icon: Smartphone },
  { key: 'toys', icon: Puzzle },
  { key: 'most', icon: Package },
] as const;

const comparisonKeys: Array<{ key: string; status: CyComparisonRow['standardStatus'] }> = [
  { key: 'uniqueId', status: 'ok' },
  { key: 'euCompliance', status: 'ok' },
  { key: 'physical', status: 'no' },
  { key: 'counterfeit', status: 'no' },
  { key: 'supplyChain', status: 'warn' },
  { key: 'trust', status: 'no' },
];

const dppFactKeys = ['origin', 'sustainability', 'repair', 'regulatory'] as const;

const footerLinks = [
  { href: 'https://www.cypheme.com/about-us', key: 'about' },
  { href: 'https://www.cypheme.com/contact-us', key: 'contact' },
  { href: 'https://www.cypheme.com/privacy-policy', key: 'privacy' },
  { href: 'https://www.cypheme.com/terms-of-use', key: 'terms' },
] as const;

export default function CyphemePassport() {
  const { t } = useTranslation('cypheme');

  const passportFacts: CyPassportFact[] = factKeys.map(({ key, icon }) => ({
    icon,
    label: t(`facts.${key}.label`),
    sub: t(`facts.${key}.sub`),
    value: t(`facts.${key}.value`),
  }));

  const comparison: CyComparisonRow[] = comparisonKeys.map(({ key, status }) => ({
    capability: t(`comparison.rows.${key}.capability`),
    standard: t(`comparison.rows.${key}.standard`),
    standardStatus: status,
    cypheme: t(`comparison.rows.${key}.cypheme`),
  }));

  return (
    <CyphemeThemeProvider title={t('meta.title')} description={t('meta.description')} noindex>
      <header className="border-b border-cy-line bg-background">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-5">
          <Link to="/" className="inline-flex items-center gap-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-pill bg-cy-orange font-cy-display text-sm font-bold text-white">
              OL
            </span>
            <span className="font-cy-display text-lg font-semibold text-cy-ink">
              Open Label <span className="font-bold text-cy-orange">.eu</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-cy-grey sm:inline">{t('header.by')}</span>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <CySection tone="plain" innerClassName="grid items-center gap-12 md:grid-cols-2">
          <div>
            <CyHeading level={1}>
              {t('hero.titleLead')}{' '}
              <span className="text-cy-blue">{t('hero.titleHighlight')}</span>
            </CyHeading>
            <p className="mt-6 max-w-xl text-lg text-cy-grey">{t('hero.body')}</p>
            <div className="mt-8">
              <CyButton to={ctaTarget()} trackAction="click_openlabel_landing_hero_get_dpp">
                {t('hero.cta')}
              </CyButton>
            </div>
            <div className="mt-10 flex flex-wrap gap-6 border-t border-cy-line pt-6 text-sm text-cy-ink">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-cy-orange" />
                {t('hero.badgeReady')}
              </span>
              <span className="inline-flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-cy-orange" />
                {t('hero.badgeCompliant')}
              </span>
            </div>
          </div>

          <CyPassportShowcase facts={passportFacts} />
        </CySection>

        {/* What is a DPP */}
        <CySection tone="surface">
          <CyEyebrow>{t('what.eyebrow')}</CyEyebrow>
          <CyHeading className="mt-2">{t('what.title')}</CyHeading>
          <p className="mt-6 text-cy-grey">{t('what.p1')}</p>
          <p className="mt-4 text-cy-grey">{t('what.p2')}</p>
          <ul className="mt-4 list-disc space-y-1 pl-6 text-cy-grey marker:text-cy-grey">
            {dppFactKeys.map((key) => (
              <li key={key}>{t(`what.items.${key}`)}</li>
            ))}
          </ul>
          <p className="mt-4 text-cy-grey">{t('what.p3')}</p>
          <div className="mt-8">
            <CyButton to={ctaTarget()} trackAction="click_openlabel_landing_stay_compliant">
              {t('what.cta')}
            </CyButton>
          </div>
        </CySection>

        {/* Timeline */}
        <CySection tone="plain">
          <CyEyebrow>{t('timeline.eyebrow')}</CyEyebrow>
          <CyHeading className="mt-2">{t('timeline.title')}</CyHeading>
          <h3 className="mt-6 font-cy-display text-xl font-bold text-cy-ink sm:text-2xl">
            {t('timeline.subtitle')}
          </h3>
          <p className="mt-3 text-cy-grey">{t('timeline.body')}</p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {timelineKeys.map(({ key, icon }) => (
              <div
                key={key}
                className="w-full max-w-sm sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)]"
              >
                <CyTimelineCard
                  period={t(`timeline.${key}.period`)}
                  title={t(`timeline.${key}.title`)}
                  body={t(`timeline.${key}.body`)}
                  icon={icon}
                />
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <CyButton to={ctaTarget()} trackAction="click_openlabel_landing_prepare_products">
              {t('timeline.cta')}
            </CyButton>
          </div>
        </CySection>

        {/* Comparison */}
        <CySection tone="surface">
          <CyEyebrow>{t('comparison.eyebrow')}</CyEyebrow>
          <CyHeading className="mt-2">{t('comparison.title')}</CyHeading>
          <p className="mt-4 text-cy-grey">
            {t('comparison.intro')}{' '}
            <strong className="text-cy-ink">{t('comparison.introStrong')}</strong>{' '}
            {t('comparison.introEnd')}
          </p>

          <div className="mt-8">
            <CyComparisonTable
              rows={comparison}
              capabilityLabel={t('comparison.capabilityLabel')}
              standardLabel={t('comparison.standardLabel')}
              cyphemeLabel={t('comparison.cyphemeLabel')}
              recommendedLabel={t('comparison.recommendedLabel')}
            />
          </div>

          <p className="mt-6 text-cy-grey">
            {t('comparison.outro')}{' '}
            <strong className="text-cy-ink">{t('comparison.outroStrong')}</strong>
          </p>
          <div className="mt-8">
            <CyButton to={ctaTarget()} trackAction="click_openlabel_landing_secure_products">
              {t('comparison.cta')}
            </CyButton>
          </div>
        </CySection>

        {/* Final CTA */}
        <CySection tone="plain" innerClassName="px-5 py-8">
          <div className="relative overflow-hidden rounded-[2rem] bg-cy-blue-cta px-4 py-24 text-center shadow-cy">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-3 rounded-[1.5rem] border-2 border-dashed border-white/70"
            />
            <div className="relative z-10">
              <CyHeading variant="onDark" className="italic">
                {t('finalCta.titleLine1')}
                <br />
                {t('finalCta.titleLine2')}
              </CyHeading>
              <div className="mt-10 flex justify-center">
                <CyButton to={ctaTarget()} trackAction="click_openlabel_landing_final_get_dpp">
                  {t('finalCta.cta')}
                </CyButton>
              </div>
            </div>
          </div>
        </CySection>
      </main>

      <footer className="border-t border-cy-line bg-background">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-5 py-8 text-sm text-cy-grey md:flex-row md:items-center md:justify-between">
          <p>{t('footer.tagline')}</p>
          <div className="flex flex-wrap gap-4">
            {footerLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cy-orange"
              >
                {t(`footer.${link.key}`)}
              </a>
            ))}
          </div>
        </div>
        <div className="mx-auto max-w-5xl px-5 pb-8 text-xs text-cy-grey">{t('footer.legal')}</div>
      </footer>
    </CyphemeThemeProvider>
  );
}
