-- Phase 2: Helpers for transaction sync and balance refresh

-- Add sync cursor to plaid_items for incremental transaction sync
alter table plaid_items add column if not exists sync_cursor text;

-- Unique constraint on accounts.account_id for upsert support
alter table accounts add constraint accounts_account_id_unique unique (account_id);

-- ============================================================
-- upsert_account: called by Edge Functions (SECURITY DEFINER bypasses RLS)
-- ============================================================
create or replace function upsert_account(
    p_user_id uuid,
    p_plaid_item_id uuid,
    p_account_id text,
    p_name text,
    p_type text,
    p_subtype text,
    p_balance_current double precision,
    p_balance_available double precision,
    p_institution_name text
) returns uuid
language plpgsql security definer
as $$
declare
    v_id uuid;
begin
    insert into accounts (
        user_id, plaid_item_id, account_id, name, type, subtype,
        balance_current, balance_available, institution_name,
        balance_updated_at, updated_at
    ) values (
        p_user_id, p_plaid_item_id, p_account_id, p_name, p_type, p_subtype,
        p_balance_current, p_balance_available, p_institution_name,
        now(), now()
    )
    on conflict (account_id) do update set
        name = excluded.name,
        type = excluded.type,
        subtype = excluded.subtype,
        balance_current = excluded.balance_current,
        balance_available = excluded.balance_available,
        institution_name = excluded.institution_name,
        balance_updated_at = now(),
        updated_at = now()
    returning id into v_id;

    return v_id;
end;
$$;

-- ============================================================
-- upsert_transaction: called by Edge Functions (SECURITY DEFINER bypasses RLS)
-- ============================================================
create or replace function upsert_transaction(
    p_user_id uuid,
    p_account_id uuid,
    p_plaid_transaction_id text,
    p_amount double precision,
    p_merchant text,
    p_category text,
    p_date date,
    p_pending boolean
) returns uuid
language plpgsql security definer
as $$
declare
    v_id uuid;
begin
    insert into transactions (
        user_id, account_id, plaid_transaction_id, amount,
        merchant, category, date, pending, updated_at
    ) values (
        p_user_id, p_account_id, p_plaid_transaction_id, p_amount,
        p_merchant, p_category, p_date, p_pending, now()
    )
    on conflict (plaid_transaction_id) do update set
        amount = excluded.amount,
        merchant = excluded.merchant,
        category = excluded.category,
        date = excluded.date,
        pending = excluded.pending,
        updated_at = now()
    returning id into v_id;

    return v_id;
end;
$$;

-- ============================================================
-- Enable Realtime for accounts and transactions
-- ============================================================
alter publication supabase_realtime add table accounts;
alter publication supabase_realtime add table transactions;
