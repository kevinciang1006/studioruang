# Image Manifest — Studio Ruang

Self-host every image under `/public/images/...` at the exact paths below. Source ~15–20
real interior photographs from Unsplash or Pexels (search terms suggested per row) and
drop them in with these filenames — nothing else needs to change.

## Home (`/`)

| Path | Subject | Recommended size | Alt text (already wired into the page) |
|---|---|---|---|
| `/public/images/home/hero.jpg` | Full-bleed living room, warm late-afternoon light, wide shot | 1920×1280 (3:2), eager-loaded LCP image | "Living room bathed in late-afternoon light, a Studio Ruang interior." |

## About (`/about`)

| Path | Subject | Recommended size | Alt text |
|---|---|---|---|
| `/public/images/about/founder-portrait.jpg` | Portrait of a woman in her 40s, natural light, studio/office setting | 800×1000 (4:5) | "Nadia Rahman, founder of Studio Ruang, in the studio's Singapore office." |

## Default social share image

| Path | Subject | Recommended size | Alt text |
|---|---|---|---|
| `/public/images/og-default.jpg` | A representative interior shot (can reuse the home hero image) | 1200×630 | n/a (Open Graph image, no alt attribute) |

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

## Once images are added

No code changes are needed — every `<img>` in the site already references these exact paths.
Just drop files into `/public/images/...` matching the paths above and rebuild.
