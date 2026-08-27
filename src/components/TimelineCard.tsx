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
    <article className="flex h-full flex-col items-center rounded-xl border border-border bg-background px-6 py-8 text-center shadow-sm transition-shadow hover:shadow-md">
      <div
        className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary"
        aria-hidden="true"
      >
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-4 text-base font-semibold text-primary">{period}</p>
      <h3 className="mt-2 text-base font-semibold">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </article>
  );
}
