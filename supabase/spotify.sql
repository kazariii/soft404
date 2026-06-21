create table if not exists public.spotify_tokens (
  id text primary key default 'primary',
  refresh_token text not null,
  spotify_user_id text,
  updated_at timestamptz not null default now()
);

alter table public.spotify_tokens enable row level security;

revoke all on public.spotify_tokens from anon, authenticated;
