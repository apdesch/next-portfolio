import { integer, pgTable, text } from "drizzle-orm/pg-core";
import timestamps from "./timestamps.ts";

// Documents uploaded on the admin Files page (PDFs and plain text), stored in Vercel Blob.
const files = pgTable("files", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  // The name as uploaded, shown in the admin; the stored name is cleaned up and suffixed.
  name: text().notNull(),
  url: text().notNull().unique(),
  thumbnailUrl: text().notNull(),
  contentType: text().notNull(),
  sizeInBytes: integer().notNull(),
  ...timestamps,
});

export type StoredFile = typeof files.$inferSelect;

export default files;
