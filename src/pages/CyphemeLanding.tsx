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

import { useEffect } from 'react';
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
  Check,
  X,
  ArrowRight,
  Battery,
  Shirt,
  Smartphone,
  Puzzle,
  Package,
} from 'lucide-react';
import TimelineCard from '@/components/TimelineCard';

const CTA_TARGET = '/?ref=cypheme+ppc';

const passportFacts = [
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

const comparison = [
  { capability: 'Unique product ID', standard: 'Required', cypheme: 'Linked ID' },
  { capability: 'EU compliance', standard: 'Data reqs', cypheme: 'Full + auth' },
  { capability: 'Physical verification', standard: 'Digital only', cypheme: 'Physical + data' },
  { capability: 'Counterfeit protection', standard: 'May appear OK', cypheme: 'Blocked' },
  { capability: 'Supply chain', standard: 'Data unverified', cypheme: 'Full trace' },
  { capability: 'Consumer trust', standard: "Can't verify", cypheme: 'Complete' },
];

function CtaButton({ children }: { children: React.ReactNode }) {
  return (
    <Link
      to={CTA_TARGET}
      className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
    >
      {children}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

export default function CyphemeLanding() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Free EU Digital Product Passport Generator | Cypheme';
    const meta = document.querySelector('meta[name="description"]');
    const previousDescription = meta?.getAttribute('content') ?? null;
    meta?.setAttribute(
      'content',
      'Create fully EU-compliant, product-ready Digital Product Passports online, free of charge. Authenticity verification included by Cypheme.',
    );
    return () => {
      document.title = previousTitle;
      if (previousDescription !== null) meta?.setAttribute('content', previousDescription);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">

      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">OL</span>
            </div>
            <span className="text-lg font-semibold">
              Open Label <span className="font-bold text-primary">.eu</span>
            </span>
          </Link>
          <span className="text-sm text-muted-foreground">by Cypheme</span>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl">
              Get your EU Digital Product Passport{' '}
              <span className="text-primary">free of charge</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Cypheme provides you fully EU-compliant, product-ready DPPs through an online
              generator. No hassle, no compliance headaches, no fees.
            </p>
            <div className="mt-8">
              <CtaButton>Get My DPP Now</CtaButton>
            </div>
            <div className="mt-10 flex flex-wrap gap-6 border-t border-border pt-6 text-sm">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Market-ready Digital Product Passport
              </span>
              <span className="inline-flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-primary" />
                Fully EU-compliant
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-muted/40 p-6">
            <ul className="grid gap-3 sm:grid-cols-2">
              {passportFacts.map(({ icon: Icon, label, sub, value }) => (
                <li key={label} className="rounded-xl bg-background p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Icon className="h-4 w-4 text-primary" />
                    {label}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
                  <p className="mt-2 text-sm font-medium">{value}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* What is a DPP */}
        <section className="border-t border-border bg-muted/30">
          <div className="mx-auto max-w-3xl px-4 py-16 md:py-20">
            <p className="text-sm font-medium uppercase tracking-wide text-primary">
              The regulation you need to know
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              What is a Digital Product Passport?
            </h2>
            <p className="mt-6 text-muted-foreground">
              European Union regulations are introducing Digital Product Passports (DPPs) to improve
              product authenticity, transparency, and sustainability.
            </p>
            <p className="mt-4 text-muted-foreground">
              A Digital Product Passport is a digital identity linked to a physical product that
              tracks key information across its lifecycle, including:
            </p>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              {[
                'Origin and materials',
                'Sustainability metrics (carbon footprint, recyclability)',
                'Repair and maintenance instructions',
                'Regulatory and compliance data',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-muted-foreground">
              Accessible via a simple scan, it gives regulators, supply chain partners, and consumers
              clear traceability and accountability throughout the product's journey.
            </p>
            <div className="mt-8">
              <CtaButton>Stay Compliant</CtaButton>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="mx-auto max-w-5xl px-4 py-16 md:py-20">
          <p className="text-sm font-medium uppercase tracking-wide text-primary">
            Regulatory Timeline
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">Time Is Running Out</h2>
          <p className="mt-2 text-muted-foreground">
            EU Digital Product Passport rollout 2027 to 2030. Regulations are rolling out in phases.
            Brands preparing now do not just comply. They compete.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {timeline.map((item) => (
              <div
                key={`${item.period}-${item.title}`}
                className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)] max-w-sm"
              >
                <TimelineCard
                  period={item.period}
                  title={item.title}
                  body={item.body}
                  icon={item.icon}
                />
              </div>
            ))}
          </div>

          <div className="mt-10">
            <CtaButton>Prepare Your Products Today</CtaButton>
          </div>
        </section>

        {/* Comparison */}
        <section className="border-t border-border bg-muted/30">
          <div className="mx-auto max-w-4xl px-4 py-16 md:py-20">
            <p className="text-sm font-medium uppercase tracking-wide text-primary">
              The limits of the Digital Product Passport
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              Digital Compliance Alone Is Not Enough
            </h2>
            <p className="mt-4 text-muted-foreground">
              Digital Product Passports store and share product data but don't verify the physical
              product. Without authentication, counterfeit or mislabelled items may seem compliant.{' '}
              <strong className="text-foreground">Cypheme's award-winning EU solution</strong>{' '}
              ensures every DPP is backed by verified product authenticity, giving your business full
              traceability and confidence.
            </p>

            <div className="mt-8 overflow-x-auto rounded-xl border border-border bg-background">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold">Capability</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Standard DPP</th>
                    <th scope="col" className="px-4 py-3 font-semibold text-primary">
                      DPP with Cypheme
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row) => (
                    <tr key={row.capability} className="border-b border-border last:border-0">
                      <th scope="row" className="px-4 py-3 font-medium">{row.capability}</th>
                      <td className="px-4 py-3 text-muted-foreground">
                        <span className="inline-flex items-center gap-2">
                          <X className="h-4 w-4 shrink-0 opacity-60" />
                          {row.standard}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-2 font-medium">
                          <Check className="h-4 w-4 shrink-0 text-primary" />
                          {row.cypheme}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-6 text-muted-foreground">
              Digital Product Passports improve transparency.{' '}
              <strong className="text-foreground">
                Cypheme ensures your DPP is trusted, authentic, and fully verified.
              </strong>
            </p>
            <div className="mt-8">
              <CtaButton>Secure Your Products</CtaButton>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="mx-auto max-w-4xl px-4 py-20 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            One click secures authentication + compliance
          </h2>
          <div className="mt-8">
            <CtaButton>Get My DPP Now</CtaButton>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>Secure Digital Product Passports with built-in authentication technology.</p>
          <div className="flex flex-wrap gap-4">
            <a href="https://www.cypheme.com/about-us" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
              About Cypheme
            </a>
            <a href="https://www.cypheme.com/contact-us" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
              Contact Us
            </a>
            <a href="https://www.cypheme.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
              Privacy Policy
            </a>
            <a href="https://www.cypheme.com/terms-of-use" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
              Terms of Use
            </a>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-4 pb-8 text-xs text-muted-foreground">
          © 2026 Cypheme | GDPR Compliant | ISO 27001 Certified · Powered by Open-Label.eu
        </div>
      </footer>
    </div>
  );
}
