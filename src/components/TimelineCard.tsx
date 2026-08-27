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

export interface TimelineCardProps {
  period: string;
  title: string;
  body: string;
}

export default function TimelineCard({ period, title, body }: TimelineCardProps) {
  return (
    <article className="relative overflow-hidden rounded-xl border border-border bg-background p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="absolute left-0 top-0 h-full w-1 bg-primary" aria-hidden="true" />
      <p className="text-sm font-semibold uppercase tracking-wide text-primary">{period}</p>
      <h3 className="mt-2 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
    </article>
  );
}
