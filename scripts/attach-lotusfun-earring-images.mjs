/**
 * Attach LotusFun_Earrings (Sept) images to earring colour variants.
 * EXPLICIT mapping only — no fuzzy matching, no cross-product mixing.
 *
 * Usage: node --env-file=.env.local scripts/attach-lotusfun-earring-images.mjs
 * Dry run:  ... --dry
 */
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const SRC_ROOT = path.join(root, 'public', 'lotusfun', 'LotusFun_Earrings (Sept)');
const DEST_ROOT = path.join(root, 'public', 'products', 'lotusfun', 'earrings');
const DRY = process.argv.includes('--dry');

function loadEnv(file) {
  try {
    for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (!m) continue;
      const k = m[1].trim();
      let v = m[2].trim();
      if (
        (v.startsWith('"') && v.endsWith('"')) ||
        (v.startsWith("'") && v.endsWith("'"))
      ) {
        v = v.slice(1, -1);
      }
      if (!process.env[k]) process.env[k] = v;
    }
  } catch {
    /* ignore */
  }
}
loadEnv(path.join(root, '.env.local'));

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const headers = {
  apikey: key,
  Authorization: `Bearer ${key}`,
  'Content-Type': 'application/json',
  Prefer: 'return=representation',
};

const IMAGE_EXT = /\.(jpe?g|png|webp|avif|gif)$/i;

/** Natural sort: 1,2,10 */
function natSort(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

function listImages(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((n) => IMAGE_EXT.test(n) && !n.startsWith('.'))
    .sort(natSort)
    .map((n) => path.join(dir, n));
}

function colourFromName(name) {
  const n = String(name || '').toLowerCase();
  if (/\bgold\b/.test(n)) return 'Gold';
  if (/\bsilver\b/.test(n)) return 'Silver';
  if (/\bgreen\b/.test(n)) return 'Green';
  if (/\bblue\b/.test(n)) return 'Blue';
  return null;
}

function colourFromSlug(slug) {
  const s = String(slug || '').toLowerCase();
  if (s.endsWith('-gold') || s.includes('-gold-')) return 'Gold';
  if (s.endsWith('-silver') || s.includes('-silver-')) return 'Silver';
  if (s.endsWith('-green')) return 'Green';
  if (s.endsWith('-blue')) return 'Blue';
  return null;
}

function swatchFor(colour) {
  const map = {
    Gold: '#D4AF64',
    Silver: '#C5C5C5',
    Green: '#2F6B4F',
    Blue: '#4A7BA7',
  };
  return map[colour] || '#C5C5C5';
}

/**
 * Explicit product → folder mapping.
 * filter: optional regex on filename; if omitted, all images in folder.
 * Only that product uses that folder (except noted shared splits by colour in filename).
 */
const ATTACH_MAP = [
  {
    familySlug: 'two-tone-flower-stud-earrings-1',
    // Filenames already tagged (gold)/(silver) — zero mixing
    folder: 'Flower earring',
    splitByFilenameColour: true,
  },
  {
    familySlug: 'blooming-flower-drop-earrings-2',
    // Gold plated pack → Gold; plain pack → Silver
    byColour: {
      Gold: { folder: 'Gold Plated Flower Design Dangle Earring' },
      Silver: { folder: 'Flower Design Dangle Earring' },
    },
  },
  {
    familySlug: 'natural-pearl-leaf-earrings-3',
    // One SKU folder only (not the duplicate "Pearl leave earring")
    folder: 'Pearl leaf earring',
    // No gold/silver in filenames — same photos for both finishes (product is plated variants)
    assignAllToEachColour: true,
  },
  {
    familySlug: 'butterfly-stud-earrings-4',
    byColour: {
      Gold: { folder: 'Butterfly stud(gold&silver)' },
      Silver: { folder: 'Butterfly stud(silver&gold)' },
    },
  },
  {
    familySlug: 'wild-flower-stud-earrings-5',
    folder: 'wild Rose flower stud',
    assignAllToEachColour: true,
  },
  {
    familySlug: 'forget-me-not-flower-baroque-pearl-earrings-6',
    // Baroque pearl + dragonfly removable set is the matching pack for pearl drop FMN style
    // SKIP if wrong — this folder is dragonfly+pearl. Better skip than mix.
    // Use dedicated baroque pearl dragonfly folder ONLY for dragonfly baroque product.
    skip: true,
    reason: 'No dedicated Forget-Me-Not baroque pearl folder — skipped to avoid mixing',
  },
  {
    familySlug: 'forget-me-not-flower-agate-stud-earrings-7',
    folder: 'Agate Forest-Me-Not Flower Stud',
    assignAllToEachColour: true, // Green/Blue stone — same style shots
  },
  {
    familySlug: 'forget-me-not-flower-stud-earrings-8',
    folder: 'Forget-me-not Flower',
    assignAllToEachColour: true,
  },
  {
    familySlug: 'forget-me-not-flower-hoop-earrings-9',
    folder: 'Forget-me-not Flower Hoop',
    assignAllToEachColour: true,
  },
  {
    familySlug: 'forget-me-not-pearl-dangle-earrings-10',
    skip: true,
    reason: 'No dedicated pearl-dangle FMN folder — skipped to avoid mixing',
  },
  {
    familySlug: 'dragonfly-stud-earrings-11',
    folder: 'Dragonfly earrings',
    assignAllToEachColour: true,
  },
  {
    familySlug: 'dragonfly-baroque-pearl-drop-earrings-12',
    folder: 'Dragonflyremovable assembleable baroque pearl',
    assignAllToEachColour: true,
  },
  {
    familySlug: 'flying-bird-stud-earrings-13',
    // Bird Stud folder contains LFJA0103 (leaf hoop SKU) — do NOT use
    skip: true,
    reason: 'Bird Stud folder images are Leaf Hoop SKU (LFJA0103) — skipped',
  },
  {
    familySlug: 'asymmetry-swallow-bird-stud-earrings-14',
    folder: 'curved branches &leaves asymmetric',
    forceColour: 'Gold',
  },
  {
    familySlug: 'phalaenopsis-flower-hoop-earrings-15',
    folder: 'Phalaenopsis Flower Hoop',
    forceColour: 'Silver',
  },
  {
    familySlug: 'lilac-flower-drop-earrings-16',
    folder: 'Lilac Flower Designer Drop Earring',
    forceColour: 'Silver',
  },
  {
    familySlug: 'pothos-dangle-earrings-17',
    folder: 'Epipremnum Aureum Dangle Drop',
    forceColour: 'Gold',
  },
  {
    familySlug: 'four-leaf-mini-clover-pearl-dangle-earrings-18',
    folder: 'Freshwater Pearl Classic Four-leaf Clover Pear Dangle Drop Earrings',
    // Folder has some stray unrelated files — keep only clover-named files
    filenameIncludes: 'four-leaf',
    assignAllToEachColour: true,
  },
  {
    familySlug: 'succulent-mini-flower-stud-earrings-19',
    folder: 'Flower stud',
    // Folder mixes two SKUs — only LFJA0177 for succulent-style stud
    filenameIncludes: 'LFJA0177',
    assignAllToEachColour: true,
  },
];

function ensureDir(d) {
  fs.mkdirSync(d, { recursive: true });
}

function copySized(files, destDir) {
  ensureDir(destDir);
  const out = [];
  files.forEach((src, i) => {
    const ext = path.extname(src).toLowerCase() || '.jpg';
    const name = `${String(i + 1).padStart(2, '0')}${ext}`;
    const dest = path.join(destDir, name);
    if (!DRY) fs.copyFileSync(src, dest);
    const publicUrl = `/products/lotusfun/earrings/${path
      .relative(DEST_ROOT, dest)
      .split(path.sep)
      .join('/')}`;
    out.push(publicUrl);
  });
  return out;
}

function resolveFiles(rule, colour) {
  if (rule.byColour?.[colour]) {
    const part = rule.byColour[colour];
    let files = listImages(path.join(SRC_ROOT, part.folder));
    if (part.filenameIncludes) {
      const needle = part.filenameIncludes.toLowerCase();
      files = files.filter((f) => path.basename(f).toLowerCase().includes(needle));
    }
    return files;
  }

  let files = listImages(path.join(SRC_ROOT, rule.folder));
  if (rule.filenameIncludes) {
    const needle = rule.filenameIncludes.toLowerCase();
    files = files.filter((f) => path.basename(f).toLowerCase().includes(needle));
  }
  if (rule.splitByFilenameColour) {
    files = files.filter((f) => colourFromName(path.basename(f)) === colour);
  }
  return files;
}

async function main() {
  if (!fs.existsSync(SRC_ROOT)) {
    console.error('Source folder missing:', SRC_ROOT);
    console.error('Expected: public/lotusfun/LotusFun_Earrings (Sept)');
    process.exit(1);
  }

  const families = await fetch(
    `${url}/rest/v1/product_families?category=eq.earrings&select=id,slug,name`,
    { headers },
  ).then((r) => r.json());

  const bySlug = new Map((families || []).map((f) => [f.slug, f]));
  const report = [];

  for (const rule of ATTACH_MAP) {
    const family = bySlug.get(rule.familySlug);
    if (!family) {
      report.push({ slug: rule.familySlug, status: 'NO_FAMILY' });
      continue;
    }
    if (rule.skip) {
      report.push({ slug: rule.familySlug, status: 'SKIPPED', reason: rule.reason });
      console.log('SKIP', family.name, '—', rule.reason);
      continue;
    }

    const variants = await fetch(
      `${url}/rest/v1/product_color_variants?family_id=eq.${family.id}&select=*&order=sort_order`,
      { headers },
    ).then((r) => r.json());

    for (const v of variants) {
      let colour =
        rule.forceColour ||
        colourFromSlug(v.slug) ||
        (v.color_label && v.color_label !== 'Default' ? v.color_label : null) ||
        'Default';

      // Single-variant families without slug colour suffix
      if (variants.length === 1 && colour === 'Default') {
        colour = rule.forceColour || 'Gold';
      }

      const files = resolveFiles(rule, colour);
      if (!files.length && rule.assignAllToEachColour && rule.folder) {
        // fallback already in resolveFiles
      }

      if (!files.length) {
        report.push({
          slug: v.slug,
          colour,
          status: 'NO_FILES',
          folder: rule.folder || rule.byColour?.[colour]?.folder,
        });
        console.log('NO FILES', v.slug, colour);
        continue;
      }

      const destDir = path.join(DEST_ROOT, family.slug, colour.toLowerCase());
      const urls = copySized(files, destDir);
      const gallery = urls.map((u, i) => ({ url: u, kind: 'image', sort: i }));
      const hero = urls[0];

      console.log(
        DRY ? 'DRY' : 'WRITE',
        family.name,
        '→',
        colour,
        `(${urls.length} imgs)`,
        files.map((f) => path.basename(f)).slice(0, 3).join(', '),
        files.length > 3 ? '…' : '',
      );

      if (!DRY) {
        const patch = {
          hero_url: hero,
          gallery,
          color_label: colour === 'Default' ? v.color_label || 'Default' : colour,
          color_swatch: swatchFor(colour === 'Default' ? 'Silver' : colour),
          updated_at: new Date().toISOString(),
        };
        const res = await fetch(
          `${url}/rest/v1/product_color_variants?id=eq.${v.id}`,
          { method: 'PATCH', headers, body: JSON.stringify(patch) },
        );
        if (!res.ok) {
          const err = await res.text();
          console.error('PATCH failed', v.slug, err);
          report.push({ slug: v.slug, status: 'PATCH_FAIL', err });
          continue;
        }
      }
      report.push({ slug: v.slug, colour, status: 'OK', count: urls.length });
    }
  }

  console.log('\n=== SUMMARY ===');
  for (const row of report) {
    console.log(
      row.status.padEnd(10),
      row.slug || '',
      row.colour || '',
      row.count != null ? `${row.count} imgs` : '',
      row.reason || '',
    );
  }
  console.log(DRY ? '\nDry run only — re-run without --dry to write.' : '\nDone.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
