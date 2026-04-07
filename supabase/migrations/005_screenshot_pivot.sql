-- WealthLens: Pivot from Plaid to screenshot-based transaction analysis
-- SF-only launch

-- ============================================================
-- Drop Plaid items table (cascades FK on accounts.plaid_item_id)
-- ============================================================
drop table if exists plaid_items cascade;

-- ============================================================
-- Alter accounts: remove Plaid-specific columns
-- ============================================================
alter table accounts drop column if exists plaid_item_id;
alter table accounts drop column if exists account_id;

-- ============================================================
-- Alter transactions: remove Plaid column, add screenshot source + city
-- ============================================================
alter table transactions drop column if exists plaid_transaction_id;
alter table transactions
    add column source text not null default 'screenshot';
alter table transactions
    add column city text not null default 'San Francisco';
alter table transactions
    alter column account_id drop not null;

-- ============================================================
-- screenshot_uploads: track uploaded bank-app screenshots
-- ============================================================
create table screenshot_uploads (
    id              uuid primary key default gen_random_uuid(),
    user_id         uuid not null references auth.users(id) on delete cascade,
    image_url       text not null,
    status          text not null default 'processing',
    extracted_data  jsonb,
    error_message   text,
    created_at      timestamptz not null default now()
);

alter table screenshot_uploads enable row level security;

create policy "Users can view their own screenshot uploads"
    on screenshot_uploads for select
    using (auth.uid() = user_id);

create policy "Users can insert their own screenshot uploads"
    on screenshot_uploads for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own screenshot uploads"
    on screenshot_uploads for update
    using (auth.uid() = user_id);

-- ============================================================
-- merchant_alternatives: cache of cheaper SF alternatives
-- ============================================================
create table merchant_alternatives (
    id              uuid primary key default gen_random_uuid(),
    merchant_name   text not null,
    category        text,
    city            text not null default 'San Francisco',
    alternatives    jsonb not null default '[]'::jsonb,
    updated_at      timestamptz not null default now()
);

create unique index idx_merchant_alternatives_name_city
    on merchant_alternatives (lower(merchant_name), lower(city));

-- ============================================================
-- Indexes
-- ============================================================
create index idx_screenshot_uploads_user_id on screenshot_uploads(user_id);
create index idx_transactions_city on transactions(city);
