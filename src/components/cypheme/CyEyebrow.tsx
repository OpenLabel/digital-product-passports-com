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
import { cn } from '@/lib/utils';

interface CyEyebrowProps {
  children: ReactNode;
  className?: string;
}

/** Cypheme section eyebrow: short rule + blue uppercase label. */
export default function CyEyebrow({ children, className }: CyEyebrowProps) {
  return (
    <p
      className={cn(
        'flex items-center gap-3 font-cy-display text-sm font-bold uppercase tracking-[0.06em] text-cy-blue',
        className,
      )}
    >
      <span aria-hidden="true" className="h-0.5 w-6 shrink-0 rounded-full bg-cy-blue" />
      {children}
    </p>
  );
}
