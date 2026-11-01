# InviteAura — consolidated project package

## Included
- React + Vite application and existing public invitation components
- Supabase email/password admin authentication
- Admin dashboard with Dashboard, Clients, Invitations and RSVP Management sections
- Client create, edit, delete, publish/unpublish and search
- Invitation editor: couple names/surnames, date/time, venue, maps URL, invitation message and theme
- Wedding event add/edit/delete
- Supabase Storage photo upload plus URL-based photo addition
- Public invitation photo gallery
- RSVP submission and server-side Resend notification endpoint

## Local setup
1. Extract this ZIP.
2. Copy your existing private `.env.local` into this folder root (same level as package.json).
3. `.env.local` must contain:
   VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
4. Run `npm install`
5. Run `npm run dev`
6. Admin login: `/admin/login`

## Supabase setup
Run `SUPABASE_SETUP.sql` in Supabase SQL Editor. This adds the editor columns if absent and configures the `wedding-photos` public storage bucket and owner-scoped upload/delete policies. Existing clients/rsvps tables and policies are assumed to exist as in the earlier project setup.

## Vercel email variables
Configure only in Vercel server environment (never in VITE_ variables):
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- RESEND_API_KEY
- RESEND_FROM_EMAIL
- INVITEAURA_NOTIFY_EMAIL

Email requires a verified Resend sender/domain for unrestricted production sending. The onboarding sender is restricted to testing.

## Important production limitations
This package is a consolidated implementation, not a claim of verified production readiness. Run a local production build and test with your own Supabase project. Before public launch, implement a DB-backed admin allowlist/role check, CAPTCHA/rate limiting for public RSVP and email triggers, and verify all RLS policies. Storage photos are publicly viewable by design because published invitation pages need public image URLs.
