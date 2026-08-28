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


const CTA_TARGET = 'https://open-label.eu/auth';

const passportFacts: CyPassportFact[] = [
  { icon: Globe, label: 'Origin', sub: 'Country of manufacture', value: 'Made in France' },
  { icon: Layers, label: 'Materials', sub: 'Component breakdown', value: '92% recycled cotton' },
  { icon: Leaf, label: 'Carbon', sub: 'Footprint score', value: '3.2 kg CO₂ eq.' },
  { icon: Recycle, label: 'Recyclability', sub: 'End-of-life rating', value: 'Grade A — fully recyclable' },
  { icon: Wrench, label: 'Maintenance', sub: 'Care instructions', value: 'Dry clean only' },
  { icon: ScrollText, label: 'Compliance', sub: 'Regulatory status', value: 'EU ESPR certified' },
];

const timeline = [
  {
    period: '2027',
    title: 'Battery Passports',
    body: 'Battery passports for electric vehicle and industrial batteries under the EU Battery Regulation.',
    icon: Battery,
  },
  {
    period: '2027–2028',
    title: 'Textiles & Apparel',
    body: 'Digital Product Passports for textiles and apparel improve sustainability, traceability, and circularity across the supply chain.',
    icon: Shirt,
  },
  {
    period: '2028–2030',
    title: 'Electronics & ICT',
    body: 'Electronics and ICT products adopt Digital Product Passports to enhance transparency, repairability, and lifecycle tracking.',
    icon: Smartphone,
  },
  {
    period: '2028–2030',
    title: 'Toys',
    body: 'Toy products are expected to adopt Digital Product Passports to strengthen product safety, traceability, and compliance across the European market.',
    icon: Puzzle,
  },
  {
    period: '2030',
    title: 'Most Products',
    body: 'By 2030, most products sold in the European Union will require a Digital Product Passport under the Ecodesign for Sustainable Products framework.',
    icon: Package,
  },
];

const comparison: CyComparisonRow[] = [
  { capability: 'Unique product ID', standard: 'Required', standardStatus: 'ok', cypheme: 'Linked ID' },
  { capability: 'EU compliance', standard: 'Data reqs', standardStatus: 'ok', cypheme: 'Full + auth' },
  { capability: 'Physical verification', standard: 'Digital only', standardStatus: 'no', cypheme: 'Physical + data' },
  { capability: 'Counterfeit protection', standard: 'May appear OK', standardStatus: 'no', cypheme: 'Blocked' },
  { capability: 'Supply chain', standard: 'Data unverified', standardStatus: 'warn', cypheme: 'Full trace' },
  { capability: 'Consumer trust', standard: "Can't verify", standardStatus: 'no', cypheme: 'Complete' },
];


const dppFacts = [
  'Origin and materials',
  'Sustainability metrics (carbon footprint, recyclability)',
  'Repair and maintenance instructions',
  'Regulatory and compliance data',
];

const footerLinks = [
  { href: 'https://www.cypheme.com/about-us', label: 'About Cypheme' },
  { href: 'https://www.cypheme.com/contact-us', label: 'Contact Us' },
  { href: 'https://www.cypheme.com/privacy-policy', label: 'Privacy Policy' },
  { href: 'https://www.cypheme.com/terms-of-use', label: 'Terms of Use' },
];

export default function CyphemePassport() {
  return (
    <CyphemeThemeProvider
      title="EU Digital Product Passport with Authentication | Cypheme"
      description="Cypheme delivers EU-compliant Digital Product Passports backed by physical authenticity verification — free to create, ready for the market."
    >
      <header className="border-b border-cy-line bg-background">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5">
          <Link to="/" className="inline-flex items-center gap-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-pill bg-cy-orange font-cy-display text-sm font-bold text-white">
              OL
            </span>
            <span className="font-cy-display text-lg font-semibold text-cy-ink">
              Open Label <span className="font-bold text-cy-orange">.eu</span>
            </span>
          </Link>
          <span className="text-sm text-cy-grey">by Cypheme</span>
        </div>
      </header>

      <main>
        {/* Hero */}
        <CySection tone="plain" innerClassName="grid items-center gap-12 md:grid-cols-2">
          <div>
            <CyHeading level={1}>
              Get your EU Digital Product Passport{' '}
              <span className="text-cy-blue">free of charge</span>
            </CyHeading>
            <p className="mt-6 max-w-xl text-lg text-cy-grey">
              Cypheme provides you fully EU-compliant, product-ready DPPs through an online
              generator. No hassle, no compliance headaches, no fees.
            </p>
            <div className="mt-8">
              <CyButton to={CTA_TARGET}>Get My DPP Now</CyButton>
            </div>
            <div className="mt-10 flex flex-wrap gap-6 border-t border-cy-line pt-6 text-sm text-cy-ink">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-cy-orange" />
                Market-ready Digital Product Passport
              </span>
              <span className="inline-flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-cy-orange" />
                Fully EU-compliant
              </span>
            </div>
          </div>

          <CyPassportShowcase facts={passportFacts} />
        </CySection>

        {/* What is a DPP */}
        <CySection tone="surface">
          <CyEyebrow>The regulation you need to know</CyEyebrow>
          <CyHeading className="mt-2">What is a Digital Product Passport?</CyHeading>
          <p className="mt-6 text-cy-grey">
            European Union regulations are introducing Digital Product Passports (DPPs) to improve
            product authenticity, transparency, and sustainability.
          </p>
          <p className="mt-4 text-cy-grey">
            A Digital Product Passport is a digital identity linked to a physical product that tracks
            key information across its lifecycle, including:
          </p>
          <ul className="mt-4 list-disc space-y-1 pl-6 text-cy-grey marker:text-cy-grey">
            {dppFacts.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-4 text-cy-grey">
            Accessible via a simple scan, it gives regulators, supply chain partners, and consumers
            clear traceability and accountability throughout the product's journey.
          </p>
          <div className="mt-8">
            <CyButton to={CTA_TARGET}>Stay Compliant</CyButton>
          </div>
        </CySection>

        {/* Timeline */}
        <CySection tone="plain">
          <CyEyebrow>Regulatory Timeline</CyEyebrow>
          <CyHeading className="mt-2">Time Is Running Out</CyHeading>
          <h3 className="mt-6 font-cy-display text-xl font-bold text-cy-ink sm:text-2xl">
            EU Digital Product Passport Rollout 2027 to 2030
          </h3>
          <p className="mt-3 text-cy-grey">
            Regulations are rolling out in phases. Brands preparing now do not just comply. They
            compete.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {timeline.map((item) => (
              <div
                key={`${item.period}-${item.title}`}
                className="w-full max-w-sm sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)]"
              >
                <CyTimelineCard
                  period={item.period}
                  title={item.title}
                  body={item.body}
                  icon={item.icon}
                />
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <CyButton to={CTA_TARGET}>Prepare Your Products Today</CyButton>
          </div>
        </CySection>

        {/* Comparison */}
        <CySection tone="surface">
          <CyEyebrow>The limits of the Digital Product Passport</CyEyebrow>
          <CyHeading className="mt-2">Digital Compliance Alone Is Not Enough</CyHeading>
          <p className="mt-4 text-cy-grey">
            Digital Product Passports store and share product data but don't verify the physical
            product. Without authentication, counterfeit or mislabelled items may seem compliant.{' '}
            <strong className="text-cy-ink">Cypheme's award-winning EU solution</strong> ensures
            every DPP is backed by verified product authenticity, giving your business full
            traceability and confidence.
          </p>

          <div className="mt-8">
            <CyComparisonTable
              rows={comparison}
              capabilityLabel="Capability"
              standardLabel="Standard Digital Product Passport"
              cyphemeLabel="DPP with Cypheme"
              recommendedLabel="Recommended"
            />
          </div>


          <p className="mt-6 text-cy-grey">
            Digital Product Passports improve transparency.{' '}
            <strong className="text-cy-ink">
              Cypheme ensures your DPP is trusted, authentic, and fully verified.
            </strong>
          </p>
          <div className="mt-8">
            <CyButton to={CTA_TARGET}>Secure Your Products</CyButton>
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
                One click secures
                <br />
                authentication + compliance
              </CyHeading>
              <div className="mt-10 flex justify-center">
                <CyButton to={CTA_TARGET}>Get My DPP Now</CyButton>
              </div>
            </div>
          </div>
        </CySection>
      </main>

      <footer className="border-t border-cy-line bg-background">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-5 py-8 text-sm text-cy-grey md:flex-row md:items-center md:justify-between">
          <p>Secure Digital Product Passports with built-in authentication technology.</p>
          <div className="flex flex-wrap gap-4">
            {footerLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cy-orange"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <div className="mx-auto max-w-5xl px-5 pb-8 text-xs text-cy-grey">
          © 2026 Cypheme | GDPR Compliant | ISO 27001 Certified · Powered by Open-Label.eu
        </div>
      </footer>
    </CyphemeThemeProvider>
  );
}
