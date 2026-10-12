-- Auth hardening: roles, phone lookup, password-reset OTP codes

alter table public.profiles
  add column if not exists role text not null default 'customer',
  add column if not exists full_name text default '',
  add column if not exists phone_normalized text default '';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'profiles_role_check'
  ) then
    alter table public.profiles
      add constraint profiles_role_check
      check (role in ('customer', 'admin'));
  end if;
end $$;

-- Keep first/last in sync when full_name is provided
update public.profiles
set full_name = trim(concat_ws(' ', nullif(first_name, ''), nullif(last_name, '')))
where coalesce(full_name, '') = ''
  and (coalesce(first_name, '') <> '' or coalesce(last_name, '') <> '');

create unique index if not exists profiles_phone_normalized_uidx
  on public.profiles (phone_normalized)
  where phone_normalized is not null and phone_normalized <> '';

create index if not exists profiles_email_lower_idx
  on public.profiles (lower(email));

create table if not exists public.password_reset_codes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  email text not null,
  code_hash text not null,
  attempts integer not null default 0,
  expires_at timestamptz not null,
  consumed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists password_reset_codes_user_id_idx
  on public.password_reset_codes (user_id);

create index if not exists password_reset_codes_email_idx
  on public.password_reset_codes (lower(email));

alter table public.password_reset_codes enable row level security;
-- No public policies: only service role reads/writes OTP rows.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_full text;
  v_first text;
  v_last text;
  v_phone text;
  v_phone_norm text;
  v_role text;
begin
  v_full := coalesce(nullif(trim(new.raw_user_meta_data->>'full_name'), ''), '');
  v_first := coalesce(nullif(trim(new.raw_user_meta_data->>'first_name'), ''), '');
  v_last := coalesce(nullif(trim(new.raw_user_meta_data->>'last_name'), ''), '');
  v_phone := coalesce(nullif(trim(new.raw_user_meta_data->>'phone'), ''), '');
  v_phone_norm := coalesce(nullif(trim(new.raw_user_meta_data->>'phone_normalized'), ''), '');
  v_role := coalesce(nullif(trim(new.raw_user_meta_data->>'role'), ''), 'customer');

  if v_full = '' and (v_first <> '' or v_last <> '') then
    v_full := trim(concat_ws(' ', nullif(v_first, ''), nullif(v_last, '')));
  end if;

  if v_first = '' and v_full <> '' then
    v_first := split_part(v_full, ' ', 1);
    v_last := nullif(trim(substr(v_full, length(v_first) + 1)), '');
  end if;

  if v_role not in ('customer', 'admin') then
    v_role := 'customer';
  end if;

  insert into public.profiles (
    id, email, first_name, last_name, full_name, phone, phone_normalized, role
  ) values (
    new.id,
    new.email,
    coalesce(v_first, ''),
    coalesce(v_last, ''),
    coalesce(v_full, ''),
    v_phone,
    v_phone_norm,
    v_role
  )
  on conflict (id) do update set
    email = excluded.email,
    first_name = coalesce(nullif(excluded.first_name, ''), public.profiles.first_name),
    last_name = coalesce(nullif(excluded.last_name, ''), public.profiles.last_name),
    full_name = coalesce(nullif(excluded.full_name, ''), public.profiles.full_name),
    phone = coalesce(nullif(excluded.phone, ''), public.profiles.phone),
    phone_normalized = coalesce(nullif(excluded.phone_normalized, ''), public.profiles.phone_normalized),
    role = case
      when excluded.role = 'admin' then 'admin'
      else public.profiles.role
    end,
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Role check via security definer to avoid RLS recursion on profiles.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

drop policy if exists "Admins read profiles" on public.profiles;
create policy "Admins read profiles" on public.profiles
  for select using (public.is_admin());
