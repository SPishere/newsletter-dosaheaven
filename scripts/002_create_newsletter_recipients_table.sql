-- Create newsletter_recipients table to track who received each newsletter
create table if not exists public.newsletter_recipients (
  id uuid primary key default gen_random_uuid(),
  newsletter_id uuid not null references public.newsletters(id) on delete cascade,
  contact_id bigint not null references public.joinlist_dosaheaven(id) on delete cascade,
  sent_at timestamp with time zone not null default now(),
  created_at timestamp with time zone not null default now()
);

-- Enable RLS
alter table public.newsletter_recipients enable row level security;

-- RLS policies for newsletter_recipients
-- Users can view recipients for their own newsletters
create policy "Users can view recipients for their newsletters"
  on public.newsletter_recipients for select
  using (
    exists (
      select 1 from public.newsletters
      where newsletters.id = newsletter_recipients.newsletter_id
      and newsletters.user_id = auth.uid()
    )
  );

create policy "Users can insert recipients for their newsletters"
  on public.newsletter_recipients for insert
  with check (
    exists (
      select 1 from public.newsletters
      where newsletters.id = newsletter_recipients.newsletter_id
      and newsletters.user_id = auth.uid()
    )
  );

-- Create indexes for faster queries
create index if not exists idx_newsletter_recipients_newsletter_id on public.newsletter_recipients(newsletter_id);
create index if not exists idx_newsletter_recipients_contact_id on public.newsletter_recipients(contact_id);
