-- Create newsletters table to store sent newsletters
create table if not exists public.newsletters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject text not null,
  message_body text not null,
  sent_at timestamp with time zone not null default now(),
  total_recipients integer not null default 0,
  created_at timestamp with time zone not null default now()
);

-- Enable RLS
alter table public.newsletters enable row level security;

-- RLS policies for newsletters
create policy "Users can view their own newsletters"
  on public.newsletters for select
  using (auth.uid() = user_id);

create policy "Users can insert their own newsletters"
  on public.newsletters for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own newsletters"
  on public.newsletters for update
  using (auth.uid() = user_id);

create policy "Users can delete their own newsletters"
  on public.newsletters for delete
  using (auth.uid() = user_id);

-- Create index for faster queries
create index if not exists idx_newsletters_user_id on public.newsletters(user_id);
create index if not exists idx_newsletters_sent_at on public.newsletters(sent_at desc);
