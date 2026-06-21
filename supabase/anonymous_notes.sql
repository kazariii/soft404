create table if not exists public.anonymous_notes (
  id uuid primary key default gen_random_uuid(),
  author_name text check (char_length(author_name) <= 40),
  message text not null check (
    char_length(message) between 3 and 500
  ),
  visibility text not null check (
    visibility in ('public', 'private')
  ),
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.anonymous_notes enable row level security;

drop policy if exists "Anyone can submit an anonymous note"
on public.anonymous_notes;

create policy "Anyone can submit an anonymous note"
on public.anonymous_notes
for insert
to anon
with check (
  (
    visibility = 'public'
    and approved = true
  )
  or (
    visibility = 'private'
    and approved = false
  )
);

drop policy if exists "Anyone can read approved public notes"
on public.anonymous_notes;

create policy "Anyone can read approved public notes"
on public.anonymous_notes
for select
to anon
using (
  visibility = 'public'
  and approved = true
);

create index if not exists anonymous_notes_public_feed_idx
on public.anonymous_notes (created_at desc)
where visibility = 'public' and approved = true;
