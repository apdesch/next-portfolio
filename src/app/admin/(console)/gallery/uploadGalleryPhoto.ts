"use server";

import { revalidateTag } from "next/cache";
import type { UploadOneResult } from "@/components/admin/MultiFileUploadForm";
import getDb from "@/db/getDb";
import getNextPositionSql from "@/db/getNextPositionSql";
import galleryPhotos from "@/db/tables/galleryPhotos";
import checkImageFile from "@/lib/checkImageFile";
import getAltTextFromFileName from "@/lib/getAltTextFromFileName";
import getUploadedFile from "@/lib/getUploadedFile";
import requireAdminSession from "@/lib/requireAdminSession";
import storeImage from "@/lib/storeImage";

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

  await getDb()
    .insert(galleryPhotos)
    .values({
      ...storedImage.image,
      alt: getAltTextFromFileName(file.name),
      category,
      position: getNextPositionSql(galleryPhotos, galleryPhotos.position),
    });
  // Marks the public gallery stale without re-rendering this page for every file in a
  // batch; the upload form refreshes the page once at the end.
  revalidateTag("gallery-photos", "max");
  return { errorMessage: null };
};

export default uploadGalleryPhoto;
