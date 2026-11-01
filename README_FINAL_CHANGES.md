# InviteAura – Final public refinements

## Included updates
- The public wedding invitation no longer displays the internal Customize navigation option.
- The website home page (`/`) is now a main InviteAura showcase for multiple invitation types: weddings, engagements, birthdays, anniversaries, baby showers, housewarming, festivals/pooja, corporate events and parties.
- The invitation editor stores separate venue name, address and Google Maps URL for each event. Haldi, Mehendi and Wedding can all use different locations. Event dates are calculated from the wedding date and each event's `daysBefore` value.
- Public gallery images use a responsive 4:5 crop with desktop heights around 300–460px and mobile heights around 290–430px. Editor thumbnails are intentionally smaller and do not affect public photo size.
- RSVP attendance cards have larger readable labels and compact selection marks.
- Theme-specific hero backgrounds are applied to the full hero section, not a narrow inner text wrapper, so changing to Mountain/Kashmir/Santorini/etc. visibly changes the preview.

## Theme preview workflow
1. Open Admin Dashboard → Invitation Editor.
2. Select a theme and fill event-specific venue fields.
3. Click **Save all changes**.
4. Open Preview. Public preview reads the saved invitation from Supabase. If the invitation is published and an old tab is open, refresh it.

## Environment variables
For local Vite use, create `.env` in the project root and add only:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY
```

On Render Static Site, add these same two values in Dashboard → your service → Environment, then trigger a new deploy because Vite embeds `VITE_` values at build time. Do not put service role keys in VITE variables or browser code.

The other variables in `.env.example` (`SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, etc.) are server-only and are not required for the React frontend. The included `/api/send-rsvp` handler uses a Vercel-style serverless route; Render Static Site does not automatically execute that route. RSVP rows can still save to Supabase, but email notifications need a separately deployed compatible function or a Render Node web service.

## Build validation
Run `npm install` then `npm run build` locally. Build could not be run in this environment because dependencies were not installed (`vite: not found`).

## Additional final refinements (Nov 1)
- Public gallery image cards now use a consistent 4:5 frame (desktop 320–470px; mobile 290–430px) with `object-fit: cover`; images are not stretched. The frame is intentionally larger than the small editor thumbnails.
- RSVP attendance cards are compact and readable, with a 24px selection mark and larger text labels.
- Each event already stores its own `venueName`, `venueAddress`, and `mapLink`; these are retained independently for Haldi, Mehendi, Wedding, and any custom event. Public event cards display each event's own directions link.
- Theme hero images now use the saved `data-theme` value to ensure Mountain, Kashmir, Santorini, Beach, Udaipur, Tuscany, Rajasthani, Jaipuri, Gujarati, Marathi, UP-Bihar, Mughal, Floral and Midnight themes visibly change the public preview. Save first, then refresh the public preview tab.
- The public page has no Customize navigation link. The main `/` route is the InviteAura showcase with multiple event categories (wedding, engagement, birthday, anniversary, baby shower, housewarming, pooja/festivals, corporate and parties).

## Render deployment notes
- For a Vite Static Site, Build Command: `npm install && npm run build`; Publish Directory: `dist`.
- Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` under Render service Environment, then deploy again. Vite reads these at build time.
- Add a rewrite rule `/*` → `/index.html` (Rewrite, status 200) so React Router routes such as `/invite/:slug` and `/admin/login` load on refresh.
- `VITE_SUPABASE_ANON_KEY` must be the Supabase publishable/anon key, never the service-role secret. Keep `SUPABASE_SERVICE_ROLE_KEY` and email API keys server-side only.
