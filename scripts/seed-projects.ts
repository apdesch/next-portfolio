// One-off: copies the placeholder projects into an empty projects table.
// Run with `pnpm db:seed`; it refuses to touch a table that already has rows.
import { neon } from "@neondatabase/serverless";
import { count } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import projects from "../src/db/schema.ts";

const createPlaceholderProject = (
  projectNumber: number,
): typeof projects.$inferInsert => ({
  title: `Placeholder Project ${projectNumber}`,
  company: null,
  category: "app",
  description: "One-line description of the project.",
  skills: ["React", "TypeScript"],
  body: "Placeholder text: what the project is, the problem it solved and my role in building it.",
  imageSrc: "https://placehold.co/1200x800/png",
  imageAlt: `Placeholder project ${projectNumber}`,
  imageWidth: 1200,
  imageHeight: 800,
  url: null,
  // Newest first on the page, so project 1 gets the latest date to keep today's order.
  date: `2026-0${4 - projectNumber}-01`,
});

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is missing.");

const database = drizzle({ client: neon(databaseUrl), casing: "snake_case" });
const [existing] = await database.select({ rows: count() }).from(projects);

if (existing.rows > 0) {
  console.log(`projects already has ${existing.rows} rows; nothing seeded.`);
} else {
  const inserted = await database
    .insert(projects)
    .values([1, 2, 3].map(createPlaceholderProject))
    .returning({ id: projects.id, title: projects.title });
  console.log(`Seeded ${inserted.length} projects:`, inserted);
}
