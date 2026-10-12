/**
 * Fill story, care, and richer features for all catalog variants.
 *   node --env-file=.env.local scripts/enrich-ywje-copy.mjs
 */

const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '');
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

if (process.env.SUPABASE_INSECURE_TLS === '1') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

if (!url || !serviceKey) {
  console.error('Missing Supabase env');
  process.exit(1);
}

const headers = {
  apikey: serviceKey,
  Authorization: `Bearer ${serviceKey}`,
  'Content-Type': 'application/json',
  Prefer: 'return=representation',
};

async function rest(path, { method = 'GET', body } = {}) {
  const res = await fetch(`${url}/rest/v1/${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}: ${JSON.stringify(data)}`);
  return data;
}

const CARE_BY_CATEGORY = {
  earrings:
    'Remove before bathing, swimming or applying perfume. Wipe with a soft dry cloth after wear. Store in the pouch, hooks facing the same way to avoid tangles.',
  rings:
    'Slip off before heavy handwork, lotions or swimming. Wipe dry after wear. Store flat — avoid stacking hard metals against the motif.',
  necklaces:
    'Fasten and unfasten with care. Keep away from water, perfume and hairspray. Wipe the chain gently and store flat or hung so it does not knot.',
  pendants:
    'Fasten and unfasten with care. Keep away from water, perfume and hairspray. Wipe the pendant and chain gently; store flat so the motif stays scratch-free.',
  chains:
    'Keep away from water, perfume and hairspray. Wipe the links gently after wear and store flat or hung so the chain does not knot.',
  chokers:
    'Best worn on dry skin. Remove before swimming. Wipe gently and store flat so the close-fit silhouette keeps its shape.',
  bracelets:
    'Remove before bathing or exercise. Wipe with a soft cloth after wear. Store flat in the pouch, clasp closed.',
  anklets:
    'Best worn on dry skin. Remove before swimming or long baths. Wipe clean and store flat so the chain stays smooth.',
  sets: 'Treat each piece as you would fine everyday silver — keep dry, wipe after wear, and store together in the pouch so the set stays complete.',
  cuffs:
    'Pin and unpin gently. Wipe the face of the piece after wear. Store flat, away from moisture and perfume.',
};

function buildStory(familyName, colorLabel, category) {
  const colourBit =
    colorLabel && colorLabel !== 'Default' ? ` in ${colorLabel.toLowerCase()}` : '';
  const wear =
    {
      earrings: 'at the ear',
      rings: 'on the hand',
      necklaces: 'at the collarbone',
      pendants: 'as a single focus at the neckline',
      chains: 'along a fine, layerable chain',
      chokers: 'close to the neck',
      bracelets: 'on the wrist',
      anklets: 'at the ankle',
      sets: 'as a small, coordinated story',
      cuffs: 'pinned close to the fabric',
    }[category] || 'in daily wear';

  return `${familyName}${colourBit} is made for quiet presence ${wear}. The motif stays the focus — considered proportions, a soft finish, and a silhouette that sits easily with what you already own. A piece to keep in rotation, and an easy gift when you want something that feels chosen rather than ordinary.`;
}

function buildFeatures(row, family) {
  const existing = Array.isArray(row.features) ? row.features.filter(Boolean) : [];
  const skuLine = existing.find((f) => /^SKU\s/i.test(f));
  const base = [
    row.material || '925 Sterling Silver',
    row.color_label && row.color_label !== 'Default' ? `Colour: ${row.color_label}` : null,
    row.length_label ? `Fit / length: ${row.length_label}` : 'Everyday wearable scale',
    family?.badge ? `${family.badge} edit` : null,
    'Hypoallergenic-friendly everyday wear',
    'Gift-ready Velvet Shell packaging',
    'Ships within India in 5–7 working days',
    skuLine || null,
  ].filter(Boolean);

  // Keep unique, prefer enriched list
  const seen = new Set();
  const out = [];
  for (const line of base) {
    const key = line.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(line);
  }
  return out;
}

async function main() {
  const families = await rest(
    'product_families?select=id,slug,name,category,badge&status=eq.active'
  );
  const byId = new Map(families.map((f) => [f.id, f]));
  const variants = await rest(
    'product_color_variants?select=id,family_id,slug,color_label,material,length_label,features,description&active=eq.true'
  );

  console.log(`Enriching ${variants.length} variants…`);
  let updated = 0;

  for (const row of variants) {
    const family = byId.get(row.family_id);
    if (!family) continue;

    const story = buildStory(family.name, row.color_label, family.category);
    const care = CARE_BY_CATEGORY[family.category] || CARE_BY_CATEGORY.sets;
    const features = buildFeatures(row, family);

    await rest(`product_color_variants?id=eq.${row.id}`, {
      method: 'PATCH',
      body: {
        story,
        care,
        features,
        updated_at: new Date().toISOString(),
      },
    });
    updated += 1;
    if (updated % 20 === 0) console.log(`  …${updated}`);
  }

  console.log(`Done. Updated ${updated} variants with story, care, and features.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
