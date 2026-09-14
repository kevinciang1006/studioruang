# Studio Ruang — Product Requirements Document

B2C interior design brand site. Portfolio + application piece for the Network / Pico Art "Website Developer (Full-Stack) – Remote" role.

## 1. Purpose

Demonstrate an end-to-end, hand-coded B2C brand site with editorial design craft, real content, sub-second loads, full SEO, and a working consultation lead form writing to a real database. This is the "can you judge whether something looks good" proof and the aesthetic showpiece of the three-site set.

## 2. Positioning

Studio Ruang — a Singapore-based residential interior design studio. Warm, editorial, quietly premium. "Ruang" means *space* in Malay/Indonesian. Audience: homeowners commissioning bespoke residential interiors. Tone: calm, confident, understated. Not loud, not corporate.

## 3. Stack

- **Astro 5** (static-first, islands architecture)
- **TypeScript** (strict, no `any`)
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **React islands** with **shadcn/ui** for interactive pieces only
- **react-hook-form + zod** for form validation
- **Supabase** (Postgres) for consultation submissions
- **astro:assets** for image optimization, self-hosted images
- `@astrojs/sitemap`, `@astrojs/vercel` adapter, `@astrojs/react`
- **Deploy:** Vercel → `studioruang.kevinciang.com`
- **CI/CD:** GitHub Actions (Vercel CLI, prebuilt deploy)

## 4. Why Astro (rationale for reviewers)

Marketing sites are judged on load speed, SEO, and share cards. Astro ships zero JS by default and hydrates only islands, so the site targets Lighthouse 100 while keeping React + shadcn for the filter, form, and lightbox. Best tool for the outcome.

## 5. Information architecture

| Page | Route | Purpose |
|------|-------|---------|
| Home | `/` | Hero statement, 3 featured projects, studio intro, services overview, one testimonial, consultation CTA |
| Projects | `/projects` | Filterable grid (Residential / Commercial / Renovation), 6 projects |
| Project detail | `/projects/[slug]` | Hero image, brief, spec meta, image gallery + lightbox, next-project link |
| Services | `/services` | 5-step process, service cards |
| About | `/about` | Studio narrative, founder, values, press strip |
| Contact | `/contact` | Book-a-consultation form → Supabase, success state |

## 6. Design direction

Warm editorial minimalism. Generous whitespace, large photography, asymmetric editorial grids, restraint over decoration.

- **Type:** Fraunces (variable display serif) for headings; Inter for body/UI. Preload, `font-display: swap`.
- **Palette:** bone `#F5F1EA` background · surface `#EFE9DE` · ink `#1C1A17` · muted `#6B655C` · clay accent `#A8543A` · hairline border `#D8D0C2`.
- **Layout:** max content width ~1200px with full-bleed image sections; large type scale; square-ish corners (radius 2–4px).
- **Motion:** subtle scroll reveals (fade + 12px translate) via IntersectionObserver, smooth, no bounce or gimmicks. Respect `prefers-reduced-motion`.
- **Imagery:** real interior photography, self-hosted, optimized via `astro:assets`.

## 7. Content (real, no lorem ipsum)

**6 projects** (name · category · year · location):
1. Emerald Hill Terrace · Residential · 2024 · Singapore — restored Peranakan shophouse, modern warmth inside heritage bones.
2. Keppel Bay Duplex · Residential · 2023 · Singapore — waterfront duplex, coastal-modern, light-led.
3. Bukit Timah House · Residential · 2024 · Singapore — landed family home, warm minimalism.
4. Sentosa Cove Villa · Residential · 2022 · Singapore — resort-style villa, indoor-outdoor living.
5. Tanjong Pagar Loft · Renovation · 2023 · Singapore — compact apartment, clever built-in storage.
6. Amoy Street Café · Commercial · 2023 · Singapore — F&B fit-out, tactile materials, moody.

**Process (Services):** Consultation → Concept & Moodboard → Design Development → Build & Project Management → Styling & Handover.

**About:** founded 2016, small Singapore studio led by founder Nadia Rahman; philosophy of light, materiality, and restraint; residential-first with select commercial work.

**Testimonials:** 2–3 short homeowner quotes.

## 8. Interactive elements (React islands only)

- Projects filter (category)
- Consultation form (validation + submit)
- Project gallery lightbox (keyboard + focus trap)
- Scroll-reveal is a plain inline script, not an island

## 9. Forms & data

- Supabase table `studioruang_consultations` (id, created_at, name, email, phone, project_type, budget_range, timeline, message, source). Reuses an existing shared Supabase project; all tables prefixed `studioruang_`.
- Server endpoint `POST /api/consultation` with `export const prerender = false`.
- Service-role key **server-only**, never exposed to client. Anon key not used for writes.
- Honeypot field + minimal per-IP rate limit. Zod-validate on server. Success/error UI states.

## 10. SEO / performance / accessibility

- Per-page `<title>`, meta description, canonical, Open Graph + Twitter tags, one default OG image plus per-project OG where feasible.
- `@astrojs/sitemap`, `robots.txt`.
- Semantic HTML, alt text on every image, visible focus states, keyboard-navigable, WCAG AA contrast.
- Targets: Lighthouse Performance / Accessibility / Best Practices / SEO ≥ 95 (aim 100).

## 11. Analytics

Vercel Analytics enabled; fire a `consultation_submitted` event on successful submit.

## 12. Deliverables

Complete Astro project — all pages, real content, self-hosted optimized images, `CLAUDE.md`, `README.md` (local setup, Supabase schema + env, Vercel deploy, image manifest), GitHub Actions workflow. No placeholder copy, no TODOs, no `any`.

## 13. Success criteria

- Lighthouse ≥ 95 all categories on the deployed site.
- Consultation form writes a real row to Supabase and shows a success state.
- Live at `studioruang.kevinciang.com`.
- Zero placeholder content or dead links.

## 14. One manual step

~15 interior photos are self-hosted for performance. The build ships with an `IMAGES.md` manifest (exact filenames, subjects, dimensions, alt text). Source them from Unsplash/Pexels in ~10 minutes and drop into `/public/images/`. Everything else is generated complete.
