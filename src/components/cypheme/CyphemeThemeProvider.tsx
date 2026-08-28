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

import { useEffect, type ReactNode } from 'react';
import '@/styles/cypheme.css';

const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&family=Inter:wght@300;400;500;600;700&display=swap';
const FONT_ID = 'cypheme-fonts';

interface CyphemeThemeProviderProps {
  children: ReactNode;
  title?: string;
  description?: string;
  noindex?: boolean;
}


/**
 * Wraps landing content in the isolated Cypheme design system scope.
 * Fonts are injected on mount and removed on unmount so no other route
 * downloads them, and tokens only apply inside `.cypheme-theme`.
 */
export default function CyphemeThemeProvider({
  children,
  title,
  description,
  noindex,
}: CyphemeThemeProviderProps) {

  useEffect(() => {
    let link = document.getElementById(FONT_ID) as HTMLLinkElement | null;
    const created = !link;
    if (!link) {
      link = document.createElement('link');
      link.id = FONT_ID;
      link.rel = 'stylesheet';
      link.href = FONT_HREF;
      document.head.appendChild(link);
    }
    return () => {
      if (created) link?.remove();
    };
  }, []);

  useEffect(() => {
    if (!title && !description) return;
    const previousTitle = document.title;
    const meta = document.querySelector('meta[name="description"]');
    const previousDescription = meta?.getAttribute('content') ?? null;
    if (title) document.title = title;
    if (description) meta?.setAttribute('content', description);
    return () => {
      document.title = previousTitle;
      if (previousDescription !== null) meta?.setAttribute('content', previousDescription);
    };
  }, [title, description]);

  useEffect(() => {
    if (!noindex) return;
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => {
      meta.remove();
    };
  }, [noindex]);

  return <div className="cypheme-theme font-cy-body min-h-screen">{children}</div>;
}

