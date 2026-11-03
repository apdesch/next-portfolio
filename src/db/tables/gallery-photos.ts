import { integer, pgTable, text } from "drizzle-orm/pg-core";
import timestamps from "./timestamps.ts";

// No titles or descriptions: gallery photos are image-only.
const galleryPhotos = pgTable("gallery_photos", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  src: text().notNull(),
  alt: text().notNull(),
  // Needed for the justified rows and to reserve space while photos load.
  width: integer().notNull(),
  height: integer().notNull(),
  // The gallery this photo belongs to; each category is shown as one gallery.
  category: text().notNull(),
  position: integer().notNull(),
  ...timestamps,
});

export type GalleryPhoto = typeof galleryPhotos.$inferSelect;

export default galleryPhotos;
