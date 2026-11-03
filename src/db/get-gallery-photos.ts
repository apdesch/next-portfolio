import "server-only";
import { asc } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import getDb from "@/db/client";
import galleryPhotos, { type GalleryPhoto } from "@/db/tables/gallery-photos";

// Cached until the admin area calls updateTag("gallery-photos") after an edit (stage 3).
const getGalleryPhotos = async (): Promise<GalleryPhoto[]> => {
  "use cache";
  cacheLife("max");
  cacheTag("gallery-photos");

  return getDb()
    .select()
    .from(galleryPhotos)
    .orderBy(asc(galleryPhotos.position));
};

export default getGalleryPhotos;
