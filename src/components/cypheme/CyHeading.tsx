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
  variant?: 'navy' | 'gradient';
  className?: string;
}

const sizes: Record<1 | 2 | 3, string> = {
  1: 'text-4xl md:text-5xl leading-[1.1]',
  2: 'text-3xl md:text-4xl leading-tight',
  3: 'text-lg md:text-xl leading-snug',
};

export default function CyHeading({
  children,
  level = 2,
  variant = 'navy',
  className,
}: CyHeadingProps) {
  const Tag = (`h${level}` as const) as 'h1' | 'h2' | 'h3';
  return (
    <Tag
      className={cn(
        'font-cy-display font-bold tracking-tight',
        sizes[level],
        variant === 'gradient'
          ? 'bg-cy-cta bg-clip-text text-transparent'
          : 'text-cy-navy',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
