-- Story + care copy on each color variant (storefront PDP accordion)

alter table public.product_color_variants
  add column if not exists story text not null default '',
  add column if not exists care text not null default '';

insert into public.schema_migrations (id) values ('005_variant_story_care.sql')
on conflict (id) do nothing;
