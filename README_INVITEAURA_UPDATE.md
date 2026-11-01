# InviteAura update

This package keeps the existing public invitation components and Supabase client, and replaces the admin dashboard with working tab navigation for Dashboard, Clients, Invitations and RSVP Management.

## Setup
1. Keep your original `.env.local` file private and copy it into this project root. It must contain `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
2. Run `npm install`.
3. Run `npm run dev`.
4. Admin login: `/admin/login`; dashboard: `/admin/dashboard`.

The admin data queries expect the existing `clients` and `rsvps` tables described in the project setup. Client creation/editing/deletion and publishing are backed by Supabase. RSVP management reads RSVP rows belonging to the signed-in admin's clients.

The Resend API endpoint is included as a server-side Vercel function. Do not put the Supabase service role key or Resend API key in any `VITE_` variable or frontend file. Configure those only as Vercel server environment variables. Email delivery requires a verified sender/domain; the Resend onboarding sender is for restricted testing only.

Security note: before production, add a database-backed admin allowlist/role check and rate limiting or CAPTCHA for public RSVP submissions and email notification triggering.
