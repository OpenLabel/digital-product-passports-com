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

export type CyCardTone = 'plain' | 'warm' | 'cool' | 'surface';

interface CyCardProps {
  children: ReactNode;
  tone?: CyCardTone;
  className?: string;
  as?: 'div' | 'article';
}

const tones: Record<CyCardTone, string> = {
  plain: 'bg-background border-cy-line',
  warm: 'bg-cy-tint-warm border-cy-orange/20',
  cool: 'bg-cy-tint-cool border-cy-blue/20',
  surface: 'bg-cy-surface border-cy-line',
};

export default function CyCard({ children, tone = 'plain', className, as = 'div' }: CyCardProps) {
  const Tag = as;
  return (
    <Tag className={cn('rounded-cy-btn border p-6 shadow-cy', tones[tone], className)}>{children}</Tag>
  );
}
