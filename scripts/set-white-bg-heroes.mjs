/**
 * For every product variant: pick a white-background shot as hero,
 * put remaining images in gallery. If none look white-bg, keep current/first.
 *
 *   node --env-file=.env.local scripts/set-white-bg-heroes.mjs --dry-run
 *   node --env-file=.env.local scripts/set-white-bg-heroes.mjs
 *   node --env-file=.env.local scripts/set-white-bg-heroes.mjs --threshold=0.8
 */

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

if (process.env.SUPABASE_INSECURE_TLS === '1' || !process.env.NODE_TLS_REJECT_UNAUTHORIZED) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const DRY = process.argv.includes('--dry-run');
const thresholdArg = process.argv.find((a) => a.startsWith('--threshold='));
const WHITE_THRESHOLD = thresholdArg ? Number(thresholdArg.split('=')[1]) : 0.78;

const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '');
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const headers = {
  apikey: key,
  Authorization: `Bearer ${key}`,
  'Content-Type': 'application/json',
  Prefer: 'return=minimal',
};

function urlToLocal(imageUrl) {
  if (!imageUrl || typeof imageUrl !== 'string') return null;
  const clean = imageUrl.split('?')[0];
  if (clean.startsWith('/products/')) {
    return path.join('public', ...clean.split('/').filter(Boolean));
  }
  if (clean.startsWith('/YIWU')) {
    const decoded = decodeURIComponent(clean);
    return path.join('public', ...decoded.split('/').filter(Boolean));
  }
  // Absolute same-origin style path
  try {
    const u = new URL(clean, 'http://local');
    if (u.pathname.startsWith('/products/')) {
      return path.join('public', ...u.pathname.split('/').filter(Boolean));
    }
  } catch {
    /* ignore */
  }
  return null;
}

/**
 * Score 0–1: share of border pixels that are near-white.
 * Studio product shots on white score high; lifestyle/coloured bgs score low.
 */
async function whiteBgScore(filePath) {
  try {
    const { data, info } = await sharp(filePath)
      .rotate()
      .resize(96, 96, { fit: 'fill' })
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const w = info.width;
    const h = info.height;
    const ch = info.channels;
    const border = 5;
    let white = 0;
    let total = 0;

    const nearWhite = (i) => {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      // Allow slight warm/cool cast on "white" paper
      return r >= 238 && g >= 238 && b >= 238 && Math.max(r, g, b) - Math.min(r, g, b) <= 18;
    };

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const onBorder = x < border || y < border || x >= w - border || y >= h - border;
        if (!onBorder) continue;
        total += 1;
        const i = (y * w + x) * ch;
        if (nearWhite(i)) white += 1;
      }
    }

    if (!total) return 0;
    return white / total;
  } catch (err) {
    console.warn('  score fail', path.basename(filePath), err.message);
    return 0;
  }
}

function collectUrls(variant) {
  const urls = [];
  const seen = new Set();
  const push = (u) => {
    if (!u || seen.has(u)) return;
    seen.add(u);
    urls.push(u);
  };
  push(variant.hero_url);
  for (const g of variant.gallery || []) {
    if (g?.url && g.kind !== 'video') push(g.url);
  }
  return urls;
}

async function fetchAllVariants() {
  const out = [];
  let from = 0;
  const size = 1000;
  while (true) {
    const res = await fetch(
      `${url}/rest/v1/product_color_variants?select=id,slug,hero_url,gallery,features,active&active=eq.true&order=slug.asc`,
      {
        headers: {
          ...headers,
          Range: `${from}-${from + size - 1}`,
          Prefer: 'count=exact',
        },
      },
    );
    const rows = await res.json();
    if (!Array.isArray(rows)) throw new Error(JSON.stringify(rows));
    out.push(...rows);
    if (rows.length < size) break;
    from += size;
  }
  return out;
}

async function patchVariant(id, hero_url, gallery) {
  const res = await fetch(`${url}/rest/v1/product_color_variants?id=eq.${id}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({
      hero_url,
      gallery,
      updated_at: new Date().toISOString(),
    }),
  });
  if (!res.ok) {
    throw new Error(`PATCH ${id}: ${res.status} ${await res.text()}`);
  }
}

function skuOf(v) {
  const f = (v.features || []).find((x) => /^SKU\s/i.test(String(x)));
  return f ? String(f).replace(/^SKU\s+/i, '').trim() : v.slug;
}

async function main() {
  console.log(
    `White-bg hero picker  threshold=${WHITE_THRESHOLD}  dry=${DRY}`,
  );
  const variants = await fetchAllVariants();
  const report = {
    updated: 0,
    already: 0,
    noImages: 0,
    whiteHero: 0,
    fallbackHero: 0,
    skippedRemote: 0,
  };

  for (const v of variants) {
    const sku = skuOf(v);
    const urls = collectUrls(v);
    if (!urls.length) {
      report.noImages += 1;
      continue;
    }

    const scored = [];
    for (const imageUrl of urls) {
      const local = urlToLocal(imageUrl);
      if (!local || !fs.existsSync(local)) {
        scored.push({ url: imageUrl, score: -1, local: null });
        continue;
      }
      const score = await whiteBgScore(local);
      scored.push({ url: imageUrl, score, local });
    }

    const withLocal = scored.filter((s) => s.score >= 0);
    if (!withLocal.length) {
      report.skippedRemote += 1;
      console.log(`SKIP ${sku} — no local files to analyse`);
      continue;
    }

    withLocal.sort((a, b) => b.score - a.score);
    const bestWhite = withLocal.find((s) => s.score >= WHITE_THRESHOLD);
    const scores = withLocal
      .map((s) => `${path.basename(s.local || s.url)}=${s.score.toFixed(2)}`)
      .join(' ');

    // No clear white-bg shot → keep existing hero/gallery as-is.
    if (!bestWhite) {
      report.fallbackHero += 1;
      report.already += 1;
      console.log(`KEEP ${sku} [FALLBACK] no white-bg (≥${WHITE_THRESHOLD})  ${scores}`);
      continue;
    }

    const hero = bestWhite;
    const rest = [
      ...withLocal.filter((s) => s.url !== hero.url).sort((a, b) => b.score - a.score),
      ...scored.filter((s) => s.score < 0 && s.url !== hero.url),
    ];
    const ordered = [hero.url, ...rest.map((s) => s.url)];

    const gallery = ordered.map((u, i) => ({
      url: u,
      kind: 'image',
      alt: `${sku} ${i + 1}`,
    }));

    const changed =
      v.hero_url !== hero.url ||
      JSON.stringify((v.gallery || []).map((g) => g.url)) !==
        JSON.stringify(ordered);

    if (!changed) {
      report.already += 1;
      report.whiteHero += 1;
      console.log(`OK   ${sku} [WHITE] hero unchanged  ${scores}`);
    } else {
      console.log(
        `${DRY ? 'DRY' : 'SET'}  ${sku} [WHITE] hero=${path.basename(hero.url)} (${hero.score.toFixed(2)})  ${scores}`,
      );
      if (!DRY) await patchVariant(v.id, hero.url, gallery);
      report.updated += 1;
      report.whiteHero += 1;
    }
  }

  console.log(JSON.stringify(report, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
