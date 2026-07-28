import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string, d?: string) => d || k, i18n: { language: 'en', changeLanguage: vi.fn() } }),
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: { invoke: vi.fn() },
  },
}));

import { CounterfeitProtection } from './CounterfeitProtection';

describe('CounterfeitProtection', () => {
  it('renders disabled state', () => {
    render(
      <CounterfeitProtection
        passportName="Test"
        passportSlug="slug"
        userEmail="test@test.com"
        enabled={false}
        onChange={vi.fn()}
      />
    );
    expect(screen.getByText('Add Counterfeit Protection (optional)')).toBeInTheDocument();
  });

  it('renders enabled state once a request has been sent', () => {
    render(
      <CounterfeitProtection
        passportName="Test"
        passportSlug="slug"
        userEmail="test@test.com"
        enabled={true}
        requestSentAt="2026-01-01T00:00:00.000Z"
        onChange={vi.fn()}
      />
    );
    expect(screen.getByText('Counterfeit Protection Enabled')).toBeInTheDocument();
  });

  it('still shows the enable prompt when enabled but no request has been sent yet', () => {
    render(
      <CounterfeitProtection
        passportName="Test"
        passportSlug={null}
        userEmail="test@test.com"
        enabled={true}
        requestSentAt={null}
        onChange={vi.fn()}
      />
    );
    // BUG-10: email is only dispatched on save, so before the timestamp
    // exists we intentionally stay in the un-sent state.
    expect(screen.getByText('Add Counterfeit Protection (optional)')).toBeInTheDocument();
  });

  it('shows disable button when enabled with a request timestamp', () => {
    render(
      <CounterfeitProtection
        passportName="Test"
        passportSlug="slug"
        userEmail="test@test.com"
        enabled={true}
        requestSentAt="2026-01-01T00:00:00.000Z"
        onChange={vi.fn()}
      />
    );
    expect(screen.getByText('Disable')).toBeInTheDocument();
  });

  it('calls onChange(false) when disable button clicked', () => {
    const onChange = vi.fn();
    render(
      <CounterfeitProtection
        passportName="Test"
        passportSlug="slug"
        userEmail="test@test.com"
        enabled={true}
        requestSentAt="2026-01-01T00:00:00.000Z"
        onChange={onChange}
      />
    );
    fireEvent.click(screen.getByText('Disable'));
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it('calls onChange(true) locally when no slug', () => {
    const onChange = vi.fn();
    render(
      <CounterfeitProtection
        passportName="Test"
        passportSlug={null}
        userEmail="test@test.com"
        enabled={false}
        onChange={onChange}
      />
    );
    // Click the enable button
    const enableBtn = screen.getByRole('button');
    fireEvent.click(enableBtn);
    expect(onChange).toHaveBeenCalledWith(true);
  });
});
