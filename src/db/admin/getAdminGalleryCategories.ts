import "server-only";
import { asc, min } from "drizzle-orm";
import getDb from "@/db/getDb";
import galleryPhotos from "@/db/tables/galleryPhotos";
import requireAdminSession from "@/lib/requireAdminSession";

// Just the gallery names, in home page order (each gallery's first photo decides its place),
// so the photo edit page doesn't load every photo to fill its gallery select.
const getAdminGalleryCategories = async (): Promise<string[]> => {
  await requireAdminSession();
  const rows = await getDb()
    .select({ category: galleryPhotos.category })
    .from(galleryPhotos)
    .groupBy(galleryPhotos.category)
    .orderBy(asc(min(galleryPhotos.position)));
  return rows.map((row) => row.category);
};

export default getAdminGalleryCategories;
