import "server-only";
import { asc } from "drizzle-orm";
import getDb from "@/db/getDb";
import galleryPhotos, { type GalleryPhoto } from "@/db/tables/galleryPhotos";
import requireAdminSession from "@/lib/requireAdminSession";

// In home page order, checked against the session like every admin read.
const getAdminGalleryPhotos = async (): Promise<GalleryPhoto[]> => {
  await requireAdminSession();
  return getDb()
    .select()
    .from(galleryPhotos)
    .orderBy(asc(galleryPhotos.position));
};

export default getAdminGalleryPhotos;
