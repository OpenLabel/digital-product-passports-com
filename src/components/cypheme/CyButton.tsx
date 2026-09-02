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

import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { trackButtonConversion, type ConversionAction } from '@/lib/googleAdsTracking';

export type CyButtonVariant = 'primary' | 'outline' | 'gradient';

interface CyButtonProps {
  children: ReactNode;
  to: string;
  variant?: CyButtonVariant;
  className?: string;
  /** Optional Google Ads conversion action fired when the button is clicked. */
  trackAction?: ConversionAction;
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-cy-btn px-7 py-3.5 font-cy-display text-base font-bold transition-all';

const variants: Record<CyButtonVariant, string> = {
  primary: 'bg-cy-orange text-white shadow-cy-btn hover:brightness-105',
  outline: 'border-2 border-cy-orange bg-transparent text-cy-orange hover:bg-cy-tint-warm',
  gradient: 'bg-cy-cta text-white shadow-cy hover:brightness-110',
};

function isExternalUrl(url: string) {
  return /^https?:\/\//i.test(url);
}

export default function CyButton({ children, to, variant = 'primary', className, trackAction }: CyButtonProps) {
  const classes = cn(base, variants[variant], className);
  const external = isExternalUrl(to);

  if (external) {
    // A same-tab navigation cancels in-flight conversion pings, so hold the
    // jump until the tag confirms delivery (or the fallback timer fires).
    const handleExternalClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (!trackAction) return;
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) {
        trackButtonConversion(trackAction);
        return;
      }
      event.preventDefault();
      trackButtonConversion(trackAction, () => {
        window.location.assign(to);
      });
    };

    return (
      <a href={to} className={classes} onClick={handleExternalClick}>
        {children}
      </a>
    );
  }

  return (
    <Link to={to} className={classes} onClick={trackAction ? () => trackButtonConversion(trackAction) : undefined}>
      {children}
    </Link>
  );
}

