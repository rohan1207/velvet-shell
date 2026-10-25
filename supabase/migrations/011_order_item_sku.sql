-- Persist product / variant identity on order lines for inventory & ops
alter table public.order_items
  add column if not exists sku text not null default '';

alter table public.order_items
  add column if not exists color_label text not null default '';

comment on column public.order_items.sku is
  'Catalogue SKU (e.g. LFJB0324) captured at checkout for inventory matching.';

comment on column public.order_items.color_label is
  'Colour / finish label of the variant at checkout (Gold, Silver, …).';

create index if not exists order_items_sku_idx on public.order_items (sku);
