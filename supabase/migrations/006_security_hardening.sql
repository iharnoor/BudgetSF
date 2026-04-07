-- ============================================================
-- Migration 006: Security Hardening
-- Adds missing RLS DELETE policies and restricts SECURITY DEFINER
-- functions so they cannot be called directly with the anon key.
-- ============================================================

-- ============================================================
-- 1. Missing DELETE policies (only on tables that exist)
-- ============================================================

-- accounts
do $$ begin
  if exists (select from pg_tables where schemaname = 'public' and tablename = 'accounts') then
    create policy "Users can delete their own accounts"
      on accounts for delete
      using (auth.uid() = user_id);
  end if;
exception when duplicate_object then null;
end $$;

-- transactions
do $$ begin
  if exists (select from pg_tables where schemaname = 'public' and tablename = 'transactions') then
    create policy "Users can delete their own transactions"
      on transactions for delete
      using (auth.uid() = user_id);
  end if;
exception when duplicate_object then null;
end $$;

-- chat_messages
do $$ begin
  if exists (select from pg_tables where schemaname = 'public' and tablename = 'chat_messages') then
    create policy "Users can delete their own chat messages"
      on chat_messages for delete
      using (auth.uid() = user_id);
  end if;
exception when duplicate_object then null;
end $$;

-- notifications
do $$ begin
  if exists (select from pg_tables where schemaname = 'public' and tablename = 'notifications') then
    create policy "Users can delete their own notifications"
      on notifications for delete
      using (auth.uid() = user_id);
  end if;
exception when duplicate_object then null;
end $$;

-- ============================================================
-- 2. Lock down SECURITY DEFINER functions (skip if not present)
-- ============================================================

-- upsert_account
do $$ begin
  if exists (select from pg_proc where proname = 'upsert_account') then
    revoke execute on function upsert_account(uuid, uuid, text, text, text, text, double precision, double precision, text) from public;
    revoke execute on function upsert_account(uuid, uuid, text, text, text, text, double precision, double precision, text) from anon;
    revoke execute on function upsert_account(uuid, uuid, text, text, text, text, double precision, double precision, text) from authenticated;
    grant  execute on function upsert_account(uuid, uuid, text, text, text, text, double precision, double precision, text) to service_role;
  end if;
exception when others then null;
end $$;

-- upsert_transaction
do $$ begin
  if exists (select from pg_proc where proname = 'upsert_transaction') then
    revoke execute on function upsert_transaction(uuid, uuid, text, double precision, text, text, date, boolean) from public;
    revoke execute on function upsert_transaction(uuid, uuid, text, double precision, text, text, date, boolean) from anon;
    revoke execute on function upsert_transaction(uuid, uuid, text, double precision, text, text, date, boolean) from authenticated;
    grant  execute on function upsert_transaction(uuid, uuid, text, double precision, text, text, date, boolean) to service_role;
  end if;
exception when others then null;
end $$;

-- match_transactions (requires pgvector — skip if extension not enabled)
do $$ begin
  if exists (select from pg_extension where extname = 'vector')
     and exists (select from pg_proc where proname = 'match_transactions') then
    execute 'revoke execute on function match_transactions(vector(1536), float, int, uuid) from public';
    execute 'revoke execute on function match_transactions(vector(1536), float, int, uuid) from anon';
    execute 'revoke execute on function match_transactions(vector(1536), float, int, uuid) from authenticated';
    execute 'grant  execute on function match_transactions(vector(1536), float, int, uuid) to service_role';
  end if;
exception when others then null;
end $$;
