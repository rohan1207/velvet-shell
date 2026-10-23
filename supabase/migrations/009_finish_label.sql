-- Separate metal finish from gem/stone colour on variants

alter table public.product_color_variants
  add column if not exists finish_label text not null default '925 Silver';

alter table public.product_families
  add column if not exists has_finish_variants boolean not null default false;

-- Backfill finish from material / legacy silver-gold "colour" labels
update public.product_color_variants
set finish_label = case
  when lower(coalesce(finish_label, '')) in ('925 silver', '18k gold-plated') then finish_label
  when lower(coalesce(color_label, '')) ~ 'gold' then '18K Gold-Plated'
  when lower(coalesce(color_label, '')) ~ 'silver|925|sterling' then '925 Silver'
  when lower(coalesce(material, '')) ~ 'gold' then '18K Gold-Plated'
  when lower(coalesce(material, '')) ~ 'silver|925|sterling' then '925 Silver'
  else '925 Silver'
end;

-- Move legacy metal-as-colour into finish; clear colour back to Default
update public.product_color_variants
set
  color_label = 'Default',
  color_swatch = '#C5C5C5'
where lower(trim(color_label)) ~ '^(silver|gold|sterling[[:space:]]*silver|18k([[:space:]]*gold)?([[:space:]]*plated)?|925([[:space:]]*silver)?|s925)$';

-- Sync material copy to finish label when empty or still metal-ish
update public.product_color_variants
set material = finish_label
where coalesce(trim(material), '') = ''
   or lower(material) ~ 'silver|gold|925|sterling|plated';

-- Families with more than one distinct finish
update public.product_families f
set has_finish_variants = true
where exists (
  select 1
  from public.product_color_variants v
  where v.family_id = f.id
  group by v.family_id
  having count(distinct v.finish_label) > 1
);

insert into public.schema_migrations (id) values ('009_finish_label')
on conflict (id) do nothing;
