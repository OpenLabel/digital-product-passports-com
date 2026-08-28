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

export interface CyPassportFact {
  icon: LucideIcon;
  label: string;
  sub: string;
  value: string;
}

interface CyPassportShowcaseProps {
  facts: CyPassportFact[];
}

function CyFactTag({ icon: Icon, label, sub, value }: CyPassportFact) {
  return (
    <div className="flex items-center gap-3 rounded-pill border border-cy-line bg-background px-5 py-3 shadow-cy">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-pill bg-cy-orange/10">
        <Icon className="h-4 w-4 text-cy-orange" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block truncate font-cy-display text-sm font-semibold leading-tight text-cy-ink">
          {label}
        </span>
        <span className="block truncate text-xs text-cy-grey">{sub}</span>
        <span className="block truncate text-xs font-medium text-cy-orange">{value}</span>
      </span>
    </div>
  );
}

export default function CyPassportShowcase({ facts }: CyPassportShowcaseProps) {
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
    <div className="relative mx-auto w-full max-w-xl rounded-2xl bg-cy-hero px-4 py-10 shadow-cy sm:px-10">
      <div className="mx-auto flex aspect-[3/4] w-48 flex-col items-center justify-center rounded-2xl bg-cy-navy p-4 shadow-cy sm:w-56">
        <div className="flex h-full w-full flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-cy-gold/70 p-4">
          <Globe className="h-16 w-16 text-cy-gold sm:h-20 sm:w-20" strokeWidth={1.25} aria-hidden="true" />
          <p className="text-center font-cy-display text-base font-semibold uppercase leading-tight tracking-wide text-cy-gold sm:text-lg">
            Digital
            <br />
            Product
            <br />
            Passport
          </p>
          <p className="text-[10px] text-cy-tint-warm">by Cypheme</p>
        </div>
      </div>

      <div className="mt-8">
        <div key={activeFact.label} className="animate-fade-in">
          <CyFactTag {...activeFact} />
        </div>
        <div className="mt-4 flex justify-center gap-2">
          {facts.map((fact, index) => (
            <button
              key={fact.label}
              type="button"
              aria-label={fact.label}
              aria-current={index === active}
              onClick={() => setActive(index)}
              className={`h-1.5 rounded-pill transition-all ${
                index === active ? 'w-6 bg-cy-orange' : 'w-1.5 bg-cy-line'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
