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

export type CyButtonVariant = 'primary' | 'outline' | 'gradient';

interface CyButtonProps {
  children: ReactNode;
  to: string;
  variant?: CyButtonVariant;
  className?: string;
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-cy-btn px-7 py-3.5 font-cy-display text-base font-bold transition-all';

const variants: Record<CyButtonVariant, string> = {
  primary: 'bg-cy-orange text-white shadow-cy hover:brightness-105',
  outline: 'border-2 border-cy-orange bg-transparent text-cy-orange hover:bg-cy-tint-warm',
  gradient: 'bg-cy-cta text-white shadow-cy hover:brightness-110',
};

export default function CyButton({ children, to, variant = 'primary', className }: CyButtonProps) {
  return (
    <Link to={to} className={cn(base, variants[variant], className)}>
      {children}
    </Link>
  );
}
