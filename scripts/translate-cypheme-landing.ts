/* eslint-disable @typescript-eslint/no-explicit-any */
// One-off generator: writes the Cypheme landing-page i18n tree into
// src/i18n/cypheme/en.json and translates it into every other supported
// locale via the Lovable AI Gateway.
//
// These strings live in a DEDICATED namespace ("cypheme") and a dedicated
// folder so they never mix with, or corrupt, the main app locales.
//
// Usage:
//   bun run scripts/translate-cypheme-landing.ts            # all languages
//   bun run scripts/translate-cypheme-landing.ts fr de      # subset

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const CY_DIR = resolve(import.meta.dir, '../src/i18n/cypheme');
const APP_DIR = resolve(import.meta.dir, '../src/i18n/locales');

const LANGUAGE_NAMES: Record<string, string> = {
  bg: 'Bulgarian', cs: 'Czech', da: 'Danish', de: 'German', el: 'Greek',
  es: 'Spanish', et: 'Estonian', fi: 'Finnish', fr: 'French', ga: 'Irish',
  hr: 'Croatian', hu: 'Hungarian', it: 'Italian', lt: 'Lithuanian',
  lv: 'Latvian', mt: 'Maltese', nl: 'Dutch', pl: 'Polish', pt: 'Portuguese',
  ro: 'Romanian', sk: 'Slovak', sl: 'Slovenian', sv: 'Swedish',
  'zh-CN': 'Chinese (Simplified)',
};

// Keys from the main homepage locales used as a terminology reference so the
// landing page taxonomy stays consistent with the rest of the website.
const GLOSSARY_KEYS = [
  'landing.timeline.subtitle',
  'landing.timeline.badge',
  'landing.cta.subtitle',
  'landing.categories.title',
  'landing.features.title',
  'landing.features.espr.description',
  'landing.features.qr.description',
  'landing.hero.title',
  'landing.hero.badge',
];

export const CYPHEME_LANDING = {
  meta: {
    title: 'EU Digital Product Passport with Authentication | Cypheme',
    description:
      'Cypheme delivers EU-compliant Digital Product Passports backed by physical authenticity verification — free to create, ready for the market.',
  },
  header: { by: 'by Cypheme' },
  hero: {
    titleLead: 'Get your EU Digital Product Passport',
    titleHighlight: 'free of charge',
    body: 'Cypheme provides you fully EU-compliant, product-ready Digital Product Passports through an online generator. No hassle, no compliance headaches, no fees.',
    cta: 'Get My DPP Now',
    badgeReady: 'Market-ready Digital Product Passport',
    badgeCompliant: 'Fully EU-compliant',
  },
  facts: {
    origin: { label: 'Origin', sub: 'Country of manufacture', value: 'Made in France' },
    materials: { label: 'Materials', sub: 'Component breakdown', value: '92% recycled cotton' },
    carbon: { label: 'Carbon', sub: 'Footprint score', value: '3.2 kg CO₂ eq.' },
    recyclability: { label: 'Recyclability', sub: 'End-of-life rating', value: 'Grade A — fully recyclable' },
    maintenance: { label: 'Maintenance', sub: 'Care instructions', value: 'Dry clean only' },
    compliance: { label: 'Compliance', sub: 'Regulatory status', value: 'EU ESPR certified' },
  },
  what: {
    eyebrow: 'The regulation you need to know',
    title: 'What is a Digital Product Passport?',
    p1: 'European Union regulations are introducing Digital Product Passports (DPPs) to improve product authenticity, transparency, and sustainability.',
    p2: 'A Digital Product Passport is a digital identity linked to a physical product that tracks key information across its lifecycle, including:',
    items: {
      origin: 'Origin and materials',
      sustainability: 'Sustainability metrics (carbon footprint, recyclability)',
      repair: 'Repair and maintenance instructions',
      regulatory: 'Regulatory and compliance data',
    },
    p3: "Accessible via a simple scan, it gives regulators, supply chain partners, and consumers clear traceability and accountability throughout the product's journey.",
    cta: 'Stay Compliant',
  },
  timeline: {
    eyebrow: 'Regulatory Timeline',
    title: 'Time Is Running Out',
    subtitle: 'EU Digital Product Passport Rollout 2027 to 2030',
    body: 'Regulations are rolling out in phases. Brands preparing now do not just comply. They compete.',
    cta: 'Prepare Your Products Today',
    batteries: {
      period: '2027',
      title: 'Battery Passports',
      body: 'Battery passports for electric vehicle and industrial batteries under the EU Battery Regulation.',
    },
    textiles: {
      period: '2027–2028',
      title: 'Textiles & Apparel',
      body: 'Digital Product Passports for textiles and apparel improve sustainability, traceability, and circularity across the supply chain.',
    },
    electronics: {
      period: '2028–2030',
      title: 'Electronics & ICT',
      body: 'Electronics and ICT products adopt Digital Product Passports to enhance transparency, repairability, and lifecycle tracking.',
    },
    toys: {
      period: '2028–2030',
      title: 'Toys',
      body: 'Toy products are expected to adopt Digital Product Passports to strengthen product safety, traceability, and compliance across the European market.',
    },
    most: {
      period: '2030',
      title: 'Most Products',
      body: 'By 2030, most products sold in the European Union will require a Digital Product Passport under the Ecodesign for Sustainable Products Regulation.',
    },
  },
  comparison: {
    eyebrow: 'The limits of the Digital Product Passport',
    title: 'Digital Compliance Alone Is Not Enough',
    intro: "Digital Product Passports store and share product data but don't verify the physical product. Without authentication, counterfeit or mislabelled items may seem compliant.",
    introStrong: "Cypheme's award-winning EU solution",
    introEnd: 'ensures every DPP is backed by verified product authenticity, giving your business full traceability and confidence.',
    outro: 'Digital Product Passports improve transparency.',
    outroStrong: 'Cypheme ensures your DPP is trusted, authentic, and fully verified.',
    cta: 'Secure Your Products',
    capabilityLabel: 'Capability',
    standardLabel: 'Standard Digital Product Passport',
    cyphemeLabel: 'DPP with Cypheme',
    recommendedLabel: 'Recommended',
    rows: {
      uniqueId: { capability: 'Unique product ID', standard: 'Required', cypheme: 'Linked ID' },
      euCompliance: { capability: 'EU compliance', standard: 'Data reqs', cypheme: 'Full + auth' },
      physical: { capability: 'Physical verification', standard: 'Digital only', cypheme: 'Physical + data' },
      counterfeit: { capability: 'Counterfeit protection', standard: 'May appear OK', cypheme: 'Blocked' },
      supplyChain: { capability: 'Supply chain', standard: 'Data unverified', cypheme: 'Full trace' },
      trust: { capability: 'Consumer trust', standard: "Can't verify", cypheme: 'Complete' },
    },
  },
  finalCta: {
    titleLine1: 'One click secures',
    titleLine2: 'authentication + compliance',
    cta: 'Get My DPP Now',
  },
  footer: {
    tagline: 'Secure Digital Product Passports with built-in authentication technology.',
    about: 'About Cypheme',
    contact: 'Contact Us',
    privacy: 'Privacy Policy',
    terms: 'Terms of Use',
    legal: '© 2026 Cypheme | GDPR Compliant | ISO 27001 Certified · Powered by Open-Label.eu',
  },
};

function flat(obj: any, prefix = ''): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object') Object.assign(out, flat(v, key));
    else if (typeof v === 'string') out[key] = v;
  }
  return out;
}

function glossaryFor(code: string): string {
  const en = flat(JSON.parse(readFileSync(resolve(APP_DIR, 'en.json'), 'utf-8')));
  const tgt = flat(JSON.parse(readFileSync(resolve(APP_DIR, `${code}.json`), 'utf-8')));
  return GLOSSARY_KEYS.filter((k) => tgt[k])
    .map((k) => `EN: "${en[k]}"\n${code}: "${tgt[k]}"`)
    .join('\n');
}

async function translateTree(code: string, source: any): Promise<any> {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error('LOVABLE_API_KEY is not set');
  const langName = LANGUAGE_NAMES[code] ?? code;

  const prompt = `You are a professional marketing + EU regulatory translator working on Digital Product Passport (DPP) content.

TASK: Translate every string VALUE in the JSON object below from English to ${langName} (${code}).

STRICT RULES:
- Return ONLY a valid JSON object with the EXACT same structure and keys.
- Keep brand names unchanged: Cypheme, Open-Label.eu.
- Keep acronyms unchanged: DPP, ESPR, EU, ICT, GDPR, ISO 27001, CO₂.
- Keep years, date ranges ("2027–2028"), numbers, units and percentages unchanged.
- Marketing copy must sound natural and idiomatic, not literal.
- TERMINOLOGY CONSISTENCY IS MANDATORY. Reuse exactly the same wording for
  "Digital Product Passport", "compliance/compliant", "traceability",
  "sustainability", "regulation", "Regulatory Timeline" as in these existing
  approved translations from the same website:
${glossaryFor(code)}
- Do NOT output markdown, code fences or commentary — only the raw JSON.

INPUT:
${JSON.stringify(source)}`;

  const res = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'google/gemini-2.5-pro',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
    }),
  });
  if (!res.ok) throw new Error(`AI gateway ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const data: any = await res.json();
  const raw: string = data.choices?.[0]?.message?.content ?? '';
  const s = raw.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
  const a = s.indexOf('{');
  const b = s.lastIndexOf('}');
  if (a < 0 || b < 0) throw new Error(`No JSON for ${code}: ${raw.slice(0, 200)}`);
  return JSON.parse(s.slice(a, b + 1));
}

async function main() {
  mkdirSync(CY_DIR, { recursive: true });
  const argLangs = process.argv.slice(2).filter((a) => !a.startsWith('-'));
  const targets = argLangs.length ? argLangs : Object.keys(LANGUAGE_NAMES);

  writeFileSync(
    resolve(CY_DIR, 'en.json'),
    JSON.stringify(CYPHEME_LANDING, null, 2) + '\n',
    'utf-8',
  );
  console.log('✓ en.json written');

  const BATCH = 4;
  for (let i = 0; i < targets.length; i += BATCH) {
    const slice = targets.slice(i, i + BATCH);
    await Promise.all(
      slice.map(async (code) => {
        try {
          console.log(`🌐 ${code}…`);
          const t = await translateTree(code, CYPHEME_LANDING);
          writeFileSync(resolve(CY_DIR, `${code}.json`), JSON.stringify(t, null, 2) + '\n', 'utf-8');
          console.log(`  ✓ ${code}.json`);
        } catch (e) {
          console.error(`  ✗ ${code}:`, (e as Error).message);
        }
      }),
    );
  }
  console.log('done');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
