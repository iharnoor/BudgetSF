-- WealthLens: Initial Schema
-- Phase 1 — Auth, Plaid Items, Accounts, Transactions with RLS

-- Enable pgvector for future embedding support (Phase 3)
create extension if not exists vector with schema extensions;
set search_path to public, extensions;

-- ============================================================
-- plaid_items: stores one row per Plaid Link session
-- ============================================================
create table plaid_items (
    id          uuid primary key default gen_random_uuid(),
    user_id     uuid not null references auth.users(id) on delete cascade,
    access_token_encrypted text not null,
    item_id     text not null unique,
    institution_name text,
    status      text not null default 'active',
    created_at  timestamptz not null default now(),
    updated_at  timestamptz not null default now()
);

alter table plaid_items enable row level security;

create policy "Users can view their own plaid items"
    on plaid_items for select
    using (auth.uid() = user_id);

create policy "Users can insert their own plaid items"
    on plaid_items for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own plaid items"
    on plaid_items for update
    using (auth.uid() = user_id);

-- ============================================================
-- accounts: bank accounts synced via Plaid
-- ============================================================
create table accounts (
    id          uuid primary key default gen_random_uuid(),
    user_id     uuid not null references auth.users(id) on delete cascade,
    plaid_item_id uuid references plaid_items(id) on delete cascade,
    account_id  text not null,
    name        text not null,
    type        text,
    subtype     text,
    balance_current   double precision,
    balance_available double precision,
    institution_name  text,
    balance_updated_at timestamptz,
    created_at  timestamptz not null default now(),
    updated_at  timestamptz not null default now()
);

alter table accounts enable row level security;

create policy "Users can view their own accounts"
    on accounts for select
    using (auth.uid() = user_id);

create policy "Users can insert their own accounts"
    on accounts for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own accounts"
    on accounts for update
    using (auth.uid() = user_id);

-- ============================================================
-- transactions: individual transactions from Plaid
-- ============================================================
create table transactions (
    id          uuid primary key default gen_random_uuid(),
    user_id     uuid not null references auth.users(id) on delete cascade,
    account_id  uuid not null references accounts(id) on delete cascade,
    plaid_transaction_id text unique,
    amount      double precision not null,
    merchant    text,
    category    text,
    date        date not null,
    pending     boolean not null default false,
    embedding   vector(1536),
    created_at  timestamptz not null default now(),
    updated_at  timestamptz not null default now()
);

alter table transactions enable row level security;

create policy "Users can view their own transactions"
    on transactions for select
    using (auth.uid() = user_id);

create policy "Users can insert their own transactions"
    on transactions for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own transactions"
    on transactions for update
    using (auth.uid() = user_id);

-- ============================================================
-- Indexes
-- ============================================================
create index idx_accounts_user_id on accounts(user_id);
create index idx_transactions_user_id on transactions(user_id);
create index idx_transactions_account_id on transactions(account_id);
create index idx_transactions_date on transactions(date);
create index idx_plaid_items_user_id on plaid_items(user_id);
