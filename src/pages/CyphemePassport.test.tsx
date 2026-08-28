/*
 * Open-Label Digital Product Passport Engine
 * Copyright (C) 2026 Open-Label.eu
 *
 * Licensed under the Open-Label Public License (OLPL) v1.0.
 * See LICENSE and NOTICE files for details.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CyphemePassport from './CyphemePassport';

function renderPage() {
  return render(
    <BrowserRouter>
      <CyphemePassport />
    </BrowserRouter>,
  );
}

describe('CyphemePassport', () => {
  it('renders the hero heading and a link back to the main page', () => {
    renderPage();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Digital Product Passport/i);
    expect(screen.getByRole('link', { name: /open label/i })).toHaveAttribute('href', '/');
  });

  it('scopes the Cypheme design system to a .cypheme-theme wrapper', () => {
    const { container } = renderPage();
    const themed = container.querySelector('.cypheme-theme');
    expect(themed).toBeInTheDocument();
    // The theme wrapper must be the outermost element: nothing outside it is styled.
    expect(container.firstElementChild).toBe(themed);
  });

  it('injects the Cypheme web fonts only while mounted', () => {
    const { unmount } = renderPage();
    expect(document.getElementById('cypheme-fonts')).toBeInTheDocument();
    unmount();
    expect(document.getElementById('cypheme-fonts')).toBeNull();
  });

  it('renders the regulatory timeline cards', () => {
    renderPage();
    expect(screen.getByText('Battery Passports')).toBeInTheDocument();
    expect(screen.getByText('Most Products')).toBeInTheDocument();
  });

  it('points every CTA at the referral-tagged signup link', () => {
    renderPage();
    const ctas = screen.getAllByRole('link', { name: /DPP|Compliant|Products/i });
    expect(ctas.length).toBeGreaterThan(3);
    ctas.forEach((cta) => expect(cta.getAttribute('href')).toContain('ref=cypheme'));
  });
});
