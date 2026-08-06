create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text not null,
  email text not null,
  situation text not null,
  area text,
  timeline text,
  notification_status text not null default 'pending'
    check (
      notification_status in ('pending', 'sent', 'failed', 'not_configured')
    ),
  notification_error text,
  created_at timestamptz not null default now()
);

create index if not exists contact_submissions_created_at_idx
  on public.contact_submissions (created_at desc);

alter table public.contact_submissions enable row level security;

revoke all on table public.contact_submissions from anon, authenticated;
grant select, insert, update on table public.contact_submissions to service_role;
