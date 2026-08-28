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

import type { LucideIcon } from 'lucide-react';
import CyCard from './CyCard';

export interface CyTimelineCardProps {
  period: string;
  title: string;
  body: string;
  icon: LucideIcon;
}

export default function CyTimelineCard({ period, title, body, icon: Icon }: CyTimelineCardProps) {
  return (
    <CyCard
      as="article"
      tone="plain"
      className="flex h-full w-full max-w-sm flex-col items-center rounded-3xl border-cy-line/70 px-7 py-9 text-center"
    >
      <span
        className="flex h-12 w-12 items-center justify-center rounded-pill bg-cy-blue/10 text-cy-blue"
        aria-hidden="true"
      >
        <Icon className="h-5 w-5" />
      </span>
      <p className="mt-5 font-cy-display text-base font-bold text-cy-blue">{period}</p>
      <h3 className="mt-2 font-cy-display text-lg font-semibold text-cy-ink">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-cy-grey">{body}</p>
    </CyCard>
  );
}
