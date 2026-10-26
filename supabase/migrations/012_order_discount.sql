-- Persist promo discount on orders for ops + receipts
alter table public.orders
  add column if not exists discount_code text not null default '';

alter table public.orders
  add column if not exists discount_amount integer not null default 0
    check (discount_amount >= 0);

alter table public.orders
  add column if not exists discount_id uuid;

comment on column public.orders.discount_code is 'Promo code applied at checkout (uppercase).';
comment on column public.orders.discount_amount is 'INR discount subtracted from subtotal before shipping.';

create index if not exists orders_discount_code_idx
  on public.orders (discount_code)
  where discount_code <> '';
