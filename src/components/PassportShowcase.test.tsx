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

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Globe, Leaf } from 'lucide-react';
import PassportShowcase from './PassportShowcase';

const facts = [
  { icon: Globe, label: 'Origin', sub: 'Country of manufacture', value: 'Made in France' },
  { icon: Leaf, label: 'Carbon', sub: 'Footprint score', value: '3.2 kg CO₂ eq.' },
];

describe('PassportShowcase', () => {
  it('renders the passport card and every fact tag', () => {
    render(<PassportShowcase facts={facts} />);
    expect(screen.getByText(/by Cypheme/i)).toBeInTheDocument();
    expect(screen.getAllByText('Origin').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Made in France').length).toBeGreaterThan(0);
  });

  it('lets the user switch the animated mobile tag', () => {
    render(<PassportShowcase facts={facts} />);
    fireEvent.click(screen.getByRole('button', { name: 'Carbon' }));
    expect(screen.getAllByText('3.2 kg CO₂ eq.').length).toBeGreaterThan(0);
  });
});
