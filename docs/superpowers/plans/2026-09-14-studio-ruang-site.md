# Studio Ruang Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete, production-quality Studio Ruang brand site (Astro 5 + Tailwind v4 + React islands + Supabase) described in the spec docs, styled to the **1a "Immersive"** homepage direction that was approved from the design file.

**Architecture:** Astro 5 static-first site (Vercel adapter, on-demand only for the consultation API route). All presentational sections are `.astro`. Three React islands carry the only client-side interactivity: the projects category filter, the consultation form, and the project-gallery lightbox. A single reusable IntersectionObserver script drives scroll reveals — no island for that. Content (project data, copy) lives in typed `.ts` modules so pages stay declarative.

**Tech Stack:** Astro 5 (static output, `@astrojs/vercel` adapter with `prerender = false` opt-out on the API route), TypeScript strict, Tailwind CSS v4 via `@tailwindcss/vite`, `@astrojs/react` islands, shadcn/ui (Button/Input/Textarea/Select/Label), `react-hook-form` + `zod`, `@supabase/supabase-js`, `astro:assets`, `@astrojs/sitemap`, Vitest + `@testing-library/react` + `jsdom` for unit tests, ESLint + Prettier.

**Spec:**

- `docs/studio-ruang-PRD.md` — product requirements (source of truth for IA, content, success criteria)
- `docs/studio-ruang-claude-code-prompt.md` — the literal build prompt (source of truth for file list, stack details, project data, Definition of Done)
- `docs/studio-ruang-claude-design-brief.md` — the brief that produced the design file
- `Studio Ruang homepage direction/Studio Ruang Homepage Directions.dc.html` — the locked visual design; **direction `1a` (`id="1a"`, roughly lines 35–404) is the one to build.** Its inline styles are the pixel-accurate spec for layout, spacing, and type scale — translate them to Tailwind utilities using the tokens defined in Task 2, do not re-invent the layout.

## Execution note (added during implementation)

Task 6's `experimental_AstroContainer`-based Vitest tests for `.astro` files hit an
unresolvable crash in this toolchain (Astro 5 / Vitest 2's worker pool re-invoking Vite
server creation inside vite-node — opaque `[object Object]` error, not a code bug).
`vitest.config.ts` was kept as the plain `defineConfig({ plugins: [react()], test: {...} })`
from Task 1 rather than switched to `getViteConfig`. Every `.astro` component/page task
below is instead verified by `npm run build` succeeding plus a grep-based structural check
against the compiled `dist/**/*.html` output. Separately: Astro's file-based router treats
_every_ `.ts`/`.js` file under `src/pages/` as a route/endpoint — a colocated
`consultation.test.ts` next to `consultation.ts` gets swept into the production build and
fails it (it imports `vitest`). Task 12's test therefore lives at
`tests/pages/api/consultation.test.ts` instead, importing the route file by relative path;
apply the same rule to any other test file that would otherwise sit under `src/pages/` — see each task's actual verification commands
run during execution rather than the `AstroContainer` snippets originally drafted here. Any
logic worth unit-testing that lived inside a `.astro` file (e.g. `getStaticPaths`) should be
extracted to a plain `.ts` module so it can still be tested directly without parsing `.astro`.

## Decisions locked with the user before this plan (do not re-litigate)

1. **Visual direction:** 1a "Immersive" (full-bleed photography hero with dark gradient overlay, editorial asymmetric project rows, dark CTA band). Not 1b.
2. **Information architecture:** the PRD's 5 pages only — Home, Projects, Services, About, Contact. No Journal/blog page (the design mockup's "Journal" nav item and its stat-row are cosmetic mockup flourishes, not part of scope). Header nav reads **Projects / Studio / Process / Contact**, where "Studio" links to `/about` and "Process" links to `/services` (label-only reconciliation of the design copy with the PRD's routes) — plus the "Book a consultation" primary button. This exact nav (5 text items minus Journal) is what's drawn at design file lines 55–64.
3. **Project data:** the PRD's canonical 6 projects (`docs/studio-ruang-PRD.md` §7 and the prompt's §"Project data") are the source of truth — **not** the placeholder project names used in the design mockup (`Bukit Timah Residence`, `Joo Chiat Shophouse`, `Keppel Bay Apartment` were mockup filler). Real project names/slugs are: Emerald Hill Terrace, Keppel Bay Duplex, Bukit Timah House, Sentosa Cove Villa, Tanjong Pagar Loft, Amoy Street Café.
4. **Studio contact details:** reuse the design file's locked, consistent set — `hello@studioruang.sg`, `+65 6220 4418`, `18 Kandahar Street #02-03, Singapore 198885` (design file lines 189, 207–211).

## Global Constraints

- Astro 5, static output by default; `@astrojs/vercel` adapter present; only `src/pages/api/consultation.ts` sets `export const prerender = false`.
- TypeScript strict mode everywhere. No `any`, no non-null assertions.
- Tailwind CSS v4 via `@tailwindcss/vite` (not `@astrojs/tailwind`). All colors/fonts/radii come from the `@theme` tokens in `src/styles/global.css` — never hardcode a hex value in a component.
- React islands ONLY for: `ProjectFilter`, `ConsultationForm`, `Lightbox`. Hydrate with the narrowest directive that works (`client:visible` for all three — none are above the fold at first paint on their pages).
- shadcn/ui primitives (Button, Input, Textarea, Select, Label) live in `src/components/react/ui/` and are used only inside the React islands.
- `react-hook-form` + `zod` for the consultation form; the same zod schema is imported and reused by the server endpoint.
- `astro:assets` (`<Image />`) for every real photo; `loading="lazy"` except the LCP hero image, which is `loading="eager" fetchpriority="high"`. Every image has real, descriptive alt text pulled from `IMAGES.md`.
- Palette tokens (exact hex, do not alter): bone `#F5F1EA`, surface `#EFE9DE`, ink `#1C1A17`, muted `#6B655C`, clay `#A8543A`, border `#D8D0C2`. Near-square corners (2–4px radius). 1px hairline borders in `--color-border`.
- Motion: scroll reveals = fade in + 12px upward translate, staggered, single reusable IntersectionObserver script (not a React island). Respect `prefers-reduced-motion: reduce`.
- No lorem ipsum, no TODOs, no placeholder copy anywhere in the final site. Every project has a full 2–3 paragraph narrative.
- Vercel Analytics is enabled site-wide (`<Analytics />` from `@vercel/analytics/astro` in `BaseLayout.astro`) and the consultation form fires a `consultation_submitted` custom event (via `track()` from `@vercel/analytics`) on a successful (200) submit — see Task 6 and Task 10.
- `npm run build`, `npm run lint`, `npm run test`, and `npm run format -- --check` must all pass clean at the end (Task 20).
- Testing note on scope: this is a content/marketing site, not an app with business-logic-heavy screens. Automated tests (Vitest) target every file with real logic or behavior — zod schemas, the API route, the three React islands, and small extracted pure helpers (`getAdjacentProject`, `revealClassNameFor`). Purely presentational `.astro` markup is verified by (a) a build succeeding, (b) an Astro Container API render assertion on the structural contract that matters (one `h1`, correct CTA hrefs, alt text present, correct nav links), and (c) a manual visual comparison against the locked design file — there is no meaningful unit test for "does this look like the mockup." Say so plainly in each such task rather than inventing a fake test.

---

## File Structure

```
package.json
astro.config.mjs
tsconfig.json
components.json
eslint.config.js
.prettierrc.json
.gitignore
.env.example
vitest.config.ts
robots.txt                              # copied to public/ by Task 1
public/robots.txt
src/env.d.ts
src/styles/global.css                   # design tokens + reveal CSS
src/data/projects.ts                    # Project type + 6 real projects
src/lib/schemas.ts                      # zod consultationSchema + option enums
src/lib/form-options.ts                 # label maps for selects
src/lib/supabase.ts                     # server-side Supabase client factory
src/lib/utils.ts                        # cn() helper for shadcn
src/lib/projects-nav.ts                 # getAdjacentProject()
src/lib/scroll-reveal.ts                # revealClassNameFor() pure helper
src/components/BaseHead.astro           # SEO/meta component
src/layouts/BaseLayout.astro            # shell: skip link, Header, <slot/>, Footer, reveal script
src/components/Header.astro             # sticky nav + mobile drawer
src/components/Footer.astro
src/components/ScrollReveal.astro       # <script> wiring IntersectionObserver
src/components/ProjectCard.astro        # shared project grid card
src/components/react/ui/button.tsx
src/components/react/ui/input.tsx
src/components/react/ui/textarea.tsx
src/components/react/ui/select.tsx
src/components/react/ui/label.tsx
src/components/react/ProjectFilter.tsx
src/components/react/ConsultationForm.tsx
src/components/react/Lightbox.tsx
src/pages/index.astro
src/pages/projects/index.astro
src/pages/projects/[slug].astro
src/pages/services.astro
src/pages/about.astro
src/pages/contact.astro
src/pages/api/consultation.ts
supabase/schema.sql
.github/workflows/deploy.yml
CLAUDE.md
README.md
IMAGES.md
tests/**/*.test.ts(x)                   # colocated as *.test.ts(x) next to source, see tasks
```

---

### Task 1: Project scaffolding & tooling

**Files:**

- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `components.json`, `eslint.config.js`, `.prettierrc.json`, `.gitignore`, `.env.example`, `vitest.config.ts`, `src/env.d.ts`, `public/robots.txt`, `src/pages/index.astro` (temporary scaffold page, replaced in Task 13)

**Interfaces:**

- Produces: `npm run dev`, `npm run build`, `npm run preview`, `npm run lint`, `npm run format`, `npm run test` scripts that every later task relies on.

- [ ] **Step 1: Initialize `package.json`**

```json
{
  "name": "studio-ruang",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro",
    "lint": "eslint .",
    "format": "prettier --write .",
    "test": "vitest run"
  },
  "dependencies": {
    "astro": "^5.0.0",
    "@astrojs/react": "^4.0.0",
    "@astrojs/sitemap": "^3.2.0",
    "@astrojs/vercel": "^8.0.0",
    "@fontsource-variable/fraunces": "^5.1.0",
    "@fontsource-variable/inter": "^5.1.0",
    "@supabase/supabase-js": "^2.45.0",
    "@vercel/analytics": "^1.4.0",
    "@tailwindcss/vite": "^4.0.0",
    "tailwindcss": "^4.0.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-hook-form": "^7.53.0",
    "@hookform/resolvers": "^3.9.0",
    "zod": "^3.23.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.0",
    "lucide-react": "^0.454.0",
    "@radix-ui/react-label": "^2.1.0",
    "@radix-ui/react-select": "^2.1.0",
    "@radix-ui/react-slot": "^1.1.0"
  },
  "devDependencies": {
    "typescript": "^5.6.0",
    "eslint": "^9.13.0",
    "@typescript-eslint/eslint-plugin": "^8.11.0",
    "@typescript-eslint/parser": "^8.11.0",
    "eslint-plugin-astro": "^1.3.0",
    "eslint-plugin-react": "^7.37.0",
    "eslint-plugin-jsx-a11y": "^6.10.0",
    "prettier": "^3.3.0",
    "prettier-plugin-astro": "^0.14.0",
    "vitest": "^2.1.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/jest-dom": "^6.6.0",
    "@testing-library/user-event": "^14.5.0",
    "jsdom": "^25.0.0",
    "@vitejs/plugin-react": "^4.3.0"
  }
}
```

- [ ] **Step 2: `astro.config.mjs`**

```js
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://studioruang.kevinciang.com",
  output: "static",
  adapter: vercel(),
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

- [ ] **Step 3: `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"],
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react",
    "strictNullChecks": true,
    "noUncheckedIndexedAccess": true
  }
}
```

- [ ] **Step 4: `src/env.d.ts`**

```ts
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly SUPABASE_URL: string;
  readonly SUPABASE_SERVICE_ROLE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

- [ ] **Step 5: `components.json` (shadcn, Tailwind v4 conventions)**

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/styles/global.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "src/components/react",
    "utils": "src/lib/utils",
    "ui": "src/components/react/ui"
  }
}
```

- [ ] **Step 6: `.env.example`, `.gitignore`**

`.env.example`:

```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

`.gitignore`:

```
node_modules/
dist/
.astro/
.vercel/
.env
.DS_Store
coverage/
```

- [ ] **Step 7: `eslint.config.js` and `.prettierrc.json`**

```js
// eslint.config.js
import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import astroPlugin from "eslint-plugin-astro";
import reactPlugin from "eslint-plugin-react";
import jsxA11y from "eslint-plugin-jsx-a11y";

export default [
  js.configs.recommended,
  ...astroPlugin.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: { parser: tsParser },
    plugins: { "@typescript-eslint": tseslint, react: reactPlugin, "jsx-a11y": jsxA11y },
    rules: {
      ...tseslint.configs.recommended.rules,
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
    },
  },
  { ignores: ["dist/", ".astro/", "node_modules/"] },
];
```

```json
{
  "semi": true,
  "singleQuote": false,
  "trailingComma": "es5",
  "printWidth": 100,
  "plugins": ["prettier-plugin-astro"],
  "overrides": [{ "files": "*.astro", "options": { "parser": "astro" } }]
}
```

- [ ] **Step 8: `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
  },
});
```

`vitest.setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 9: `public/robots.txt`**

```
User-agent: *
Allow: /

Sitemap: https://studioruang.kevinciang.com/sitemap-index.xml
```

- [ ] **Step 9b: `public/favicon.svg`**

`BaseHead.astro` (Task 6) links `/favicon.svg`; provide a minimal real mark now so that link never 404s — a clay-on-bone monogram, not a placeholder icon:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="#F5F1EA"/>
  <text x="16" y="22" text-anchor="middle" font-family="Georgia, serif" font-size="18" fill="#A8543A">R</text>
</svg>
```

- [ ] **Step 10: Temporary scaffold page so the build has something to render**

`src/pages/index.astro`:

```astro
---

---

<html lang="en">
  <head><title>Studio Ruang</title></head>
  <body><h1>Studio Ruang</h1></body>
</html>
```

- [ ] **Step 11: Install and verify**

Run: `npm install && npm run build`
Expected: build succeeds, `dist/index.html` exists.

- [ ] **Step 12: Commit**

```bash
git init
git add -A
git commit -m "chore: scaffold Astro 5 + Tailwind v4 + React project"
```

---

### Task 2: Design tokens & global styles

**Files:**

- Create: `src/styles/global.css`

**Interfaces:**

- Produces: Tailwind utility classes `bg-bone`, `bg-surface`, `text-ink`, `text-muted`, `text-clay`/`bg-clay`, `border-border`, `font-display`, `font-sans`, `rounded-sm`, `rounded-md`; CSS classes `.reveal` / `.reveal-visible` for scroll reveals; `.skip-link`.

- [ ] **Step 1: Write `src/styles/global.css`**

```css
@import "tailwindcss";
@import "@fontsource-variable/fraunces";
@import "@fontsource-variable/inter";

@theme {
  --color-bone: #f5f1ea;
  --color-surface: #efe9de;
  --color-ink: #1c1a17;
  --color-muted: #6b655c;
  --color-clay: #a8543a;
  --color-border: #d8d0c2;

  --font-display: "Fraunces Variable", ui-serif, Georgia, serif;
  --font-sans: "Inter Variable", ui-sans-serif, system-ui, sans-serif;

  --radius-sm: 2px;
  --radius-md: 4px;
}

@layer base {
  html {
    background: var(--color-bone);
    color: var(--color-ink);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
  }

  h1,
  h2,
  h3,
  h4 {
    font-family: var(--font-display);
    font-weight: 400;
  }

  a {
    color: inherit;
  }

  :focus-visible {
    outline: 2px solid var(--color-clay);
    outline-offset: 2px;
  }
}

.skip-link {
  position: absolute;
  left: -9999px;
  top: 0;
  z-index: 100;
  background: var(--color-ink);
  color: var(--color-bone);
  padding: 12px 20px;
  border-radius: var(--radius-sm);
}

.skip-link:focus {
  left: 16px;
  top: 16px;
}

.reveal {
  opacity: 0;
  transform: translateY(12px);
  transition:
    opacity 0.6s ease,
    transform 0.6s ease;
}

.reveal-visible {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .reveal {
    transition: none;
    opacity: 1;
    transform: none;
  }
}
```

- [ ] **Step 2: Verify tokens compile**

Run: `npm run build`
Expected: build succeeds with no Tailwind warnings about unknown theme keys.

- [ ] **Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: design tokens and global styles"
```

---

### Task 3: Project data & validation schemas

**Files:**

- Create: `src/data/projects.ts`, `src/data/projects.test.ts`, `src/lib/schemas.ts`, `src/lib/schemas.test.ts`, `src/lib/form-options.ts`

**Interfaces:**

- Produces: `export interface Project { slug: string; name: string; category: "Residential" | "Renovation" | "Commercial"; year: number; location: string; scope: string; narrative: string[]; coverImage: string; coverImageAlt: string; gallery: { src: string; alt: string }[]; }`, `export const projects: Project[]`.
- Produces: `export const consultationSchema` (zod), `export type ConsultationInput`, `export const projectTypeOptions`, `budgetRangeOptions`, `timelineOptions` (as const tuples).
- Produces (form-options): `projectTypeLabels`, `budgetRangeLabels`, `timelineLabels` — `Record<string, string>` keyed by the schema's enum values.

- [ ] **Step 1: Write the failing data-integrity test**

`src/data/projects.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { projects } from "./projects";

describe("projects data", () => {
  it("has exactly 6 projects", () => {
    expect(projects).toHaveLength(6);
  });

  it("has unique slugs", () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("every project has 2-3 narrative paragraphs and 4-6 gallery images", () => {
    for (const project of projects) {
      expect(project.narrative.length).toBeGreaterThanOrEqual(2);
      expect(project.narrative.length).toBeLessThanOrEqual(3);
      expect(project.gallery.length).toBeGreaterThanOrEqual(4);
      expect(project.gallery.length).toBeLessThanOrEqual(6);
      expect(project.coverImageAlt.length).toBeGreaterThan(10);
      for (const image of project.gallery) {
        expect(image.alt.length).toBeGreaterThan(10);
      }
    }
  });

  it("includes the six canonical PRD projects", () => {
    const slugs = projects.map((p) => p.slug).sort();
    expect(slugs).toEqual(
      [
        "amoy-street-cafe",
        "bukit-timah-house",
        "emerald-hill-terrace",
        "keppel-bay-duplex",
        "sentosa-cove-villa",
        "tanjong-pagar-loft",
      ].sort()
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/projects.test.ts`
Expected: FAIL — `src/data/projects.ts` does not exist yet.

- [ ] **Step 3: Write `src/data/projects.ts`**

```ts
export interface GalleryImage {
  src: string;
  alt: string;
}

export interface Project {
  slug: string;
  name: string;
  category: "Residential" | "Renovation" | "Commercial";
  year: number;
  location: string;
  scope: string;
  /** 2-3 short paragraphs: brief, challenge, response. */
  narrative: string[];
  coverImage: string;
  coverImageAlt: string;
  gallery: GalleryImage[];
}

export const projects: Project[] = [
  {
    slug: "emerald-hill-terrace",
    name: "Emerald Hill Terrace",
    category: "Residential",
    year: 2024,
    location: "Singapore",
    scope: "Full residential design",
    narrative: [
      "The brief was to bring a family of four back into a two-storey Peranakan shophouse that had sat, largely untouched, since the 1980s. The owners wanted to keep everything the conservation authority would let them keep — the timber shutters, the encaustic tile threshold, the airwell — and build a home for the way they actually live around it.",
      "The building's narrow, deep footprint was the real challenge: light only entered from the front and the airwell, and every previous renovation had chased more floor area at the cost of both. We reversed that instinct, removing a mezzanine that had blocked the airwell for decades and letting daylight fall through the full section of the house again. The original floor tiles were repaired rather than replaced; new joinery in white oak was designed to sit slightly proud of the old walls so the line between old and new stays honest.",
      "Upstairs, two smaller bedrooms became one generous main suite with a study nook overlooking the street — the space the family said they were missing most. The result reads as it should: a house that has clearly been lived in for a hundred years, with a family now living in it comfortably for the next hundred.",
    ],
    coverImage: "/images/projects/emerald-hill-terrace/cover.jpg",
    coverImageAlt:
      "Restored Peranakan shophouse living room with timber shutters, white oak flooring, and afternoon light falling across an open airwell.",
    gallery: [
      {
        src: "/images/projects/emerald-hill-terrace/gallery-1.jpg",
        alt: "Reopened airwell at the centre of the shophouse, seen from the ground-floor living space.",
      },
      {
        src: "/images/projects/emerald-hill-terrace/gallery-2.jpg",
        alt: "Repaired original encaustic floor tiles at the entry threshold.",
      },
      {
        src: "/images/projects/emerald-hill-terrace/gallery-3.jpg",
        alt: "White oak joinery run along the ground-floor corridor wall.",
      },
      {
        src: "/images/projects/emerald-hill-terrace/gallery-4.jpg",
        alt: "Main bedroom suite with a study nook overlooking the street-facing timber shutters.",
      },
      {
        src: "/images/projects/emerald-hill-terrace/gallery-5.jpg",
        alt: "Kitchen with warm plaster walls and a view back toward the airwell.",
      },
    ],
  },
  {
    slug: "keppel-bay-duplex",
    name: "Keppel Bay Duplex",
    category: "Residential",
    year: 2023,
    location: "Singapore",
    scope: "Full residential design",
    narrative: [
      "A waterfront duplex bought largely for its view, with interiors that hadn't been touched since the building's completion a decade earlier. The brief was simple to state and harder to deliver: let the water do the talking, and keep everything else quiet.",
      "We stripped back a heavy, dark material palette left by the developer fit-out and replaced it with limewashed walls, white oak flooring, and a kitchen in the same warm neutral as the walls, so nothing in the room competes with Keppel Bay outside the window. The lower level's living and dining spaces were opened into a single volume by removing a partition wall, and glazing along the water-facing wall was left almost entirely untreated — no heavy drapery, just a single sheer track for glare on the brightest afternoons.",
      "Upstairs, the principal bedroom and its ensuite were reorganised so the bath sits directly in line with the view. It is a small, deliberate luxury: a five-minute soak that looks straight out at the water, in a home designed to get out of its own way.",
    ],
    coverImage: "/images/projects/keppel-bay-duplex/cover.jpg",
    coverImageAlt:
      "Open-plan living and dining space in a waterfront duplex with unobstructed views of Keppel Bay.",
    gallery: [
      {
        src: "/images/projects/keppel-bay-duplex/gallery-1.jpg",
        alt: "Living room with limewashed walls and white oak flooring facing full-height water-view glazing.",
      },
      {
        src: "/images/projects/keppel-bay-duplex/gallery-2.jpg",
        alt: "Kitchen in warm neutral tones matching the surrounding walls.",
      },
      {
        src: "/images/projects/keppel-bay-duplex/gallery-3.jpg",
        alt: "Principal bathroom with a freestanding bath aligned to the bay view.",
      },
      {
        src: "/images/projects/keppel-bay-duplex/gallery-4.jpg",
        alt: "Staircase connecting the duplex's two levels, lit by a skylight.",
      },
    ],
  },
  {
    slug: "bukit-timah-house",
    name: "Bukit Timah House",
    category: "Residential",
    year: 2024,
    location: "Singapore",
    scope: "Full residential design",
    narrative: [
      "A landed family home for a couple raising three children, who came to us wanting fewer, better things rather than more square footage. The existing house was generously sized but felt scattered — a collection of rooms that didn't relate to each other or to the garden outside.",
      "We reorganised the ground floor around a single long axis from the entry through to the garden, so that arriving in the house means seeing daylight and greenery immediately rather than a hallway. Materials were kept warm and few: white oak, lime plaster, and a travertine used sparingly in the kitchen and bathrooms to mark the spaces meant to feel a little more special. Storage was designed first, not last, with full-height joinery built into the plan from the earliest sketches so that surfaces could stay clear.",
      "Upstairs, each child's room was given the same simple palette so the spaces would age with them rather than needing to be redone at each birthday. The family moved in eighteen months ago and, by their own account, has changed almost nothing since.",
    ],
    coverImage: "/images/projects/bukit-timah-house/cover.jpg",
    coverImageAlt:
      "Ground-floor living space of a landed house opening directly onto a garden, warm minimalist palette.",
    gallery: [
      {
        src: "/images/projects/bukit-timah-house/gallery-1.jpg",
        alt: "Entry axis running from the front door through to the rear garden.",
      },
      {
        src: "/images/projects/bukit-timah-house/gallery-2.jpg",
        alt: "Kitchen with travertine counters and full-height oak joinery.",
      },
      {
        src: "/images/projects/bukit-timah-house/gallery-3.jpg",
        alt: "Children's bedroom in a simple, durable warm-neutral palette.",
      },
      {
        src: "/images/projects/bukit-timah-house/gallery-4.jpg",
        alt: "Family bathroom finished in travertine with brushed brass fittings.",
      },
      {
        src: "/images/projects/bukit-timah-house/gallery-5.jpg",
        alt: "Garden-facing dining area with lime-plastered walls.",
      },
    ],
  },
  {
    slug: "sentosa-cove-villa",
    name: "Sentosa Cove Villa",
    category: "Residential",
    year: 2022,
    location: "Singapore",
    scope: "Full residential design",
    narrative: [
      "A resort-style villa for a family who spend roughly half the year overseas, and wanted a home in Singapore that felt like a holiday whenever they were in it. The brief leaned hard into indoor-outdoor living: pool, terrace and living room needed to function as one continuous space.",
      "The existing sliding doors between the living room and the pool deck were replaced with a single pivoting glass wall that opens the room fully to the outside, and the flooring material runs unbroken from the living room tile to the pool surround so the threshold nearly disappears. Furniture was chosen for a climate that moves between air-conditioned interiors and open-air terraces — natural fibres, teak, and outdoor-rated upholstery used throughout, so nothing needed a separate 'outdoor' language.",
      "A guest wing was reworked with its own small living area, giving visiting family privacy without feeling separate from the main house. The villa now reads as a single resort suite rather than a house with a pool attached to it — which was, in the end, exactly the point.",
    ],
    coverImage: "/images/projects/sentosa-cove-villa/cover.jpg",
    coverImageAlt:
      "Resort-style villa living room opening fully onto a pool terrace through a pivoting glass wall.",
    gallery: [
      {
        src: "/images/projects/sentosa-cove-villa/gallery-1.jpg",
        alt: "Pool terrace seen from the living room through the fully opened glass wall.",
      },
      {
        src: "/images/projects/sentosa-cove-villa/gallery-2.jpg",
        alt: "Outdoor lounge furniture in teak and natural fibre beside the pool.",
      },
      {
        src: "/images/projects/sentosa-cove-villa/gallery-3.jpg",
        alt: "Guest wing living area with its own outdoor access.",
      },
      {
        src: "/images/projects/sentosa-cove-villa/gallery-4.jpg",
        alt: "Principal bedroom with sliding doors onto a private terrace.",
      },
    ],
  },
  {
    slug: "tanjong-pagar-loft",
    name: "Tanjong Pagar Loft",
    category: "Renovation",
    year: 2023,
    location: "Singapore",
    scope: "Renovation",
    narrative: [
      "A 700-square-foot apartment for a single owner who wanted a home office, a proper kitchen, and guest sleeping arrangements without feeling like the flat had been packed to capacity. It is the smallest project in our portfolio and, in some ways, the most demanding.",
      "Every wall in the apartment does more than one job. A full-height joinery run along the entry hides a pull-down guest bed, a home office desk that folds flat when not in use, and the building's electrical riser, all behind a single continuous timber face so the corridor doesn't read as storage. The kitchen was widened by six centimetres — reclaimed from an oversized store cupboard — which was enough to fit a proper run of counter space and a two-seat breakfast bar.",
      "Nothing in the apartment is styled to look larger than it is; instead, everything has an exact, considered place. The owner has hosted overnight guests three times since moving in, something that would have been unthinkable in the layout inherited from before.",
    ],
    coverImage: "/images/projects/tanjong-pagar-loft/cover.jpg",
    coverImageAlt:
      "Compact apartment living area with a continuous timber joinery wall concealing a fold-down guest bed and desk.",
    gallery: [
      {
        src: "/images/projects/tanjong-pagar-loft/gallery-1.jpg",
        alt: "Full-height joinery wall with the guest bed folded away.",
      },
      {
        src: "/images/projects/tanjong-pagar-loft/gallery-2.jpg",
        alt: "Widened kitchen counter with a two-seat breakfast bar.",
      },
      {
        src: "/images/projects/tanjong-pagar-loft/gallery-3.jpg",
        alt: "Fold-down home office desk built into the entry joinery.",
      },
      {
        src: "/images/projects/tanjong-pagar-loft/gallery-4.jpg",
        alt: "Compact bathroom with space-efficient fittings.",
      },
    ],
  },
  {
    slug: "amoy-street-cafe",
    name: "Amoy Street Café",
    category: "Commercial",
    year: 2023,
    location: "Singapore",
    scope: "Commercial fit-out",
    narrative: [
      "A twenty-eight-seat café fit-out for a first-time F&B operator who wanted a room that felt considered rather than trend-driven — somewhere that would still feel right in five years. Our brief covered everything from the counter layout to the light fittings.",
      "We built the interior around a small number of tactile materials used generously rather than many materials used sparingly: a lime-plastered counter, blackened steel shelving, and a floor in dark terracotta tile that reads almost black under the space's low, warm lighting. The kitchen pass was widened and lowered slightly so baristas and servers could see and speak to guests directly, which the owner said was as important to the brand as anything on the menu.",
      "Acoustic treatment was worked into the joinery rather than added as a visible fix — a felt-lined ceiling void above the blackened steel shelving keeps the room calm even at capacity. The café opened to a queue on its first weekend and has kept a fuller room than its size would suggest ever since.",
    ],
    coverImage: "/images/projects/amoy-street-cafe/cover.jpg",
    coverImageAlt:
      "Moody café interior with a lime-plastered counter, blackened steel shelving, and dark terracotta flooring.",
    gallery: [
      {
        src: "/images/projects/amoy-street-cafe/gallery-1.jpg",
        alt: "Lime-plastered service counter with blackened steel shelving behind it.",
      },
      {
        src: "/images/projects/amoy-street-cafe/gallery-2.jpg",
        alt: "Café seating area in dark terracotta tile under warm, low lighting.",
      },
      {
        src: "/images/projects/amoy-street-cafe/gallery-3.jpg",
        alt: "Widened kitchen pass connecting baristas to the seating area.",
      },
      {
        src: "/images/projects/amoy-street-cafe/gallery-4.jpg",
        alt: "Detail of the felt-lined ceiling void above the steel shelving.",
      },
    ],
  },
];
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/data/projects.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Write the failing schema test**

`src/lib/schemas.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { consultationSchema } from "./schemas";

const validPayload = {
  name: "Hui Min Tan",
  email: "hui.min@example.com",
  phone: "+65 9123 4567",
  projectType: "residential",
  budgetRange: "250k-500k",
  timeline: "6-12-months",
  message: "We're renovating a 4-room flat in Bukit Timah and would like a full consultation.",
  company: "",
};

describe("consultationSchema", () => {
  it("accepts a fully valid payload", () => {
    const result = consultationSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it("rejects a missing name", () => {
    const result = consultationSchema.safeParse({ ...validPayload, name: "" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = consultationSchema.safeParse({ ...validPayload, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid project type", () => {
    const result = consultationSchema.safeParse({ ...validPayload, projectType: "spaceship" });
    expect(result.success).toBe(false);
  });

  it("rejects a message under 20 characters", () => {
    const result = consultationSchema.safeParse({ ...validPayload, message: "Too short" });
    expect(result.success).toBe(false);
  });

  it("still parses successfully when the honeypot field is filled (the API route, not the schema, rejects those)", () => {
    const result = consultationSchema.safeParse({ ...validPayload, company: "Acme Bots" });
    expect(result.success).toBe(true);
  });
});
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npx vitest run src/lib/schemas.test.ts`
Expected: FAIL — `src/lib/schemas.ts` does not exist yet.

- [ ] **Step 7: Write `src/lib/schemas.ts`**

```ts
import { z } from "zod";

export const projectTypeOptions = ["residential", "renovation", "commercial"] as const;
export const budgetRangeOptions = ["under-100k", "100k-250k", "250k-500k", "500k-plus"] as const;
export const timelineOptions = [
  "within-3-months",
  "3-6-months",
  "6-12-months",
  "flexible",
] as const;

export const consultationSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name.").max(120),
  email: z.string().trim().email("Enter a valid email address."),
  phone: z
    .string()
    .trim()
    .min(8, "Enter a valid phone number.")
    .max(20)
    .regex(/^[0-9+()\-\s]+$/, "Use digits, spaces, + and - only."),
  projectType: z.enum(projectTypeOptions, {
    errorMap: () => ({ message: "Select a project type." }),
  }),
  budgetRange: z.enum(budgetRangeOptions, {
    errorMap: () => ({ message: "Select a budget range." }),
  }),
  timeline: z.enum(timelineOptions, {
    errorMap: () => ({ message: "Select a timeline." }),
  }),
  message: z.string().trim().min(20, "Tell us a little more (20 characters minimum).").max(2000),
  // Honeypot: humans never see or fill this field. Stays permissive here — a filled value
  // is still schema-valid — because the API route checks it *after* parsing (see Task 12).
  company: z.string().max(200).optional().default(""),
});

export type ConsultationInput = z.infer<typeof consultationSchema>;
```

- [ ] **Step 8: Run test to verify it passes**

Run: `npx vitest run src/lib/schemas.test.ts`
Expected: PASS (6 tests).

- [ ] **Step 9: Write `src/lib/form-options.ts`**

```ts
import { budgetRangeOptions, projectTypeOptions, timelineOptions } from "./schemas";

export const projectTypeLabels: Record<(typeof projectTypeOptions)[number], string> = {
  residential: "Residential",
  renovation: "Renovation",
  commercial: "Commercial",
};

export const budgetRangeLabels: Record<(typeof budgetRangeOptions)[number], string> = {
  "under-100k": "Under S$100,000",
  "100k-250k": "S$100,000 – S$250,000",
  "250k-500k": "S$250,000 – S$500,000",
  "500k-plus": "S$500,000+",
};

export const timelineLabels: Record<(typeof timelineOptions)[number], string> = {
  "within-3-months": "Within 3 months",
  "3-6-months": "3–6 months",
  "6-12-months": "6–12 months",
  flexible: "Flexible / not yet decided",
};
```

- [ ] **Step 10: Commit**

```bash
git add src/data/projects.ts src/data/projects.test.ts src/lib/schemas.ts src/lib/schemas.test.ts src/lib/form-options.ts
git commit -m "feat: project data and consultation validation schema"
```

---

### Task 4: Supabase client & small utilities

**Files:**

- Create: `src/lib/supabase.ts`, `src/lib/utils.ts`, `src/lib/utils.test.ts`, `src/lib/projects-nav.ts`, `src/lib/projects-nav.test.ts`, `src/lib/scroll-reveal.ts`, `src/lib/scroll-reveal.test.ts`

**Interfaces:**

- Consumes: `Project`, `projects` from `src/data/projects.ts` (Task 3).
- Produces: `getSupabaseServerClient(): SupabaseClient`, `cn(...inputs: ClassValue[]): string`, `getAdjacentProject(slug: string): Project`, `revealClassNameFor(isIntersecting: boolean, prefersReducedMotion: boolean): string`.

- [ ] **Step 1: Write failing tests for `getAdjacentProject`**

`src/lib/projects-nav.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { projects } from "../data/projects";
import { getAdjacentProject } from "./projects-nav";

describe("getAdjacentProject", () => {
  it("returns the next project in sequence", () => {
    expect(getAdjacentProject(projects[0].slug).slug).toBe(projects[1].slug);
  });

  it("wraps from the last project back to the first", () => {
    const last = projects[projects.length - 1];
    expect(getAdjacentProject(last.slug).slug).toBe(projects[0].slug);
  });

  it("throws for an unknown slug", () => {
    expect(() => getAdjacentProject("does-not-exist")).toThrow();
  });
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npx vitest run src/lib/projects-nav.test.ts`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Implement `src/lib/projects-nav.ts`**

```ts
import { projects, type Project } from "../data/projects";

export function getAdjacentProject(slug: string): Project {
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) {
    throw new Error(`Unknown project slug: ${slug}`);
  }
  const nextIndex = (index + 1) % projects.length;
  const next = projects[nextIndex];
  if (!next) {
    throw new Error("Project list is empty.");
  }
  return next;
}
```

- [ ] **Step 4: Run test, verify it passes**

Run: `npx vitest run src/lib/projects-nav.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Write failing test for `revealClassNameFor`**

`src/lib/scroll-reveal.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { revealClassNameFor } from "./scroll-reveal";

describe("revealClassNameFor", () => {
  it("shows content immediately when reduced motion is preferred", () => {
    expect(revealClassNameFor(false, true)).toBe("reveal-visible");
  });

  it("hides content that has not intersected yet", () => {
    expect(revealClassNameFor(false, false)).toBe("reveal-hidden");
  });

  it("reveals content once it intersects", () => {
    expect(revealClassNameFor(true, false)).toBe("reveal-visible");
  });
});
```

- [ ] **Step 6: Run test, verify it fails**

Run: `npx vitest run src/lib/scroll-reveal.test.ts`
Expected: FAIL — module does not exist.

- [ ] **Step 7: Implement `src/lib/scroll-reveal.ts`**

```ts
export function revealClassNameFor(
  isIntersecting: boolean,
  prefersReducedMotion: boolean
): "reveal-visible" | "reveal-hidden" {
  if (prefersReducedMotion) return "reveal-visible";
  return isIntersecting ? "reveal-visible" : "reveal-hidden";
}
```

- [ ] **Step 8: Run test, verify it passes**

Run: `npx vitest run src/lib/scroll-reveal.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 9: Write `src/lib/utils.ts` with an inline-verifiable test**

`src/lib/utils.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("merges class names and drops falsy values", () => {
    expect(cn("a", false && "b", "c")).toBe("a c");
  });

  it("resolves conflicting tailwind classes to the last one", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });
});
```

Run: `npx vitest run src/lib/utils.test.ts`
Expected: FAIL — module does not exist.

`src/lib/utils.ts`:

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

Run again: `npx vitest run src/lib/utils.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 10: Write `src/lib/supabase.ts` (no test — thin wrapper around a third-party SDK, exercised indirectly by Task 12's API tests via mocking)**

```ts
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export function getSupabaseServerClient(): SupabaseClient {
  const url = import.meta.env.SUPABASE_URL;
  const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Supabase server environment variables are not configured.");
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
```

- [ ] **Step 11: Full test run + commit**

Run: `npx vitest run`
Expected: all tests so far pass.

```bash
git add src/lib/
git commit -m "feat: supabase client, cn helper, project-nav and scroll-reveal helpers"
```

---

### Task 5: shadcn/ui primitives

**Files:**

- Create: `src/components/react/ui/button.tsx`, `input.tsx`, `textarea.tsx`, `label.tsx`, `select.tsx`, `src/components/react/ui/button.test.tsx`

**Interfaces:**

- Consumes: `cn` from `src/lib/utils.ts` (Task 4).
- Produces: `<Button variant="primary" | "secondary">`, `<Input>`, `<Textarea>`, `<Label>`, `<Select>` + `<SelectTrigger>` + `<SelectContent>` + `<SelectItem>` + `<SelectValue>` — all forwarding refs, all typed, all used exclusively inside `ConsultationForm` (Task 10).

- [ ] **Step 1: Write failing render test for `Button`**

`src/components/react/ui/button.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { Button } from "./button";

describe("Button", () => {
  it("renders its children and responds to click", async () => {
    const onClick = vi.fn();
    render(
      <Button variant="primary" onClick={onClick}>
        Book a consultation
      </Button>
    );
    const button = screen.getByRole("button", { name: "Book a consultation" });
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("disables interaction when disabled", () => {
    render(<Button disabled>Submit</Button>);
    expect(screen.getByRole("button", { name: "Submit" })).toBeDisabled();
  });
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npx vitest run src/components/react/ui/button.test.tsx`
Expected: FAIL — `button.tsx` does not exist.

- [ ] **Step 3: Implement the primitives**

`src/components/react/ui/button.tsx`:

```tsx
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "../../../lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-sm px-6 py-3 text-xs font-medium uppercase tracking-widest transition-colors disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" && "bg-clay text-bone hover:bg-ink",
        variant === "secondary" && "border border-ink text-ink hover:bg-ink hover:text-bone",
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";
```

`src/components/react/ui/input.tsx`:

```tsx
import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../../../lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-sm border border-border bg-bone px-4 py-3 text-sm text-ink placeholder:text-muted focus-visible:border-clay",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
```

`src/components/react/ui/textarea.tsx`:

```tsx
import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "../../../lib/utils";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full rounded-sm border border-border bg-bone px-4 py-3 text-sm text-ink placeholder:text-muted focus-visible:border-clay",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
```

`src/components/react/ui/label.tsx`:

```tsx
import * as LabelPrimitive from "@radix-ui/react-label";
import { forwardRef } from "react";
import { cn } from "../../../lib/utils";

export const Label = forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn("text-xs font-medium uppercase tracking-widest text-muted", className)}
    {...props}
  />
));
Label.displayName = "Label";
```

`src/components/react/ui/select.tsx`:

```tsx
import * as SelectPrimitive from "@radix-ui/react-select";
import { forwardRef } from "react";
import { cn } from "../../../lib/utils";

export const Select = SelectPrimitive.Root;
export const SelectValue = SelectPrimitive.Value;

export const SelectTrigger = forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex w-full items-center justify-between rounded-sm border border-border bg-bone px-4 py-3 text-sm text-ink focus-visible:border-clay",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon>▾</SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = "SelectTrigger";

export const SelectContent = forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn("overflow-hidden rounded-sm border border-border bg-bone shadow-md", className)}
      {...props}
    >
      <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = "SelectContent";

export const SelectItem = forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "cursor-pointer px-4 py-2 text-sm text-ink outline-none data-[highlighted]:bg-surface",
      className
    )}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = "SelectItem";
```

- [ ] **Step 4: Run test, verify it passes**

Run: `npx vitest run src/components/react/ui/button.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/react/ui/
git commit -m "feat: shadcn ui primitives (button, input, textarea, label, select)"
```

---

### Task 6: BaseHead & BaseLayout

**Files:**

- Create: `src/components/BaseHead.astro`, `src/layouts/BaseLayout.astro`, `src/components/ScrollReveal.astro`, `src/layouts/BaseLayout.test.ts`

**Interfaces:**

- Consumes: `revealClassNameFor` pattern from Task 4 is used conceptually by `ScrollReveal.astro`'s inline script (imported directly since Astro scripts are processed by Vite).
- Produces: `BaseLayout` props `{ title: string; description: string; ogImage?: string; canonicalPath: string }`; renders `<html>`, skip link, `<Header />`, `<slot />`, `<Footer />`, and the reveal script — every page in Tasks 13–17 wraps its content in this layout.

- [ ] **Step 1: Write the failing container test**

Astro 5 ships an experimental Container API for exactly this. `src/layouts/BaseLayout.test.ts`:

```ts
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import BaseLayout from "./BaseLayout.astro";

describe("BaseLayout", () => {
  it("renders exactly one title tag, a skip link, and the given description", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(BaseLayout, {
      props: {
        title: "Studio Ruang — Test Page",
        description: "A test description for the layout.",
        canonicalPath: "/test",
      },
      slots: { default: "<p>Body content</p>" },
    });

    expect(result).toContain("<title>Studio Ruang — Test Page</title>");
    expect(result).toContain('name="description" content="A test description for the layout."');
    expect(result).toContain("Skip to content");
    expect(result).toContain("Body content");
  });
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npx vitest run src/layouts/BaseLayout.test.ts`
Expected: FAIL — `BaseLayout.astro` does not exist.

- [ ] **Step 3: Implement `src/components/BaseHead.astro`**

```astro
---
interface Props {
  title: string;
  description: string;
  canonicalPath: string;
  ogImage?: string;
}

const { title, description, canonicalPath, ogImage = "/images/og-default.jpg" } = Astro.props;
const canonicalUrl = new URL(canonicalPath, Astro.site);
const ogImageUrl = new URL(ogImage, Astro.site);
---

<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>{title}</title>
<meta name="description" content={description} />
<link rel="canonical" href={canonicalUrl} />
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />

<meta property="og:type" content="website" />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={ogImageUrl} />
<meta property="og:url" content={canonicalUrl} />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={ogImageUrl} />

<link
  rel="preload"
  as="font"
  href="/_astro/fraunces-variable-latin.woff2"
  type="font/woff2"
  crossorigin
/>
```

- [ ] **Step 4: Implement `src/components/ScrollReveal.astro`**

```astro
<script>
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const elements = document.querySelectorAll<HTMLElement>(".reveal");

  if (prefersReducedMotion) {
    elements.forEach((el) => el.classList.add("reveal-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15 }
    );
    elements.forEach((el, index) => {
      el.style.transitionDelay = `${Math.min(index % 4, 3) * 80}ms`;
      observer.observe(el);
    });
  }
</script>
```

- [ ] **Step 5: Implement `src/layouts/BaseLayout.astro`**

```astro
---
import Analytics from "@vercel/analytics/astro"; // default export, not named
import BaseHead from "../components/BaseHead.astro";
import Header from "../components/Header.astro";
import Footer from "../components/Footer.astro";
import ScrollReveal from "../components/ScrollReveal.astro";
import "../styles/global.css";

interface Props {
  title: string;
  description: string;
  canonicalPath: string;
  ogImage?: string;
}

const { title, description, canonicalPath, ogImage } = Astro.props;
---

<html lang="en">
  <head>
    <BaseHead
      title={title}
      description={description}
      canonicalPath={canonicalPath}
      ogImage={ogImage}
    />
  </head>
  <body class="bg-bone text-ink font-sans">
    <a href="#main-content" class="skip-link">Skip to content</a>
    <Header />
    <main id="main-content">
      <slot />
    </main>
    <Footer />
    <ScrollReveal />
    <Analytics />
  </body>
</html>
```

Note: `Header.astro` and `Footer.astro` don't exist yet (Task 7) — this is expected; the container test below only asserts on head/skip-link/slot content, not the header/footer markup, so it can pass once Task 7 supplies empty-but-valid stub-free components. Build Task 7 immediately after this one before running `npm run build` on the whole site.

- [ ] **Step 6: Run test, verify it passes (after Task 7 exists)**

Run: `npx vitest run src/layouts/BaseLayout.test.ts`
Expected: PASS once `Header.astro`/`Footer.astro` exist (Task 7). If run before Task 7, it will fail on the missing import — that's fine, do Task 7 next before considering this task done.

- [ ] **Step 7: Commit (after Task 7 makes the test pass)**

```bash
git add src/components/BaseHead.astro src/components/ScrollReveal.astro src/layouts/BaseLayout.astro src/layouts/BaseLayout.test.ts
git commit -m "feat: base head, scroll reveal script, and base layout"
```

---

### Task 7: Header & Footer

**Files:**

- Create: `src/components/Header.astro`, `src/components/Footer.astro`, `src/components/Header.test.ts`

**Interfaces:**

- Produces: sticky header with logo linking `/`, nav links `Projects → /projects`, `Studio → /about`, `Process → /services`, `Contact → /contact` (rendered as design file lines 55–64: same 5 slots, minus "Journal"), a primary "Book a consultation" button linking `/contact`, and an accessible mobile disclosure (`<button aria-expanded aria-controls>` + a hidden panel) matching the mobile-menu-open artboard (design file lines 322–338 restyled to the bone/ink palette used by 1a's own light-mode nav, since the header itself is not sitting over a photo except on the homepage hero — see Task 13's hero override).

- [ ] **Step 1: Write the failing container test**

`src/components/Header.test.ts`:

```ts
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import Header from "./Header.astro";

describe("Header", () => {
  it("links the logo home and exposes the 4 nav destinations plus the CTA", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Header);

    expect(html).toContain('href="/"');
    expect(html).toContain('href="/projects"');
    expect(html).toContain('href="/about"');
    expect(html).toContain('href="/services"');
    expect(html).toContain('href="/contact"');
    expect(html).toContain(">Studio<");
    expect(html).toContain(">Process<");
    expect(html).not.toContain(">Journal<");
  });

  it("exposes an accessible mobile menu toggle", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Header);
    expect(html).toContain("aria-expanded");
    expect(html).toContain("aria-controls");
  });
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npx vitest run src/components/Header.test.ts`
Expected: FAIL — `Header.astro` does not exist.

- [ ] **Step 3: Implement `src/components/Header.astro`**

```astro
---
const navLinks = [
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "Studio" },
  { href: "/services", label: "Process" },
  { href: "/contact", label: "Contact" },
];
---

<header
  data-header
  class="sticky top-0 z-40 border-b border-border bg-bone/95 backdrop-blur transition-[padding] duration-300"
>
  <div
    class="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-6 lg:px-9"
    data-header-inner
  >
    <a href="/" class="font-display text-lg uppercase tracking-[0.14em] text-ink">Studio Ruang</a>

    <nav class="hidden items-center gap-9 md:flex" aria-label="Primary">
      {
        navLinks.map((link) => (
          <a href={link.href} class="text-sm text-ink hover:text-clay">
            {link.label}
          </a>
        ))
      }
      <a
        href="/contact"
        class="rounded-sm bg-clay px-6 py-3 text-xs font-medium uppercase tracking-widest text-bone hover:bg-ink"
      >
        Book a consultation
      </a>
    </nav>

    <button
      type="button"
      data-menu-toggle
      aria-expanded="false"
      aria-controls="mobile-menu"
      class="flex h-11 w-11 flex-col items-center justify-center gap-1.5 md:hidden"
    >
      <span class="sr-only">Open menu</span>
      <span class="block h-px w-6 bg-ink"></span>
      <span class="block h-px w-6 bg-ink"></span>
    </button>
  </div>

  <div
    id="mobile-menu"
    data-mobile-menu
    hidden
    class="border-t border-border bg-ink px-6 py-10 md:hidden"
  >
    <nav class="flex flex-col gap-2" aria-label="Mobile primary">
      {
        navLinks.map((link) => (
          <a href={link.href} class="font-display text-3xl font-light text-bone py-3">
            {link.label}
          </a>
        ))
      }
    </nav>
    <a
      href="/contact"
      class="mt-8 flex h-12 items-center justify-center rounded-sm bg-clay text-xs font-medium uppercase tracking-widest text-bone"
    >
      Book a consultation
    </a>
  </div>
</header>

<script>
  const toggle = document.querySelector<HTMLButtonElement>("[data-menu-toggle]");
  const menu = document.querySelector<HTMLElement>("[data-mobile-menu]");
  const header = document.querySelector<HTMLElement>("[data-header]");

  toggle?.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    if (menu) menu.hidden = isOpen;
  });

  let lastScrollY = window.scrollY;
  window.addEventListener("scroll", () => {
    if (!header) return;
    const scrolled = window.scrollY > 24;
    header.classList.toggle("py-0", scrolled);
    lastScrollY = window.scrollY;
  });
</script>
```

- [ ] **Step 4: Implement `src/components/Footer.astro`**

Translate design file lines 194–221 (1a footer) to Tailwind tokens:

```astro
---
const year = new Date().getFullYear();
---

<footer class="border-t border-border bg-bone">
  <div class="mx-auto grid max-w-[1200px] gap-12 px-6 py-16 lg:grid-cols-[2fr_1fr_1fr_1fr] lg:px-9">
    <div class="flex flex-col gap-3">
      <span class="font-display text-lg uppercase tracking-[0.14em] text-ink">Studio Ruang</span>
      <p class="max-w-[280px] text-sm leading-relaxed text-muted">
        Interior design for homes in Singapore and the region.
      </p>
    </div>
    <div class="flex flex-col gap-3">
      <span class="text-xs font-medium uppercase tracking-widest text-muted">Navigate</span>
      <a href="/projects" class="text-sm text-ink">Projects</a>
      <a href="/about" class="text-sm text-ink">Studio</a>
      <a href="/services" class="text-sm text-ink">Process</a>
      <a href="/contact" class="text-sm text-ink">Contact</a>
    </div>
    <div class="flex flex-col gap-3">
      <span class="text-xs font-medium uppercase tracking-widest text-muted">Contact</span>
      <a href="mailto:hello@studioruang.sg" class="text-sm text-ink">hello@studioruang.sg</a>
      <a href="tel:+6562204418" class="text-sm text-ink">+65 6220 4418</a>
      <span class="text-sm text-muted">18 Kandahar Street #02-03<br />Singapore 198885</span>
    </div>
    <div class="flex flex-col gap-3">
      <span class="text-xs font-medium uppercase tracking-widest text-muted">Follow</span>
      <a href="https://instagram.com" class="text-sm text-ink">Instagram</a>
      <a href="https://pinterest.com" class="text-sm text-ink">Pinterest</a>
    </div>
  </div>
  <div
    class="mx-auto flex max-w-[1200px] justify-between border-t border-border px-6 py-6 text-xs text-muted lg:px-9"
  >
    <span>© {year} Studio Ruang Pte Ltd</span>
    <span>Privacy · Terms</span>
  </div>
</footer>
```

- [ ] **Step 5: Run test, verify it passes**

Run: `npx vitest run src/components/Header.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 6: Now finish Task 6's test**

Run: `npx vitest run src/layouts/BaseLayout.test.ts`
Expected: PASS (1 test).

- [ ] **Step 7: Commit**

```bash
git add src/components/Header.astro src/components/Footer.astro src/components/Header.test.ts
git commit -m "feat: header with mobile drawer, footer"
```

---

### Task 8: ProjectCard component

**Files:**

- Create: `src/components/ProjectCard.astro`, `src/components/ProjectCard.test.ts`

**Interfaces:**

- Consumes: `Project` type from `src/data/projects.ts`.
- Produces: `<ProjectCard project={Project} />` — used by `src/pages/index.astro` (Task 13) and inside `ProjectFilter.tsx`'s Astro-rendered markup is NOT reused (the React island renders its own cards for filtering interactivity — see Task 9); this component is for the two static, non-filterable placements: the homepage featured grid and any other static callouts.

- [ ] **Step 1: Write the failing container test**

`src/components/ProjectCard.test.ts`:

```ts
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import ProjectCard from "./ProjectCard.astro";
import { projects } from "../data/projects";

describe("ProjectCard", () => {
  it("links to the project detail page and shows its real alt text", async () => {
    const container = await AstroContainer.create();
    const project = projects[0];
    const html = await container.renderToString(ProjectCard, { props: { project } });

    expect(html).toContain(`href="/projects/${project.slug}"`);
    expect(html).toContain(project.name);
    expect(html).toContain(project.coverImageAlt);
    expect(html).toContain(String(project.year));
  });
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npx vitest run src/components/ProjectCard.test.ts`
Expected: FAIL — component does not exist.

- [ ] **Step 3: Implement `src/components/ProjectCard.astro`**

```astro
---
import { Image } from "astro:assets";
import type { Project } from "../data/projects";

interface Props {
  project: Project;
  eager?: boolean;
}

const { project, eager = false } = Astro.props;
---

<a href={`/projects/${project.slug}`} class="group reveal block">
  <div class="overflow-hidden rounded-sm bg-surface">
    <img
      src={project.coverImage}
      alt={project.coverImageAlt}
      width={800}
      height={600}
      loading={eager ? "eager" : "lazy"}
      class="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
    />
  </div>
  <h3 class="mt-5 font-display text-2xl text-ink">{project.name}</h3>
  <p class="mt-1 text-xs uppercase tracking-widest text-muted">
    {project.category} · {project.year}
  </p>
</a>
```

(Note: plain `<img>` is used here intentionally over `<Image />` because `project.coverImage` is a runtime string path into `/public/images/...` rather than a statically-imported asset module — see Task 18/IMAGES.md. If the images are instead placed under `src/assets/images/` and imported, switch this to `astro:assets`'s `<Image src={importedAsset} />` and update `Project.coverImage` to the imported type; call this out to the user when photos are supplied, since it changes the field's type from `string` to an image import.)

- [ ] **Step 4: Run test, verify it passes**

Run: `npx vitest run src/components/ProjectCard.test.ts`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add src/components/ProjectCard.astro src/components/ProjectCard.test.ts
git commit -m "feat: shared project card component"
```

---

### Task 9: React island — ProjectFilter

**Files:**

- Create: `src/components/react/ProjectFilter.tsx`, `src/components/react/ProjectFilter.test.tsx`

**Interfaces:**

- Consumes: `Project` from `src/data/projects.ts`.
- Produces: `export default function ProjectFilter({ projects }: { projects: Project[] })`. Used by `src/pages/projects/index.astro` (Task 14) as `<ProjectFilter client:visible projects={projects} />`.

- [ ] **Step 1: Write the failing tests**

`src/components/react/ProjectFilter.test.tsx`:

```tsx
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import ProjectFilter from "./ProjectFilter";
import type { Project } from "../../data/projects";

const sample: Project[] = [
  { ...baseProject("r1", "Residential") },
  { ...baseProject("c1", "Commercial") },
  { ...baseProject("n1", "Renovation") },
];

function baseProject(slug: string, category: Project["category"]): Project {
  return {
    slug,
    name: `Project ${slug}`,
    category,
    year: 2024,
    location: "Singapore",
    scope: "Full residential design",
    narrative: ["a", "b"],
    coverImage: `/images/${slug}.jpg`,
    coverImageAlt: `Cover photo for project ${slug}`,
    gallery: [{ src: `/images/${slug}-1.jpg`, alt: "gallery image" }],
  };
}

beforeEach(() => {
  window.history.pushState({}, "", "/projects");
});

describe("ProjectFilter", () => {
  it("shows all projects by default", () => {
    render(<ProjectFilter projects={sample} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("filters to a single category on click and updates the URL", async () => {
    render(<ProjectFilter projects={sample} />);
    await userEvent.click(screen.getByRole("button", { name: "Residential" }));

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(1);
    expect(within(items[0]).getByText("Project r1")).toBeInTheDocument();
    expect(window.location.search).toBe("?category=residential");
  });

  it("is keyboard operable", async () => {
    render(<ProjectFilter projects={sample} />);
    const button = screen.getByRole("button", { name: "Commercial" });
    button.focus();
    await userEvent.keyboard("{Enter}");
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
  });

  it("reads the initial category back out of the URL on mount", () => {
    window.history.pushState({}, "", "/projects?category=renovation");
    render(<ProjectFilter projects={sample} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
    expect(screen.getByText("Project n1")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npx vitest run src/components/react/ProjectFilter.test.tsx`
Expected: FAIL — component does not exist.

- [ ] **Step 3: Implement `src/components/react/ProjectFilter.tsx`**

```tsx
import { useEffect, useMemo, useState } from "react";
import type { Project } from "../../data/projects";

type CategoryFilter = "all" | "residential" | "commercial" | "renovation";

const CATEGORIES: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "renovation", label: "Renovation" },
];

function readCategoryFromUrl(): CategoryFilter {
  if (typeof window === "undefined") return "all";
  const value = new URLSearchParams(window.location.search).get("category");
  return CATEGORIES.some((c) => c.value === value) ? (value as CategoryFilter) : "all";
}

interface ProjectFilterProps {
  projects: Project[];
}

export default function ProjectFilter({ projects }: ProjectFilterProps) {
  const [category, setCategory] = useState<CategoryFilter>(() => readCategoryFromUrl());

  useEffect(() => {
    const onPopState = () => setCategory(readCategoryFromUrl());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  function selectCategory(next: CategoryFilter) {
    setCategory(next);
    const url = new URL(window.location.href);
    if (next === "all") {
      url.searchParams.delete("category");
    } else {
      url.searchParams.set("category", next);
    }
    window.history.pushState({}, "", url);
  }

  const visibleProjects = useMemo(() => {
    if (category === "all") return projects;
    return projects.filter((project) => project.category.toLowerCase() === category);
  }, [category, projects]);

  return (
    <div>
      <div role="group" aria-label="Filter projects by category" className="flex flex-wrap gap-3">
        {CATEGORIES.map((c) => {
          const isActive = category === c.value;
          return (
            <button
              key={c.value}
              type="button"
              aria-pressed={isActive}
              onClick={() => selectCategory(c.value)}
              className={
                isActive
                  ? "rounded-sm border border-ink bg-ink px-4 py-2 text-xs uppercase tracking-widest text-bone"
                  : "rounded-sm border border-border px-4 py-2 text-xs uppercase tracking-widest text-ink hover:border-ink"
              }
            >
              {c.label}
            </button>
          );
        })}
      </div>

      <ul className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {visibleProjects.map((project) => (
          <li key={project.slug}>
            <a href={`/projects/${project.slug}`} className="group block">
              <img
                src={project.coverImage}
                alt={project.coverImageAlt}
                width={800}
                height={600}
                loading="lazy"
                className="aspect-[4/3] w-full rounded-sm object-cover"
              />
              <h3 className="mt-4 font-display text-xl text-ink">{project.name}</h3>
              <p className="mt-1 text-xs uppercase tracking-widest text-muted">
                {project.category} · {project.year}
              </p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 4: Run test, verify it passes**

Run: `npx vitest run src/components/react/ProjectFilter.test.tsx`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/react/ProjectFilter.tsx src/components/react/ProjectFilter.test.tsx
git commit -m "feat: keyboard-accessible, URL-synced project category filter"
```

---

### Task 10: React island — ConsultationForm

**Files:**

- Create: `src/components/react/ConsultationForm.tsx`, `src/components/react/ConsultationForm.test.tsx`

**Interfaces:**

- Consumes: `consultationSchema`, `projectTypeOptions`, `budgetRangeOptions`, `timelineOptions` (Task 3); `projectTypeLabels`, `budgetRangeLabels`, `timelineLabels` (Task 3); `Button`, `Input`, `Textarea`, `Label`, `Select*` (Task 5).
- Produces: `export default function ConsultationForm()`. Used by `src/pages/contact.astro` (Task 17) as `<ConsultationForm client:visible />`. POSTs JSON to `/api/consultation` (Task 12).

- [ ] **Step 1: Write the failing tests**

`src/components/react/ConsultationForm.test.tsx`:

```tsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import ConsultationForm from "./ConsultationForm";

vi.mock("@vercel/analytics", () => ({ track: vi.fn() }));

afterEach(() => {
  vi.restoreAllMocks();
});

async function fillValidForm() {
  await userEvent.type(screen.getByLabelText(/full name/i), "Hui Min Tan");
  await userEvent.type(screen.getByLabelText(/email/i), "hui.min@example.com");
  await userEvent.type(screen.getByLabelText(/phone/i), "+65 9123 4567");
  await userEvent.click(screen.getByRole("combobox", { name: /project type/i }));
  await userEvent.click(await screen.findByRole("option", { name: "Residential" }));
  await userEvent.click(screen.getByRole("combobox", { name: /budget/i }));
  await userEvent.click(await screen.findByRole("option", { name: "S$250,000 – S$500,000" }));
  await userEvent.click(screen.getByRole("combobox", { name: /timeline/i }));
  await userEvent.click(await screen.findByRole("option", { name: "6–12 months" }));
  await userEvent.type(
    screen.getByLabelText(/message/i),
    "We are renovating a 4-room flat in Bukit Timah and would like a full consultation."
  );
}

describe("ConsultationForm", () => {
  it("shows inline errors when submitted empty", async () => {
    render(<ConsultationForm />);
    await userEvent.click(screen.getByRole("button", { name: /request a consultation/i }));
    expect(await screen.findByText(/enter your full name/i)).toBeInTheDocument();
    expect(screen.getByText(/enter a valid email/i)).toBeInTheDocument();
  });

  it("has a visually hidden honeypot field that real users never see", () => {
    render(<ConsultationForm />);
    const honeypot = screen.getByLabelText(/company/i, { selector: "input" });
    expect(honeypot).toHaveAttribute("tabindex", "-1");
    expect(honeypot.closest("[aria-hidden]")).toBeTruthy();
  });

  it("submits, disables the button, shows a success state on 200, and fires the analytics event", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
    vi.stubGlobal("fetch", fetchMock);
    const { track } = await import("@vercel/analytics");

    render(<ConsultationForm />);
    await fillValidForm();
    await userEvent.click(screen.getByRole("button", { name: /request a consultation/i }));

    expect(await screen.findByText(/thank you/i)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/consultation",
      expect.objectContaining({ method: "POST" })
    );
    expect(track).toHaveBeenCalledWith("consultation_submitted");
  });

  it("shows a friendly error state when the request fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, json: async () => ({ ok: false, error: "nope" }) })
    );

    render(<ConsultationForm />);
    await fillValidForm();
    await userEvent.click(screen.getByRole("button", { name: /request a consultation/i }));

    expect(await screen.findByText(/something went wrong|try again/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npx vitest run src/components/react/ConsultationForm.test.tsx`
Expected: FAIL — component does not exist.

- [ ] **Step 3: Implement `src/components/react/ConsultationForm.tsx`**

```tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { track } from "@vercel/analytics";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { budgetRangeLabels, projectTypeLabels, timelineLabels } from "../../lib/form-options";
import {
  budgetRangeOptions,
  consultationSchema,
  projectTypeOptions,
  timelineOptions,
  type ConsultationInput,
} from "../../lib/schemas";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";

type SubmitState = "idle" | "submitting" | "success" | "error";

export default function ConsultationForm() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ConsultationInput>({
    resolver: zodResolver(consultationSchema),
    defaultValues: { company: "" },
  });

  async function onSubmit(data: ConsultationInput) {
    setSubmitState("submitting");
    try {
      const response = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("request failed");
      track("consultation_submitted");
      setSubmitState("success");
    } catch {
      setSubmitState("error");
    }
  }

  if (submitState === "success") {
    return (
      <div role="status" className="rounded-sm border border-border bg-surface p-8">
        <h3 className="font-display text-2xl text-ink">Thank you — your enquiry is in.</h3>
        <p className="mt-3 text-sm text-muted">
          We read every enquiry personally and reply within two working days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      {/* Honeypot: hidden from sighted and keyboard users, left for bots to fill in. */}
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden opacity-0">
        <Label htmlFor="company">Company</Label>
        <input id="company" tabIndex={-1} autoComplete="off" {...register("company")} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" autoComplete="name" {...register("name")} />
          {errors.name && <p className="text-xs text-clay">{errors.name.message}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" {...register("email")} />
          {errors.email && <p className="text-xs text-clay">{errors.email.message}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" type="tel" autoComplete="tel" {...register("phone")} />
        {errors.phone && <p className="text-xs text-clay">{errors.phone.message}</p>}
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="projectType">Project type</Label>
          <Select
            onValueChange={(v) =>
              setValue("projectType", v as ConsultationInput["projectType"], {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger id="projectType" aria-label="Project type">
              <SelectValue placeholder="Select one" />
            </SelectTrigger>
            <SelectContent>
              {projectTypeOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {projectTypeLabels[option]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.projectType && <p className="text-xs text-clay">{errors.projectType.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="budgetRange">Budget range</Label>
          <Select
            onValueChange={(v) =>
              setValue("budgetRange", v as ConsultationInput["budgetRange"], {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger id="budgetRange" aria-label="Budget range">
              <SelectValue placeholder="Select one" />
            </SelectTrigger>
            <SelectContent>
              {budgetRangeOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {budgetRangeLabels[option]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.budgetRange && <p className="text-xs text-clay">{errors.budgetRange.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="timeline">Timeline</Label>
          <Select
            onValueChange={(v) =>
              setValue("timeline", v as ConsultationInput["timeline"], { shouldValidate: true })
            }
          >
            <SelectTrigger id="timeline" aria-label="Timeline">
              <SelectValue placeholder="Select one" />
            </SelectTrigger>
            <SelectContent>
              {timelineOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {timelineLabels[option]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.timeline && <p className="text-xs text-clay">{errors.timeline.message}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="message">Tell us about your project</Label>
        <Textarea id="message" rows={5} {...register("message")} />
        {errors.message && <p className="text-xs text-clay">{errors.message.message}</p>}
      </div>

      {submitState === "error" && (
        <p role="alert" className="text-sm text-clay">
          Something went wrong sending your enquiry. Please try again, or email us directly.
        </p>
      )}

      <Button type="submit" disabled={submitState === "submitting"}>
        {submitState === "submitting" ? "Sending…" : "Request a consultation"}
      </Button>
    </form>
  );
}
```

- [ ] **Step 4: Run test, verify it passes**

Run: `npx vitest run src/components/react/ConsultationForm.test.tsx`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/react/ConsultationForm.tsx src/components/react/ConsultationForm.test.tsx
git commit -m "feat: consultation form with validation, honeypot, and submit states"
```

---

### Task 11: React island — Lightbox

**Files:**

- Create: `src/components/react/Lightbox.tsx`, `src/components/react/Lightbox.test.tsx`

**Interfaces:**

- Produces: `export default function Lightbox({ images }: { images: { src: string; alt: string }[] })`. Used by `src/pages/projects/[slug].astro` (Task 14) as `<Lightbox client:visible images={project.gallery} />`.

- [ ] **Step 1: Write the failing tests**

`src/components/react/Lightbox.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import Lightbox from "./Lightbox";

const images = [
  { src: "/a.jpg", alt: "Photo A" },
  { src: "/b.jpg", alt: "Photo B" },
  { src: "/c.jpg", alt: "Photo C" },
];

describe("Lightbox", () => {
  it("opens the dialog with the clicked image when a thumbnail is activated", async () => {
    render(<Lightbox images={images} />);
    await userEvent.click(screen.getAllByRole("button")[1]);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(screen.getByAltText("Photo B")).toBeInTheDocument();
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    render(<Lightbox images={images} />);
    const trigger = screen.getAllByRole("button")[0];
    await userEvent.click(trigger);
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("navigates forward and backward with the arrow keys", async () => {
    render(<Lightbox images={images} />);
    await userEvent.click(screen.getAllByRole("button")[0]);
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByAltText("Photo B")).toBeInTheDocument();
    await userEvent.keyboard("{ArrowLeft}");
    expect(screen.getByAltText("Photo A")).toBeInTheDocument();
  });

  it("closes when the backdrop is clicked but not when the image is clicked", async () => {
    render(<Lightbox images={images} />);
    await userEvent.click(screen.getAllByRole("button")[0]);
    await userEvent.click(screen.getByAltText("Photo A"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("dialog"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npx vitest run src/components/react/Lightbox.test.tsx`
Expected: FAIL — component does not exist.

- [ ] **Step 3: Implement `src/components/react/Lightbox.tsx`**

```tsx
import { useEffect, useRef, useState } from "react";

interface LightboxImage {
  src: string;
  alt: string;
}

interface LightboxProps {
  images: LightboxImage[];
}

export default function Lightbox({ images }: LightboxProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    if (openIndex === null) return;
    dialogRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        close();
      } else if (event.key === "ArrowRight") {
        setOpenIndex((i) => (i === null ? i : (i + 1) % images.length));
      } else if (event.key === "ArrowLeft") {
        setOpenIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length));
      } else if (event.key === "Tab") {
        trapFocus(event);
      }
    }

    function trapFocus(event: KeyboardEvent) {
      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>('button, [href], [tabindex]:not([tabindex="-1"])')
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [openIndex, images.length]);

  function close() {
    const trigger = openIndex !== null ? triggerRefs.current[openIndex] : null;
    setOpenIndex(null);
    trigger?.focus();
  }

  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, index) => (
          <li key={image.src}>
            <button
              type="button"
              ref={(el) => {
                triggerRefs.current[index] = el;
              }}
              onClick={() => setOpenIndex(index)}
              className="block w-full"
            >
              <img
                src={image.src}
                alt={image.alt}
                width={800}
                height={600}
                loading="lazy"
                className="aspect-[4/3] w-full rounded-sm object-cover"
              />
            </button>
          </li>
        ))}
      </ul>

      {openIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Project photo, expanded"
          ref={dialogRef}
          tabIndex={-1}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-6"
          onClick={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <img
            src={images[openIndex]?.src}
            alt={images[openIndex]?.alt ?? ""}
            className="max-h-[85vh] max-w-[90vw] object-contain"
          />
          <button
            type="button"
            onClick={close}
            aria-label="Close image viewer"
            className="absolute right-6 top-6 text-xs uppercase tracking-widest text-bone"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() =>
              setOpenIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length))
            }
            aria-label="Previous photo"
            className="absolute left-6 text-xs uppercase tracking-widest text-bone"
          >
            ← Prev
          </button>
          <button
            type="button"
            onClick={() => setOpenIndex((i) => (i === null ? i : (i + 1) % images.length))}
            aria-label="Next photo"
            className="absolute right-6 text-xs uppercase tracking-widest text-bone"
            style={{ marginTop: "3rem" }}
          >
            Next →
          </button>
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 4: Run test, verify it passes**

Run: `npx vitest run src/components/react/Lightbox.test.tsx`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/react/Lightbox.tsx src/components/react/Lightbox.test.tsx
git commit -m "feat: gallery lightbox with keyboard nav and focus trap"
```

---

### Task 12: API endpoint — `/api/consultation`

**Files:**

- Create: `src/pages/api/consultation.ts`, `src/pages/api/consultation.test.ts`

**Interfaces:**

- Consumes: `consultationSchema` (Task 3), `getSupabaseServerClient` (Task 4).
- Produces: `POST` handler returning `{ ok: true }` (200) or `{ ok: false, error: string }` (400/429/500/502). This is what `ConsultationForm.tsx` (Task 10) calls.

- [ ] **Step 1: Write the failing tests (mocking Supabase, resetting rate-limit state between tests)**

`src/pages/api/consultation.test.ts`:

```ts
import { beforeEach, describe, expect, it, vi } from "vitest";

const insertMock = vi.fn().mockResolvedValue({ error: null });
vi.mock("../../lib/supabase", () => ({
  getSupabaseServerClient: () => ({
    from: () => ({ insert: insertMock }),
  }),
}));

function makeRequest(body: unknown) {
  return new Request("https://studioruang.kevinciang.com/api/consultation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const validPayload = {
  name: "Hui Min Tan",
  email: "hui.min@example.com",
  phone: "+65 9123 4567",
  projectType: "residential",
  budgetRange: "250k-500k",
  timeline: "6-12-months",
  message: "We are renovating a 4-room flat in Bukit Timah and would like a full consultation.",
  company: "",
};

describe("POST /api/consultation", () => {
  beforeEach(() => {
    insertMock.mockClear();
    vi.resetModules();
  });

  it("inserts a valid submission and returns 200", async () => {
    const { POST } = await import("./consultation");
    const response = await POST({
      request: makeRequest(validPayload),
      clientAddress: "203.0.113.10",
    } as never);

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual({ ok: true });
    expect(insertMock).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Hui Min Tan", project_type: "residential" })
    );
  });

  it("rejects an invalid payload with 400 and does not insert", async () => {
    const { POST } = await import("./consultation");
    const response = await POST({
      request: makeRequest({ ...validPayload, email: "not-an-email" }),
      clientAddress: "203.0.113.11",
    } as never);

    expect(response.status).toBe(400);
    expect(insertMock).not.toHaveBeenCalled();
  });

  it("silently accepts (200) but never inserts when the honeypot is filled", async () => {
    const { POST } = await import("./consultation");
    const response = await POST({
      request: makeRequest({ ...validPayload, company: "Bot Co" }),
      clientAddress: "203.0.113.12",
    } as never);

    expect(response.status).toBe(200);
    expect(insertMock).not.toHaveBeenCalled();
  });

  it("rate-limits after 5 requests from the same IP within the window", async () => {
    const { POST } = await import("./consultation");
    const ip = "203.0.113.13";
    for (let i = 0; i < 5; i += 1) {
      const ok = await POST({ request: makeRequest(validPayload), clientAddress: ip } as never);
      expect(ok.status).toBe(200);
    }
    const limited = await POST({ request: makeRequest(validPayload), clientAddress: ip } as never);
    expect(limited.status).toBe(429);
  });
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npx vitest run src/pages/api/consultation.test.ts`
Expected: FAIL — `consultation.ts` does not exist.

- [ ] **Step 3: Implement `src/pages/api/consultation.ts`**

```ts
export const prerender = false;

import type { APIContext } from "astro";
import { consultationSchema } from "../../lib/schemas";
import { getSupabaseServerClient } from "../../lib/supabase";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (requestLog.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  const limited = recent.length >= RATE_LIMIT_MAX_REQUESTS;
  recent.push(now);
  requestLog.set(ip, recent);
  return limited;
}

function jsonResponse(status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST({ request, clientAddress }: APIContext): Promise<Response> {
  const ip = clientAddress || "unknown";

  if (isRateLimited(ip)) {
    return jsonResponse(429, { ok: false, error: "Too many requests. Please try again shortly." });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonResponse(400, { ok: false, error: "Invalid request body." });
  }

  const parsed = consultationSchema.safeParse(body);
  if (!parsed.success) {
    return jsonResponse(400, { ok: false, error: "Please check the form and try again." });
  }

  if (parsed.data.company) {
    // Honeypot tripped: pretend success so automated fillers don't learn to adapt.
    return jsonResponse(200, { ok: true });
  }

  const { name, email, phone, projectType, budgetRange, timeline, message } = parsed.data;

  try {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from("studioruang_consultations").insert({
      name,
      email,
      phone,
      project_type: projectType,
      budget_range: budgetRange,
      timeline,
      message,
      source: "studio-ruang",
    });

    if (error) {
      return jsonResponse(502, {
        ok: false,
        error: "We could not save your enquiry. Please try again.",
      });
    }

    return jsonResponse(200, { ok: true });
  } catch {
    return jsonResponse(500, { ok: false, error: "Something went wrong. Please try again." });
  }
}
```

- [ ] **Step 4: Run test, verify it passes**

Run: `npx vitest run src/pages/api/consultation.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/pages/api/consultation.ts src/pages/api/consultation.test.ts
git commit -m "feat: consultation API endpoint with validation, honeypot, and rate limiting"
```

---

### Task 13: Home page (`/`)

**Files:**

- Modify: `src/pages/index.astro` (replace Task 1's scaffold entirely)
- Create: `src/pages/index.test.ts`

**Interfaces:**

- Consumes: `BaseLayout` (Task 6), `ProjectCard` (Task 8), `projects` (Task 3).
- Produces: the real homepage. No other task depends on this file.

Build the six sections against direction 1a's homepage artboard (design file lines 42–222), reusing the exact copy given there where it is already final client-ready copy, and Task 3's real project data for anything the mockup only sketched with placeholder project names:

1. **Hero** (design lines 52–77): full-viewport height, one full-bleed cover image (`/images/home/hero.jpg`) with the dark gradient overlay, eyebrow "Interior design · Singapore · Est. 2016", `<h1>Space, made personal.</h1>`, descriptor "Residential interiors shaped around how a home is actually lived in.", primary CTA "Book a consultation" → `/contact`, secondary "View projects" → `/projects`. This is the one `loading="eager" fetchpriority="high"` image on the whole site.
2. **Featured projects** (design lines 79–126): 3 of the 6 real projects in the same asymmetric big/small rhythm — use `emerald-hill-terrace` (large left image), `keppel-bay-duplex` (large right image), `bukit-timah-house` (compact full-width row), each linking to its real `/projects/<slug>`.
3. **Studio intro strip** (design lines 128–135): "Founded in 2016, Studio Ruang is a six-person practice working across Singapore and the region. We take on a small number of homes each year so each one gets the attention it needs." + "About the studio →" linking `/about`.
4. **Services overview** (design lines 137–170): the 5 process steps as a compact numbered row, using the PRD's exact step names — Consultation, Concept & Moodboard, Design Development, Build & Project Management, Styling & Handover — each with a one-sentence description, ending with a link to `/services`.
5. **Testimonial** (design lines 172–178): the quote and attribution exactly as drafted there.
6. **Closing CTA band** (design lines 180–191): dark band, "Considering a project?" heading, supporting line, "Book a consultation" → `/contact`.

- [ ] **Step 1: Write the failing container test**

`src/pages/index.test.ts`:

```ts
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import Index from "./index.astro";

describe("Home page", () => {
  it("has exactly one h1, links the CTAs to /contact and /projects, and features 3 real projects", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Index);

    const h1Matches = html.match(/<h1[\s>]/g) ?? [];
    expect(h1Matches).toHaveLength(1);
    expect(html).toContain("Space, made personal.");
    expect(html).toContain('href="/contact"');
    expect(html).toContain('href="/projects"');
    expect(html).toContain('href="/projects/emerald-hill-terrace"');
    expect(html).toContain('href="/projects/keppel-bay-duplex"');
    expect(html).toContain('href="/projects/bukit-timah-house"');
    expect(html).toContain("Concept &#38; Moodboard");
    expect(html).toContain("Styling &#38; Handover");
  });
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npx vitest run src/pages/index.test.ts`
Expected: FAIL — current `index.astro` is still Task 1's scaffold.

- [ ] **Step 3: Implement `src/pages/index.astro`**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import ProjectCard from "../components/ProjectCard.astro";
import { projects } from "../data/projects";

const featured = [
  projects.find((p) => p.slug === "emerald-hill-terrace")!,
  projects.find((p) => p.slug === "keppel-bay-duplex")!,
  projects.find((p) => p.slug === "bukit-timah-house")!,
];

const processSteps = [
  {
    number: "01",
    title: "Consultation",
    description: "We visit the space, listen, and set a budget that is honest from the start.",
  },
  {
    number: "02",
    title: "Concept & Moodboard",
    description: "Plans, materials and references, presented as one coherent idea.",
  },
  {
    number: "03",
    title: "Design Development",
    description: "Joinery, lighting and finishes resolved down to the detail.",
  },
  {
    number: "04",
    title: "Build & Project Management",
    description: "Weekly site presence and coordinated trades, start to finish.",
  },
  {
    number: "05",
    title: "Styling & Handover",
    description: "Furniture, art and final styling, then a home that's ready to live in.",
  },
];
---

<BaseLayout
  title="Studio Ruang — Residential Interior Design, Singapore"
  description="Studio Ruang is a Singapore-based residential interior design studio designing homes shaped around how they're actually lived in."
  canonicalPath="/"
>
  <section class="relative flex min-h-screen flex-col justify-end overflow-hidden">
    <img
      src="/images/home/hero.jpg"
      alt="Living room bathed in late-afternoon light, a Studio Ruang interior."
      class="absolute inset-0 h-full w-full object-cover"
      loading="eager"
      fetchpriority="high"
      width={1920}
      height={1280}
    />
    <div class="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/30 to-ink/70"></div>
    <div class="relative z-10 mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-6 pb-24 lg:px-9">
      <p class="text-xs font-medium uppercase tracking-[0.2em] text-surface">
        Interior design · Singapore · Est. 2016
      </p>
      <h1
        class="max-w-3xl font-display text-6xl font-light leading-[0.98] tracking-tight text-bone md:text-8xl"
      >
        Space, made<br />personal.
      </h1>
      <p class="max-w-lg text-lg text-surface">
        Residential interiors shaped around how a home is actually lived in.
      </p>
      <div class="flex flex-wrap gap-4 pt-2">
        <a
          href="/contact"
          class="rounded-sm bg-clay px-7 py-4 text-xs font-medium uppercase tracking-widest text-bone"
        >
          Book a consultation
        </a>
        <a
          href="/projects"
          class="rounded-sm border border-bone/70 px-7 py-4 text-xs font-medium uppercase tracking-widest text-bone"
        >
          View projects
        </a>
      </div>
    </div>
  </section>

  <section class="mx-auto max-w-[1200px] px-6 py-24 lg:px-9">
    <div class="mb-14 flex items-end justify-between border-b border-border pb-6">
      <h2 class="text-xs font-medium uppercase tracking-[0.2em] text-muted">Selected projects</h2>
      <a href="/projects" class="text-sm text-clay">All projects →</a>
    </div>
    <div class="grid gap-16 lg:grid-cols-2">
      {featured.map((project) => <ProjectCard project={project} />)}
    </div>
  </section>

  <section class="reveal bg-surface px-6 py-28 lg:px-9">
    <div class="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[300px_1fr]">
      <p class="text-xs font-medium uppercase tracking-[0.2em] text-muted">The studio</p>
      <div class="flex flex-col gap-6">
        <p class="max-w-3xl font-display text-3xl leading-snug text-ink">
          Founded in 2016, Studio Ruang is a six-person practice working across Singapore and the
          region. We take on a small number of homes each year so each one gets the attention it
          needs.
        </p>
        <a href="/about" class="text-sm text-clay">About the studio →</a>
      </div>
    </div>
  </section>

  <section class="mx-auto max-w-[1200px] px-6 py-24 lg:px-9">
    <div class="mb-12 flex items-baseline justify-between border-b border-border pb-6">
      <h2 class="text-xs font-medium uppercase tracking-[0.2em] text-muted">How we work</h2>
      <a href="/services" class="text-sm text-clay">Our process →</a>
    </div>
    <div class="grid gap-9 md:grid-cols-5">
      {
        processSteps.map((step) => (
          <div class="reveal flex flex-col gap-3 border-t border-border pt-5">
            <span class="font-mono text-xs text-clay">{step.number}</span>
            <h3 class="font-display text-xl text-ink">{step.title}</h3>
            <p class="text-sm text-muted">{step.description}</p>
          </div>
        ))
      }
    </div>
  </section>

  <section class="reveal flex justify-center px-6 py-32 lg:px-9">
    <blockquote class="flex max-w-3xl flex-col items-center gap-8 text-center">
      <p class="font-display text-3xl font-light leading-relaxed text-ink">
        &ldquo;They listened for months before they drew anything. The house we live in now is the
        one we described on that first afternoon — only better than we could picture it.&rdquo;
      </p>
      <cite class="text-xs uppercase tracking-widest text-muted not-italic">
        H. &amp; M. Tan · Bukit Timah House
      </cite>
    </blockquote>
  </section>

  <section class="bg-ink px-6 py-24 lg:px-9">
    <div
      class="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-10 lg:flex-row lg:items-end"
    >
      <div class="flex max-w-xl flex-col gap-5">
        <span class="text-xs font-medium uppercase tracking-[0.2em] text-clay">Enquiries</span>
        <h2 class="font-display text-5xl font-light leading-tight text-bone">
          Considering a project?
        </h2>
        <p class="text-base text-border">
          We take on a limited number of homes each year. Tell us about yours and we will say
          honestly whether we are the right studio for it.
        </p>
      </div>
      <a
        href="/contact"
        class="rounded-sm bg-clay px-7 py-4 text-xs font-medium uppercase tracking-widest text-bone"
      >
        Book a consultation
      </a>
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 4: Run test, verify it passes**

Run: `npx vitest run src/pages/index.test.ts`
Expected: PASS (1 test).

- [ ] **Step 5: Build and eyeball against the design file**

Run: `npm run build && npm run preview`, open the preview URL next to `Studio Ruang homepage direction/Studio Ruang Homepage Directions.dc.html`'s `1a` desktop artboard in a browser and compare rhythm/spacing/type scale. This is the manual check called out in Global Constraints — there is no automated equivalent for "does the hero read as full-bleed and immersive."

- [ ] **Step 6: Commit**

```bash
git add src/pages/index.astro src/pages/index.test.ts
git commit -m "feat: home page (hero, featured projects, studio strip, process, testimonial, CTA)"
```

---

### Task 14: Projects index & detail pages

**Files:**

- Create: `src/pages/projects/index.astro`, `src/pages/projects/[slug].astro`, `src/pages/projects/index.test.ts`, `src/pages/projects/slug.test.ts`

**Interfaces:**

- Consumes: `projects` (Task 3), `ProjectFilter` (Task 9), `Lightbox` (Task 11), `getAdjacentProject` (Task 4).
- Produces: `/projects` and 6 static routes under `/projects/<slug>`.

- [ ] **Step 1: Write the failing test for the index page**

`src/pages/projects/index.test.ts`:

```ts
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import ProjectsIndex from "./index.astro";

describe("Projects index page", () => {
  it("has one h1 and hydrates the filter island with client:visible", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(ProjectsIndex);

    const h1Matches = html.match(/<h1[\s>]/g) ?? [];
    expect(h1Matches).toHaveLength(1);
    expect(html).toContain("astro-island");
    expect(html).toContain('client="visible"');
  });
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npx vitest run src/pages/projects/index.test.ts`
Expected: FAIL — page does not exist.

- [ ] **Step 3: Implement `src/pages/projects/index.astro`**

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import ProjectFilter from "../../components/react/ProjectFilter.tsx";
import { projects } from "../../data/projects";
---

<BaseLayout
  title="Projects — Studio Ruang"
  description="Residential and commercial interiors by Studio Ruang, Singapore — browse by category."
  canonicalPath="/projects"
>
  <section class="mx-auto max-w-[1200px] px-6 py-20 lg:px-9">
    <h1 class="font-display text-5xl font-light text-ink">Projects</h1>
    <p class="mt-4 max-w-xl text-muted">
      Six homes and one dining room, each designed around how the people in it actually live.
    </p>
    <div class="mt-12">
      <ProjectFilter client:visible projects={projects} />
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 4: Run test, verify it passes**

Run: `npx vitest run src/pages/projects/index.test.ts`
Expected: PASS (1 test).

- [ ] **Step 5: Write the failing test for the detail page's static paths and next-project cycle**

`src/pages/projects/slug.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { getStaticPaths } from "./[slug].astro";
import { projects } from "../../data/projects";

describe("project detail static paths", () => {
  it("generates exactly one path per project, with the project attached as props", () => {
    const paths = getStaticPaths();
    expect(paths).toHaveLength(6);
    const slugs = paths.map((p) => p.params.slug).sort();
    expect(slugs).toEqual(projects.map((p) => p.slug).sort());
    for (const path of paths) {
      expect(path.props.project.slug).toBe(path.params.slug);
    }
  });
});
```

- [ ] **Step 6: Run test, verify it fails**

Run: `npx vitest run src/pages/projects/slug.test.ts`
Expected: FAIL — `[slug].astro` does not exist.

- [ ] **Step 7: Implement `src/pages/projects/[slug].astro`**

Translate design lines 342–404 (1a project detail) to Tailwind, using the real project's `narrative` array for the "brief" section and `gallery` for the image grid:

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import Lightbox from "../../components/react/Lightbox.tsx";
import { projects, type Project } from "../../data/projects";
import { getAdjacentProject } from "../../lib/projects-nav";

export function getStaticPaths() {
  return projects.map((project) => ({
    params: { slug: project.slug },
    props: { project },
  }));
}

interface Props {
  project: Project;
}

const { project } = Astro.props;
const next = getAdjacentProject(project.slug);
---

<BaseLayout
  title={`${project.name} — Studio Ruang`}
  description={project.narrative[0]}
  canonicalPath={`/projects/${project.slug}`}
  ogImage={project.coverImage}
>
  <section class="relative flex h-[70vh] min-h-[520px] items-end overflow-hidden">
    <img
      src={project.coverImage}
      alt={project.coverImageAlt}
      class="absolute inset-0 h-full w-full object-cover"
      loading="eager"
      fetchpriority="high"
      width={1920}
      height={1080}
    />
    <div class="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/25 to-ink/60"></div>
    <div class="relative z-10 mx-auto w-full max-w-[1200px] px-6 pb-16 lg:px-9">
      <p class="text-xs font-medium uppercase tracking-[0.2em] text-surface">
        {project.category} project
      </p>
      <h1 class="mt-4 font-display text-6xl font-light text-bone md:text-7xl">{project.name}</h1>
    </div>
  </section>

  <section class="mx-auto max-w-[1200px] px-6 lg:px-9">
    <dl class="grid grid-cols-2 gap-8 border-b border-border py-9 md:grid-cols-4">
      <div class="flex flex-col gap-2">
        <dt class="text-xs font-medium uppercase tracking-widest text-muted">Category</dt>
        <dd class="text-ink">{project.category}</dd>
      </div>
      <div class="flex flex-col gap-2">
        <dt class="text-xs font-medium uppercase tracking-widest text-muted">Year</dt>
        <dd class="text-ink">{project.year}</dd>
      </div>
      <div class="flex flex-col gap-2">
        <dt class="text-xs font-medium uppercase tracking-widest text-muted">Location</dt>
        <dd class="text-ink">{project.location}</dd>
      </div>
      <div class="flex flex-col gap-2">
        <dt class="text-xs font-medium uppercase tracking-widest text-muted">Scope</dt>
        <dd class="text-ink">{project.scope}</dd>
      </div>
    </dl>

    <div class="grid gap-10 py-20 lg:grid-cols-[minmax(0,340px)_1fr]">
      <p class="font-display text-2xl leading-snug text-ink">{project.narrative[0]}</p>
      <div class="flex max-w-2xl flex-col gap-6 text-muted">
        {project.narrative.slice(1).map((paragraph) => <p>{paragraph}</p>)}
      </div>
    </div>
  </section>

  <section class="mx-auto max-w-[1200px] px-6 pb-20 lg:px-9">
    <Lightbox client:visible images={project.gallery} />
  </section>

  <nav class="border-t border-border" aria-label="Project navigation">
    <div
      class="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-4 px-6 py-10 text-xs uppercase tracking-widest text-muted sm:flex-row lg:px-9"
    >
      <a href="/projects" class="text-clay">All projects</a>
      <a href={`/projects/${next.slug}`}>{next.name} →</a>
    </div>
  </nav>
</BaseLayout>
```

- [ ] **Step 8: Run test, verify it passes**

Run: `npx vitest run src/pages/projects/slug.test.ts`
Expected: PASS (1 test).

- [ ] **Step 9: Full build check**

Run: `npm run build`
Expected: 6 static files under `dist/projects/<slug>/index.html`.

- [ ] **Step 10: Commit**

```bash
git add src/pages/projects/
git commit -m "feat: projects index (filterable) and static project detail pages"
```

---

### Task 15: Services page

**Files:**

- Create: `src/pages/services.astro`, `src/pages/services.test.ts`

**Interfaces:**

- Consumes: `BaseLayout` (Task 6).

- [ ] **Step 1: Write the failing test**

`src/pages/services.test.ts`:

```ts
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import Services from "./services.astro";

describe("Services page", () => {
  it("lists all 5 process steps by name and links the CTA to /contact", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Services);

    for (const step of [
      "Consultation",
      "Concept &#38; Moodboard",
      "Design Development",
      "Build &#38; Project Management",
      "Styling &#38; Handover",
    ]) {
      expect(html).toContain(step);
    }
    expect(html).toContain('href="/contact"');
  });
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npx vitest run src/pages/services.test.ts`
Expected: FAIL — page does not exist.

- [ ] **Step 3: Implement `src/pages/services.astro`**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";

const steps = [
  {
    number: "01",
    title: "Consultation",
    description:
      "We visit the space in person, listen to how you actually want to live in it, and set a budget that's honest from day one — not a number designed to win the pitch.",
  },
  {
    number: "02",
    title: "Concept & Moodboard",
    description:
      "A single coherent direction — plan, materials, references — rather than a menu of options to choose between. We'd rather convince you of one good idea than hedge with three.",
  },
  {
    number: "03",
    title: "Design Development",
    description:
      "Joinery, lighting, and finishes resolved down to the detail, with physical samples in hand before anything is ordered.",
  },
  {
    number: "04",
    title: "Build & Project Management",
    description:
      "Drawings issued, contractors tendered, and costs agreed before work starts. We're on site weekly for the length of the build.",
  },
  {
    number: "05",
    title: "Styling & Handover",
    description:
      "Furniture, art, and final styling, then a walkthrough of the finished home before we hand you the keys.",
  },
];

const offerings = [
  {
    title: "Full residential design",
    description: "End-to-end design for a whole home, from first sketch to the last chair placed.",
  },
  {
    title: "Renovation",
    description:
      "Structural and interior renovation for apartments and landed homes, including conservation properties.",
  },
  {
    title: "Styling & FF&E",
    description:
      "Furniture, fittings and styling for homes that don't need structural work — just a considered finish.",
  },
  {
    title: "Commercial fit-out",
    description:
      "A small number of F&B and hospitality fit-outs each year, for operators who want a considered room.",
  },
];
---

<BaseLayout
  title="Services & Process — Studio Ruang"
  description="How Studio Ruang works, from first consultation to handover, and the services we offer."
  canonicalPath="/services"
>
  <section class="mx-auto max-w-[1200px] px-6 py-20 lg:px-9">
    <h1 class="font-display text-5xl font-light text-ink">How we work</h1>
    <p class="mt-4 max-w-xl text-muted">
      Typically 9–14 months from first meeting to handover, across five stages.
    </p>

    <ol class="mt-16 flex flex-col">
      {
        steps.map((step) => (
          <li class="reveal grid gap-4 border-t border-border py-9 md:grid-cols-[80px_260px_1fr] md:items-baseline">
            <span class="font-mono text-xs text-clay">{step.number}</span>
            <h2 class="font-display text-2xl text-ink">{step.title}</h2>
            <p class="max-w-2xl text-muted">{step.description}</p>
          </li>
        ))
      }
    </ol>
  </section>

  <section class="reveal bg-surface px-6 py-24 lg:px-9">
    <div class="mx-auto max-w-[1200px]">
      <h2 class="text-xs font-medium uppercase tracking-[0.2em] text-muted">What we offer</h2>
      <div class="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {
          offerings.map((offering) => (
            <div class="flex flex-col gap-3 rounded-sm border border-border bg-bone p-7">
              <h3 class="font-display text-xl text-ink">{offering.title}</h3>
              <p class="text-sm text-muted">{offering.description}</p>
            </div>
          ))
        }
      </div>
    </div>
  </section>

  <section class="bg-ink px-6 py-20 text-center lg:px-9">
    <div class="mx-auto flex max-w-xl flex-col items-center gap-6">
      <h2 class="font-display text-4xl font-light text-bone">Ready to talk about your home?</h2>
      <a
        href="/contact"
        class="rounded-sm bg-clay px-7 py-4 text-xs font-medium uppercase tracking-widest text-bone"
      >
        Book a consultation
      </a>
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 4: Run test, verify it passes**

Run: `npx vitest run src/pages/services.test.ts`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add src/pages/services.astro src/pages/services.test.ts
git commit -m "feat: services page with 5-step process and offering cards"
```

---

### Task 16: About page

**Files:**

- Create: `src/pages/about.astro`, `src/pages/about.test.ts`

**Interfaces:**

- Consumes: `BaseLayout` (Task 6).

- [ ] **Step 1: Write the failing test**

`src/pages/about.test.ts`:

```ts
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import About from "./about.astro";

describe("About page", () => {
  it("names the founder, lists 3 values, and includes a founder portrait with real alt text", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(About);

    expect(html).toContain("Nadia Rahman");
    expect(html).toContain("Light first");
    expect(html).toContain("Honest materials");
    expect(html).toContain("Quiet detail");
    expect(html).toContain('alt="Nadia Rahman');
  });
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npx vitest run src/pages/about.test.ts`
Expected: FAIL — page does not exist.

- [ ] **Step 3: Implement `src/pages/about.astro`**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";

const values = [
  {
    title: "Light first",
    description: "Every plan starts from where the daylight falls, not where the furniture goes.",
  },
  {
    title: "Honest materials",
    description: "Repairs stay visible rather than disguised; new work doesn't pretend to be old.",
  },
  {
    title: "Quiet detail",
    description:
      "The best joinery is the kind you stop noticing after the first week of living with it.",
  },
];

const press = ["Home & Decor", "Tatler Homes", "Cubes"];
---

<BaseLayout
  title="About — Studio Ruang"
  description="Studio Ruang is a small, Singapore-based residential interior design studio founded in 2016 by Nadia Rahman."
  canonicalPath="/about"
>
  <section class="mx-auto max-w-[1200px] px-6 py-20 lg:px-9">
    <h1 class="font-display text-5xl font-light text-ink">The studio</h1>
    <div class="mt-10 grid gap-16 lg:grid-cols-2">
      <div class="flex flex-col gap-6 text-muted">
        <p>
          Studio Ruang was founded in Singapore in 2016. "Ruang" means space in Malay and Indonesian
          — the word we kept coming back to when we tried to describe what we actually do, which is
          give a room back to the people living in it.
        </p>
        <p>
          We're a small, six-person practice, residential-first, with a short list of commercial
          fit-outs each year for operators we believe in. We take on a limited number of homes at a
          time so that each one gets the attention it needs from the first sketch to the last chair
          placed.
        </p>
        <p>
          Our approach comes back to three things, in this order: light, materiality, and restraint.
          We'd rather leave a room slightly underfurnished than crowd it with things that don't need
          to be there.
        </p>
      </div>
      <img
        src="/images/about/founder-portrait.jpg"
        alt="Nadia Rahman, founder of Studio Ruang, in the studio's Singapore office."
        width={800}
        height={1000}
        loading="lazy"
        class="aspect-[4/5] w-full rounded-sm object-cover"
      />
    </div>
  </section>

  <section class="reveal bg-surface px-6 py-24 lg:px-9">
    <div class="mx-auto max-w-[1200px]">
      <h2 class="text-xs font-medium uppercase tracking-[0.2em] text-muted">What we believe</h2>
      <div class="mt-10 grid gap-8 md:grid-cols-3">
        {
          values.map((value) => (
            <div class="flex flex-col gap-3">
              <h3 class="font-display text-2xl text-ink">{value.title}</h3>
              <p class="text-sm text-muted">{value.description}</p>
            </div>
          ))
        }
      </div>
    </div>
  </section>

  <section class="mx-auto max-w-[1200px] px-6 py-20 text-center lg:px-9">
    <p class="text-xs font-medium uppercase tracking-[0.2em] text-muted">As featured in</p>
    <div class="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
      {press.map((name) => <span class="font-display text-xl text-muted">{name}</span>)}
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 4: Run test, verify it passes**

Run: `npx vitest run src/pages/about.test.ts`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add src/pages/about.astro src/pages/about.test.ts
git commit -m "feat: about page with founder, values, and press strip"
```

---

### Task 17: Contact page

**Files:**

- Create: `src/pages/contact.astro`, `src/pages/contact.test.ts`

**Interfaces:**

- Consumes: `BaseLayout` (Task 6), `ConsultationForm` (Task 10).

- [ ] **Step 1: Write the failing test**

`src/pages/contact.test.ts`:

```ts
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import Contact from "./contact.astro";

describe("Contact page", () => {
  it("shows the studio's contact details and hydrates the consultation form", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Contact);

    expect(html).toContain("hello@studioruang.sg");
    expect(html).toContain("+65 6220 4418");
    expect(html).toContain("18 Kandahar Street");
    expect(html).toContain("astro-island");
    expect(html).toContain('client="visible"');
  });
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npx vitest run src/pages/contact.test.ts`
Expected: FAIL — page does not exist.

- [ ] **Step 3: Implement `src/pages/contact.astro`**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import ConsultationForm from "../components/react/ConsultationForm.tsx";
---

<BaseLayout
  title="Contact — Studio Ruang"
  description="Book a consultation with Studio Ruang, a residential interior design studio in Singapore."
  canonicalPath="/contact"
>
  <section class="mx-auto max-w-[1200px] px-6 py-20 lg:px-9">
    <h1 class="font-display text-5xl font-light text-ink">Book a consultation</h1>
    <p class="mt-4 max-w-xl text-muted">
      Tell us about your home and where you are in the process. We reply personally within two
      working days.
    </p>

    <div class="mt-16 grid gap-16 lg:grid-cols-[1fr_360px]">
      <ConsultationForm client:visible />

      <aside
        class="flex flex-col gap-8 border-t border-border pt-8 lg:border-t-0 lg:border-l lg:pl-12 lg:pt-0"
      >
        <div class="flex flex-col gap-2">
          <h2 class="text-xs font-medium uppercase tracking-widest text-muted">Email</h2>
          <a href="mailto:hello@studioruang.sg" class="text-ink">hello@studioruang.sg</a>
        </div>
        <div class="flex flex-col gap-2">
          <h2 class="text-xs font-medium uppercase tracking-widest text-muted">Phone</h2>
          <a href="tel:+6562204418" class="text-ink">+65 6220 4418</a>
        </div>
        <div class="flex flex-col gap-2">
          <h2 class="text-xs font-medium uppercase tracking-widest text-muted">Studio</h2>
          <p class="text-ink">18 Kandahar Street #02-03<br />Singapore 198885</p>
        </div>
        <div class="flex flex-col gap-2">
          <h2 class="text-xs font-medium uppercase tracking-widest text-muted">Hours</h2>
          <p class="text-ink">Monday – Friday, 10am – 6pm<br />Saturday by appointment</p>
        </div>
      </aside>
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 4: Run test, verify it passes**

Run: `npx vitest run src/pages/contact.test.ts`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add src/pages/contact.astro src/pages/contact.test.ts
git commit -m "feat: contact page with consultation form and studio details"
```

---

### Task 18: Supabase schema, IMAGES.md, sitemap wiring

**Files:**

- Create: `supabase/schema.sql`, `IMAGES.md`

**Interfaces:**

- None consumed/produced beyond documentation — this task has no automated test; it is verified by review (SQL is syntactically valid Postgres DDL; every path in `IMAGES.md` matches a path referenced somewhere in `src/`).

- [ ] **Step 1: Write `supabase/schema.sql`**

```sql
-- Studio Ruang consultation submissions.
-- This project reuses a shared Supabase instance; every table is prefixed
-- studioruang_ to stay isolated from other apps in the same project.

create table if not exists public.studioruang_consultations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text not null,
  project_type text not null,
  budget_range text not null,
  timeline text not null,
  message text not null,
  source text not null default 'studio-ruang'
);

alter table public.studioruang_consultations enable row level security;

-- No public policies are defined: all reads/writes go through the server
-- endpoint (src/pages/api/consultation.ts) using the service-role key,
-- which bypasses RLS. The anon key has no access to this table.
comment on table public.studioruang_consultations is
  'Consultation form submissions from studioruang.kevinciang.com. Written only by the server endpoint using the service-role key.';
```

- [ ] **Step 2: Write `IMAGES.md`**

```markdown
# Image Manifest — Studio Ruang

Self-host every image under `/public/images/...` at the exact paths below. Source ~15
real interior photographs from Unsplash or Pexels (search terms suggested per row) and
drop them in with these filenames — nothing else needs to change.

## Home (`/`)

| Path                           | Subject                                                      | Recommended size                        | Alt text (already wired into the page)                                 |
| ------------------------------ | ------------------------------------------------------------ | --------------------------------------- | ---------------------------------------------------------------------- |
| `/public/images/home/hero.jpg` | Full-bleed living room, warm late-afternoon light, wide shot | 1920×1280 (3:2), eager-loaded LCP image | "Living room bathed in late-afternoon light, a Studio Ruang interior." |

## About (`/about`)

| Path                                        | Subject                                                              | Recommended size | Alt text                                                                   |
| ------------------------------------------- | -------------------------------------------------------------------- | ---------------- | -------------------------------------------------------------------------- |
| `/public/images/about/founder-portrait.jpg` | Portrait of a woman in her 40s, natural light, studio/office setting | 1200×1500 (4:5)  | "Nadia Rahman, founder of Studio Ruang, in the studio's Singapore office." |

## Default social share image

| Path                            | Subject                                                        | Recommended size | Alt text                                 |
| ------------------------------- | -------------------------------------------------------------- | ---------------- | ---------------------------------------- |
| `/public/images/og-default.jpg` | A representative interior shot (can reuse the home hero image) | 1200×630         | n/a (Open Graph image, no alt attribute) |

## Projects (`/projects`, `/projects/[slug]`)

Each project needs 1 cover image + 4–6 gallery images at `/public/images/projects/<slug>/`.

### emerald-hill-terrace (search: "peranakan shophouse interior", "restored heritage home singapore")

- `cover.jpg` — 1600×1200 (4:3) — "Restored Peranakan shophouse living room with timber shutters, white oak flooring, and afternoon light falling across an open airwell."
- `gallery-1.jpg` — 1600×1200 — "Reopened airwell at the centre of the shophouse, seen from the ground-floor living space."
- `gallery-2.jpg` — 1600×1200 — "Repaired original encaustic floor tiles at the entry threshold."
- `gallery-3.jpg` — 1600×1200 — "White oak joinery run along the ground-floor corridor wall."
- `gallery-4.jpg` — 1200×1600 (3:4) — "Main bedroom suite with a study nook overlooking the street-facing timber shutters."
- `gallery-5.jpg` — 1600×1200 — "Kitchen with warm plaster walls and a view back toward the airwell."

### keppel-bay-duplex (search: "waterfront apartment interior", "coastal modern living room")

- `cover.jpg` — 1600×1200 — "Open-plan living and dining space in a waterfront duplex with unobstructed views of Keppel Bay."
- `gallery-1.jpg` — 1600×1200 — "Living room with limewashed walls and white oak flooring facing full-height water-view glazing."
- `gallery-2.jpg` — 1600×1200 — "Kitchen in warm neutral tones matching the surrounding walls."
- `gallery-3.jpg` — 1600×1200 — "Principal bathroom with a freestanding bath aligned to the bay view."
- `gallery-4.jpg` — 1200×1600 — "Staircase connecting the duplex's two levels, lit by a skylight."

### bukit-timah-house (search: "warm minimalist family home", "landed house interior singapore")

- `cover.jpg` — 1600×1200 — "Ground-floor living space of a landed house opening directly onto a garden, warm minimalist palette."
- `gallery-1.jpg` — 1600×1200 — "Entry axis running from the front door through to the rear garden."
- `gallery-2.jpg` — 1600×1200 — "Kitchen with travertine counters and full-height oak joinery."
- `gallery-3.jpg` — 1200×1600 — "Children's bedroom in a simple, durable warm-neutral palette."
- `gallery-4.jpg` — 1600×1200 — "Family bathroom finished in travertine with brushed brass fittings."
- `gallery-5.jpg` — 1600×1200 — "Garden-facing dining area with lime-plastered walls."

### sentosa-cove-villa (search: "resort style villa interior", "indoor outdoor living pool house")

- `cover.jpg` — 1600×1200 — "Resort-style villa living room opening fully onto a pool terrace through a pivoting glass wall."
- `gallery-1.jpg` — 1600×1200 — "Pool terrace seen from the living room through the fully opened glass wall."
- `gallery-2.jpg` — 1600×1200 — "Outdoor lounge furniture in teak and natural fibre beside the pool."
- `gallery-3.jpg` — 1600×1200 — "Guest wing living area with its own outdoor access."
- `gallery-4.jpg` — 1200×1600 — "Principal bedroom with sliding doors onto a private terrace."

### tanjong-pagar-loft (search: "small apartment clever storage", "compact loft interior design")

- `cover.jpg` — 1600×1200 — "Compact apartment living area with a continuous timber joinery wall concealing a fold-down guest bed and desk."
- `gallery-1.jpg` — 1600×1200 — "Full-height joinery wall with the guest bed folded away."
- `gallery-2.jpg` — 1600×1200 — "Widened kitchen counter with a two-seat breakfast bar."
- `gallery-3.jpg` — 1200×1600 — "Fold-down home office desk built into the entry joinery."
- `gallery-4.jpg` — 1600×1200 — "Compact bathroom with space-efficient fittings."

### amoy-street-cafe (search: "moody cafe interior", "tactile materials restaurant fitout")

- `cover.jpg` — 1600×1200 — "Moody café interior with a lime-plastered counter, blackened steel shelving, and dark terracotta flooring."
- `gallery-1.jpg` — 1600×1200 — "Lime-plastered service counter with blackened steel shelving behind it."
- `gallery-2.jpg` — 1600×1200 — "Café seating area in dark terracotta tile under warm, low lighting."
- `gallery-3.jpg` — 1600×1200 — "Widened kitchen pass connecting baristas to the seating area."
- `gallery-4.jpg` — 1600×1200 — "Detail of the felt-lined ceiling void above the steel shelving."

**Total: 2 standalone + 6 covers + 27 gallery images = 35 files.** (More than the ~15 estimated
in the PRD once every project's full 4–6-image gallery is counted — reusing 2–3 similar-toned
shots per project from the same search term is fine; they don't need to be unique locations.)
```

- [ ] **Step 3: Confirm `astro.config.mjs`'s sitemap + site URL are already correct**

Re-check Task 1's `astro.config.mjs`: `site: "https://studioruang.kevinciang.com"` and `sitemap()` integration are already present — no change needed here, just verify with:

Run: `npm run build && ls dist/sitemap-index.xml`
Expected: file exists.

- [ ] **Step 4: Commit**

```bash
git add supabase/schema.sql IMAGES.md
git commit -m "docs: supabase schema and image manifest"
```

---

### Task 19: GitHub Actions deploy workflow

**Files:**

- Create: `.github/workflows/deploy.yml`

**Interfaces:**

- None — CI config, verified by review (valid YAML, matches the Vercel CLI prebuilt flow) rather than a test.

- [ ] **Step 1: Write `.github/workflows/deploy.yml`**

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Install Vercel CLI
        run: npm install --global vercel@latest

      - name: Pull Vercel environment
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

      - name: Build project artifacts
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}

      - name: Deploy to Vercel
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

- [ ] **Step 2: Validate YAML**

Run: `python3 -c "import yaml,sys; yaml.safe_load(open('.github/workflows/deploy.yml'))"` (or any YAML linter available)
Expected: no error.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: add Vercel prebuilt deploy workflow"
```

---

### Task 20: CLAUDE.md, README.md, and final verification

**Files:**

- Create: `CLAUDE.md`, `README.md`

**Interfaces:**

- None — this task closes the plan.

- [ ] **Step 1: Write `CLAUDE.md`**

````markdown
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
  re-validated server-side in the API route.
- `@supabase/supabase-js`, server-only client (`src/lib/supabase.ts`), service-role key never
  imported into an island.

## Conventions

- Islands hydrate with `client:visible` (none are above the fold at first paint). Never use
  `client:load` without a specific reason, and document the reason inline if you do.
- One `<h1>` per page. Semantic landmarks (`header`, `nav`, `main`, `footer`). Skip-to-content
  link in `BaseLayout.astro`. Every `<img>`/`<Image>` has real, descriptive alt text — check
  `IMAGES.md` before writing new ones.
- Scroll reveals are the shared `ScrollReveal.astro` inline script + `.reveal` class — never a
  new IntersectionObserver per component, and never a React island for this.
- Accessibility baseline: WCAG AA contrast (the token palette is chosen to clear this), full
  keyboard operability (filter, lightbox, mobile menu), visible focus rings (`:focus-visible` in
  `global.css`).
- Performance baseline: self-hosted, optimized images; minimal JS (3 islands total); target
  Lighthouse ≥ 95 in all four categories.
- Commit small, working slices; branch off `main` for feature work, never commit straight to
  `main` for anything non-trivial.

## Commands

```bash
npm run dev       # local dev server
npm run build     # production build (must be zero type/lint errors before merging)
npm run preview   # preview the production build
npm run lint      # eslint
npm run format    # prettier --write
npm run test      # vitest run
```
````

````

- [ ] **Step 2: Write `README.md`**

```markdown
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
````

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
npm run test     # vitest — schemas, islands, API route, layout/page structure
npm run lint      # eslint
npm run format    # prettier --write
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

````

- [ ] **Step 3: Run full verification suite**

Run: `npm run build`
Expected: succeeds, zero type errors.

Run: `npm run lint`
Expected: zero errors.

Run: `npm run format -- --check`
Expected: no unformatted files (run `npm run format` first if it reports any, then re-check).

Run: `npm run test`
Expected: all tests across every task pass.

- [ ] **Step 4: Self-review against the Definition of Done**

Check off each item from the prompt doc's Definition of Done against the actual repo:
- `npm run build` succeeds with zero type and lint errors. ✅ (Step 3)
- All 6 project detail pages render statically. ✅ (Task 14, Step 9)
- Filter, form, and lightbox work and are keyboard accessible. ✅ (Tasks 9–11 tests)
- No placeholder text anywhere; every image slot has a manifest entry and real alt text. ✅
  (cross-check every `src="/images/..."` in `src/` has a matching row in `IMAGES.md`)
- Reasonable expectation of Lighthouse ≥ 95 in all four categories — run a manual
  `npx lighthouse http://localhost:4321 --view` against `npm run preview` for a sanity check;
  there's no automated gate for this in CI, note that to the user.
- Vercel Analytics is wired (`<Analytics />` in `BaseLayout.astro`) and `consultation_submitted`
  fires on a successful form submit (Task 10's test asserts this). ✅

- [ ] **Step 5: Commit**

```bash
git add CLAUDE.md README.md
git commit -m "docs: CLAUDE.md and README.md"
````
