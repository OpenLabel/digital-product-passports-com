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

import { useEffect, useState } from 'react';
import { Globe } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface PassportFact {
  icon: LucideIcon;
  label: string;
  sub: string;
  value: string;
}

interface PassportShowcaseProps {
  facts: PassportFact[];
}

function FactTag({ icon: Icon, label, sub, value }: PassportFact) {
  return (
    <div className="flex items-center gap-3 rounded-full border border-border bg-background/95 px-4 py-2 shadow-lg backdrop-blur">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
        <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold leading-tight">{label}</span>
        <span className="block truncate text-xs text-muted-foreground">{sub}</span>
        <span className="block truncate text-xs font-medium text-primary">{value}</span>
      </span>
    </div>
  );
}

export default function PassportShowcase({ facts }: PassportShowcaseProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (facts.length < 2) return;
    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % facts.length);
    }, 2600);
    return () => window.clearInterval(id);
  }, [facts.length]);

  const activeFact = facts[active];

  return (
    <div className="relative mx-auto w-full max-w-xl rounded-2xl bg-muted/40 px-4 py-10 sm:px-10">
      {/* Passport card */}
      <div className="mx-auto flex aspect-[3/4] w-48 flex-col items-center justify-center rounded-2xl bg-foreground p-4 shadow-2xl sm:w-56">
        <div className="flex h-full w-full flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-accent/60 p-4">
          <Globe className="h-16 w-16 text-accent sm:h-20 sm:w-20" strokeWidth={1.25} aria-hidden="true" />
          <p className="text-center text-base font-semibold uppercase leading-tight tracking-wide text-accent sm:text-lg">
            Digital
            <br />
            Product
            <br />
            Passport
          </p>
          <p className="text-[10px] text-accent/80">by Cypheme</p>
        </div>
      </div>

      {/* Fact carousel */}
      <div className="mt-8">
        <div key={activeFact.label} className="animate-fade-in">
          <FactTag {...activeFact} />
        </div>
        <div className="mt-4 flex justify-center gap-2">
          {facts.map((fact, index) => (
            <button
              key={fact.label}
              type="button"
              aria-label={fact.label}
              aria-current={index === active}
              onClick={() => setActive(index)}
              className={`h-1.5 rounded-full transition-all ${
                index === active ? 'w-6 bg-primary' : 'w-1.5 bg-border'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
