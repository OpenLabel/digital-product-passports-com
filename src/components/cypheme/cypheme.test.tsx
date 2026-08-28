/*
 * Open-Label Digital Product Passport Engine
 * Copyright (C) 2026 Open-Label.eu
 *
 * Licensed under the Open-Label Public License (OLPL) v1.0.
 * See LICENSE and NOTICE files for details.
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Battery } from 'lucide-react';
import CyButton from './CyButton';
import CyCard from './CyCard';
import CyHeading from './CyHeading';
import CySection from './CySection';
import CyTimelineCard from './CyTimelineCard';
import CyPassportShowcase from './CyPassportShowcase';
import CyComparisonTable from './CyComparisonTable';


describe('Cypheme design system isolation', () => {
  const raw = readFileSync(resolve(process.cwd(), 'src/styles/cypheme.css'), 'utf8');
  const css = raw.replace(/\/\*[\s\S]*?\*\//g, '');

  it('never defines tokens on :root or .dark', () => {
    expect(css).not.toMatch(/:root/);
    expect(css).not.toMatch(/\.dark\b/);
  });


  it('defines every token inside the .cypheme-theme scope', () => {
    expect(css).toMatch(/\.cypheme-theme\s*\{/);
    const scoped = css.slice(css.indexOf('.cypheme-theme'));
    for (const token of ['--cy-orange', '--cy-navy', '--primary', '--radius', '--cy-radius-pill']) {
      expect(scoped).toContain(token);
    }
  });

  it('keeps the app stylesheet free of Cypheme tokens', () => {
    const appCss = readFileSync(resolve(process.cwd(), 'src/index.css'), 'utf8');
    expect(appCss).not.toContain('--cy-');
    expect(appCss).not.toContain('cypheme');
  });
});

describe('Cypheme primitives', () => {
  it('CyButton renders a brand-radius link with the requested variant', () => {
    render(
      <BrowserRouter>
        <CyButton to="/target" variant="outline">
          Go
        </CyButton>
      </BrowserRouter>,
    );
    const link = screen.getByRole('link', { name: 'Go' });
    expect(link).toHaveAttribute('href', '/target');
    expect(link.className).toContain('rounded-cy-btn');
    expect(link.className).toContain('border-cy-orange');
  });

  it('CyButton renders external URLs as an anchor tag', () => {
    render(
      <BrowserRouter>
        <CyButton to="https://open-label.eu/auth">Sign up</CyButton>
      </BrowserRouter>,
    );
    const link = screen.getByRole('link', { name: 'Sign up' });
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', 'https://open-label.eu/auth');
  });

  it('CyHeading renders the requested level and gradient variant', () => {
    const { container } = render(
      <CyHeading level={3} variant="gradient">
        Title
      </CyHeading>,
    );
    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toHaveTextContent('Title');
    expect(container.firstElementChild?.className).toContain('bg-cy-cta');
  });

  it('CySection applies the tone background', () => {
    const { container } = render(<CySection tone="warm">body</CySection>);
    expect(container.querySelector('section')?.className).toContain('bg-cy-tint-warm');
  });

  it('CyCard renders as the requested element', () => {
    const { container } = render(
      <CyCard as="article" tone="cool">
        content
      </CyCard>,
    );
    expect(container.querySelector('article')?.className).toContain('bg-cy-tint-cool');
  });

  it('CyTimelineCard shows period, title and body', () => {
    render(<CyTimelineCard period="2027" title="Batteries" body="Rollout starts." icon={Battery} />);
    expect(screen.getByText('2027')).toBeInTheDocument();
    expect(screen.getByText('Batteries')).toBeInTheDocument();
    expect(screen.getByText('Rollout starts.')).toBeInTheDocument();
  });

  it('CyPassportShowcase renders one dot per fact', () => {
    render(
      <CyPassportShowcase
        facts={[
          { icon: Battery, label: 'A', sub: 'sub a', value: 'val a' },
          { icon: Battery, label: 'B', sub: 'sub b', value: 'val b' },
        ]}
      />,
    );
    expect(screen.getAllByRole('button')).toHaveLength(2);
    expect(screen.getByText('val a')).toBeInTheDocument();
  });

  it('CyComparisonTable renders the recommended badge and every row', () => {
    render(
      <CyComparisonTable
        rows={[
          { capability: 'Supply chain', standard: 'Data unverified', standardStatus: 'warn', cypheme: 'Full trace' },
          { capability: 'Consumer trust', standard: "Can't verify", standardStatus: 'no', cypheme: 'Complete' },
        ]}
        capabilityLabel="Capability"
        standardLabel="Standard Digital Product Passport"
        cyphemeLabel="DPP with Cypheme"
        recommendedLabel="Recommended"
      />,
    );
    expect(screen.getByText('Recommended')).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(3);
    expect(screen.getByText('Full trace')).toBeInTheDocument();
  });
});

