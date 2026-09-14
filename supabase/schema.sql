-- Studio Ruang consultation submissions.
-- This project reuses a shared Supabase instance; every table is prefixed
-- studioruang_ to stay isolated from other apps in the same instance.

create table if not exists public.studioruang_consultations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text not null,
  project_type text not null,
  budget_range text not null,
  timeline text not null,
  message text not null,
  source text not null default 'studio-ruang'
);

alter table public.studioruang_consultations enable row level security;

-- No public policies are defined: all reads/writes go through the server
-- endpoint (src/pages/api/consultation.ts) using the service-role key,
-- which bypasses RLS. The anon key has no access to this table.
comment on table public.studioruang_consultations is
  'Consultation form submissions from studioruang.kevinciang.com. Written only by the server endpoint using the service-role key.';
