-- Delhivery / courier shipment fields on orders
alter table public.orders
  add column if not exists courier text default '',
  add column if not exists awb text default '',
  add column if not exists tracking_url text default '',
  add column if not exists shipment_id text default '',
  add column if not exists shipment_status text default '',
  add column if not exists shipped_at timestamptz,
  add column if not exists delivered_at timestamptz;

create index if not exists orders_awb_idx on public.orders (awb)
  where awb is not null and awb <> '';

comment on column public.orders.courier is 'Carrier slug, e.g. delhivery';
comment on column public.orders.awb is 'Air waybill / tracking number';
comment on column public.orders.shipment_status is 'Last carrier status string from webhook';
