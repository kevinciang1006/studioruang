# CLAUDE.md

## Project

Studio Ruang — a Singapore-based residential interior design studio's brand site. Astro 5,
static-first with the Vercel adapter; React islands only for the projects filter, the
consultation form, and the project-gallery lightbox.

## Stack

- Astro 5 (`output: "static"`, `@astrojs/vercel` adapter; `src/pages/api/consultation.ts` is the
  one route with `export const prerender = false`)
- TypeScript, strict mode. No `any`, no non-null assertions (`!`).
- Tailwind CSS v4 via `@tailwindcss/vite`. Tokens live in `src/styles/global.css`'s `@theme`
  block — use the generated utilities (`bg-bone`, `text-ink`, `text-muted`, `bg-clay`/`text-clay`,
  `border-border`, `font-display`, `font-sans`, `rounded-sm`/`rounded-md`). Never hardcode a hex
  value in a component.
- `@astrojs/react` islands + shadcn/ui primitives (`src/components/react/ui/`), used only inside
  the three islands.
- `react-hook-form` + `zod` (`src/lib/schemas.ts`) for the consultation form; the same schema is
  re-validated server-side in the API route. Note: the honeypot (`company`) field is
  intentionally schema-permissive — the route checks it _after_ a successful parse so it can
  answer bots with a silent 200 rather than a 400 that would tip them off.
- `@supabase/supabase-js`, server-only client (`src/lib/supabase.ts`), service-role key never
  imported into an island.
- `resend`, server-only (`src/lib/email.ts`), called from `src/pages/api/consultation.ts` after
  the Supabase insert succeeds. `sendEmails()` never throws — email is best-effort and must never
  lose an enquiry or break the success UI. Sends a confirmation to the submitter and a
  notification to `OWNER_EMAIL`, both from `Studio Ruang <hello@send.kevinciang.com>`. See
  README.md for the `send.kevinciang.com` domain-verification steps.

## Conventions

- Islands hydrate with `client:visible` (none are above the fold at first paint). Never use
  `client:load` without a specific reason, and document the reason inline if you do.
- One `<h1>` per page. Semantic landmarks (`header`, `nav`, `main`, `footer`). Skip-to-content
  link in `BaseLayout.astro`. Every `<img>` has real, descriptive alt text — check `IMAGES.md`
  before writing new ones.
- Scroll reveals are the shared `ScrollReveal.astro` inline script + `.reveal` class — never a
  new IntersectionObserver per component, and never a React island for this.
- **Never colocate a `*.test.ts(x)` file directly under `src/pages/`.** Astro's file-based
  router treats every `.ts`/`.js` file there as a route/endpoint, and a colocated test file
  (which imports `vitest`) gets swept into the production build and breaks it. Route-level tests
  live under `tests/` instead, mirroring the `src/pages/` path (see `tests/pages/api/`).
- `.astro` component/page correctness is verified by `npm run build` succeeding plus a
  grep-style structural check against the compiled `dist/client/**/*.html` (not a
  Vitest/Container-API render test — that combination crashes in this toolchain; see
  `vitest.config.ts`'s top comment). Anything with real logic (schemas, the API route, the three
  React islands, small extracted helpers like `getAdjacentProject`) is unit-tested normally.
- Accessibility baseline: WCAG AA contrast (the token palette is chosen to clear this), full
  keyboard operability (filter, lightbox, mobile menu), visible focus rings (`:focus-visible` in
  `global.css`).
- Performance baseline: self-hosted, optimized images; minimal JS (3 islands total); target
  Lighthouse ≥ 95 in all four categories.
- Commit small, working slices; branch off `main` for feature work, never commit straight to
  `main` for anything non-trivial.

## Commands

```bash
npm run dev          # local dev server
npm run build         # production build (must be zero type/lint errors before merging)
npm run preview       # preview the production build
npm run lint           # eslint
npm run format          # prettier --write
npm run format:check     # prettier --check
npm run test            # vitest run
```
