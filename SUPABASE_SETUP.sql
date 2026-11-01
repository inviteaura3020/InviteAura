-- InviteAura Supabase setup additions
-- Run in Supabase SQL Editor. Existing clients/rsvps tables are not recreated.

alter table public.clients
  add column if not exists groom_surname text,
  add column if not exists bride_surname text,
  add column if not exists wedding_time text default '7:00 PM',
  add column if not exists map_link text,
  add column if not exists welcome_message text default 'Together with our families',
  add column if not exists invitation_description text default 'Joyfully invite you to celebrate the beginning of our forever.',
  add column if not exists theme text default 'royal',
  add column if not exists event_type text default 'wedding';

update public.clients
set events = '[
 {"id":1,"icon":"🌼","name":"Haldi","daysBefore":2,"time":"11:00 AM onwards","description":"A morning of sunshine, marigolds and blessings."},
 {"id":2,"icon":"🌿","name":"Mehendi","daysBefore":1,"time":"4:00 PM onwards","description":"An evening of music, henna and happy hearts."},
 {"id":3,"icon":"♡","name":"The Wedding","daysBefore":0,"time":"7:00 PM onwards","description":"Join us as we begin our forever together."}
]'::jsonb
where events is null or events = '[]'::jsonb;

-- Create a PUBLIC bucket named wedding-photos.
insert into storage.buckets (id, name, public)
values ('wedding-photos', 'wedding-photos', true)
on conflict (id) do update set public = true;

-- Public visitors can view published wedding photos.
drop policy if exists "Public can view wedding photos" on storage.objects;
create policy "Public can view wedding photos"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'wedding-photos');

-- Signed-in owner can upload into a folder named with their client UUID.
drop policy if exists "Owners upload wedding photos" on storage.objects;
create policy "Owners upload wedding photos"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'wedding-photos'
  and exists (
    select 1 from public.clients c
    where c.id::text = (storage.foldername(name))[1]
      and c.owner_id = auth.uid()
  )
);

drop policy if exists "Owners delete wedding photos" on storage.objects;
create policy "Owners delete wedding photos"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'wedding-photos'
  and exists (
    select 1 from public.clients c
    where c.id::text = (storage.foldername(name))[1]
      and c.owner_id = auth.uid()
  )
);
