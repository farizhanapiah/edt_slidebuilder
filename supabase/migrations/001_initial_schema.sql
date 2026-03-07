-- EDT SlideBuilder — Initial Schema
-- Run this in your Supabase SQL Editor or via Supabase CLI

-- ============================================================
-- EXTENSIONS
-- ============================================================

create extension if not exists "pgcrypto";

-- ============================================================
-- ENUMS
-- ============================================================

create type deck_type as enum ('pitch', 'case_study', 'product', 'recap');
create type deck_status as enum ('draft', 'published', 'archived');

create type layout_type as enum (
  'cover',
  'section_divider',
  'stats',
  'text_image',
  'full_bleed_image',
  'content_list',
  'quote',
  'timeline',
  'thank_you'
);

-- ============================================================
-- TABLES
-- ============================================================

create table decks (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  client_name   text not null,
  deck_type     deck_type not null default 'pitch',
  status        deck_status not null default 'draft',
  share_token   text unique not null default encode(gen_random_bytes(16), 'hex'),
  created_by    uuid references auth.users(id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table slides (
  id            uuid primary key default gen_random_uuid(),
  deck_id       uuid not null references decks(id) on delete cascade,
  position      integer not null,
  layout_type   layout_type not null,
  content       jsonb not null default '{}',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (deck_id, position)
);

-- ============================================================
-- INDEXES
-- ============================================================

create index idx_slides_deck_id on slides(deck_id);
create index idx_slides_deck_position on slides(deck_id, position);
create index idx_decks_share_token on decks(share_token);
create index idx_decks_created_by on decks(created_by);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger decks_updated_at
  before update on decks
  for each row execute function update_updated_at();

create trigger slides_updated_at
  before update on slides
  for each row execute function update_updated_at();

-- ============================================================
-- REORDER SLIDES RPC — updates all positions atomically
-- ============================================================

create or replace function reorder_slides(p_deck_id uuid, p_ordered_ids uuid[])
returns void as $$
declare
  i int := 0;
  v_id uuid;
begin
  -- First set all to large negative values to avoid unique constraint conflict
  update slides
  set position = -(position + 1)
  where deck_id = p_deck_id;

  -- Then assign correct positions
  foreach v_id in array p_ordered_ids loop
    update slides
    set position = i
    where id = v_id and deck_id = p_deck_id;
    i := i + 1;
  end loop;
end;
$$ language plpgsql security definer;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table decks enable row level security;
alter table slides enable row level security;

-- Staff: full access to their own decks
create policy "staff_own_decks" on decks
  for all
  using (auth.uid() = created_by)
  with check (auth.uid() = created_by);

-- Public: read any deck (filtered by share_token in app layer)
create policy "public_read_decks" on decks
  for select
  using (true);

-- Staff: full access to slides on their own decks
create policy "staff_own_slides" on slides
  for all
  using (
    exists (
      select 1 from decks
      where decks.id = slides.deck_id
      and decks.created_by = auth.uid()
    )
  );

-- Public: read any slide (filtered in app layer)
create policy "public_read_slides" on slides
  for select
  using (true);

-- ============================================================
-- STORAGE BUCKET — run via Supabase Dashboard or CLI
-- ============================================================

-- Create bucket: slide-images
-- Settings:
--   Public: false
--   File size limit: 10MB
--   Allowed MIME types: image/jpeg, image/png, image/webp
--
-- Run these in the SQL editor after creating the bucket:
--
-- insert into storage.buckets (id, name, public)
-- values ('slide-images', 'slide-images', false);
--
-- create policy "auth_upload_images" on storage.objects
--   for insert
--   with check (bucket_id = 'slide-images' and auth.role() = 'authenticated');
--
-- create policy "auth_read_images" on storage.objects
--   for select
--   using (bucket_id = 'slide-images' and auth.role() = 'authenticated');
--
-- create policy "service_all_images" on storage.objects
--   for all
--   using (bucket_id = 'slide-images');
