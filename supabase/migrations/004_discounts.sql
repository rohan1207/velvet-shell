-- Promo codes + bulk-buy tiers + redemption analytics

create table if not exists public.discount_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null default '',
  description text default '',
  discount_type text not null default 'percent'
    check (discount_type in ('percent', 'fixed')),
  value integer not null check (value >= 0),
  scope text not null default 'all'
    check (scope in ('all', 'category', 'collection', 'products')),
  scope_values jsonb not null default '[]'::jsonb,
  min_order_amount integer not null default 0 check (min_order_amount >= 0),
  max_uses integer,
  max_uses_per_customer integer,
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  status text not null default 'active'
    check (status in ('draft', 'active', 'paused', 'expired')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists discount_codes_status_idx on public.discount_codes (status);
create index if not exists discount_codes_code_idx on public.discount_codes (code);

create table if not exists public.discount_redemptions (
  id uuid primary key default gen_random_uuid(),
  discount_id uuid not null references public.discount_codes (id) on delete cascade,
  order_id uuid,
  order_number text default '',
  customer_email text default '',
  discount_amount integer not null default 0 check (discount_amount >= 0),
  order_subtotal integer not null default 0,
  order_total integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists discount_redemptions_discount_idx
  on public.discount_redemptions (discount_id);
create index if not exists discount_redemptions_created_idx
  on public.discount_redemptions (created_at desc);

create table if not exists public.bulk_discounts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text default '',
  scope text not null default 'all'
    check (scope in ('all', 'category', 'collection', 'products')),
  scope_values jsonb not null default '[]'::jsonb,
  -- tiers: [{ "qty": 2, "discount_type": "percent"|"fixed", "value": 10 }, ...]
  tiers jsonb not null default '[]'::jsonb,
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  status text not null default 'active'
    check (status in ('draft', 'active', 'paused', 'expired')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists bulk_discounts_status_idx on public.bulk_discounts (status);

create table if not exists public.bulk_discount_redemptions (
  id uuid primary key default gen_random_uuid(),
  bulk_discount_id uuid not null references public.bulk_discounts (id) on delete cascade,
  order_id uuid,
  order_number text default '',
  customer_email text default '',
  qty integer not null default 0,
  discount_amount integer not null default 0,
  order_subtotal integer not null default 0,
  order_total integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists bulk_discount_redemptions_bulk_idx
  on public.bulk_discount_redemptions (bulk_discount_id);

alter table public.discount_codes enable row level security;
alter table public.discount_redemptions enable row level security;
alter table public.bulk_discounts enable row level security;
alter table public.bulk_discount_redemptions enable row level security;

-- Storefront may validate codes later via service role; no public write policies.

create table if not exists public.schema_migrations (
  id text primary key,
  applied_at timestamptz not null default now()
);
insert into public.schema_migrations (id) values ('004_discounts.sql')
on conflict (id) do nothing;
