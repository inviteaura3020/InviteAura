# InviteAura — Public view refinements

## Included changes
- Public invitation photo gallery uses responsive 4:5 portrait tiles (desktop height 300–440px; mobile height up to 430px) with `object-fit: cover`; images are not stretched.
- RSVP attendance choices are compact, readable cards; the small helper copy is more legible.
- Every event supports its own venue name, full address and Google Maps URL. The editor saves these inside the existing `clients.events` JSONB array as `venueName`, `venueAddress`, and `mapLink`; no database migration is needed for those fields.
- The public invitation reads the saved `theme` and applies a distinct hero image treatment for the selected theme. Save changes, then open Preview again (hard refresh if the browser has cached CSS).
- Public invitation page does not render the demo Customization panel.
- Main home page presents multiple invitation categories (weddings, engagements, birthdays, anniversaries, baby showers, housewarming, puja/festivals, corporate events and parties).

## Local setup
1. Extract the ZIP into a new folder.
2. Copy `.env.example` to `.env`.
3. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from Supabase Project Settings > API.
4. For the optional RSVP email endpoint, set server-only `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `INVITEAURA_NOTIFY_EMAIL` in the hosting provider's environment settings. Never put the service role key or Resend key in a `VITE_` variable.
5. Run `npm install`, then `npm run dev`.

## Render deployment
- Build command: `npm install && npm run build`
- Publish directory: `dist`
- Add the `VITE_` Supabase variables to the frontend service's environment.
- If deploying the RSVP email API as a separate serverless function, deploy `/api/send-rsvp.js` on a platform that supports the included API route and add the server-only environment variables there. A static Render site alone does not execute a Node serverless API route; use a Render Web Service or a compatible serverless host for that endpoint.

## Validation note
The source files are included. A Vite production build was not run in this workspace because dependencies are not installed here (`vite: not found`). Run the commands above locally to install dependencies and build.
