"use server";

import { eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { notFound } from "next/navigation";
import getDb from "@/db/getDb";
import galleryPhotos from "@/db/tables/galleryPhotos";
import checkImageFile from "@/lib/checkImageFile";
import deleteStoredFile from "@/lib/deleteStoredFile";
import parseGalleryPhotoForm, {
  type GalleryPhotoFormState,
} from "@/lib/parseGalleryPhotoForm";
import getFailedFormState from "@/lib/getFailedFormState";
import getUploadedFile from "@/lib/getUploadedFile";
import isValidId from "@/lib/isValidId";
import requireAdminSession from "@/lib/requireAdminSession";
import storeImage from "@/lib/storeImage";

// The edit page binds the photo's ID. Without a new image, the photo keeps its current one.
const updateGalleryPhoto = async (
  photoId: number,
  _previousState: GalleryPhotoFormState,
  formData: FormData,
): Promise<GalleryPhotoFormState> => {
  await requireAdminSession();
  if (!isValidId(photoId)) notFound();
  const result = parseGalleryPhotoForm(formData);
  const imageFile = getUploadedFile(formData, "image");
  const imageError = checkImageFile(imageFile, false);
  if (!result.isValid || imageError) {
    return getFailedFormState(result, imageError);
  }

  const [existingPhoto] = await getDb()
    .select({ src: galleryPhotos.src })
    .from(galleryPhotos)
    .where(eq(galleryPhotos.id, photoId));
  if (!existingPhoto) notFound();

  const storedImage = imageFile ? await storeImage(imageFile, "gallery") : null;
  if (storedImage && !storedImage.isStored) {
    return { fieldErrors: { image: storedImage.errorMessage }, isSaved: false };
  }

  await getDb()
    .update(galleryPhotos)
    .set({ ...result.values, ...(storedImage?.isStored && storedImage.image) })
    .where(eq(galleryPhotos.id, photoId));
  updateTag("gallery-photos");
  if (storedImage) await deleteStoredFile(existingPhoto.src);
  return { fieldErrors: {}, isSaved: true };
};

export default updateGalleryPhoto;
