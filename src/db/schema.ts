import { date, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
// Relative with an extension so the seed script can load this file in plain Node.
import projectCategory from "./project-category.ts";

// Column names are written in camelCase here; `casing: "snake_case"` in the Drizzle
// client and drizzle.config.ts stores them as snake_case in Postgres.
const projects = pgTable("projects", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: text().notNull(),
  // Optional: personal projects have no company (e.g. title "Facebook", company "Meta").
  company: text(),
  category: projectCategory().notNull(),
  description: text().notNull(),
  skills: text().array().notNull(),
  // Markdown, so future case study pages can include headings, links and images.
  body: text().notNull(),
  imageSrc: text().notNull(),
  imageAlt: text().notNull(),
  imageWidth: integer().notNull(),
  imageHeight: integer().notNull(),
  // Live project link and project date: stored now, shown on future project pages.
  url: text(),
  date: date({ mode: "string" }).notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type Project = typeof projects.$inferSelect;

export default projects;
