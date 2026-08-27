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

import { Link } from 'react-router-dom';

export default function CyphemeLanding() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors"
      >
        <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <span className="text-primary-foreground font-bold text-lg">OL</span>
        </div>
        <span className="text-xl font-semibold">Open Label <span className="text-primary font-bold">.eu</span></span>
      </Link>
    </div>
  );
}
