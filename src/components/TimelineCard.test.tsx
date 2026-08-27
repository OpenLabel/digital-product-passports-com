import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TimelineCard from './TimelineCard';

describe('TimelineCard', () => {
  it('renders period, title and body', () => {
    render(<TimelineCard period="2027" title="Battery Passports" body="Battery passports for EVs." />);
    expect(screen.getByText('2027')).toBeInTheDocument();
    expect(screen.getByText('Battery Passports')).toBeInTheDocument();
    expect(screen.getByText('Battery passports for EVs.')).toBeInTheDocument();
  });

  it('uses an article element with a decorative accent bar', () => {
    const { container } = render(<TimelineCard period="2030" title="Most Products" body="By 2030." />);
    expect(container.querySelector('article')).toBeInTheDocument();
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });
});
