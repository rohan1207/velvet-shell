/**
 * Attach public/YIWU Products images to YWJE variants in Supabase.
 * Copies into public/products/ywje/{SKU}/ for stable URLs, then PATCHes hero_url + gallery.
 *
 *   node --env-file=.env.local scripts/attach-yiwu-images.mjs
 *   node --env-file=.env.local scripts/attach-yiwu-images.mjs --dry-run
 */

import fs from 'fs';
import path from 'path';

if (process.env.SUPABASE_INSECURE_TLS === '1' || !process.env.NODE_TLS_REJECT_UNAUTHORIZED) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const DRY = process.argv.includes('--dry-run');
const ROOT = path.join('public', 'YIWU Products');
const OUT_ROOT = path.join('public', 'products', 'ywje');
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

/** Resolve folder or file paths relative to YIWU Products root. */
function resolveSources(spec) {
  const items = Array.isArray(spec) ? spec : [spec];
  const files = [];
  for (const item of items) {
    const abs = path.join(ROOT, item);
    if (!fs.existsSync(abs)) {
      console.warn('  MISSING source:', item);
      continue;
    }
    const st = fs.statSync(abs);
    if (st.isDirectory()) {
      files.push(
        ...fs
          .readdirSync(abs)
          .filter((n) => /\.(avif|jpe?g|png|webp)$/i.test(n))
          .sort(naturalSort)
          .map((n) => path.join(abs, n)),
      );
    } else if (st.isFile()) {
      files.push(abs);
    }
  }
  return [...new Set(files)];
}

function naturalSort(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

function preferHero(files) {
  // Prefer clean product shots (no trailing letter variants first), then shorter names
  const scored = files.map((f) => {
    const base = path.basename(f);
    let score = 0;
    if (/\(\d+\)/.test(base)) score += 2;
    if (/[a-z]$/i.test(base.replace(/\.[^.]+$/, '').replace(/\s+$/, ''))) score += 1;
    if (/_+$/.test(base.replace(/\.[^.]+$/, ''))) score -= 1;
    if (/wear|hand|model|n\.|r\.|w\./i.test(base)) score += 3;
    return { f, score, base };
  });
  scored.sort((a, b) => a.score - b.score || naturalSort(a.base, b.base));
  return scored.map((x) => x.f);
}

function copyForSku(sku, sourceFiles) {
  const destDir = path.join(OUT_ROOT, sku);
  fs.mkdirSync(destDir, { recursive: true });
  // clear previous
  for (const n of fs.readdirSync(destDir)) {
    fs.unlinkSync(path.join(destDir, n));
  }
  const ordered = preferHero(sourceFiles);
  const urls = [];
  ordered.forEach((src, i) => {
    const ext = path.extname(src).toLowerCase();
    const name = `${String(i + 1).padStart(2, '0')}${ext}`;
    fs.copyFileSync(src, path.join(destDir, name));
    urls.push(`/products/ywje/${sku}/${name}`);
  });
  return urls;
}

/**
 * Explicit map: YWJE SKU → one or more paths under public/YIWU Products
 * (folder = all images; file = that file only).
 */
const MAP = {
  // —— Earrings 0001–0008 ——
  YWJE0001: ['Yiwu(earrings)/Flowers Long Earrings'],
  YWJE0002: ['Yiwu(earrings)/Thai Flower Long Tassel Earrings'],
  YWJE0003: ['Yiwu(earrings)/Flower Long Tassel Earrings'],
  YWJE0004: [
    'Yiwu(earrings)/Lotus Flower Drop Earrings',
    'Yiwu(earrings)/Silver Long Lotus Flower Drop Earrings.avif',
  ],
  YWJE0005: ['Yiwu(earrings)/Long Flower Earrings'],
  YWJE0006: ['Yiwu(earrings)/Elegant Lotus Long Drop Earring'],
  YWJE0007: ['Yiwu(earrings)/Round Cat Silver Pearl Stud'],
  YWJE0008: ['Yiwu(earrings)/Silver Stud Flower Daisy Earrings'],

  // Pearl studs family (shared folder)
  YWJE0009: ['Yiwu(earrings)/Freshwater Pearl Stud', 'Yiwu(SET)/Freshwater Pearl Set.avif'],
  YWJE0010: ['Yiwu(earrings)/Freshwater Pearl Stud', 'Yiwu(SET)/Freshwater Pearl Set.avif'],
  YWJE0011: ['Yiwu(earrings)/Freshwater Pearl Stud', 'Yiwu(SET)/Freshwater Pearl Set.avif'],
  YWJE0012: ['Yiwu(earrings)/Freshwater Pearl Stud', 'Yiwu(SET)/Freshwater Pearl Set.avif'],
  YWJE0013: ['Yiwu(earrings)/Freshwater Pearl Stud', 'Yiwu(SET)/Freshwater Pearl Set.avif'],
  YWJE0014: ['Yiwu(earrings)/Freshwater Pearl Stud', 'Yiwu(SET)/Freshwater Pearl Set.avif'],

  YWJE0015: [
    'Yiwu(Bracelet)/Silver Pearl Open Bracelet  Pearl Bracelet Valentine_s Day Present High-quality Popular Bracelet',
  ],
  YWJE0016: ['Yiwu(Bracelet)/Vintage Silver Dolphin Zircon Bracelets'],
  YWJE0017: ['Yiwu(Bracelet)/Vintage Silver Dolphin Zircon Bracelets'],
  YWJE0018: ['Yiwu(earrings)/Chic Lotus Flower Stud Earring'],
  YWJE0019: ['Yiwu(earrings)/Chic Lotus Flower Stud Earring'],
  YWJE0020: [
    'Yiwu(Bracelet)/Clover Geometric Square Vintage Style Open  Bracelet',
  ],
  YWJE0021: ['Yiwu(earrings)/Silver Flower Pearl Stud'],
  YWJE0022: ['Yiwu(earrings)/Round Brincos Grandes earring'],
  YWJE0023: ['Yiwu(earrings)/Four Leaf Clover Earrings'],
  YWJE0024: ['Yiwu(earrings)/Long Leaf Drop Earrings'],
  YWJE0025: ['Yiwu (rings)/Daisy Rings'],
  YWJE0026: ['Yiwu (rings)/Leaves Silver Ring Opening Rings'],
  YWJE0027: ['Yiwu(necklace)/Clavicle Chain'],
  YWJE0028: ['Yiwu(necklace)/Cat Animal Necklace'],
  YWJE0029: ['Yiwu(necklace)/Cat Animal Necklace'],
  YWJE0030: ['Yiwu(Bracelet)/Double Star Bracelet'],
  YWJE0031: ['Yiwu(Bracelet)/Simple Flower Bracelet'],
  YWJE0032: ['Yiwu(Bracelet)/Strawberry Crystal Feather'],
  YWJE0033: ['Yiwu(Bracelet)/Daisy Bracelet', 'Yiwu(Bracelet)/flower bracelet.avif'],
  YWJE0034: ['Yiwu(Bracelet)/Feather Bracelet'],
  YWJE0035: ['Yiwu(Bracelet)/Feather Bracelet'],
  YWJE0036: ['Yiwu(earrings)/Trendy Sterling Silver Stud'],
  YWJE0037: ['Yiwu(earrings)/Silver Clover Pearl Stud'],
  YWJE0038: ['Yiwu(necklace)/High Heels Necklace'],
  YWJE0039: ['Yiwu(necklace)/Lotus Necklace'],
  YWJE0040: ['Yiwu(necklace)/Lotus Necklace'],
  YWJE0041: ['Yiwu(necklace)/Pine Cone Choker Necklaces'],
  YWJE0042: ['Yiwu(necklace)/silver pearl stud', 'Yiwu(necklace)/Clover Pearl Necklace'],
  YWJE0043: ['Yiwu(earrings)/Silver Clover Stud'],
  YWJE0044: ['Yiwu(earrings)/Heart Stud Earrings'],
  YWJE0045: ['Yiwu(necklace)/Clover Pearl Necklace'],
  YWJE0046: [
    'Yiwu(Bracelet)/Strawberry Crystal Simple Personality Sweet Bracelet',
  ],
  YWJE0047: ['Yiwu(Bracelet)/Bar Bird Branches  Open Bracelet'],
  YWJE0048: ['Yiwu(Bracelet)/Simple Bar Cute Puppy  Bracelet'],
  YWJE0049: ['Yiwu(Bracelet)/Clover open bracelet', 'Yiwu(Bracelet)/Clover bracelet'],
  YWJE0050: ['Yiwu(Bracelet)/Daisy Open Bracelet'],
  YWJE0051: ['Yiwu(Bracelet)/Red Heart Bracelet', 'Yiwu(Bracelet)/Heart shaped Bracelet.avif'],
  YWJE0052: ['Yiwu(necklace)/Flower Branch Bird Sterling Silver Necklace'],
  YWJE0053: ['Yiwu(Bracelet)/Leaf bangles'],
  YWJE0054: ['Yiwu(earrings)/Rose earring Stud'],
  YWJE0055: ['Yiwu (rings)/Irregular Liquid Streamline Pearl'],
  YWJE0056: ['Yiwu(Bracelet)/Bamboo Knot Shore', 'Yiwu(Bracelet)/SL294h.avif'],
  YWJE0057: [
    "Yiwu(Anklet)/Anklet Women_s Light Luxury Niche Korean Version Versatile High-end Ginkgo",
  ],
  YWJE0058: ['Yiwu(Bracelet)/Bamboo Joint Bracelet'],
  YWJE0059: [
    'Yiwu(Bracelet)/Pearl Silver Beaded Bracelet  Light Luxury Fine Chain Link Versatil',
    'Yiwu(Bracelet)/Pearl Silver Beaded Bracelet  Light Luxury Fine Chain Link Versatile',
  ],
  YWJE0060: ['Yiwu(Bracelet)/Pearl Bracelet'],
  YWJE0061: ['Yiwu(Bracelet)/Pearl Bracelet'],
  YWJE0062: ['Yiwu(Anklet)/Lock Ankle Chain'],
  YWJE0063: ['Yiwu(necklace)/Silver flower necklace'],
  YWJE0064: ['Yiwu(Anklet)/Palace Bell Ankle Chain'],
  YWJE0065: ['Yiwu(necklace)/Pendant Collarbone Necklace'],
  YWJE0066: ['Yiwu(necklace)/Water Drop Necklace'],
  YWJE0067: ['Yiwu(necklace)/Pearl drop necklace.avif', 'Yiwu(necklace)/Pendant Collarbone Necklace'],
  YWJE0068: ['Yiwu(earrings)/Sterling Silver Vintage Stud'],
  // Pearl shell / lava — no dedicated folders; closest pearl studs + set
  YWJE0069: ['Yiwu(earrings)/Freshwater Pearl Stud', 'Yiwu(SET)/Freshwater Pearl Set.avif'],
  YWJE0070: ['Yiwu(earrings)/Freshwater Pearl Stud', 'Yiwu(earrings)/Sterling Silver Pearl Earrings'],
  YWJE0071: ['Yiwu(Bracelet)/Glittering Pearl Bracelet'],
  YWJE0072: ['Yiwu(Bracelet)/Glittering Pearl Bracelet'],
  YWJE0073: [
    'Yiwu(Bracelet)/Fresh Sweet Fairy-like Fringed Collarbone Chain Heart-shaped Pearl Bead Bracelet',
  ],
  YWJE0074: [
    'Yiwu(Bracelet)/Sweet Fairy-like Fringed',
    'Yiwu(Bracelet)/Fresh Sweet Fairy-like Fringed Collarbone Chain Heart-shaped Pearl Bead Bracelet',
  ],
  YWJE0075: ['Yiwu(Bracelet)/Daisy Open Bracelet', 'Yiwu(SET)/Daisy set.avif'],
  YWJE0076: ['Yiwu(SET)/Daisy set.avif', 'Yiwu(necklace)/Sweet flower'],
  YWJE0077: ['Yiwu (rings)/Daisy Rings', 'Yiwu(SET)/Daisy set.avif'],
  YWJE0078: [
    'Yiwu(Bracelet)/Broken Bow',
    'Yiwu(SET)/Broken Bow Bracelet with Collarbone Chain.avif',
  ],
  YWJE0079: ['Yiwu(Bracelet)/Christian Design Bracelet'],
  YWJE0080: ['Yiwu(Bracelet)/Christian Design Bracelet'],
  YWJE0081: ['Yiwu(Bracelet)/Leaf bangles'],
  YWJE0082: [
    'Yiwu(SET)/Zircon Geometric Rhodium Plated Set.avif',
    'Yiwu(earrings)/Zircon Geometric Rhodium Plated Charming.avif',
    'Yiwu (rings)/Zircon Geometric Rhodium Plated Charming Korean-style Minimalist Elegant',
  ],
  YWJE0083: [
    'Yiwu(SET)/Zircon Flower set.avif',
    'Yiwu(earrings)/Zircon Flower',
    'Yiwu(necklace)/Zircon Flower Necklaces',
    'Yiwu (rings)/Zircon Flower ring',
  ],
  YWJE0084: [
    'Yiwu(SET)/Set Korean Style Trendy Sterling Silver Stud Earrings with Zircon Gold_Silver Plated Christian Design for Women.avif',
    'Yiwu(Bracelet)/Christian Design Bracelet',
    'Yiwu (rings)/Christian ring',
  ],
  YWJE0085: ['Yiwu(Bracelet)/Christian Design Bracelet'],
  YWJE0086: [
    'Yiwu (rings)/Christian ring',
    'Yiwu(necklace)/Heart shaped necklace',
  ],
  YWJE0087: ['Yiwu (rings)/Christian ring'],
  YWJE0088: [
    'Yiwu(SET)/Forest Sweet Fashion Whale Pendant Cute Dolphin Collarbone Chain.avif',
    'Yiwu(necklace)/Whale Pendant Cute Dolphin Collarbone Chain',
    'Yiwu(earrings)/Forest Sweet Fashion Whale Stud',
  ],
  YWJE0089: [
    'Yiwu(SET)/Daisy set.avif',
    'Yiwu(earrings)/Zircon Flower',
    'Yiwu (rings)/Daisy Rings',
  ],
  YWJE0090: ['Yiwu (rings)/Daisy Rings'],
  YWJE0091: ['Yiwu(earrings)/Zircon Flower', 'Yiwu(SET)/Daisy set.avif'],
  YWJE0092: ['Yiwu(necklace)/Zircon Flower Necklaces', 'Yiwu(SET)/Daisy set.avif'],
  YWJE0093: [
    'Yiwu(SET)/Sterling Silver Elegant Snowflake Set.avif',
    'Yiwu(necklace)/Snowflakes',
    'Yiwu(earrings)/Elegant Snowflakes earring.avif',
  ],
  YWJE0094: [
    'Yiwu(SET)/Sterling Silver Elegant Snowflake Set.avif',
    'Yiwu(necklace)/Snowflakes',
  ],
  YWJE0095: ['Yiwu(necklace)/Snowflakes', 'Yiwu(SET)/Sterling Silver Elegant Snowflake Set.avif'],
  YWJE0096: [
    'Yiwu(earrings)/Elegant Snowflakes earring.avif',
    'Yiwu(SET)/Sterling Silver Elegant Snowflake Set.avif',
  ],
  YWJE0097: [
    'Yiwu(SET)/Sterling Silver Gentle Temperament Butterfly-themed Lightly.avif',
    'Yiwu(necklace)/Butterfly-themed necklace',
    'Yiwu(Bracelet)/Butterfly themed Bracelet.avif',
    'Yiwu(earrings)/Butterfly Stud.avif',
  ],
  YWJE0098: ['Yiwu(necklace)/Butterfly-themed necklace'],
  YWJE0099: ['Yiwu(Bracelet)/Butterfly themed Bracelet.avif'],
  YWJE0100: ['Yiwu(necklace)/Pink pearl necklace'],
  YWJE0101: [
    'Yiwu(Bracelet)/Strawberry Crystal Simple Personality Sweet Bracelet',
  ],
  YWJE0102: ['Yiwu(earrings)/Strawberry Crystal Pink Crystal Bead'],
  YWJE0103: [
    'Yiwu(Bracelet)/Feather Dreamcatcher Bracelet',
    'Yiwu(SET)/Feather Dreamcatcher Set.avif',
  ],
  YWJE0104: [
    'Yiwu(necklace)/Feather Dreamcatcher Chain',
    'Yiwu(SET)/Feather Dreamcatcher Set.avif',
  ],
  YWJE0105: [
    'Yiwu(earrings)/Feather Dreamcatcher',
    'Yiwu(SET)/Feather Dreamcatcher Set.avif',
  ],
  YWJE0106: [
    'Yiwu(SET)/Cute Bee Set.avif',
    'Yiwu(necklace)/Cute Bee',
    'Yiwu(earrings)/Cute Bee stud earring.avif',
  ],
  YWJE0107: ['Yiwu(earrings)/Cute Bee stud earring.avif'],
  YWJE0108: ['Yiwu(necklace)/Cute Bee'],
  YWJE0109: [
    'Yiwu(SET)/Fresh Leaf Collarbone Chain Korean Fashionable.avif',
    'Yiwu(necklace)/Fresh Leaf Collarbone Chain',
    'Yiwu (rings)/Fresh Leaf',
  ],
  YWJE0110: [
    'Yiwu(SET)/Sterling Silver Elegant Snowflake Set.avif',
    'Yiwu(necklace)/Snowflakes',
    'Yiwu(earrings)/Elegant Snowflakes earring.avif',
  ],
  YWJE0111: [
    'Yiwu(earrings)/Elegant Snowflakes earring.avif',
    'Yiwu(SET)/Sterling Silver Elegant Snowflake Set.avif',
  ],
  YWJE0112: ['Yiwu(necklace)/Snowflakes', 'Yiwu(SET)/Sterling Silver Elegant Snowflake Set.avif'],
  YWJE0113: [
    'Yiwu(SET)/Sweet Flower Sterling Silver Set.avif',
    'Yiwu(SET)/Sweet Flower Sterling Silver Set(1).avif',
    'Yiwu(necklace)/Sweet flower',
    'Yiwu(Bracelet)/Sweet flower bracelet',
    'Yiwu (rings)/Sweet Flower Ring',
  ],
  YWJE0114: ['Yiwu(necklace)/Sweet flower'],
  YWJE0115: [
    'Yiwu(earrings)/Zircon Flower',
    'Yiwu(SET)/Sweet Flower Sterling Silver Set.avif',
  ],
  YWJE0116: ['Yiwu(Bracelet)/Sweet flower bracelet'],
  YWJE0117: ['Yiwu (rings)/Sweet Flower Ring'],
  YWJE0118: [
    'Yiwu(SET)/Green leaves Set.avif',
    'Yiwu(Bracelet)/Green Leaves bracelet',
    'Yiwu (rings)/Green Leaves',
    'Yiwu(earrings)/Green Leaf earring',
  ],
  YWJE0119: [
    'Yiwu(SET)/Green leaves Set.avif',
    'Yiwu(necklace)/Fresh Leaf Collarbone Chain',
  ],
  YWJE0120: ['Yiwu(Bracelet)/Green Leaves bracelet'],
  YWJE0121: ['Yiwu (rings)/Green Leaves'],
  YWJE0122: [
    'Yiwu(earrings)/Green Leaf earring',
    'Yiwu(earrings)/Green Leaves Dangles',
  ],
  YWJE0123: ['Yiwu(earrings)/Sterling Silver Leaf Earring'],
  YWJE0124: ['Yiwu(earrings)/Sterling Silver Leaf Earring'],
  YWJE0125: ['Yiwu (rings)/Natural Freshwater Double Pearl Ring'],
  YWJE0126: ['Yiwu (rings)/Natural Freshwater Double Pearl Ring'],
  YWJE0127: ['Yiwu (rings)/Natural Freshwater Double Pearl Ring'],
  YWJE0128: ['Yiwu(earrings)/Double Pearl Clip-On Earring'],
  YWJE0129: ['Yiwu(earrings)/Double Pearl Clip-On Earring'],
  YWJE0130: ['Yiwu(necklace)/Starry Sky Mermaid Line Imitation Pearl Necklace'],
  YWJE0131: ['Yiwu(necklace)/Starry Sky Mermaid Line Imitation Pearl Necklace'],
  YWJE0132: ['Yiwu(necklace)/Starry Sky Mermaid Line Imitation Pearl Necklace'],
  YWJE0133: ['Yiwu(necklace)/Pearl Zircon Necklace'],
  YWJE0134: ['Yiwu(necklace)/Pearl Zircon Necklace'],
  YWJE0135: ['Yiwu(earrings)/Sterling Silver Pearl Earrings'],
  YWJE0136: ['Yiwu(earrings)/Silver Small Bead'],
};

async function fetchAllVariants() {
  const out = [];
  let from = 0;
  const size = 1000;
  while (true) {
    const res = await fetch(
      `${url}/rest/v1/product_color_variants?select=id,slug,features,hero_url,gallery&active=eq.true&order=slug.asc`,
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
    const t = await res.text();
    throw new Error(`PATCH ${id}: ${res.status} ${t}`);
  }
}

function skuOf(v) {
  const f = (v.features || []).find((x) => /^SKU\s/i.test(String(x)));
  return f ? String(f).replace(/^SKU\s+/i, '').trim().toUpperCase() : null;
}

async function main() {
  const variants = await fetchAllVariants();
  const bySku = Object.fromEntries(
    variants.map((v) => [skuOf(v), v]).filter(([s]) => s),
  );

  const report = { ok: [], empty: [], missingSku: [], unmapped: [] };
  const expected = Object.keys(MAP);

  for (const sku of expected) {
    const v = bySku[sku];
    if (!v) {
      report.missingSku.push(sku);
      continue;
    }
    const sources = resolveSources(MAP[sku]);
    if (!sources.length) {
      report.empty.push(sku);
      console.log(`EMPTY ${sku}`);
      continue;
    }
    const urls = DRY ? sources.map((_, i) => `/products/ywje/${sku}/${String(i + 1).padStart(2, '0')}.avif`) : copyForSku(sku, sources);
    const hero = urls[0];
    const gallery = urls.map((u, i) => ({
      url: u,
      kind: 'image',
      alt: `${sku} ${i + 1}`,
    }));
    console.log(`${DRY ? 'DRY ' : ''}${sku} → ${urls.length} images  hero=${hero}`);
    if (!DRY) await patchVariant(v.id, hero, gallery);
    report.ok.push({ sku, count: urls.length, slug: v.slug });
  }

  const mapped = new Set(expected);
  for (const sku of Object.keys(bySku)) {
    if (!mapped.has(sku) && /^YWJE\d+$/.test(sku)) report.unmapped.push(sku);
  }

  console.log(
    JSON.stringify(
      {
        dry: DRY,
        attached: report.ok.length,
        empty: report.empty,
        missingSku: report.missingSku,
        unmapped: report.unmapped,
        sample: report.ok.slice(0, 5),
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
