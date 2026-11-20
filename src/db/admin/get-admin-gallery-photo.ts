import "server-only";
import { eq } from "drizzle-orm";
import getDb from "@/db/client";
import galleryPhotos, { type GalleryPhoto } from "@/db/tables/gallery-photos";
import isValidId from "@/lib/is-valid-id";
import requireAdminSession from "@/lib/require-admin-session";

const getAdminGalleryPhoto = async (
  photoId: number,
): Promise<GalleryPhoto | null> => {
  await requireAdminSession();
  if (!isValidId(photoId)) return null;
  const [photo] = await getDb()
    .select()
    .from(galleryPhotos)
    .where(eq(galleryPhotos.id, photoId));
  return photo ?? null;
};

export default getAdminGalleryPhoto;
