/**
 * Push YWJE catalog + collections into Supabase (service role REST).
 *
 *   node --env-file=.env.local scripts/seed-ywje-catalog.mjs
 */

import { COLLECTIONS, EXTRA_CATEGORIES, FAMILIES, skuCount } from './data/ywje-catalog.mjs';

const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '');
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

if (process.env.SUPABASE_INSECURE_TLS === '1') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

if (!url || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const headers = {
  apikey: serviceKey,
  Authorization: `Bearer ${serviceKey}`,
  'Content-Type': 'application/json',
};

async function rest(path, { method = 'GET', body, prefer } = {}) {
  const res = await fetch(`${url}/rest/v1/${path}`, {
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
    const msg = typeof data === 'object' ? JSON.stringify(data) : String(data);
    throw new Error(`${method} ${path} → ${res.status}: ${msg}`);
  }
  return data;
}

const DEFAULT_SHIPPING = {
  intro:
    'Orders are prepared Monday to Friday (excluding public holidays). Orders placed on Friday usually ship the following Monday.',
  regions: [{ location: 'India', eta: '5–7 working days' }],
  note: 'We currently deliver within India only. Estimated times start after dispatch and may vary during peak periods or courier delays.',
  delayed:
    'If tracking has not updated for several days, the parcel is not always lost. Contact us with your order number and we will investigate with the courier. Where needed, we arrange a replacement or refund.',
  returnsNote: 'See our Returns, Refunds & Exchanges policy for damaged or incorrect items.',
};

async function upsertCollections() {
  for (const c of COLLECTIONS) {
    await rest('collections?on_conflict=slug', {
      method: 'POST',
      prefer: 'resolution=merge-duplicates,return=minimal',
      body: [{ slug: c.slug, name: c.name, line: c.line }],
    });
  }
  console.log(`Collections upserted: ${COLLECTIONS.length}`);
}

async function upsertCategories() {
  for (const c of EXTRA_CATEGORIES) {
    await rest('shop_categories?on_conflict=slug', {
      method: 'POST',
      prefer: 'resolution=merge-duplicates,return=minimal',
      body: [
        {
          slug: c.slug,
          name: c.name,
          line: c.line,
          sort_order: c.sort_order,
          active: true,
        },
      ],
    });
  }
  console.log(`Extra categories upserted: ${EXTRA_CATEGORIES.map((c) => c.slug).join(', ')}`);
}

async function findFamilyId(slug) {
  const rows = await rest(`product_families?slug=eq.${encodeURIComponent(slug)}&select=id`);
  return rows?.[0]?.id || null;
}

async function findVariantId(slug) {
  const rows = await rest(`product_color_variants?slug=eq.${encodeURIComponent(slug)}&select=id`);
  return rows?.[0]?.id || null;
}

async function upsertFamily(family) {
  const familyRow = {
    slug: family.slug,
    name: family.name,
    category: family.category,
    collection_slug: family.collection,
    has_color_variants: !!family.hasColorVariants,
    shipping: DEFAULT_SHIPPING,
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

  for (let i = 0; i < family.variants.length; i += 1) {
    const v = family.variants[i];
    const variantRow = {
      family_id: familyId,
      slug: v.slug,
      color_label: v.colorLabel,
      color_swatch: v.colorSwatch,
      is_primary: !!v.isPrimary,
      price: v.price,
      description: v.description,
      features: v.features,
      material: v.material,
      length_label: v.length || '',
      reviews: v.reviews,
      hero_url: '',
      gallery: [],
      stock: v.stock,
      out_of_stock: !!v.outOfStock,
      active: true,
      sort_order: i,
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
  }

  return family.variants.length;
}

async function main() {
  console.log(`Seeding ${FAMILIES.length} families / ${skuCount()} SKUs…`);
  await upsertCollections();
  await upsertCategories();

  let skus = 0;
  for (const family of FAMILIES) {
    const n = await upsertFamily(family);
    skus += n;
    process.stdout.write(`  ✓ ${family.slug} (${n})\n`);
  }

  const families = await rest('product_families?status=eq.active&select=id', {
    method: 'GET',
  });
  const variants = await rest('product_color_variants?active=eq.true&select=id', {
    method: 'GET',
  });

  console.log('\nDone.');
  console.log(`Active families in DB: ${families?.length ?? '?'}`);
  console.log(`Active variants in DB: ${variants?.length ?? '?'}`);
  console.log(`SKUs written this run: ${skus}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
