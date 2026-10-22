/**
 * Seed Lotus Fun catalog from public/lotusfun folders + copy map.
 * Copies images to public/products/lotusfun/{SKU}/, upserts Supabase,
 * then picks white-bg heroes for LF* SKUs.
 *
 *   node --env-file=.env.local scripts/seed-lotusfun-catalog.mjs
 *   node --env-file=.env.local scripts/seed-lotusfun-catalog.mjs --dry-run
 */

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import {
  COLLECTIONS,
  fallbackDescription,
  matchCopy,
  norm,
  titleFromFolder,
} from './data/lotusfun-copy.mjs';

if (process.env.SUPABASE_INSECURE_TLS === '1' || !process.env.NODE_TLS_REJECT_UNAUTHORIZED) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const DRY = process.argv.includes('--dry-run');
const ROOT = path.join('public', 'lotusfun');
const OUT_ROOT = path.join('public', 'products', 'lotusfun');
const WHITE_THRESHOLD = 0.78;

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
};

const CAT_DIR = {
  'LotusFun_Rings(sept)': 'rings',
  'LotusFun_Bracelets (Sept)': 'bracelets',
  'LotusFun_brooch(sept)': 'cuffs',
  'LotusFun_chain(sept)': 'necklaces',
  'LotusFun_necklace(sept)': 'necklaces',
  'LotusFun_Earrings (Sept)': 'earrings',
};

const DEFAULT_PRICE = {
  rings: 3899,
  bracelets: 3699,
  cuffs: 3299,
  necklaces: 3499,
  earrings: 3299,
};

const DEFAULT_SHIPPING = {
  intro:
    'Orders are prepared Monday to Friday (excluding public holidays). Orders placed on Friday usually ship the following Monday.',
  regions: [{ location: 'India', eta: '5–7 working days' }],
  note: 'We currently deliver within India only. Estimated times start after dispatch and may vary during peak periods or courier delays.',
  delayed:
    'If tracking has not updated for several days, the parcel is not always lost. Contact us with your order number and we will investigate with the courier. Where needed, we arrange a replacement or refund.',
  returnsNote: 'See our Returns, Refunds & Exchanges policy for damaged or incorrect items.',
};

const CARE =
  'Remove before bathing. Wipe dry after wear. Store alone in the pouch.';

function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function naturalSort(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

function listImages(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((n) => /\.(avif|jpe?g|png|webp)$/i.test(n))
    .sort(naturalSort)
    .map((n) => path.join(dir, n));
}

function inventary() {
  const items = [];
  for (const [dirName, category] of Object.entries(CAT_DIR)) {
    const catPath = path.join(ROOT, dirName);
    if (!fs.existsSync(catPath)) {
      console.warn('Missing category folder:', dirName);
      continue;
    }
    for (const folder of fs
      .readdirSync(catPath, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
      .sort(naturalSort)) {
      items.push({
        category,
        folder,
        sourceDir: path.join(catPath, folder),
        catDirName: dirName,
      });
    }
  }
  return items;
}

function resolveSourceImages(item, copy) {
  let files = listImages(item.sourceDir);
  if (!files.length && copy?.imageFallback) {
    const fallback = path.join(path.dirname(item.sourceDir), copy.imageFallback);
    files = listImages(fallback);
  }
  return files;
}

function preferHeroOrder(files) {
  const scored = files.map((f) => {
    const base = path.basename(f);
    let score = 0;
    if (/\(\d+\)/.test(base)) score += 2;
    if (/wear|hand|model|on[- ]?finger|lifestyle/i.test(base)) score += 4;
    return { f, score, base };
  });
  scored.sort((a, b) => a.score - b.score || naturalSort(a.base, b.base));
  return scored.map((x) => x.f);
}

function copyForSku(sku, sourceFiles) {
  const destDir = path.join(OUT_ROOT, sku);
  fs.mkdirSync(destDir, { recursive: true });
  for (const n of fs.readdirSync(destDir)) {
    fs.unlinkSync(path.join(destDir, n));
  }
  const ordered = preferHeroOrder(sourceFiles);
  const urls = [];
  ordered.forEach((src, i) => {
    const ext = path.extname(src).toLowerCase();
    const name = `${String(i + 1).padStart(2, '0')}${ext}`;
    fs.copyFileSync(src, path.join(destDir, name));
    urls.push(`/products/lotusfun/${sku}/${name}`);
  });
  return urls;
}

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
      return r >= 238 && g >= 238 && b >= 238 && Math.max(r, g, b) - Math.min(r, g, b) <= 18;
    };
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (!(x < border || y < border || x >= w - border || y >= h - border)) continue;
        total += 1;
        if (nearWhite((y * w + x) * ch)) white += 1;
      }
    }
    return total ? white / total : 0;
  } catch {
    return 0;
  }
}

async function pickWhiteHero(urls) {
  if (!urls.length) return { hero: '', gallery: [] };
  const scored = [];
  for (const imageUrl of urls) {
    const local = path.join('public', ...imageUrl.split('/').filter(Boolean));
    const score = fs.existsSync(local) ? await whiteBgScore(local) : -1;
    scored.push({ url: imageUrl, score });
  }
  const local = scored.filter((s) => s.score >= 0).sort((a, b) => b.score - a.score);
  const best = local.find((s) => s.score >= WHITE_THRESHOLD) || local[0] || scored[0];
  const rest = scored.filter((s) => s.url !== best.url);
  const ordered = [best.url, ...rest.map((s) => s.url)];
  return {
    hero: ordered[0],
    gallery: ordered.map((u, i) => ({ url: u, kind: 'image', alt: `image ${i + 1}` })),
  };
}

async function rest(pathname, { method = 'GET', body, prefer } = {}) {
  const res = await fetch(`${url}/rest/v1/${pathname}`, {
    method,
    headers: {
      ...headers,
      ...(prefer ? { Prefer: prefer } : {}),
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
    throw new Error(`${method} ${pathname} → ${res.status}: ${typeof data === 'object' ? JSON.stringify(data) : data}`);
  }
  return data;
}

async function findFamilyId(slug) {
  const rows = await rest(`product_families?slug=eq.${encodeURIComponent(slug)}&select=id`);
  return rows?.[0]?.id || null;
}

async function findVariantId(slug) {
  const rows = await rest(`product_color_variants?slug=eq.${encodeURIComponent(slug)}&select=id`);
  return rows?.[0]?.id || null;
}

function reviews(seed) {
  const rating = [4.6, 4.7, 4.8, 4.9, 5][seed % 5];
  const count = 8 + ((seed * 7) % 41);
  return {
    rating,
    count,
    highlights: ['Beautiful finish', 'Feels light to wear', 'Gift-ready packaging'],
  };
}

function buildProduct(item, index) {
  const copy = matchCopy(item.folder, item.category);
  const name = copy?.name || titleFromFolder(item.folder);
  const baseSlug = `lf-${slugify(name)}`;
  // Disambiguate same names across categories / duplicate folders
  const slug =
    item.category === 'earrings' && /butterfly stud/i.test(item.folder) && /\(/.test(item.folder)
      ? `lf-${slugify(item.folder)}`
      : itemsNeedSuffix(item, name)
        ? `${baseSlug}-${item.category.replace(/s$/, '')}`
        : baseSlug;

  const sku = `LF${String(index + 1).padStart(4, '0')}`;
  const price = copy?.price || DEFAULT_PRICE[item.category] || 3499;
  const material = copy?.material || 'Sterling Silver';
  const collection = copy?.collection || 'garden-path';
  const description =
    copy?.description || fallbackDescription(name, item.category);
  const features = [...(copy?.bullets || ['Handmade With Love', 'Unique Design', 'Beautifully Packaged', 'Great For Gift'])];
  if (!features.some((f) => /^SKU\s/i.test(f))) features.push(`SKU ${sku}`);
  else {
    const i = features.findIndex((f) => /^SKU\s/i.test(f));
    features[i] = `SKU ${sku}`;
  }

  const story = description.split(/\n\n/)[0] || '';

  return {
    item,
    copy,
    family: {
      slug,
      name,
      category: item.category,
      collection,
      badge: 'Lotus Fun',
      hasColorVariants: false,
      shipping: DEFAULT_SHIPPING,
      variant: {
        slug,
        colorLabel: 'Default',
        colorSwatch: '#C5C5C5',
        isPrimary: true,
        price,
        stock: 8,
        material,
        length: /adjustable|resizable/i.test(material + name) ? 'Adjustable' : '',
        description,
        story,
        care: CARE,
        features,
        reviews: reviews(index + 1),
        sku,
      },
    },
  };
}

/** When the same display name appears in multiple categories, suffix slug. */
const nameCategorySeen = new Map();
function itemsNeedSuffix(item, name) {
  const key = norm(name);
  const prev = nameCategorySeen.get(key);
  if (!prev) {
    nameCategorySeen.set(key, item.category);
    return false;
  }
  return prev !== item.category;
}

async function upsertCollections() {
  for (const c of COLLECTIONS) {
    if (DRY) continue;
    await rest('collections?on_conflict=slug', {
      method: 'POST',
      prefer: 'resolution=merge-duplicates,return=minimal',
      body: [{ slug: c.slug, name: c.name, line: c.line }],
    });
  }
  console.log(`Collections upserted: ${COLLECTIONS.length}`);
}

async function activateBrooches() {
  const row = {
    slug: 'cuffs',
    name: 'Brooches',
    line: 'Botanical accents for lapel, scarf or dress.',
    sort_order: 50,
    active: true,
  };
  console.log(`${DRY ? 'DRY' : 'ACTIVATE'} shop_category cuffs (Brooches)`);
  if (!DRY) {
    await rest('shop_categories?on_conflict=slug', {
      method: 'POST',
      prefer: 'resolution=merge-duplicates,return=minimal',
      body: [row],
    });
  }
}

async function upsertFamily(built) {
  const { family } = built;
  const v = family.variant;
  const familyRow = {
    slug: family.slug,
    name: family.name,
    category: family.category,
    collection_slug: family.collection,
    has_color_variants: false,
    shipping: family.shipping,
    recommended_family_ids: [],
    badge: family.badge || '',
    status: 'active',
    active: true,
    updated_at: new Date().toISOString(),
  };

  let familyId = await findFamilyId(family.slug);
  if (familyId) {
    await rest(`product_families?id=eq.${familyId}`, {
      method: 'PATCH',
      prefer: 'return=minimal',
      body: familyRow,
    });
  } else {
    const inserted = await rest('product_families', {
      method: 'POST',
      prefer: 'return=representation',
      body: [familyRow],
    });
    familyId = inserted[0].id;
  }

  const sourceFiles = resolveSourceImages(built.item, built.copy);
  let hero_url = '';
  let gallery = [];
  if (sourceFiles.length) {
    const urls = DRY
      ? sourceFiles.map((_, i) => `/products/lotusfun/${v.sku}/${String(i + 1).padStart(2, '0')}.jpg`)
      : copyForSku(v.sku, sourceFiles);
    const picked = DRY ? { hero: urls[0] || '', gallery: urls.map((u, i) => ({ url: u, kind: 'image', alt: `${v.sku} ${i + 1}` })) } : await pickWhiteHero(urls);
    hero_url = picked.hero;
    gallery = picked.gallery;
  }

  const variantRow = {
    family_id: familyId,
    slug: v.slug,
    color_label: v.colorLabel,
    color_swatch: v.colorSwatch,
    is_primary: true,
    price: v.price,
    description: v.description,
    story: v.story,
    care: v.care,
    features: v.features,
    material: v.material,
    length_label: v.length || (Array.isArray(v.sizeTags) ? v.sizeTags[0] : '') || '',
    size_tags: Array.isArray(v.sizeTags) ? v.sizeTags : v.length ? [v.length] : [],
    reviews: v.reviews,
    hero_url,
    gallery,
    stock: v.stock,
    out_of_stock: false,
    active: true,
    sort_order: 0,
    updated_at: new Date().toISOString(),
  };

  const existingId = await findVariantId(v.slug);
  if (existingId) {
    await rest(`product_color_variants?id=eq.${existingId}`, {
      method: 'PATCH',
      prefer: 'return=minimal',
      body: variantRow,
    });
  } else {
    await rest('product_color_variants', {
      method: 'POST',
      prefer: 'return=minimal',
      body: [variantRow],
    });
  }

  return { sku: v.sku, imgs: sourceFiles.length, hero: hero_url };
}

async function main() {
  const items = inventary();
  console.log(`Discovered ${items.length} Lotus Fun folders  dry=${DRY}`);

  // Build products in stable category order (already from CAT_DIR order)
  const built = items.map((item, i) => buildProduct(item, i));

  // Fix slug collisions (same name, same category, different folders)
  const slugCount = new Map();
  for (const b of built) {
    const s = b.family.slug;
    slugCount.set(s, (slugCount.get(s) || 0) + 1);
  }
  const slugSeen = new Map();
  for (const b of built) {
    const s = b.family.slug;
    if (slugCount.get(s) > 1) {
      const n = (slugSeen.get(s) || 0) + 1;
      slugSeen.set(s, n);
      if (n > 1) {
        const next = `${s}-${n}`;
        b.family.slug = next;
        b.family.variant.slug = next;
      }
    }
  }

  const matched = built.filter((b) => b.copy).length;
  const withImgs = built.filter((b) => resolveSourceImages(b.item, b.copy).length).length;
  console.log(`Copy matched: ${matched}/${built.length}  with images: ${withImgs}`);

  if (!DRY) {
    await upsertCollections();
    await activateBrooches();
  } else {
    console.log('DRY: skip collections / brooches activate');
  }

  let ok = 0;
  for (const b of built) {
    if (DRY) {
      const imgs = resolveSourceImages(b.item, b.copy).length;
      console.log(
        `DRY ${b.family.variant.sku}  ${b.family.category.padEnd(10)}  ${b.family.slug}  imgs=${imgs}  copy=${b.copy ? 'yes' : 'FALLBACK'}`,
      );
      ok += 1;
      continue;
    }
    const r = await upsertFamily(b);
    console.log(`  ✓ ${r.sku}  ${b.family.slug}  imgs=${r.imgs}  hero=${r.hero ? path.basename(r.hero) : '—'}`);
    ok += 1;
  }

  if (!DRY) {
    const byCat = {};
    for (const b of built) {
      byCat[b.family.category] = (byCat[b.family.category] || 0) + 1;
    }
    console.log('\nDone.');
    console.log('By category:', byCat);
    console.log(`SKUs written: ${ok}`);
  } else {
    console.log(`\nDRY complete — ${ok} products would be written.`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
