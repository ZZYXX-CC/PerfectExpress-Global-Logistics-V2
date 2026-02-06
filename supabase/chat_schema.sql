-- Live Chat Schema (Auth-only)

create extension if not exists "uuid-ossp";

create table if not exists chat_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) not null,
  user_email text not null,
  user_name text not null,
  status text default 'active' check (status in ('active', 'closed')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists chat_messages (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid references chat_sessions(id) on delete cascade,
  sender_type text not null check (sender_type in ('customer', 'admin')),
  sender_name text,
  message text not null,
  created_at timestamptz default now()
);

create index if not exists idx_chat_sessions_user_id on chat_sessions(user_id);
create index if not exists idx_chat_messages_session_id on chat_messages(session_id);

alter table chat_sessions enable row level security;
alter table chat_messages enable row level security;

-- Sessions
drop policy if exists "Users can create own chat sessions" on chat_sessions;
create policy "Users can create own chat sessions" on chat_sessions
for insert with check (auth.uid() = user_id);

drop policy if exists "Users can view own chat sessions" on chat_sessions;
create policy "Users can view own chat sessions" on chat_sessions
for select using (auth.uid() = user_id);

drop policy if exists "Admins can view all chat sessions" on chat_sessions;
create policy "Admins can view all chat sessions" on chat_sessions
for select using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

drop policy if exists "Admins can update all chat sessions" on chat_sessions;
create policy "Admins can update all chat sessions" on chat_sessions
for update using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

-- Messages
drop policy if exists "Users can view messages in own sessions" on chat_messages;
create policy "Users can view messages in own sessions" on chat_messages
for select using (
  exists (
    select 1 from public.chat_sessions s
    where s.id = chat_messages.session_id
    and s.user_id = auth.uid()
  )
);

drop policy if exists "Users can send messages in own sessions" on chat_messages;
create policy "Users can send messages in own sessions" on chat_messages
for insert with check (
  exists (
    select 1 from public.chat_sessions s
    where s.id = chat_messages.session_id
    and s.user_id = auth.uid()
  )
);

drop policy if exists "Admins can view all chat messages" on chat_messages;
create policy "Admins can view all chat messages" on chat_messages
for select using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

drop policy if exists "Admins can send chat messages" on chat_messages;
create policy "Admins can send chat messages" on chat_messages
for insert with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);
