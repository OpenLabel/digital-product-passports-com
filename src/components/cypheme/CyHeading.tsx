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

interface CyHeadingProps {
  children: ReactNode;
  level?: 1 | 2 | 3;
  variant?: 'ink' | 'navy' | 'gradient';
  className?: string;
}

const sizes: Record<1 | 2 | 3, string> = {
  1: 'text-[2.75rem] md:text-6xl leading-[1.05]',
  2: 'text-3xl md:text-[2.5rem] leading-[1.15]',
  3: 'text-xl md:text-2xl leading-snug',
};

export default function CyHeading({
  children,
  level = 2,
  variant = 'ink',
  className,
}: CyHeadingProps) {
  const Tag = (`h${level}` as const) as 'h1' | 'h2' | 'h3';
  return (
    <Tag
      className={cn(
        'font-cy-display font-bold tracking-[-0.02em]',
        sizes[level],
        variant === 'gradient'
          ? 'bg-cy-cta bg-clip-text text-transparent'
          : variant === 'navy'
            ? 'text-cy-navy'
            : 'text-cy-ink',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
