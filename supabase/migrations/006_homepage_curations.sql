-- Homepage curated product strips (Festive Edit / Best Sellers)

create table if not exists public.homepage_curations (
  slug text primary key
    check (slug in ('festive-edit', 'best-sellers')),
  eyebrow text not null default '',
  title text not null default '',
  line text not null default '',
  -- Ordered list of product family or variant slugs
  product_slugs jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.homepage_curations enable row level security;

drop policy if exists "Public read homepage curations" on public.homepage_curations;
create policy "Public read homepage curations"
  on public.homepage_curations for select
  using (true);

-- Seed defaults matching previous hardcoded storefront lists
insert into public.homepage_curations (slug, eyebrow, title, line, product_slugs)
values
  (
    'festive-edit',
    'Seasonal',
    'Festive Edit',
    'A celebratory selection — blooms, metals and forms for the season’s quiet shine.',
    '[
      "glitter-pearl-bracelet",
      "fairy-fringe-necklace",
      "starry-mermaid-pearl-choker",
      "pearl-zircon-clavicle",
      "double-pearl-clip-ons",
      "palace-bell-anklet",
      "green-leaves-set",
      "sweet-flower-set",
      "frost-bloom",
      "snowflake-jewellery-set",
      "butterfly-jewellery-set",
      "shell-hoop-earrings"
    ]'::jsonb
  ),
  (
    'best-sellers',
    'Best sellers',
    'Best of Velvet Shell',
    'The pieces guests return for — a quiet house edit across form and metal.',
    '[
      "soft-rain-floral-drops",
      "freshwater-pearl-studs",
      "lotus-chain-necklace",
      "daisy-day-studs",
      "clover-pearl-studs",
      "honeybee-studs",
      "mermaid-double-pearl-ring",
      "birds-on-branch-bracelet",
      "pearl-pendant-necklace",
      "chrysanthemum-open-ring",
      "bamboo-knot-bracelet",
      "butterfly-layered-necklace"
    ]'::jsonb
  )
on conflict (slug) do nothing;
