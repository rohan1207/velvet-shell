/**
 * Segregate Gold / Silver colour variants + finishes + galleries.
 *
 * 1) Fix finish labels from colour (Gold → 18K Gold Plated, Silver → Sterling Silver)
 * 2) For existing Gold+Silver pairs with shared/mixed galleries → split by image warmth
 * 3) For single-variant pieces whose gallery clearly contains both metals → create Gold + Silver
 *
 *   node --env-file=.env.local scripts/segregate-metal-variants.mjs --dry-run
 *   node --env-file=.env.local scripts/segregate-metal-variants.mjs
 */

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { randomUUID } from 'crypto';

const DRY = process.argv.includes('--dry-run');
const ROOT = process.cwd();

if (process.env.SUPABASE_INSECURE_TLS === '1') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

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
};

const SILVER_SWATCH = '#C5C5C5';
const GOLD_SWATCH = '#D4AF64';
const FINISH_SILVER = 'Sterling Silver';
const FINISH_GOLD = '18K Gold Plated';

const scoreCache = new Map();

async function rest(pathname, { method = 'GET', body, prefer } = {}) {
  const res = await fetch(`${url}/rest/v1/${pathname}`, {
    method,
    headers: {
      ...headers,
      ...(prefer ? { Prefer: prefer } : { Prefer: 'return=representation' }),
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
  if (!res.ok) {
    throw new Error(`${method} ${pathname} → ${res.status}: ${JSON.stringify(data)}`);
  }
  return data;
}

function galleryUrls(variant) {
  const fromGallery = (variant.gallery || [])
    .map((g) => (typeof g === 'string' ? g : g?.url))
    .filter(Boolean);
  const urls = [];
  if (variant.hero_url) urls.push(variant.hero_url);
  for (const u of fromGallery) if (!urls.includes(u)) urls.push(u);
  return urls;
}

function toGalleryRows(urls) {
  return urls.map((u, i) => ({
    url: u,
    kind: 'image',
    sort: i,
  }));
}

function localPathFromUrl(imageUrl) {
  if (!imageUrl) return null;
  let p = String(imageUrl).trim();
  if (p.startsWith('http')) {
    try {
      const u = new URL(p);
      p = u.pathname;
    } catch {
      return null;
    }
  }
  if (!p.startsWith('/')) p = `/${p}`;
  // Only local public assets
  if (!p.startsWith('/products/') && !p.startsWith('/images/') && !p.startsWith('/rings/') && !p.startsWith('/earrings/') && !p.startsWith('/necklace/') && !p.startsWith('/bracelets/') && !p.startsWith('/brooch/')) {
    return null;
  }
  const abs = path.join(ROOT, 'public', p.replace(/^\//, ''));
  return fs.existsSync(abs) ? abs : null;
}

/**
 * Classify a product photo as gold | silver | uncertain using warm/cool metal cues.
 */
async function classifyImage(imageUrl) {
  if (scoreCache.has(imageUrl)) return scoreCache.get(imageUrl);
  const abs = localPathFromUrl(imageUrl);
  if (!abs) {
    const miss = { label: 'uncertain', gold: 0, silver: 0, confidence: 0 };
    scoreCache.set(imageUrl, miss);
    return miss;
  }

  try {
    const { data, info } = await sharp(abs)
      .resize(72, 72, { fit: 'inside' })
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    let gold = 0;
    let silver = 0;
    let samples = 0;
    const channels = info.channels || 3;

    for (let i = 0; i < data.length; i += channels) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      // skip crushed blacks / blown whites (backgrounds)
      if (max < 35 || min > 245) continue;
      const sat = max === 0 ? 0 : (max - min) / max;
      samples += 1;

      const warm = r - b;
      const goldish =
        r > 110 &&
        warm > 28 &&
        g > b + 8 &&
        r >= g * 0.78 &&
        sat > 0.12 &&
        sat < 0.85;
      const silverish =
        sat < 0.18 ||
        (Math.abs(r - g) < 22 && Math.abs(g - b) < 22 && max > 70 && max < 230);

      if (goldish) gold += 1;
      else if (silverish) silver += 1;
    }

    if (samples < 40) {
      const low = { label: 'uncertain', gold, silver, confidence: 0 };
      scoreCache.set(imageUrl, low);
      return low;
    }

    const gRatio = gold / samples;
    const sRatio = silver / samples;
    let label = 'uncertain';
    let confidence = 0;

    if (gRatio > 0.14 && gRatio > sRatio * 1.25) {
      label = 'gold';
      confidence = gRatio / (sRatio + 0.05);
    } else if (sRatio > 0.18 && sRatio > gRatio * 1.15) {
      label = 'silver';
      confidence = sRatio / (gRatio + 0.05);
    }

    const result = { label, gold: gRatio, silver: sRatio, confidence };
    scoreCache.set(imageUrl, result);
    return result;
  } catch {
    const err = { label: 'uncertain', gold: 0, silver: 0, confidence: 0 };
    scoreCache.set(imageUrl, err);
    return err;
  }
}

async function partitionUrls(urls) {
  const gold = [];
  const silver = [];
  const uncertain = [];
  for (const u of urls) {
    const c = await classifyImage(u);
    if (c.label === 'gold' && c.confidence >= 1.15) gold.push(u);
    else if (c.label === 'silver' && c.confidence >= 1.1) silver.push(u);
    else uncertain.push(u);
  }
  return { gold, silver, uncertain };
}

function metalKind(label = '', material = '') {
  const l = `${label} ${material}`.toLowerCase();
  if (/\bros[eé]\s*gold\b/.test(l)) return 'rose-gold';
  if (/\bwhite\s*gold\b/.test(l)) return 'white-gold';
  if (/\bgold\b/.test(l) && !/\bsilver\b/.test(label.toLowerCase())) return 'gold';
  if (/\bsilver\b|sterling|925|s925/.test(l)) return 'silver';
  return 'other';
}

function finishForKind(kind) {
  if (kind === 'gold' || kind === 'rose-gold') return FINISH_GOLD;
  if (kind === 'silver' || kind === 'white-gold') return FINISH_SILVER;
  return null;
}

function swatchForKind(kind) {
  if (kind === 'gold' || kind === 'rose-gold') return GOLD_SWATCH;
  return SILVER_SWATCH;
}

function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function fetchAllFamilies() {
  const families = await rest(
    'product_families?select=id,slug,name,has_color_variants,category,active,status&active=eq.true&status=eq.active&order=slug',
  );
  const variants = [];
  for (let i = 0; i < families.length; i += 50) {
    const chunk = families.slice(i, i + 50).map((f) => f.id);
    const rows = await rest(
      `product_color_variants?select=*&family_id=in.(${chunk.join(',')})&active=eq.true&order=sort_order`,
    );
    variants.push(...rows);
  }
  const byFamily = new Map();
  for (const v of variants) {
    const list = byFamily.get(v.family_id) || [];
    list.push(v);
    byFamily.set(v.family_id, list);
  }
  return { families, byFamily };
}

async function patchVariant(id, patch) {
  if (DRY) return;
  await rest(`product_color_variants?id=eq.${id}`, {
    method: 'PATCH',
    body: { ...patch, updated_at: new Date().toISOString() },
    prefer: 'return=minimal',
  });
}

async function patchFamily(id, patch) {
  if (DRY) return;
  await rest(`product_families?id=eq.${id}`, {
    method: 'PATCH',
    body: { ...patch, updated_at: new Date().toISOString() },
    prefer: 'return=minimal',
  });
}

async function insertVariant(row) {
  if (DRY) return { id: 'dry-run' };
  const data = await rest('product_color_variants', {
    method: 'POST',
    body: [row],
    prefer: 'return=representation',
  });
  return Array.isArray(data) ? data[0] : data;
}

async function main() {
  console.log(DRY ? '=== DRY RUN ===' : '=== LIVE RUN ===');
  const { families, byFamily } = await fetchAllFamilies();
  const stats = {
    finishFixed: 0,
    galleriesSplit: 0,
    familiesExpanded: 0,
    skipped: 0,
    errors: 0,
  };

  // —— Phase 1: finish labels from colour ——
  for (const family of families) {
    const variants = byFamily.get(family.id) || [];
    for (const v of variants) {
      const kind = metalKind(v.color_label, '');
      const finish = finishForKind(kind);
      if (!finish) continue;
      const needsMaterial = v.material !== finish;
      const needsSwatch =
        (kind === 'gold' || kind === 'rose-gold') &&
        (!v.color_swatch || v.color_swatch === SILVER_SWATCH || /c5c5c5/i.test(v.color_swatch));
      if (!needsMaterial && !needsSwatch) continue;
      console.log(`finish  ${v.slug}: ${v.material || '∅'} → ${finish}`);
      await patchVariant(v.id, {
        material: finish,
        ...(needsSwatch ? { color_swatch: swatchForKind(kind) } : {}),
      });
      stats.finishFixed += 1;
    }
  }

  // —— Phase 2: split galleries on existing Gold+Silver families ——
  for (const family of families) {
    const variants = byFamily.get(family.id) || [];
    const goldV = variants.find((v) => metalKind(v.color_label) === 'gold');
    const silverV = variants.find((v) => metalKind(v.color_label) === 'silver');
    if (!goldV || !silverV) continue;

    const goldUrls = galleryUrls(goldV);
    const silverUrls = galleryUrls(silverV);
    const pooled = [...new Set([...goldUrls, ...silverUrls])];
    if (pooled.length < 2) {
      stats.skipped += 1;
      continue;
    }

    // Always reclassify — Gold/Silver SKUs often copied the same mixed folder
    // under different paths (/YWJE0028 vs /YWJE0029), so URL overlap is low.
    const parts = await partitionUrls(pooled);
    let nextGold = [...parts.gold];
    let nextSilver = [...parts.silver];

    if (nextGold.length < 1 || nextSilver.length < 1) {
      stats.skipped += 1;
      continue;
    }

    // Uncertain → silver (catalog default), unless silver already rich
    nextSilver = [...nextSilver, ...parts.uncertain];

    console.log(
      `split   ${family.slug}: gold=${nextGold.length} silver=${nextSilver.length} (from ${pooled.length})`,
    );
    await patchVariant(goldV.id, {
      material: FINISH_GOLD,
      color_swatch: GOLD_SWATCH,
      hero_url: nextGold[0],
      gallery: toGalleryRows(nextGold),
    });
    await patchVariant(silverV.id, {
      material: FINISH_SILVER,
      color_swatch: SILVER_SWATCH,
      hero_url: nextSilver[0],
      gallery: toGalleryRows(nextSilver),
    });
    await patchFamily(family.id, { has_color_variants: true });
    stats.galleriesSplit += 1;
  }

  // —— Phase 3: expand single-variant mixed galleries into Gold + Silver ——
  for (const family of families) {
    const variants = byFamily.get(family.id) || [];
    if (variants.length !== 1) continue;
    const primary = variants[0];
    const urls = galleryUrls(primary);
    if (urls.length < 4) {
      stats.skipped += 1;
      continue;
    }

    // Prefer pieces that already hint at dual metal in material/copy
    const materialHintsBoth =
      /gold/i.test(primary.material || '') && /silver|sterling|925/i.test(primary.material || '');

    const parts = await partitionUrls(urls);
    const canSplit =
      parts.gold.length >= 2 &&
      parts.silver.length >= 2 &&
      (materialHintsBoth || parts.gold.length + parts.silver.length >= Math.ceil(urls.length * 0.55));

    if (!canSplit) {
      stats.skipped += 1;
      continue;
    }

    let nextSilver = [...parts.silver, ...parts.uncertain];
    let nextGold = [...parts.gold];
    if (nextSilver.length < 2) nextSilver = [...parts.silver, ...parts.uncertain, ...urls.filter((u) => !nextGold.includes(u))];

    const goldSlug = `${family.slug}-gold`;
    // Avoid colliding if slug already exists elsewhere
    const exists = await rest(
      `product_color_variants?select=id&slug=eq.${encodeURIComponent(goldSlug)}&limit=1`,
    );
    if (exists?.length) {
      console.log(`skip    ${family.slug}: gold slug already exists`);
      stats.skipped += 1;
      continue;
    }

    console.log(
      `expand  ${family.slug}: silver=${nextSilver.length} gold=${nextGold.length} (was ${urls.length})`,
    );

    await patchFamily(family.id, { has_color_variants: true });
    await patchVariant(primary.id, {
      color_label: 'Silver',
      color_swatch: SILVER_SWATCH,
      material: FINISH_SILVER,
      is_primary: true,
      hero_url: nextSilver[0],
      gallery: toGalleryRows(nextSilver),
    });

    const maxSort = Number(primary.sort_order) || 0;
    await insertVariant({
      id: randomUUID(),
      family_id: family.id,
      slug: goldSlug,
      color_label: 'Gold',
      color_swatch: GOLD_SWATCH,
      is_primary: false,
      price: primary.price,
      description: primary.description,
      story: primary.story || '',
      care: primary.care || '',
      features: primary.features || [],
      material: FINISH_GOLD,
      length_label: primary.length_label,
      reviews: primary.reviews || { rating: 0, count: 0 },
      hero_url: nextGold[0],
      gallery: toGalleryRows(nextGold),
      stock: primary.stock ?? 5,
      out_of_stock: false,
      active: true,
      sort_order: maxSort + 1,
    });

    stats.familiesExpanded += 1;
  }

  console.log('\nDone.', stats);
  if (DRY) console.log('(dry-run — no writes)');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
