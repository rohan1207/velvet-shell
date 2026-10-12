/**
 * Promote root product photos (not catalog/) to SEO names.
 * Purest white-background shot becomes `{slug}-hero.*`; rest `{slug}-2.*`…
 * Rewrites lib/products.js image/gallery/hoverImage for earrings, necklace, bracelets, brooch.
 */
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const productsPath = path.join(root, 'lib', 'products.js');

const categories = [
  {
    key: 'earrings',
    dir: path.join(root, 'public', 'earrings'),
    urlBase: '/earrings',
    catalogJson: path.join(__dirname, 'earrings-catalog.json'),
  },
  {
    key: 'necklace',
    dir: path.join(root, 'public', 'necklace'),
    urlBase: '/necklace',
    catalogJson: path.join(__dirname, 'necklace-catalog.json'),
  },
  {
    key: 'brooch',
    dir: path.join(root, 'public', 'brooch'),
    urlBase: '/brooch',
    catalogJson: path.join(__dirname, 'brooch-catalog.json'),
  },
];

/** Bracelets have no catalog JSON — map root filenames by predicate */
const braceletSkus = [
  {
    slug: 'flower-in-the-rain-pink',
    match: (n) => /flower\s*in\s*the\s*rain/i.test(n) && /pink/i.test(n),
  },
  {
    slug: 'flower-in-the-rain-white',
    match: (n) => /flower\s*in\s*the\s*rain/i.test(n) && /white/i.test(n),
  },
  {
    slug: 'flower-in-the-rain-edit',
    match: (n) =>
      /flower\s*in\s*the\s*rain/i.test(n) && !/pink/i.test(n) && !/white/i.test(n),
  },
  {
    slug: 'forget-me-not-bangles',
    match: (n) => /forget/i.test(n) && /bangle/i.test(n),
  },
  {
    slug: 'forget-me-not-cuff',
    match: (n) => /forget/i.test(n) && !/bangle/i.test(n),
  },
  {
    slug: 'lotus-whisper-bangle-pink',
    match: (n) => /lotus\s*whisper/i.test(n) && /bangle/i.test(n) && /pink/i.test(n),
  },
  {
    slug: 'lotus-whisper-bangle-green',
    match: (n) => /lotus\s*whisper/i.test(n) && /bangle/i.test(n) && /green/i.test(n),
  },
  {
    slug: 'lotus-whisper-pink',
    match: (n) =>
      /lotus\s*whisper/i.test(n) && /pink/i.test(n) && !/bangle/i.test(n),
  },
  {
    slug: 'lotus-whisper-green',
    match: (n) =>
      /lotus\s*whisper/i.test(n) && /green/i.test(n) && !/bangle/i.test(n),
  },
  {
    slug: 'lotus-whisper-edit',
    match: (n) =>
      /^lotus\s*whisper\d/i.test(n.replace(/\s+/g, ' ').trim()) ||
      (/lotus\s*whisper/i.test(n) && !/pink|green|bangle/i.test(n)),
  },
];

function listImages(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => {
      const full = path.join(dir, f);
      return (
        fs.statSync(full).isFile() &&
        /\.(jpe?g|png|webp)$/i.test(f) &&
        !f.startsWith('_') &&
        !/-hero\./i.test(f) &&
        !/-wear\./i.test(f) &&
        !/^\w[\w-]+(-\d+)?\.(jpe?g|png|webp)$/i.test(f) // skip already-SEO names mid-run
      );
    });
}

function listAllImages(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => {
    const full = path.join(dir, f);
    return fs.statSync(full).isFile() && /\.(jpe?g|png|webp)$/i.test(f);
  });
}

/** Fraction of border samples that are near-white (or transparent-as-white for PNG). */
async function whiteScore(filePath) {
  try {
    const { data, info } = await sharp(filePath)
      .rotate()
      .resize(80, 80, { fit: 'fill' })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const { width: w, height: h, channels } = info;
    let white = 0;
    let total = 0;
    const border = 3;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const onBorder = x < border || y < border || x >= w - border || y >= h - border;
        if (!onBorder) continue;
        const i = (y * w + x) * channels;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = channels > 3 ? data[i + 3] : 255;
        total += 1;
        if (a < 20) {
          white += 1;
          continue;
        }
        if (r >= 235 && g >= 235 && b >= 235) white += 1;
      }
    }
    return total ? white / total : 0;
  } catch (err) {
    console.warn('whiteScore fail', path.basename(filePath), err.message);
    return 0;
  }
}

function resolveExisting(dir, names) {
  const onDisk = new Set(listAllImages(dir));
  const resolved = [];
  for (const name of names) {
    if (onDisk.has(name)) {
      resolved.push(name);
      continue;
    }
    // fuzzy: ignore case / unicode junk
    const target = name.toLowerCase().replace(/[^\w.()-]+/g, '');
    const hit = [...onDisk].find(
      (f) => f.toLowerCase().replace(/[^\w.()-]+/g, '') === target,
    );
    if (hit) resolved.push(hit);
  }
  return resolved;
}

async function promoteSku({ dir, urlBase, slug, sourceFiles, preferred }) {
  const existing = resolveExisting(dir, sourceFiles);
  if (!existing.length) {
    console.warn('MISS sources', slug, sourceFiles);
    return null;
  }

  const scored = [];
  for (const f of existing) {
    const score = await whiteScore(path.join(dir, f));
    const pref = preferred && preferred === f ? 1 : 0;
    scored.push({ f, score, pref });
  }
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.pref !== a.pref) return b.pref - a.pref;
    const ae = a.f.toLowerCase().endsWith('.jpg') ? 0 : 1;
    const be = b.f.toLowerCase().endsWith('.jpg') ? 0 : 1;
    if (ae !== be) return ae - be;
    return a.f.localeCompare(b.f, undefined, { numeric: true });
  });

  // Prefer jpg output names; keep source extension
  const written = [];
  const usedTargets = new Set();
  for (let i = 0; i < scored.length; i++) {
    const srcName = scored[i].f;
    const ext = path.extname(srcName).toLowerCase() || '.jpg';
    const outName = i === 0 ? `${slug}-hero${ext}` : `${slug}-${i + 1}${ext}`;
    const srcPath = path.join(dir, srcName);
    const outPath = path.join(dir, outName);
    if (path.resolve(srcPath) === path.resolve(outPath)) {
      written.push(outName);
      usedTargets.add(outName);
      continue;
    }
    // Avoid clobbering another source that already has this name
    if (fs.existsSync(outPath) && !usedTargets.has(outName)) {
      // if target exists and is not our staged write, overwrite — we own SEO names
    }
    fs.copyFileSync(srcPath, outPath);
    written.push(outName);
    usedTargets.add(outName);
    console.log(
      '  ',
      outName,
      `white=${scored[i].score.toFixed(2)}`,
      '←',
      srcName,
    );
  }

  // Remove old messy source names once copied (keep if same as SEO out)
  for (const srcName of existing) {
    if (usedTargets.has(srcName)) continue;
    if (written.includes(srcName)) continue;
    try {
      fs.unlinkSync(path.join(dir, srcName));
    } catch {
      // ignore
    }
  }

  const urls = written.map((f) => `${urlBase}/${f}`);
  return {
    slug,
    image: urls[0],
    gallery: urls,
    hoverImage: urls[1] || urls[0],
    white: scored[0]?.score ?? 0,
  };
}

function patchProducts(src, updates) {
  let out = src;
  let n = 0;
  for (const u of updates) {
    const escaped = u.slug.replace(/-/g, '\\-');
    const galleryLiteral = `[\n${u.gallery.map((p) => `      "${p}"`).join(',\n')},\n    ]`;
    const re = new RegExp(
      `(slug:\\s*"${escaped}"[\\s\\S]*?)(image:\\s*"[^"]*")([\\s\\S]*?)(gallery:\\s*\\[[\\s\\S]*?\\])([\\s\\S]*?)(hoverImage:\\s*"[^"]*")`,
    );
    if (!re.test(out)) {
      console.warn('PRODUCT MISS', u.slug);
      continue;
    }
    out = out.replace(re, (_full, a, _img, mid, _gal, mid2) => {
      n += 1;
      return `${a}image: "${u.image}"${mid}gallery: ${galleryLiteral}${mid2}hoverImage: "${u.hoverImage}"`;
    });
  }
  return { out, n };
}

function moveWearShots(dir, urlBase) {
  const catalogDir = path.join(dir, 'catalog');
  if (!fs.existsSync(catalogDir)) return [];
  const moved = [];
  for (const f of fs.readdirSync(catalogDir)) {
    if (!/^wear-.+\.(jpe?g|png|webp)$/i.test(f)) continue;
    const dest = f.replace(/^wear-/, '').replace(/(\.[^.]+)$/, '-wear$1');
    // wear-foo.jpg → foo-wear.jpg
    const m = f.match(/^wear-(.+)\.(jpe?g|png|webp)$/i);
    if (!m) continue;
    const outName = `${m[1]}-wear.${m[2].toLowerCase()}`;
    fs.copyFileSync(path.join(catalogDir, f), path.join(dir, outName));
    moved.push(`${urlBase}/${outName}`);
  }
  return moved;
}

async function runCategory(cat) {
  console.log(`\n=== ${cat.key} ===`);
  const data = JSON.parse(fs.readFileSync(cat.catalogJson, 'utf8'));
  const updates = [];
  for (const sku of data.skus || []) {
    console.log(sku.slug);
    const result = await promoteSku({
      dir: cat.dir,
      urlBase: cat.urlBase,
      slug: sku.slug,
      sourceFiles: sku._sourceFiles || [],
      preferred: sku._defaultSource,
    });
    if (result) updates.push(result);
  }
  const wears = moveWearShots(cat.dir, cat.urlBase);
  console.log('wear shots → root', wears.length);
  return updates;
}

async function runBracelets() {
  console.log('\n=== bracelets ===');
  const dir = path.join(root, 'public', 'bracelets');
  const urlBase = '/bracelets';
  const files = listAllImages(dir).filter((f) => !f.includes('catalog'));
  // Prefer original messy names; skip already SEO-hero if re-run
  const pool = files.filter((f) => !/^[a-z0-9]+(?:-[a-z0-9]+)*-hero\./i.test(f));
  const assigned = new Set();
  const updates = [];

  // Order matters: more specific bangle/pink matches first (array already ordered)
  for (const sku of braceletSkus) {
    const matched = pool.filter((f) => !assigned.has(f) && sku.match(f));
    if (!matched.length) {
      console.warn('MISS bracelet', sku.slug);
      continue;
    }
    matched.forEach((f) => assigned.add(f));
    console.log(sku.slug, matched.length);
    const result = await promoteSku({
      dir,
      urlBase,
      slug: sku.slug,
      sourceFiles: matched,
      preferred: null,
    });
    if (result) updates.push(result);
  }

  const orphans = pool.filter((f) => !assigned.has(f) && !/-hero\./i.test(f) && !/-\d+\./i.test(f));
  // ignore SEO leftovers
  const realOrphans = orphans.filter(
    (f) => !/^[a-z0-9]+(?:-[a-z0-9]+)*(-\d+)?\.(jpe?g|png|webp)$/i.test(f),
  );
  if (realOrphans.length) console.warn('ORPHANS bracelets', realOrphans);

  moveWearShots(dir, urlBase);
  return updates;
}

async function main() {
  const allUpdates = [];
  for (const cat of categories) {
    allUpdates.push(...(await runCategory(cat)));
  }
  allUpdates.push(...(await runBracelets()));

  let src = fs.readFileSync(productsPath, 'utf8');
  const { out, n } = patchProducts(src, allUpdates);
  fs.writeFileSync(productsPath, out);
  console.log('\nproducts.js image blocks updated:', n, '/', allUpdates.length);

  // Strip any remaining /catalog/ product image paths that we can map to -hero
  let cleaned = out.replace(
    /\/(earrings|necklace|bracelets|brooch|rings)\/catalog\/(?:wear-)?([a-z0-9-]+?)(?:-v\d+)?(?:-(\d+))?\.(jpe?g|png|webp)/gi,
    (full, folder, slug, num, ext) => {
      if (num) return `/${folder}/${slug}-${num}.${ext.toLowerCase()}`;
      return `/${folder}/${slug}-hero.${ext.toLowerCase()}`;
    },
  );
  if (cleaned !== out) {
    fs.writeFileSync(productsPath, cleaned);
    console.log('stripped residual /catalog/ refs in products.js');
  }

  fs.writeFileSync(
    path.join(__dirname, 'promote-root-heroes-report.json'),
    JSON.stringify({ updates: allUpdates }, null, 2),
  );
  console.log('done');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
