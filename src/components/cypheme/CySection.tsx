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

export type CySectionTone = 'plain' | 'surface' | 'warm' | 'cool' | 'gradient';

interface CySectionProps {
  children: ReactNode;
  tone?: CySectionTone;
  className?: string;
  innerClassName?: string;
}

const tones: Record<CySectionTone, string> = {
  plain: 'bg-background',
  surface: 'bg-cy-surface',
  warm: 'bg-cy-tint-warm',
  cool: 'bg-cy-tint-cool',
  gradient: 'bg-cy-hero',
};

export default function CySection({
  children,
  tone = 'plain',
  className,
  innerClassName,
}: CySectionProps) {
  return (
    <section className={cn(tones[tone], className)}>
      <div className={cn('mx-auto w-full max-w-5xl px-5 py-16 md:py-24', innerClassName)}>
        {children}
      </div>
    </section>
  );
}
