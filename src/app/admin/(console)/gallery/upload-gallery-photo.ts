"use server";

import { max } from "drizzle-orm";
import { refresh, updateTag } from "next/cache";
import type { UploadOneResult } from "@/components/admin/multi-file-upload-form";
import getDb from "@/db/client";
import galleryPhotos from "@/db/tables/gallery-photos";
import checkImageFile from "@/lib/check-image-file";
import getAltTextFromFileName from "@/lib/get-alt-text-from-file-name";
import getUploadedFile from "@/lib/get-uploaded-file";
import requireAdminSession from "@/lib/require-admin-session";
import storeImage from "@/lib/store-image";

// Stores one photo at the end of its gallery; the shared upload form calls this once per
// chosen photo, sending the gallery (category) with each.
const uploadGalleryPhoto = async (
  formData: FormData,
): Promise<UploadOneResult> => {
  await requireAdminSession();
  const category = String(formData.get("category") ?? "").trim();
  if (category === "") {
    return { errorMessage: "Choose a gallery or name a new one." };
  }
  const file = getUploadedFile(formData, "file");
  const imageError = checkImageFile(file, true);
  if (imageError || !file) return { errorMessage: imageError };

  const storedImage = await storeImage(file, "gallery");
  if (!storedImage.isStored) return { errorMessage: storedImage.errorMessage };

  const [{ lastPosition }] = await getDb()
    .select({ lastPosition: max(galleryPhotos.position) })
    .from(galleryPhotos);
  await getDb()
    .insert(galleryPhotos)
    .values({
      ...storedImage.image,
      alt: getAltTextFromFileName(file.name),
      category,
      position: (lastPosition ?? 0) + 1,
    });
  updateTag("gallery-photos");
  refresh();
  return { errorMessage: null };
};

export default uploadGalleryPhoto;
