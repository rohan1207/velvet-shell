-- Gift wrap + custom gift message (storefront + admin settings)

create table if not exists public.store_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.store_settings enable row level security;

drop policy if exists "Public read store settings" on public.store_settings;
create policy "Public read store settings"
  on public.store_settings for select
  using (true);

-- Default gift options (admin can toggle / customize anytime)
insert into public.store_settings (key, value)
values (
  'gift_options',
  '{
    "giftWrapEnabled": true,
    "giftWrapFee": 25,
    "giftWrapLabel": "Gift wrap?",
    "giftWrapDescription": "Ribbon-tied packaging — a soft finishing touch for someone special.",
    "messageEnabled": true,
    "messageLabel": "Add a custom message?",
    "messageDescription": "We will include a short note with your order.",
    "messageMaxLength": 200,
    "messagePlaceholder": "Write a short note…"
  }'::jsonb
)
on conflict (key) do nothing;

alter table public.orders
  add column if not exists gift_wrap boolean not null default false;

alter table public.orders
  add column if not exists gift_wrap_fee integer not null default 0
    check (gift_wrap_fee >= 0);

alter table public.orders
  add column if not exists gift_message text not null default '';

comment on column public.orders.gift_wrap is 'Whether gift wrap was selected at checkout.';
comment on column public.orders.gift_wrap_fee is 'INR fee charged for gift wrap (usually 25).';
comment on column public.orders.gift_message is 'Optional gift note included with the order.';

insert into public.schema_migrations (id) values ('014_gift_options')
on conflict (id) do nothing;
