-- Catalog: product families + color variants (admin → storefront)

create table if not exists public.product_families (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null,
  collection_slug text references public.collections (slug),
  has_color_variants boolean not null default false,
  shipping jsonb not null default '{}'::jsonb,
  recommended_family_ids jsonb not null default '[]'::jsonb,
  badge text default '',
  status text not null default 'draft' check (status in ('draft', 'active')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists product_families_category_idx on public.product_families (category);
create index if not exists product_families_status_idx on public.product_families (status);

create table if not exists public.product_color_variants (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.product_families (id) on delete cascade,
  slug text not null unique,
  color_label text not null default 'Default',
  color_swatch text not null default '#C5C5C5',
  is_primary boolean not null default false,
  price integer not null check (price >= 0),
  description text default '',
  features jsonb not null default '[]'::jsonb,
  material text default '',
  length_label text default '',
  reviews jsonb not null default '{"rating":0,"count":0,"highlights":[]}'::jsonb,
  hero_url text default '',
  gallery jsonb not null default '[]'::jsonb,
  stock integer not null default 0 check (stock >= 0),
  out_of_stock boolean not null default false,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists product_color_variants_family_idx
  on public.product_color_variants (family_id);

-- Categories managed from admin (seeded from known storefront slugs)
create table if not exists public.shop_categories (
  slug text primary key,
  name text not null,
  line text default '',
  banner_url text default '',
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

insert into public.shop_categories (slug, name, line, sort_order) values
  ('necklaces', 'Necklaces', 'Floral forms worn close to the collarbone.', 10),
  ('earrings', 'Earrings', 'Nature-drawn gold and silver for the ear.', 20),
  ('rings', 'Rings', 'Petals and polish, shaped for the hand.', 30),
  ('bracelets', 'Bracelets', 'Delicate branches that follow the wrist.', 40),
  ('cuffs', 'Brooches', 'Calla lilies and quiet botanical pins.', 50)
on conflict (slug) do nothing;

insert into public.collections (slug, name, line) values
  ('the-shell-edit', 'The Shell Edit', 'Sculptural gold, drawn with quiet architecture.'),
  ('pearls-of-nacre', 'Lumen Line', 'Fine gold and light, worn close to the skin.'),
  ('gilded-tide', 'Gilded Tide', 'Worn like water. Held like architecture.'),
  ('private-atelier', 'Private Atelier', 'Made in small numbers. Never hurried.')
on conflict (slug) do nothing;

alter table public.product_families enable row level security;
alter table public.product_color_variants enable row level security;
alter table public.shop_categories enable row level security;

drop policy if exists "Public read active families" on public.product_families;
create policy "Public read active families" on public.product_families
  for select using (status = 'active' and active = true);

drop policy if exists "Public read active color variants" on public.product_color_variants;
create policy "Public read active color variants" on public.product_color_variants
  for select using (
    active = true
    and exists (
      select 1 from public.product_families f
      where f.id = family_id and f.status = 'active' and f.active = true
    )
  );

drop policy if exists "Public read shop categories" on public.shop_categories;
create policy "Public read shop categories" on public.shop_categories
  for select using (active = true);

-- Track this migration if runner is used
create table if not exists public.schema_migrations (
  id text primary key,
  applied_at timestamptz not null default now()
);
insert into public.schema_migrations (id) values ('003_catalog_families.sql')
on conflict (id) do nothing;
