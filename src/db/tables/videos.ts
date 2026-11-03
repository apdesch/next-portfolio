import { integer, pgTable, text } from "drizzle-orm/pg-core";
import timestamps from "./timestamps.ts";

const videos = pgTable("videos", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  // The normal YouTube link; the embed URL is derived from it when rendering.
  youtubeUrl: text().notNull(),
  // Shown as the caption and used as the embed's accessible title.
  description: text().notNull(),
  position: integer().notNull(),
  ...timestamps,
});

export type Video = typeof videos.$inferSelect;

export default videos;
