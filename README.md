# Studio Ruang

The brand site for Studio Ruang, a Singapore-based residential interior design studio. Built
with Astro 5, Tailwind CSS v4, React islands, and Supabase.

## Prerequisites

- Node.js 20+
- A Supabase project (this app reuses a shared instance — see below)

## Install & run

```bash
npm install
cp .env.example .env   # then fill in the two Supabase values, see below
npm run dev
```

## Supabase setup

This project writes consultation form submissions to a `studioruang_consultations` table in a
shared Supabase project (prefixed `studioruang_` so it doesn't collide with other apps in the
same instance).

1. Open the shared Supabase project's SQL editor and run `supabase/schema.sql`.
2. Copy the project's URL and **service role key** (Project Settings → API) into `.env`:

   ```
   SUPABASE_URL=https://<project-ref>.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
   ```

   The service role key is server-only — it's read in `src/lib/supabase.ts` via
   `import.meta.env` inside `src/pages/api/consultation.ts`, which runs on-demand
   (`export const prerender = false`). It is never sent to the browser.

## Email setup (Resend)

On a successful submission, `src/pages/api/consultation.ts` sends two emails via Resend
(`src/lib/email.ts`) after the Supabase insert: a confirmation to the submitter (echoes their
project type, budget, timeline, and a short excerpt of their message) and a notification to
`OWNER_EMAIL`. Email is best-effort — `sendEmails()` never throws, so a Resend outage never loses
an enquiry or breaks the success UI; the Supabase row is the source of truth.

1. `send.kevinciang.com` must be a **verified sending domain** in the Resend dashboard (add the
   SPF/DKIM DNS records it gives you at your domain host, then wait for verification).
2. Set `RESEND_API_KEY` in `.env` from the Resend dashboard → API Keys.
3. Set `OWNER_EMAIL` in `.env` to the address that should receive new-submission notifications.
4. Set both of the same variables in your Vercel project's Environment Variables (Production and
   Preview) before deploying.

## Images

Real photography is not included in this repo. Read `IMAGES.md` for the exact file paths,
subjects, dimensions, and alt text expected, source ~15–20 photos from Unsplash/Pexels matching
each row's search terms, and drop them into `/public/images/...` at the given paths.

## Local build & preview

```bash
npm run build
npm run preview
```

## Testing, linting, formatting

```bash
npm run test          # vitest — schemas, islands, API route, helpers
npm run lint            # eslint
npm run format           # prettier --write
npm run format:check      # prettier --check
```

## Deploy (Vercel)

1. Import the repo into Vercel (framework preset: Astro).
2. Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in the Vercel project's environment
   variables (Production, and Preview if you want form submissions to work on preview
   deployments too).
3. Push to `main` — `.github/workflows/deploy.yml` runs `vercel pull` → `vercel build --prod` →
   `vercel deploy --prebuilt --prod` using these repo secrets:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
4. Production URL: `studioruang.kevinciang.com`.
