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
      tone="warm"
      className="flex h-full w-full max-w-sm flex-col items-center px-6 py-8 text-center"
    >
      <span
        className="flex h-14 w-14 items-center justify-center rounded-pill bg-cy-orange/10 text-cy-orange"
        aria-hidden="true"
      >
        <Icon className="h-6 w-6" />
      </span>
      <p className="mt-5 font-cy-display text-sm font-semibold uppercase tracking-wide text-cy-orange">
        {period}
      </p>
      <h3 className="mt-2 font-cy-display text-lg font-semibold text-cy-ink">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-cy-grey">{body}</p>
    </CyCard>
  );
}
