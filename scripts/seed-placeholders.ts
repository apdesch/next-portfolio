// One-off: fills empty tables with the placeholder content (and the two real videos).
// Run with `pnpm db:seed`; any table that already has rows is left untouched.
import { neon } from "@neondatabase/serverless";
import { count } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import type { PgTable } from "drizzle-orm/pg-core";
import galleryPhotos from "../src/db/tables/gallery-photos.ts";
import projects from "../src/db/tables/projects.ts";
import videos from "../src/db/tables/videos.ts";

// PNG, not placehold.co's default SVG, and no ?text= label (next.config.ts blocks query strings).
const getPlaceholderImageUrl = (width: number, height: number): string =>
  `https://placehold.co/${width}x${height}/png`;

const createPlaceholderProject = (
  projectNumber: number,
): typeof projects.$inferInsert => ({
  title: `Placeholder Project ${projectNumber}`,
  company: null,
  category: "app",
  description: "One-line description of the project.",
  skills: ["React", "TypeScript"],
  body: "Placeholder text: what the project is, the problem it solved and my role in building it.",
  imageSrc: getPlaceholderImageUrl(1200, 800),
  imageAlt: `Placeholder project ${projectNumber}`,
  imageWidth: 1200,
  imageHeight: 800,
  url: null,
  // Newest first on the page, so project 1 gets the latest date to keep today's order.
  date: `2026-0${4 - projectNumber}-01`,
});

const placeholderVideos: (typeof videos.$inferInsert)[] = [
  {
    youtubeUrl: "https://www.youtube.com/watch?v=4-ZZnb3-eOA",
    description: "B-roll footage for coffee roaster spec ad.",
    position: 1,
  },
  {
    youtubeUrl: "https://www.youtube.com/watch?v=_ksmHf2Zd7Y",
    description: "The Palace of Fine Arts in San Francisco shot on an iPhone.",
    position: 2,
  },
];

const placeholderGallerySizes: readonly [
  string,
  readonly [number, number][],
][] = [
  [
    "Placeholder Gallery 1",
    [
      [1200, 800],
      [800, 1200],
      [1000, 1000],
      [1200, 675],
      [900, 1200],
      [1200, 800],
      [1080, 1350],
      [1200, 900],
    ],
  ],
  [
    "Placeholder Gallery 2",
    [
      [1200, 900],
      [1200, 675],
      [800, 1200],
      [1200, 800],
      [1000, 1000],
      [1200, 800],
    ],
  ],
];

// Positions run across all galleries, so gallery order follows each gallery's first photo.
const placeholderGalleryPhotos: (typeof galleryPhotos.$inferInsert)[] =
  placeholderGallerySizes
    .flatMap(([category, sizes]) =>
      sizes.map(([width, height], index) => ({
        src: getPlaceholderImageUrl(width, height),
        alt: `${category} photo ${index + 1}`,
        width,
        height,
        category,
      })),
    )
    .map((photo, index) => ({ ...photo, position: index + 1 }));

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is missing.");

const database = drizzle({ client: neon(databaseUrl), casing: "snake_case" });

const seedTableIfEmpty = async (
  tableName: string,
  table: PgTable,
  rows: Record<string, unknown>[],
): Promise<void> => {
  const [existing] = await database.select({ rows: count() }).from(table);
  if (existing.rows > 0) {
    console.log(`${tableName}: already has ${existing.rows} rows, skipped.`);
    return;
  }
  await database.insert(table).values(rows);
  console.log(`${tableName}: seeded ${rows.length} rows.`);
};

await seedTableIfEmpty(
  "projects",
  projects,
  [1, 2, 3].map(createPlaceholderProject),
);
await seedTableIfEmpty("videos", videos, placeholderVideos);
await seedTableIfEmpty(
  "gallery_photos",
  galleryPhotos,
  placeholderGalleryPhotos,
);
