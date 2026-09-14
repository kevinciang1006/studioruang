# Claude Code Prompt — Studio Ruang

Paste everything below the line into Claude Code in an empty project directory. It generates the complete site in one pass.

---

Build a complete, production-quality **B2C interior design brand site** called **Studio Ruang** using **Astro 5**. This is a real portfolio piece, not a scaffold. Write final, publication-ready content and design it with genuine editorial craft. No lorem ipsum, no TODOs, no placeholder comments, no `any` types. Generate every file completely.

## Studio & positioning

Studio Ruang is a Singapore-based residential interior design studio. "Ruang" means *space* in Malay/Indonesian. Warm, editorial, quietly premium. Audience: homeowners commissioning bespoke residential interiors. Tone: calm, confident, understated. Founded 2016, small studio led by founder Nadia Rahman. Philosophy: light, materiality, restraint. Residential-first with select commercial work.

## Tech stack (use exactly this)

- Astro 5, static output by default with the Vercel adapter present so individual routes can opt into on-demand rendering via `export const prerender = false`.
- TypeScript in strict mode. No `any`, no non-null assertions to dodge types.
- Tailwind CSS v4 via the `@tailwindcss/vite` plugin (not `@astrojs/tailwind`). Define the design tokens as CSS variables in the global stylesheet and expose them through the `@theme` block.
- `@astrojs/react` for islands. React islands ONLY for: the projects filter, the consultation form, and the project-gallery lightbox. Everything else is static `.astro`.
- shadcn/ui components (Button, Input, Textarea, Select, Label, and any needed for the form) inside the React islands. Configure shadcn for Tailwind v4.
- `react-hook-form` + `zod` for the consultation form (client validation) and re-validate with the same zod schema on the server endpoint.
- `@supabase/supabase-js` for persisting consultation submissions from the server endpoint.
- `astro:assets` (`<Image />` / `<Picture />`) for all imagery, self-hosted from `/src/assets/images/` or `/public/images/`.
- `@astrojs/sitemap`. Generate `robots.txt`.
- `@astrojs/vercel` adapter.

## Design system

Warm editorial minimalism. Generous whitespace, large photography, asymmetric editorial grids, restraint over decoration. Make deliberate, tasteful choices — this site is being judged on whether it looks good, not just whether it works.

**Typography**
- Display/headings: **Fraunces** (variable serif). Use its optical-size and soft/wonky axes tastefully for large display headings.
- Body/UI: **Inter**.
- Self-host both via `@fontsource-variable/fraunces` and `@fontsource-variable/inter`, or preload from Google Fonts with `font-display: swap`. Preload the display weight used above the fold.
- Large, confident type scale. Big editorial headings. Comfortable line length (~65ch) for body.

**Color tokens** (CSS variables)
- `--bone: #F5F1EA` (page background)
- `--surface: #EFE9DE` (cards / alt sections)
- `--ink: #1C1A17` (primary text)
- `--muted: #6B655C` (secondary text)
- `--clay: #A8543A` (accent — links, small highlights, CTA)
- `--border: #D8D0C2` (hairlines)
- Ensure all text/background pairings meet WCAG AA.

**Layout & feel**
- Max content width ~1200px, with full-bleed image sections that break out to viewport width.
- Corners near-square (radius 2–4px). Thin 1px hairline borders in `--border`.
- Buttons: understated. Primary = clay background / bone text; secondary = ink outline. Clear hover and visible focus rings.

**Motion**
- Subtle scroll reveals: fade in + 12px upward translate, staggered, via a single reusable IntersectionObserver script (not a React island). Smooth easing, no bounce, no parallax gimmicks.
- Respect `prefers-reduced-motion: reduce` — disable reveals and transitions.

## Pages & content (write all copy in full)

**Home (`/`)**
- Hero: full-viewport-height, one large interior image, an editorial headline about designing spaces that feel like home, a one-line studio descriptor, and a primary CTA ("Book a consultation" → `/contact`).
- Featured projects: 3 of the 6 projects in an asymmetric editorial layout, each linking to its detail page.
- Studio intro strip: 2–3 sentences on the studio's approach + link to About.
- Services overview: the 5 process steps as a compact numbered list/row + link to Services.
- One testimonial, large and quiet.
- Closing CTA band → consultation.

**Projects (`/projects`)**
- Intro heading + short line.
- Filter (React island): All / Residential / Commercial / Renovation. Filtering is instant, updates the visible grid, is keyboard accessible, and reflects state in the URL query (`?category=residential`) so it's shareable and back-button friendly.
- Responsive grid of all 6 projects with cover image, name, category, year.

**Project detail (`/projects/[slug]`)** — generate statically for all 6
- Full-bleed hero image + project name.
- Meta row: category, year, location, scope.
- 2–3 short paragraphs of real project narrative (the design brief, the challenge, the response).
- Image gallery: 4–6 images. Clicking opens a lightbox (React island) with keyboard nav (arrows, Esc), focus trap, and backdrop click to close.
- "Next project" link at the bottom cycling through the set.

**Services (`/services`)**
- The 5-step process as a numbered editorial sequence, each step with a heading and a short real description: Consultation → Concept & Moodboard → Design Development → Build & Project Management → Styling & Handover.
- A short "what we offer" set of service cards (e.g. Full residential design, Renovation, Styling & FF&E, Commercial fit-out).
- CTA → consultation.

**About (`/about`)**
- Studio narrative (founded 2016, Singapore, small studio, philosophy of light/materiality/restraint).
- Founder: Nadia Rahman — one short paragraph, portrait image slot.
- Values: 3 short values (e.g. Light first, Honest materials, Quiet detail).
- Press/awards strip: a tasteful row of plausible publication names (e.g. Home & Decor, Tatler Homes, Cubes) as text logos.

**Contact (`/contact`)**
- Book-a-consultation form (React island) with fields: name, email, phone, project type (Residential / Renovation / Commercial), budget range (select), timeline (select), message (textarea).
- Client validation with react-hook-form + zod. Inline field errors. Disabled+spinner submit state. Success state replacing the form on 200; friendly error state on failure.
- Hidden honeypot field.
- Studio contact details beside the form: email, a Singapore address, hours. Real-looking, consistent.

## Project data (source of truth)

Create `src/data/projects.ts` typed with an exported `Project` interface and this data (write full narratives for each):

1. `emerald-hill-terrace` — Emerald Hill Terrace · Residential · 2024 · Singapore · Full residential design. Restored Peranakan shophouse; modern warmth inside heritage bones.
2. `keppel-bay-duplex` — Keppel Bay Duplex · Residential · 2023 · Singapore · Full residential design. Waterfront duplex; coastal-modern, light-led.
3. `bukit-timah-house` — Bukit Timah House · Residential · 2024 · Singapore · Full residential design. Landed family home; warm minimalism.
4. `sentosa-cove-villa` — Sentosa Cove Villa · Residential · 2022 · Singapore · Full residential design. Resort-style villa; indoor-outdoor living.
5. `tanjong-pagar-loft` — Tanjong Pagar Loft · Renovation · 2023 · Singapore · Renovation. Compact apartment; clever built-in storage.
6. `amoy-street-cafe` — Amoy Street Café · Commercial · 2023 · Singapore · Commercial fit-out. F&B fit-out; tactile materials, moody palette.

Each project needs: slug, name, category, year, location, scope, a 2–3 paragraph narrative, a cover image path, and 4–6 gallery image paths with real alt text.

## Images

Self-host for performance. Do NOT hotlink. Reference local files and optimize with `astro:assets`. Since the actual photos are dropped in by the user, do this:

- Reference images by predictable local paths (e.g. `/public/images/projects/emerald-hill-terrace/cover.jpg`, `gallery-1.jpg` …), and a hero image per page, plus a founder portrait and OG image.
- Create `IMAGES.md` at the repo root: a complete manifest listing every required image — exact path, subject description, recommended dimensions/aspect ratio, and the alt text used. Enough that the user can source ~15 interior photos from Unsplash/Pexels and drop them in without guessing.
- Every `<Image>` must have real, descriptive alt text (pull from the manifest), correct width/height to avoid CLS, and `loading="lazy"` except the LCP hero which is eager + `fetchpriority="high"`.

## Forms & data (Supabase)

This project reuses an existing shared Supabase project — do NOT create a new one. Prefix every table with `studioruang_` so it stays isolated from other apps in the same instance. This site uses one table: `studioruang_consultations`.

- Server endpoint `src/pages/api/consultation.ts` with `export const prerender = false`. Accepts POST JSON, re-validates with the shared zod schema, rejects if the honeypot is filled, applies a minimal in-memory per-IP rate limit, inserts into `studioruang_consultations`, returns `{ ok: true }` or a 4xx/5xx with a safe error message.
- Supabase client created server-side with `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` from env. Never import the service key into any client/island code.
- Provide the SQL for the `studioruang_consultations` table in the README and in `supabase/schema.sql`:
  columns: `id uuid pk default gen_random_uuid()`, `created_at timestamptz default now()`, `name text`, `email text`, `phone text`, `project_type text`, `budget_range text`, `timeline text`, `message text`, `source text default 'studio-ruang'`. Enable RLS and note that writes go through the service role from the server only.
- `.env.example` with `SUPABASE_URL=` and `SUPABASE_SERVICE_ROLE_KEY=`. Real `.env` gitignored.

## SEO, performance, accessibility

- A reusable `<BaseHead>`/SEO component: per-page title, meta description, canonical URL, Open Graph (title, description, image, type, url) and Twitter card tags. Default OG image at `/public/images/og-default.jpg`; per-project OG uses the project cover.
- `@astrojs/sitemap` configured with the production site URL; generate `robots.txt` allowing all and pointing to the sitemap.
- Set `site: 'https://studioruang.kevinciang.com'` in `astro.config.mjs`.
- Semantic landmarks (`header`, `nav`, `main`, `footer`), one `h1` per page, logical heading order, skip-to-content link, visible focus states, keyboard-operable filter and lightbox, AA contrast.
- Ship minimal JS. Islands hydrate with the narrowest directive that works (`client:visible` / `client:idle`, not `client:load`, unless above the fold).
- Vercel Analytics: add `@vercel/analytics/astro` (or the script) and fire a `consultation_submitted` event on successful submit.

## Project config & quality

- `tsconfig.json` extending `astro/tsconfigs/strict`.
- ESLint + Prettier configured for Astro + TS + React; a `format` and `lint` npm script. Code must pass lint clean.
- Sensible component structure: `src/components/` (shared `.astro` + `react/` for islands), `src/layouts/BaseLayout.astro`, `src/data/`, `src/lib/` (supabase client, zod schemas, utils), `src/styles/global.css`.
- Header with nav (Home, Projects, Services, About, Contact) + logotype; sticky, condenses on scroll. Footer with contact, nav, social, copyright.
- Fully responsive: mobile-first, tested mentally at 375 / 768 / 1280. Mobile nav is an accessible drawer/disclosure.

## Files to generate (non-exhaustive, generate all that are needed)

- `package.json`, `astro.config.mjs`, `tsconfig.json`, `tailwind`/global CSS with tokens, `components.json` (shadcn), eslint/prettier configs, `.gitignore`, `.env.example`
- `src/layouts/BaseLayout.astro`, `src/components/BaseHead.astro`, `Header.astro`, `Footer.astro`, `ScrollReveal` script, project card, section components
- `src/components/react/ProjectFilter.tsx`, `ConsultationForm.tsx`, `Lightbox.tsx` + shadcn ui components
- `src/pages/index.astro`, `projects/index.astro`, `projects/[slug].astro`, `services.astro`, `about.astro`, `contact.astro`, `api/consultation.ts`
- `src/data/projects.ts`, `src/lib/supabase.ts`, `src/lib/schemas.ts`
- `supabase/schema.sql`
- `.github/workflows/deploy.yml`
- `CLAUDE.md`, `README.md`, `IMAGES.md`, `robots.txt`

## CLAUDE.md (generate this file)

Include: project overview; the exact stack and versions; the rule that React islands are used sparingly and hydrated with the narrowest client directive; TypeScript strict / no `any`; Tailwind v4 token conventions (use the CSS variables, don't hardcode hex in markup); accessibility baseline (AA, keyboard, focus, alt text, one h1); performance baseline (self-hosted optimized images, minimal JS, Lighthouse ≥ 95); commit/branch note; and how to run dev/build/lint/format.

## README.md (generate this file)

Include: what the project is; prerequisites; install and run; the Supabase setup (create project, run `supabase/schema.sql`, copy env vars); the image sourcing step (point to `IMAGES.md`); local build/preview; and full Vercel deploy instructions.

## GitHub Actions (`.github/workflows/deploy.yml`)

Deploy to Vercel on push to `main` using the Vercel CLI prebuilt flow:
- checkout, setup Node 20, install deps
- `vercel pull --yes --environment=production --token=$VERCEL_TOKEN`
- `vercel build --prod --token=$VERCEL_TOKEN`
- `vercel deploy --prebuilt --prod --token=$VERCEL_TOKEN`
- Secrets used: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`. Note in the README that Supabase env vars are set in the Vercel project settings.

## Definition of done

- `npm run build` succeeds with zero type and lint errors.
- All 6 project detail pages render statically; filter, form, and lightbox work and are keyboard accessible.
- No placeholder text anywhere; every image slot has a manifest entry and real alt text.
- Reasonable expectation of Lighthouse ≥ 95 in all four categories.

Generate the entire project now, every file complete.
