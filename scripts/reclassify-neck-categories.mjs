/**
 * Split neck pieces into necklaces / pendants / chains / chokers in Supabase.
 *   node --env-file=.env.local scripts/reclassify-neck-categories.mjs
 */

import { FAMILIES } from './data/ywje-catalog.mjs';

const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '');
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

if (process.env.SUPABASE_INSECURE_TLS === '1') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

if (!url || !serviceKey) {
  console.error('Missing Supabase env');
  process.exit(1);
}

const headers = {
  apikey: serviceKey,
  Authorization: `Bearer ${serviceKey}`,
  'Content-Type': 'application/json',
};

async function rest(path, { method = 'GET', body, prefer } = {}) {
  const res = await fetch(`${url}/rest/v1/${path}`, {
    method,
    headers: {
      ...headers,
      ...(prefer ? { Prefer: prefer } : { Prefer: 'return=minimal' }),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}: ${JSON.stringify(data)}`);
  return data;
}

function subcategoryFromSlug(slug = '') {
  const s = slug.toLowerCase();
  if (s.includes('choker')) return 'chokers';
  if (s.includes('pendant')) return 'pendants';
  if (s.includes('chain') && !s.includes('bracelet')) return 'chains';
  return 'necklaces';
}

const EXTRA = [
  {
    slug: 'pendants',
    name: 'Pendants',
    line: 'Motifs worn as a single quiet focus.',
    sort_order: 12,
  },
  {
    slug: 'chains',
    name: 'Chains',
    line: 'Fine chains for layering and everyday light.',
    sort_order: 14,
  },
  {
    slug: 'chokers',
    name: 'Chokers',
    line: 'Close-to-the-neck forms with a soft hold.',
    sort_order: 16,
  },
];

async function main() {
  for (const c of EXTRA) {
    await rest('shop_categories?on_conflict=slug', {
      method: 'POST',
      prefer: 'resolution=merge-duplicates,return=minimal',
      body: [
        {
          slug: c.slug,
          name: c.name,
          line: c.line,
          sort_order: c.sort_order,
          active: true,
        },
      ],
    });
  }
  console.log('Categories ensured: pendants, chains, chokers');

  const targetSlugs = new Set(
    FAMILIES.filter((f) =>
      ['necklaces', 'pendants', 'chains', 'chokers'].includes(f.category)
    ).map((f) => f.slug)
  );

  // Also include any DB families currently under necklaces
  const dbFamilies = await rest(
    'product_families?select=id,slug,category&or=(category.eq.necklaces,category.eq.pendants,category.eq.chains,category.eq.chokers)'
  );

  const seedCat = new Map(FAMILIES.map((f) => [f.slug, f.category]));
  const counts = { necklaces: 0, pendants: 0, chains: 0, chokers: 0 };

  for (const family of dbFamilies) {
    const next =
      seedCat.get(family.slug) &&
      ['necklaces', 'pendants', 'chains', 'chokers'].includes(seedCat.get(family.slug))
        ? seedCat.get(family.slug)
        : subcategoryFromSlug(family.slug);

    // Only reclassify neck-related seed families + current neck rows
    if (!targetSlugs.has(family.slug) && family.category === 'necklaces') {
      // still reclassify via slug heuristic
    }

    if (!['necklaces', 'pendants', 'chains', 'chokers'].includes(next)) continue;

    if (family.category !== next) {
      await rest(`product_families?id=eq.${family.id}`, {
        method: 'PATCH',
        body: { category: next, updated_at: new Date().toISOString() },
      });
      console.log(`  ${family.slug}: ${family.category} → ${next}`);
    }
    counts[next] += 1;
  }

  console.log('Done.', counts);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
