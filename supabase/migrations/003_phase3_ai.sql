-- Phase 3: AI Chat & Semantic Search
set search_path to public, extensions;

-- ============================================================
-- chat_messages: stores user ↔ assistant conversation history
-- ============================================================
create table chat_messages (
    id          uuid primary key default gen_random_uuid(),
    user_id     uuid not null references auth.users(id) on delete cascade,
    role        text not null check (role in ('user', 'assistant')),
    content     text not null,
    tx_refs     uuid[],
    created_at  timestamptz not null default now()
);

alter table chat_messages enable row level security;

create policy "Users can view their own chat messages"
    on chat_messages for select
    using (auth.uid() = user_id);

create policy "Users can insert their own chat messages"
    on chat_messages for insert
    with check (auth.uid() = user_id);

-- ============================================================
-- HNSW index on transactions.embedding for fast cosine search
-- ============================================================
create index idx_transactions_embedding
    on transactions using hnsw (embedding vector_cosine_ops)
    with (m = 16, ef_construction = 64);

-- ============================================================
-- match_transactions: pgvector similarity search RPC
-- ============================================================
create or replace function match_transactions(
    query_embedding vector(1536),
    match_threshold float default 0.7,
    match_count int default 10,
    p_user_id uuid default null
)
returns table (
    id uuid,
    merchant text,
    category text,
    amount float,
    date date,
    similarity float
)
language plpgsql security definer
as $$
begin
    return query
    select
        t.id,
        t.merchant,
        t.category,
        t.amount::float,
        t.date,
        (1 - (t.embedding <=> query_embedding))::float as similarity
    from transactions t
    where t.user_id = p_user_id
      and 1 - (t.embedding <=> query_embedding) > match_threshold
    order by t.embedding <=> query_embedding
    limit match_count;
end;
$$;

-- ============================================================
-- Enable Realtime for chat_messages
-- ============================================================
alter publication supabase_realtime add table chat_messages;
