/**
 * Apply size_tags column + seed Clover Stud Earrings petite size pill.
 * Usage: node scripts/apply-size-tags.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function loadEnv() {
  const envPath = path.join(root, '.env.local');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (!m) continue;
    const key = m[1];
    let val = m[2].trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnv();

if (process.env.SUPABASE_INSECURE_TLS === '1' || !process.env.NODE_TLS_REJECT_UNAUTHORIZED) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SECRET_KEY;

if (!url || !key) {
  console.error('Missing Supabase URL or service role key');
  process.exit(1);
}

async function rest(pathname, { method = 'GET', body, prefer } = {}) {
  const headers = {
    apikey: key,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
  };
  if (prefer) headers.Prefer = prefer;
  const res = await fetch(`${url}/rest/v1/${pathname}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`${method} ${pathname} → ${res.status}: ${text}`);
  }
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function ensureColumn() {
  // PostgREST cannot ALTER TABLE — try a no-op select of size_tags.
  try {
    await rest('product_color_variants?select=id,size_tags&limit=1');
    console.log('size_tags column present');
    return true;
  } catch (err) {
    console.error(
      'size_tags column missing. Run supabase/migrations/007_size_tags.sql in the Supabase SQL editor, then re-run this script.',
    );
    console.error(String(err.message || err));
    return false;
  }
}

async function backfillFromLength() {
  const rows = await rest(
    'product_color_variants?select=id,length_label,size_tags&length_label=neq.',
  );
  let updated = 0;
  for (const row of rows || []) {
    const tags = Array.isArray(row.size_tags) ? row.size_tags.filter(Boolean) : [];
    const length = String(row.length_label || '').trim();
    if (tags.length || !length) continue;
    await rest(`product_color_variants?id=eq.${row.id}`, {
      method: 'PATCH',
      prefer: 'return=minimal',
      body: { size_tags: [length] },
    });
    updated += 1;
  }
  console.log(`Backfilled size_tags from length_label: ${updated}`);
}

async function setCloverStudSize() {
  const tag = 'Petite · ~1 cm';
  const slug = 'clover-stud-earrings';
  const rows = await rest(
    `product_color_variants?slug=eq.${encodeURIComponent(slug)}&select=id,slug,length_label,size_tags`,
  );
  if (!rows?.length) {
    console.log(`skip ${slug} (not found)`);
    return;
  }
  for (const row of rows) {
    await rest(`product_color_variants?id=eq.${row.id}`, {
      method: 'PATCH',
      prefer: 'return=minimal',
      body: {
        length_label: tag,
        size_tags: [tag],
      },
    });
    console.log(`Updated ${row.slug} → ${tag}`);
  }
}

const ok = await ensureColumn();
if (!ok) process.exit(1);
await backfillFromLength();
await setCloverStudSize();
console.log('Done.');
