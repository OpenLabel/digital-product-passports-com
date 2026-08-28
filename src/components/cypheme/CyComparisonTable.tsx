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

import { Check, X, AlertTriangle, Star } from 'lucide-react';

export type CyComparisonStatus = 'ok' | 'no' | 'warn';

export interface CyComparisonRow {
  capability: string;
  standard: string;
  standardStatus: CyComparisonStatus;
  cypheme: string;
}

interface CyComparisonTableProps {
  rows: CyComparisonRow[];
  capabilityLabel: string;
  standardLabel: string;
  cyphemeLabel: string;
  recommendedLabel: string;
}

function StatusIcon({ status }: { status: CyComparisonStatus }) {
  if (status === 'ok') {
    return <Check className="h-5 w-5 shrink-0 text-cy-ok" aria-hidden="true" />;
  }
  if (status === 'warn') {
    return <AlertTriangle className="h-5 w-5 shrink-0 text-cy-warn" aria-hidden="true" />;
  }
  return <X className="h-5 w-5 shrink-0 text-cy-no" aria-hidden="true" />;
}

export default function CyComparisonTable({
  rows,
  capabilityLabel,
  standardLabel,
  cyphemeLabel,
  recommendedLabel,
}: CyComparisonTableProps) {
  return (
    <div className="overflow-x-auto rounded-cy-btn border border-cy-line bg-background">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-cy-line font-cy-display text-cy-ink">
            <th scope="col" className="bg-cy-surface px-6 py-5 font-semibold">
              {capabilityLabel}
            </th>
            <th scope="col" className="bg-cy-surface px-6 py-5 font-semibold">
              {standardLabel}
            </th>
            <th scope="col" className="bg-cy-tint-cool/60 px-6 py-5 font-semibold">
              <span className="flex items-center justify-between gap-4">
                {cyphemeLabel}
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-pill border border-cy-blue px-3 py-1 text-xs font-semibold text-cy-blue">
                  <Star className="h-3.5 w-3.5" aria-hidden="true" />
                  {recommendedLabel}
                </span>
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.capability} className="border-b border-cy-line last:border-0">
              <th
                scope="row"
                className="px-6 py-5 font-cy-display text-sm font-semibold text-cy-ink"
              >
                {row.capability}
              </th>
              <td className="px-6 py-5">
                <span className="inline-flex items-center gap-3 font-medium text-cy-grey">
                  <StatusIcon status={row.standardStatus} />
                  {row.standard}
                </span>
              </td>
              <td className="bg-cy-tint-cool/40 px-6 py-5">
                <span className="inline-flex items-center gap-3 font-cy-display font-semibold text-cy-ink">
                  <StatusIcon status="ok" />
                  {row.cypheme}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
