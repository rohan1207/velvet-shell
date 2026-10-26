-- Jewellery sets (bundle of existing products) + back-in-stock notify waitlist

create table if not exists public.product_sets (
  id uuid primary key default gen_random_uuid(),
  set_code text unique,
  slug text not null unique,
  name text not null,
  description text not null default '',
  material text not null default '',
  design text not null default '',
  type_label text not null default '',
  colour text not null default '',
  set_sku text not null default '',
  -- null = price is sum of member variants; otherwise fixed set price (INR)
  price_override integer check (price_override is null or price_override >= 0),
  hero_url text not null default '',
  gallery jsonb not null default '[]'::jsonb,
  shipping jsonb not null default '{}'::jsonb,
  badge text not null default '',
  status text not null default 'draft'
    check (status in ('draft', 'active')),
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists product_sets_status_idx on public.product_sets (status, active);
create index if not exists product_sets_sort_idx on public.product_sets (sort_order, created_at desc);

create table if not exists public.product_set_items (
  id uuid primary key default gen_random_uuid(),
  set_id uuid not null references public.product_sets (id) on delete cascade,
  family_id uuid not null references public.product_families (id) on delete cascade,
  variant_id uuid references public.product_color_variants (id) on delete set null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (set_id, family_id)
);

create index if not exists product_set_items_set_idx on public.product_set_items (set_id, sort_order);
create index if not exists product_set_items_family_idx on public.product_set_items (family_id);

-- Temporary waitlist: deleted after restock email is sent
create table if not exists public.stock_notify_requests (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  kind text not null default 'product'
    check (kind in ('product', 'set')),
  target_slug text not null,
  target_id uuid,
  product_name text not null default '',
  created_at timestamptz not null default now(),
  unique (email, kind, target_slug)
);

create index if not exists stock_notify_target_idx
  on public.stock_notify_requests (kind, target_slug);

alter table public.product_sets enable row level security;
alter table public.product_set_items enable row level security;
alter table public.stock_notify_requests enable row level security;

-- Ensure Sets exists in shop categories
insert into public.shop_categories (slug, name, line, sort_order, active)
values ('sets', 'Sets', 'Complete looks', 60, true)
on conflict (slug) do update
  set name = excluded.name,
      active = true;

comment on table public.product_sets is 'Jewellery sets with own hero media; members are existing products.';
comment on table public.stock_notify_requests is 'Back-in-stock emails; rows removed after send.';
