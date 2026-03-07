create table feedback (
  id         uuid primary key default gen_random_uuid(),
  deck_id    uuid not null references decks(id) on delete cascade,
  name       text not null,
  email      text,
  rating     integer check (rating between 1 and 5),
  comment    text,
  created_at timestamptz not null default now()
);

-- Public insert only (no auth needed — share link is the auth)
alter table feedback enable row level security;

create policy "Anyone can insert feedback"
  on feedback for insert
  with check (true);

create policy "Deck owner can read feedback"
  on feedback for select
  using (
    deck_id in (
      select id from decks where created_by = auth.uid()
    )
  );
