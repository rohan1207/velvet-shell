/**
 * Apply only 007_size_tags.sql via Postgres, then seed Clover Stud size pill.
 * Usage: node scripts/migrate-size-tags.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

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
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

function urls() {
  const password = process.env.SUPABASE_DB_PASSWORD;
  const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const ref = projectUrl.match(/https?:\/\/([a-z0-9-]+)\.supabase\.co/i)?.[1];
  const list = [];
  if (process.env.DATABASE_URL) list.push(process.env.DATABASE_URL);
  if (password && ref) {
    const encoded = encodeURIComponent(password);
    list.push(`postgresql://postgres:${encoded}@db.${ref}.supabase.co:5432/postgres`);
    list.push(
      `postgresql://postgres.${ref}:${encoded}@aws-0-ap-south-1.pooler.supabase.com:5432/postgres`,
    );
  }
  return list;
}

async function connect() {
  let lastError;
  for (const connectionString of urls()) {
    const client = new pg.Client({
      connectionString,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 20000,
    });
    try {
      await client.connect();
      console.log('Connected');
      return client;
    } catch (err) {
      lastError = err;
      console.warn('Connect failed:', err.message);
      try {
        await client.end();
      } catch {
        /* ignore */
      }
    }
  }
  throw lastError || new Error('No database URL');
}

const sqlPath = path.join(root, 'supabase', 'migrations', '007_size_tags.sql');
const sql = fs.readFileSync(sqlPath, 'utf8');

const client = await connect();
try {
  await client.query(sql);
  console.log('Applied 007_size_tags.sql');

  const tag = 'Petite · ~1 cm';
  const { rowCount } = await client.query(
    `update public.product_color_variants
     set length_label = $1,
         size_tags = $2::jsonb,
         updated_at = now()
     where slug = 'clover-stud-earrings'`,
    [tag, JSON.stringify([tag])],
  );
  console.log(`Clover Stud Earrings size pill updated: ${rowCount} row(s)`);
} finally {
  await client.end();
}
