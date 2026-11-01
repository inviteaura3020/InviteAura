# InviteAura – Restored Complete Project

This package restores the original full project structure and the original page-specific stylesheet. The broken replacement stylesheet containing non-breaking spaces is not used.

## Setup
1. Extract this ZIP into a new folder (do not merge it over the damaged folder).
2. Copy `.env.example` to `.env` and add your Supabase project URL and anon key.
3. Open a terminal in this folder and run `npm install`.
4. Run `npm run dev` and open the local URL printed by Vite.

## Important
- Keep `src/main.jsx` importing `./styles.css`.
- The restored `src/styles.css` contains the original public, admin login, dashboard and editor styling, plus scoped public invitation theme palettes.
- Theme selection is stored in the existing `clients.theme` field; no new database column is needed.
- Photo upload expects a Supabase Storage bucket named `wedding-photos` with suitable upload/public-read policies.
- Do not replace `src/styles.css` with a Markdown-formatted CSS paste. Use the plain CSS file in this package.
