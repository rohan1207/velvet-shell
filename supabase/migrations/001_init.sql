-- Velvet Shell commerce schema (Supabase Postgres)
-- Run in Supabase SQL Editor or via supabase db push

create extension if not exists "pgcrypto";

-- Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  first_name text default '',
  last_name text default '',
  phone text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  label text default 'Home',
  full_name text not null,
  phone text not null,
  line1 text not null,
  line2 text default '',
  city text not null,
  state text not null,
  postal text not null,
  country text not null default 'India',
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists addresses_user_id_idx on public.addresses (user_id);

create table if not exists public.collections (
  slug text primary key,
  name text not null,
  line text default ''
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  collection_slug text references public.collections (slug),
  category text not null,
  price integer not null check (price >= 0),
  limited boolean not null default false,
  made_to_order boolean not null default false,
  badge text default '',
  description text default '',
  story text default '',
  care text default '',
  image_url text not null,
  hover_image_url text,
  details jsonb not null default '[]'::jsonb,
  gallery jsonb not null default '[]'::jsonb,
  metals jsonb not null default '[]'::jsonb,
  sizes jsonb not null default '[]'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category);
create index if not exists products_collection_idx on public.products (collection_slug);
create index if not exists products_active_idx on public.products (active);

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  sku text not null unique,
  size text not null,
  metal text not null,
  price_override integer,
  created_at timestamptz not null default now(),
  unique (product_id, size, metal)
);

create table if not exists public.inventory (
  variant_id uuid primary key references public.product_variants (id) on delete cascade,
  stock integer not null default 0 check (stock >= 0),
  reserved integer not null default 0 check (reserved >= 0),
  low_stock_threshold integer not null default 3,
  updated_at timestamptz not null default now()
);

create table if not exists public.wishlists (
  user_id uuid not null references public.profiles (id) on delete cascade,
  product_slug text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, product_slug)
);

create type public.order_status as enum (
  'pending_payment',
  'paid',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded'
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  user_id uuid references public.profiles (id) on delete set null,
  email text not null,
  status public.order_status not null default 'pending_payment',
  subtotal integer not null check (subtotal >= 0),
  shipping_fee integer not null default 0,
  total integer not null check (total >= 0),
  currency text not null default 'INR',
  shipping jsonb not null default '{}'::jsonb,
  razorpay_order_id text unique,
  notes text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_user_id_idx on public.orders (user_id);
create index if not exists orders_status_idx on public.orders (status);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_slug text not null,
  product_name text not null,
  image_url text,
  size text not null,
  metal text not null,
  unit_price integer not null,
  qty integer not null check (qty > 0),
  line_total integer not null,
  variant_id uuid references public.product_variants (id) on delete set null
);

create index if not exists order_items_order_id_idx on public.order_items (order_id);

create type public.payment_status as enum (
  'created',
  'authorized',
  'captured',
  'failed',
  'refunded'
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  razorpay_order_id text,
  razorpay_payment_id text unique,
  razorpay_signature text,
  amount integer not null,
  currency text not null default 'INR',
  status public.payment_status not null default 'created',
  raw jsonb default '{}'::jsonb,
  idempotency_key text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.blog_posts (
  slug text primary key,
  title text not null,
  eyebrow text default '',
  excerpt text default '',
  body jsonb not null default '[]'::jsonb,
  image_url text,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.banners (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  image_url text not null,
  alt text default '',
  href text default '/',
  sort_order integer not null default 0,
  active boolean not null default true
);

-- Auto profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, first_name, last_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', '')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Mark paid + decrement stock (idempotent via payments.idempotency_key)
create or replace function public.fulfill_paid_order(
  p_order_id uuid,
  p_payment_id text,
  p_signature text,
  p_idempotency_key text,
  p_raw jsonb default '{}'::jsonb
)
returns public.orders
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders;
  v_item record;
  v_available integer;
begin
  if exists (select 1 from public.payments where idempotency_key = p_idempotency_key) then
    select * into v_order from public.orders where id = p_order_id;
    return v_order;
  end if;

  select * into v_order from public.orders where id = p_order_id for update;
  if not found then
    raise exception 'Order not found';
  end if;

  if v_order.status = 'paid' then
    return v_order;
  end if;

  for v_item in
    select * from public.order_items where order_id = p_order_id
  loop
    if v_item.variant_id is null then
      continue;
    end if;

    select (stock - reserved) into v_available
    from public.inventory
    where variant_id = v_item.variant_id
    for update;

    if v_available is null then
      raise exception 'Missing inventory for variant %', v_item.variant_id;
    end if;

    if v_available < v_item.qty then
      raise exception 'Insufficient stock for %', v_item.product_slug;
    end if;

    update public.inventory
    set stock = stock - v_item.qty,
        updated_at = now()
    where variant_id = v_item.variant_id;
  end loop;

  update public.orders
  set status = 'paid',
      updated_at = now()
  where id = p_order_id
  returning * into v_order;

  insert into public.payments (
    order_id,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    amount,
    currency,
    status,
    raw,
    idempotency_key
  ) values (
    p_order_id,
    v_order.razorpay_order_id,
    p_payment_id,
    p_signature,
    v_order.total,
    v_order.currency,
    'captured',
    p_raw,
    p_idempotency_key
  );

  return v_order;
end;
$$;

-- RLS
alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.inventory enable row level security;
alter table public.wishlists enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;
alter table public.collections enable row level security;
alter table public.blog_posts enable row level security;
alter table public.banners enable row level security;

-- Public read catalog
create policy "Public read products" on public.products for select using (active = true);
create policy "Public read variants" on public.product_variants for select using (true);
create policy "Public read inventory" on public.inventory for select using (true);
create policy "Public read collections" on public.collections for select using (true);
create policy "Public read blogs" on public.blog_posts for select using (published_at is not null);
create policy "Public read banners" on public.banners for select using (active = true);

-- Profile: own row
create policy "Users read own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id);

-- Addresses
create policy "Users manage own addresses" on public.addresses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Wishlists
create policy "Users manage own wishlist" on public.wishlists
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Orders: read own
create policy "Users read own orders" on public.orders for select using (auth.uid() = user_id);
create policy "Users read own order items" on public.order_items for select
  using (exists (
    select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()
  ));
create policy "Users read own payments" on public.payments for select
  using (exists (
    select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()
  ));

-- Service role bypasses RLS for webhooks / admin inserts
