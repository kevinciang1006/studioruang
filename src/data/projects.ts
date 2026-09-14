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
