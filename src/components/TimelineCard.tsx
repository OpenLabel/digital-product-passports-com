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

export interface TimelineCardProps {
  period: string;
  title: string;
  body: string;
  icon: LucideIcon;
}

export default function TimelineCard({ period, title, body, icon: Icon }: TimelineCardProps) {
  return (
    <article className="relative overflow-hidden rounded-xl border border-border bg-background p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="absolute left-0 top-0 h-full w-1 bg-primary" aria-hidden="true" />
      <div className="flex items-center gap-2 text-primary">
        <Icon className="h-5 w-5" aria-hidden="true" />
        <p className="text-sm font-semibold uppercase tracking-wide">{period}</p>
      </div>
      <h3 className="mt-2 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
    </article>
  );
}
