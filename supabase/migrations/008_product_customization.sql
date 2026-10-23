-- Product customization prompts (admin-defined) + order line answers

alter table public.product_families
  add column if not exists customization_enabled boolean not null default false;

alter table public.product_families
  add column if not exists customization_fields jsonb not null default '[]'::jsonb;

comment on column public.product_families.customization_enabled is
  'When true, storefront asks shoppers for the fields in customization_fields.';

comment on column public.product_families.customization_fields is
  'Array of { id, label, inputType: text|number|textarea, required, placeholder }.';

alter table public.order_items
  add column if not exists customization jsonb not null default '[]'::jsonb;

comment on column public.order_items.customization is
  'Shopper answers: array of { id, label, value }.';
