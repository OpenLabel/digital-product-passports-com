import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: 'en', changeLanguage: vi.fn() } }),
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      // Immediately fire PASSWORD_RECOVERY so the gated form is rendered.
      onAuthStateChange: vi.fn((cb: (event: string) => void) => {
        cb('PASSWORD_RECOVERY');
        return { data: { subscription: { unsubscribe: vi.fn() } } };
      }),
      updateUser: vi.fn(),
    },
  },
}));

vi.mock('@/components/LanguageSwitcher', () => ({
  LanguageSwitcher: () => <div data-testid="lang-switcher" />,
}));

import ResetPassword from './ResetPassword';

describe('ResetPassword page', () => {
  it('renders without crashing', () => {
    render(<MemoryRouter><ResetPassword /></MemoryRouter>);
    expect(screen.getByText('auth.setNewPassword')).toBeInTheDocument();
  });

  it('shows password fields once a recovery session is delivered', () => {
    render(<MemoryRouter><ResetPassword /></MemoryRouter>);
    expect(screen.getByLabelText('auth.newPassword')).toBeInTheDocument();
    expect(screen.getByLabelText('auth.confirmPassword')).toBeInTheDocument();
  });

  it('shows submit button once a recovery session is delivered', () => {
    render(<MemoryRouter><ResetPassword /></MemoryRouter>);
    expect(screen.getByText('auth.updatePassword')).toBeInTheDocument();
  });
});
