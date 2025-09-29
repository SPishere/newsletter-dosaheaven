-- Add RLS policies to the existing joinlist_dosaheaven table
-- This allows authenticated users to view and manage contacts

alter table public.joinlist_dosaheaven enable row level security;

-- Allow authenticated users to view all contacts
create policy "Authenticated users can view all contacts"
  on public.joinlist_dosaheaven for select
  using (auth.role() = 'authenticated');

-- Allow authenticated users to update contacts
create policy "Authenticated users can update contacts"
  on public.joinlist_dosaheaven for update
  using (auth.role() = 'authenticated');

-- Allow authenticated users to insert contacts
create policy "Authenticated users can insert contacts"
  on public.joinlist_dosaheaven for insert
  with check (auth.role() = 'authenticated');
