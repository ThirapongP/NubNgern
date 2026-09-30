-- =========================================================
-- NUBNGERN DATABASE
-- Supabase PostgreSQL
-- =========================================================

create extension if not exists "pgcrypto";


-- =========================================================
-- PROFILES
-- =========================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  theme text not null default 'dark'
    check (theme in ('dark','light')),
  lang text not null default 'en'
    check (lang in ('th','en')),
  updated_at timestamptz not null default now()
);

alter table public.profiles
  add column if not exists display_name text,
  add column if not exists theme text not null default 'dark',
  add column if not exists lang text not null default 'en',
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists monthly_expense_budget numeric(12,2)
    check (monthly_expense_budget is null or monthly_expense_budget > 0);

notify pgrst, 'reload schema';

alter table public.profiles enable row level security;

drop policy if exists profiles_select on public.profiles;
create policy profiles_select
on public.profiles
for select
using (auth.uid() = id);

drop policy if exists profiles_insert on public.profiles;
create policy profiles_insert
on public.profiles
for insert
with check (auth.uid() = id);

drop policy if exists profiles_update on public.profiles;
create policy profiles_update
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);


-- =========================================================
-- SUBSCRIPTIONS
-- =========================================================

create table if not exists public.subscriptions (

  id uuid primary key
    default gen_random_uuid(),

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  type varchar(10) not null
    check (type in ('income','expense')),

  category varchar(50) not null,

  amount numeric(12,2) not null
    check (amount > 0),

  payment_method varchar(20) not null
    check (
      payment_method in
      ('cash','bank','credit')
    ),

  note text,

  frequency varchar(10) not null
    check (
      frequency in
      ('daily','weekly','monthly','yearly')
    ),

  next_run_at timestamptz not null,

  last_run_at timestamptz,

  is_active boolean not null
    default true,

  created_at timestamptz not null
    default now()
);

create index if not exists idx_sub_user
on public.subscriptions(user_id);

create index if not exists idx_sub_next_run
on public.subscriptions(next_run_at)
where is_active = true;


alter table public.subscriptions enable row level security;

drop policy if exists subscriptions_owner
on public.subscriptions;

create policy subscriptions_owner
on public.subscriptions
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);


-- =========================================================
-- TRANSACTIONS
-- =========================================================
--
-- IMPORTANT:
-- ใช้ column ตาม form/backend เท่านั้น
--
-- id
-- user_id
-- type
-- category
-- amount
-- payment_method
-- is_subscription
-- note
-- occurred_at
-- created_at
-- =========================================================

create table if not exists public.transactions (

  id uuid primary key
    default gen_random_uuid(),

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  type varchar(10) not null
    check (type in ('income','expense')),

  category varchar(50) not null,

  amount numeric(12,2) not null
    check (amount > 0),

  payment_method varchar(20) not null
    check (
      payment_method in
      ('cash','bank','credit')
    ),

  is_subscription boolean not null
    default false,

  note text,

  occurred_at timestamptz not null
    default now(),

  created_at timestamptz not null
    default now()
);


create index if not exists idx_transactions_user_date
on public.transactions(
  user_id,
  occurred_at desc
);

create index if not exists idx_transactions_user_type
on public.transactions(
  user_id,
  type
);

create index if not exists idx_transactions_subscription
on public.transactions(
  user_id,
  is_subscription
);


alter table public.transactions enable row level security;

drop policy if exists transactions_owner
on public.transactions;

create policy transactions_owner
on public.transactions
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);


-- =========================================================
-- SAVINGS GOALS
-- =========================================================

create table if not exists public.savings_goals (

  id uuid primary key
    default gen_random_uuid(),

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  title text not null
    default 'Monthly Savings Goal',

  target_amount numeric(12,2) not null
    check (target_amount > 0),

  period varchar(10) not null
    default 'monthly'
    check (
      period in
      ('weekly','monthly','yearly')
    ),

  is_active boolean not null
    default true,

  created_at timestamptz not null
    default now()
);

create unique index if not exists uq_active_goal
on public.savings_goals(user_id)
where is_active = true;


alter table public.savings_goals enable row level security;

drop policy if exists savings_owner
on public.savings_goals;

create policy savings_owner
on public.savings_goals
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);


-- =========================================================
-- AUTO UPDATE PROFILE TIME
-- =========================================================

create or replace function public.update_profile_timestamp()
returns trigger
language plpgsql
as $$
begin

  new.updated_at = now();

  return new;

end;
$$;


drop trigger if exists profile_updated_at
on public.profiles;

create trigger profile_updated_at

before update
on public.profiles

for each row
execute function public.update_profile_timestamp();


-- =========================================================
-- AUTO CREATE PROFILE AFTER SIGNUP (FIXED NULL CRASH)
-- =========================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles(
    id,
    display_name,
    lang,
    theme
  )
  VALUES(
    new.id,
    COALESCE(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      split_part(new.email, '@', 1),
      'User'
    ),
    'en',
    'dark'
  )
  ON CONFLICT(id) DO UPDATE 
  SET updated_at = now();

  RETURN new;
END;
$$;


drop trigger if exists on_auth_user_created
on auth.users;

create trigger on_auth_user_created

after insert
on auth.users

for each row
execute procedure public.handle_new_user();


-- =========================================================
-- DONE
-- =========================================================