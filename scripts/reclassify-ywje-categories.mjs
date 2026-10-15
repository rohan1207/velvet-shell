/**
 * Reclassify all YWJE families to the client's 6 categories only:
 * earrings, bracelets, necklaces, rings, anklets, sets.
 *
 *   node --env-file=.env.local scripts/reclassify-ywje-categories.mjs --dry-run
 *   node --env-file=.env.local scripts/reclassify-ywje-categories.mjs
 */

if (process.env.SUPABASE_INSECURE_TLS === '1' || !process.env.NODE_TLS_REJECT_UNAUTHORIZED) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const DRY = process.argv.includes('--dry-run');
const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '');
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

if (!url || !key) {
  console.error('Missing Supabase env');
  process.exit(1);
}

const headers = {
  apikey: key,
  Authorization: `Bearer ${key}`,
  'Content-Type': 'application/json',
  Prefer: 'return=minimal',
};

/** Exact client map: YWJE#### → category */
const SKU_CATEGORY = {
  // Earrings 42
  YWJE0001: 'earrings',
  YWJE0002: 'earrings',
  YWJE0003: 'earrings',
  YWJE0004: 'earrings',
  YWJE0005: 'earrings',
  YWJE0006: 'earrings',
  YWJE0007: 'earrings',
  YWJE0008: 'earrings',
  YWJE0009: 'earrings',
  YWJE0010: 'earrings',
  YWJE0011: 'earrings',
  YWJE0012: 'earrings',
  YWJE0013: 'earrings',
  YWJE0014: 'earrings',
  YWJE0018: 'earrings',
  YWJE0019: 'earrings',
  YWJE0021: 'earrings',
  YWJE0022: 'earrings',
  YWJE0023: 'earrings',
  YWJE0024: 'earrings',
  YWJE0036: 'earrings',
  YWJE0037: 'earrings',
  YWJE0043: 'earrings',
  YWJE0044: 'earrings',
  YWJE0054: 'earrings',
  YWJE0068: 'earrings',
  YWJE0069: 'earrings',
  YWJE0070: 'earrings',
  YWJE0091: 'earrings',
  YWJE0096: 'earrings',
  YWJE0102: 'earrings',
  YWJE0105: 'earrings',
  YWJE0107: 'earrings',
  YWJE0111: 'earrings',
  YWJE0115: 'earrings',
  YWJE0122: 'earrings',
  YWJE0123: 'earrings',
  YWJE0124: 'earrings',
  YWJE0128: 'earrings',
  YWJE0129: 'earrings',
  YWJE0135: 'earrings',
  YWJE0136: 'earrings',
  // Bracelets 36
  YWJE0015: 'bracelets',
  YWJE0016: 'bracelets',
  YWJE0017: 'bracelets',
  YWJE0020: 'bracelets',
  YWJE0030: 'bracelets',
  YWJE0031: 'bracelets',
  YWJE0032: 'bracelets',
  YWJE0033: 'bracelets',
  YWJE0034: 'bracelets',
  YWJE0035: 'bracelets',
  YWJE0046: 'bracelets',
  YWJE0047: 'bracelets',
  YWJE0048: 'bracelets',
  YWJE0049: 'bracelets',
  YWJE0050: 'bracelets',
  YWJE0051: 'bracelets',
  YWJE0053: 'bracelets',
  YWJE0056: 'bracelets',
  YWJE0058: 'bracelets',
  YWJE0059: 'bracelets',
  YWJE0060: 'bracelets',
  YWJE0061: 'bracelets',
  YWJE0071: 'bracelets',
  YWJE0072: 'bracelets',
  YWJE0073: 'bracelets',
  YWJE0075: 'bracelets',
  YWJE0078: 'bracelets',
  YWJE0079: 'bracelets',
  YWJE0080: 'bracelets',
  YWJE0081: 'bracelets',
  YWJE0085: 'bracelets',
  YWJE0099: 'bracelets',
  YWJE0101: 'bracelets',
  YWJE0103: 'bracelets',
  YWJE0116: 'bracelets',
  YWJE0120: 'bracelets',
  // Necklaces 31
  YWJE0027: 'necklaces',
  YWJE0028: 'necklaces',
  YWJE0029: 'necklaces',
  YWJE0038: 'necklaces',
  YWJE0039: 'necklaces',
  YWJE0040: 'necklaces',
  YWJE0041: 'necklaces',
  YWJE0042: 'necklaces',
  YWJE0045: 'necklaces',
  YWJE0052: 'necklaces',
  YWJE0063: 'necklaces',
  YWJE0065: 'necklaces',
  YWJE0066: 'necklaces',
  YWJE0067: 'necklaces',
  YWJE0074: 'necklaces',
  YWJE0076: 'necklaces',
  YWJE0086: 'necklaces',
  YWJE0092: 'necklaces',
  YWJE0095: 'necklaces',
  YWJE0098: 'necklaces',
  YWJE0100: 'necklaces',
  YWJE0104: 'necklaces',
  YWJE0108: 'necklaces',
  YWJE0112: 'necklaces',
  YWJE0114: 'necklaces',
  YWJE0119: 'necklaces',
  YWJE0130: 'necklaces',
  YWJE0131: 'necklaces',
  YWJE0132: 'necklaces',
  YWJE0133: 'necklaces',
  YWJE0134: 'necklaces',
  // Rings 12
  YWJE0025: 'rings',
  YWJE0026: 'rings',
  YWJE0055: 'rings',
  YWJE0077: 'rings',
  YWJE0087: 'rings',
  YWJE0090: 'rings',
  YWJE0094: 'rings',
  YWJE0117: 'rings',
  YWJE0121: 'rings',
  YWJE0125: 'rings',
  YWJE0126: 'rings',
  YWJE0127: 'rings',
  // Anklets 3
  YWJE0057: 'anklets',
  YWJE0062: 'anklets',
  YWJE0064: 'anklets',
  // Sets 12
  YWJE0082: 'sets',
  YWJE0083: 'sets',
  YWJE0084: 'sets',
  YWJE0088: 'sets',
  YWJE0089: 'sets',
  YWJE0093: 'sets',
  YWJE0097: 'sets',
  YWJE0106: 'sets',
  YWJE0109: 'sets',
  YWJE0110: 'sets',
  YWJE0113: 'sets',
  YWJE0118: 'sets',
};

const KEEP_SHOP_CATS = new Set([
  'earrings',
  'bracelets',
  'necklaces',
  'rings',
  'anklets',
  'sets',
]);

async function all(path) {
  const out = [];
  let from = 0;
  const size = 1000;
  while (true) {
    const res = await fetch(`${url}/rest/v1/${path}`, {
      headers: { ...headers, Range: `${from}-${from + size - 1}`, Prefer: 'count=exact' },
    });
    const rows = await res.json();
    if (!Array.isArray(rows)) throw new Error(JSON.stringify(rows));
    out.push(...rows);
    if (rows.length < size) break;
    from += size;
  }
  return out;
}

async function patch(path, body) {
  const res = await fetch(`${url}/rest/v1/${path}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${path} → ${res.status} ${await res.text()}`);
}

async function main() {
  // Validate map completeness
  const expected = [];
  for (let i = 1; i <= 136; i++) expected.push(`YWJE${String(i).padStart(4, '0')}`);
  const missingMap = expected.filter((s) => !SKU_CATEGORY[s]);
  const extraMap = Object.keys(SKU_CATEGORY).filter((s) => !expected.includes(s));
  if (missingMap.length || extraMap.length) {
    console.error('Map incomplete', { missingMap, extraMap });
    process.exit(1);
  }
  const counts = {};
  for (const c of Object.values(SKU_CATEGORY)) counts[c] = (counts[c] || 0) + 1;
  console.log('Target SKU counts:', counts, 'total', Object.keys(SKU_CATEGORY).length);

  const variants = await all(
    'product_color_variants?select=id,family_id,features,slug&active=eq.true',
  );
  const families = await all('product_families?select=id,slug,name,category,status');
  const famById = Object.fromEntries(families.map((f) => [f.id, f]));

  // family_id → desired category (from any SKU on that family)
  const familyTarget = new Map();
  const conflicts = [];
  const skuFound = new Set();

  for (const v of variants) {
    const feat = (v.features || []).find((x) => /^SKU\s/i.test(String(x)));
    if (!feat) continue;
    const sku = String(feat).replace(/^SKU\s+/i, '').trim().toUpperCase();
    const cat = SKU_CATEGORY[sku];
    if (!cat) continue;
    skuFound.add(sku);
    const prev = familyTarget.get(v.family_id);
    if (prev && prev !== cat) {
      conflicts.push({
        family: famById[v.family_id]?.slug,
        a: prev,
        b: cat,
        sku,
      });
    } else {
      familyTarget.set(v.family_id, cat);
    }
  }

  const missingSkus = expected.filter((s) => !skuFound.has(s));
  if (conflicts.length) {
    console.error('Family category conflicts (same family, different target cats):', conflicts);
    process.exit(1);
  }
  if (missingSkus.length) {
    console.warn('SKUs not found on active variants:', missingSkus);
  }

  let updated = 0;
  let unchanged = 0;
  for (const [familyId, cat] of familyTarget) {
    const fam = famById[familyId];
    if (!fam) continue;
    if (fam.category === cat) {
      unchanged += 1;
      continue;
    }
    console.log(`${DRY ? 'DRY' : 'SET'}  ${fam.slug}  ${fam.category} → ${cat}`);
    if (!DRY) {
      await patch(`product_families?id=eq.${familyId}`, {
        category: cat,
        updated_at: new Date().toISOString(),
      });
    }
    updated += 1;
  }

  // Deactivate shop categories we no longer use
  const shopCats = await all('shop_categories?select=slug,name,active');
  for (const c of shopCats) {
    const keep = KEEP_SHOP_CATS.has(c.slug);
    if (keep && !c.active) {
      console.log(`${DRY ? 'DRY' : 'ACTIVATE'} shop_category ${c.slug}`);
      if (!DRY) await patch(`shop_categories?slug=eq.${c.slug}`, { active: true });
    }
    if (!keep && c.active) {
      console.log(`${DRY ? 'DRY' : 'DEACTIVATE'} shop_category ${c.slug}`);
      if (!DRY) await patch(`shop_categories?slug=eq.${c.slug}`, { active: false });
    }
  }

  // Ensure core 6 exist / correct names
  const core = [
    { slug: 'earrings', name: 'Earrings', sort_order: 1 },
    { slug: 'bracelets', name: 'Bracelets', sort_order: 2 },
    { slug: 'necklaces', name: 'Necklaces', sort_order: 3 },
    { slug: 'rings', name: 'Rings', sort_order: 4 },
    { slug: 'anklets', name: 'Anklets', sort_order: 5 },
    { slug: 'sets', name: 'Sets', sort_order: 6 },
  ];
  if (!DRY) {
    for (const c of core) {
      const res = await fetch(`${url}/rest/v1/shop_categories?on_conflict=slug`, {
        method: 'POST',
        headers: {
          ...headers,
          Prefer: 'resolution=merge-duplicates,return=minimal',
        },
        body: JSON.stringify([
          {
            slug: c.slug,
            name: c.name,
            line: '',
            sort_order: c.sort_order,
            active: true,
          },
        ]),
      });
      if (!res.ok) console.warn('upsert cat', c.slug, await res.text());
    }
  }

  // Final counts by family category
  const after = DRY
    ? [...familyTarget.values()]
    : (await all('product_families?select=category&status=eq.active')).map((f) => f.category);
  const finalCounts = {};
  for (const c of after) finalCounts[c] = (finalCounts[c] || 0) + 1;

  console.log(
    JSON.stringify(
      {
        dry: DRY,
        familiesUpdated: updated,
        familiesUnchanged: unchanged,
        skusMapped: skuFound.size,
        missingSkus,
        familyCategoryCounts: finalCounts,
      },
      null,
      2,
    ),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
