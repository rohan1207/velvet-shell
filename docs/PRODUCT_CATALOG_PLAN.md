# Product catalog — admin → Supabase → storefront

## Goal

Admin can create rich products (media on Cloudflare, optional color variants, recommendations). Storefront shows **Supabase products when available**, otherwise keeps the existing dummy catalog in `lib/products.js`.

## Data model

```
product_families          ← one shop card / SEO product group
  ├─ name, slug, category, collection
  ├─ has_color_variants
  ├─ shipping (jsonb)      ← India 5–7 days default, styled like reference
  ├─ recommended_family_ids[]
  └─ active / draft

product_color_variants    ← one row per color (or a single “Default” if no colors)
  ├─ color_label, color_swatch, slug, is_primary
  ├─ price, description, features[], material, length
  ├─ reviews { rating, count, highlights[] }
  ├─ hero_url
  ├─ gallery [{ url, kind: image|video, alt }]
  └─ stock, active
```

Color variants share copy when admin uses **Import from…**; **media stays per-color**.

## Admin UX

1. **Products** list (existing) → Add / Edit  
2. **Categories** page (new sidebar link) — manage category names/slugs  
3. **Product form** sections:
   - Basics: name, category, collection, status  
   - Shipping (prefilled India-only block, editable)  
   - Recommendations (multi-select other families)  
   - Color variants? Yes/No  
   - Per-variant tab: price, description, features, material, length, reviews, hero, unlimited gallery (image + video), import-from-sibling  
4. Uploads go to Cloudflare R2 via `/api/upload` (direct or signed URL)

## Storefront

- `GET /api/catalog` → active families + variants  
- `lib/catalog.js` merges remote → listing shape compatible with `ProductCard` / PDP  
- If remote empty or error → use static `lib/products.js` (current dummy data)

## Cloudflare R2 — send these

From Cloudflare dashboard → **R2** → create bucket (e.g. `velvet-shell-media`) → **Manage R2 API Tokens**:

1. `CLOUDFLARE_ACCOUNT_ID`
2. `CLOUDFLARE_R2_ACCESS_KEY_ID`
3. `CLOUDFLARE_R2_SECRET_ACCESS_KEY`
4. `CLOUDFLARE_R2_BUCKET` (bucket name)
5. `CLOUDFLARE_R2_PUBLIC_BASE_URL` (R2.dev public URL or custom domain, no trailing slash)

Put the same values in root `.env.local` and `admin/.env.local`.

## Rollout

1. SQL migration `003_catalog_families.sql`  
2. Admin form + APIs (save to Supabase; local draft fallback if DB down)  
3. Upload wiring once R2 keys land  
4. Storefront catalog fetch + fallback  
