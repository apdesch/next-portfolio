"use server";

import { eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { notFound, redirect } from "next/navigation";
import getDb from "@/db/getDb";
import galleryPhotos from "@/db/tables/galleryPhotos";
import deleteStoredFile from "@/lib/deleteStoredFile";
import isValidId from "@/lib/isValidId";
import requireAdminSession from "@/lib/requireAdminSession";

// The edit page binds the photo's ID; the confirmation popover submits it.
const deleteGalleryPhoto = async (photoId: number): Promise<void> => {
  await requireAdminSession();
  if (!isValidId(photoId)) notFound();
  const [deletedPhoto] = await getDb()
    .delete(galleryPhotos)
    .where(eq(galleryPhotos.id, photoId))
    .returning({ src: galleryPhotos.src });
  updateTag("gallery-photos");
  if (deletedPhoto) await deleteStoredFile(deletedPhoto.src);
  redirect("/admin/gallery");
};

export default deleteGalleryPhoto;
