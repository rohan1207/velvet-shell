/**
 * Apply supabase/migrations/*.sql automatically (no SQL Editor paste).
 *
 * Usage:
 *   npm run db:migrate
 *
 * Env (one of):
 *   DATABASE_URL=postgresql://postgres:...@db.<ref>.supabase.co:5432/postgres
 *   or
 *   SUPABASE_DB_PASSWORD=...   (+ NEXT_PUBLIC_SUPABASE_URL to derive host)
 *
 * Tracks applied files in public.schema_migrations so re-runs are safe.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const migrationsDir = path.join(root, 'supabase', 'migrations');

function getDatabaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;

  const password = process.env.SUPABASE_DB_PASSWORD;
  const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const ref = projectUrl.match(/https?:\/\/([a-z0-9-]+)\.supabase\.co/i)?.[1];

  if (!password || !ref) return null;

  const encoded = encodeURIComponent(password);
  // Direct connection (IPv6 may fail on some networks — pooler fallback below)
  return `postgresql://postgres:${encoded}@db.${ref}.supabase.co:5432/postgres`;
}

function getPoolerUrl() {
  const password = process.env.SUPABASE_DB_PASSWORD;
  const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const ref = projectUrl.match(/https?:\/\/([a-z0-9-]+)\.supabase\.co/i)?.[1];
  if (!password || !ref) return null;
  const encoded = encodeURIComponent(password);
  // Session mode pooler
  return `postgresql://postgres.${ref}:${encoded}@aws-0-ap-south-1.pooler.supabase.com:5432/postgres`;
}

function listMigrationFiles() {
  return fs
    .readdirSync(migrationsDir)
    .filter((name) => name.endsWith('.sql'))
    .filter((name) => !/^RUN_/i.test(name))
    .filter((name) => /^\d+_/.test(name))
    .sort();
}

async function connect() {
  const urls = [getDatabaseUrl(), getPoolerUrl()].filter(Boolean);
  if (!urls.length) {
    console.error(`
Missing database credentials.

Add ONE of these to .env.local:

  SUPABASE_DB_PASSWORD=your-database-password
  (from Supabase → Project Settings → Database → Database password)

  or a full connection string:

  DATABASE_URL=postgresql://postgres:...@db.xxxxx.supabase.co:5432/postgres

Then run: npm run db:migrate
`);
    process.exit(1);
  }

  let lastError;
  for (const connectionString of urls) {
    const client = new pg.Client({
      connectionString,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 15000,
    });
    try {
      await client.connect();
      return client;
    } catch (err) {
      lastError = err;
      try {
        await client.end();
      } catch {
        /* ignore */
      }
    }
  }
  throw lastError;
}

async function ensureTracking(client) {
  await client.query(`
    create table if not exists public.schema_migrations (
      id text primary key,
      applied_at timestamptz not null default now()
    );
  `);
}

async function appliedSet(client) {
  const { rows } = await client.query(`select id from public.schema_migrations`);
  return new Set(rows.map((r) => r.id));
}

async function main() {
  const files = listMigrationFiles();
  if (!files.length) {
    console.log('No numbered migration files found.');
    return;
  }

  const client = await connect();
  console.log('Connected to Postgres.');

  try {
    await ensureTracking(client);
    const done = await appliedSet(client);

    for (const file of files) {
      if (done.has(file)) {
        console.log(`skip  ${file} (already applied)`);
        continue;
      }

      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      console.log(`apply ${file} ...`);
      await client.query('begin');
      try {
        await client.query(sql);
        await client.query(
          `insert into public.schema_migrations (id) values ($1) on conflict (id) do nothing`,
          [file]
        );
        await client.query('commit');
        console.log(`ok    ${file}`);
      } catch (err) {
        await client.query('rollback');
        // If tables already exist from a manual SQL Editor run, mark as applied
        if (/already exists/i.test(err.message || '')) {
          console.warn(`warn  ${file}: objects already exist — marking applied`);
          await client.query(
            `insert into public.schema_migrations (id) values ($1) on conflict do nothing`,
            [file]
          );
          continue;
        }
        console.error(`fail  ${file}`);
        throw err;
      }
    }

    console.log('\nAll migrations up to date. Future schema changes: npm run db:migrate');
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error('\nMigration failed:', err.message || err);
  process.exit(1);
});
