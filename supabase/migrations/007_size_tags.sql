-- Custom size pills / tags per color variant (admin → storefront Measure pills)

alter table public.product_color_variants
  add column if not exists size_tags jsonb not null default '[]'::jsonb;

-- Backfill from existing length_label when size_tags is empty
update public.product_color_variants
set size_tags = jsonb_build_array(length_label)
where coalesce(length_label, '') <> ''
  and (size_tags is null or size_tags = '[]'::jsonb);

insert into public.schema_migrations (id) values ('007_size_tags.sql')
on conflict (id) do nothing;
