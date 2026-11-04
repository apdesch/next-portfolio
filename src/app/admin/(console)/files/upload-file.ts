"use server";

import { put } from "@vercel/blob";
import { refresh } from "next/cache";
import getDb from "@/db/client";
import files from "@/db/tables/files";
import checkUploadedFile from "@/lib/check-uploaded-file";
import createFileThumbnail from "@/lib/create-file-thumbnail";
import getSafeFileName from "@/lib/get-safe-file-name";
import getUploadedFile from "@/lib/get-uploaded-file";
import requireAdminSession from "@/lib/require-admin-session";

export type UploadFileState = {
  errorMessage: string | null;
  uploadedFileName: string | null;
};

const getFailedUpload = (errorMessage: string): UploadFileState => ({
  errorMessage,
  uploadedFileName: null,
});

const createThumbnailOrNull = async (
  kind: "pdf" | "text",
  bytes: Uint8Array,
): Promise<Buffer | null> => {
  try {
    return await createFileThumbnail(kind, bytes);
  } catch {
    return null;
  }
};

const uploadFile = async (
  _previousState: UploadFileState,
  formData: FormData,
): Promise<UploadFileState> => {
  await requireAdminSession();
  const file = getUploadedFile(formData, "file");
  if (!file) return getFailedUpload("Choose a file to upload.");

  const fileBytes = new Uint8Array(await file.arrayBuffer());
  const checkedFile = checkUploadedFile(file.name, fileBytes);
  if (!checkedFile.isAllowed) return getFailedUpload(checkedFile.errorMessage);

  const thumbnail = await createThumbnailOrNull(checkedFile.kind, fileBytes);
  if (!thumbnail) return getFailedUpload("That PDF couldn't be read.");

  const safeName = getSafeFileName(file.name);
  const [storedFile, storedThumbnail] = await Promise.all([
    put(`files/${safeName}.${checkedFile.extension}`, Buffer.from(fileBytes), {
      access: "public",
      addRandomSuffix: true,
      contentType: checkedFile.contentType,
    }),
    put(`files/thumbnails/${safeName}.webp`, thumbnail, {
      access: "public",
      addRandomSuffix: true,
      contentType: "image/webp",
    }),
  ]);
  await getDb().insert(files).values({
    name: file.name,
    url: storedFile.url,
    thumbnailUrl: storedThumbnail.url,
    contentType: checkedFile.contentType,
    sizeInBytes: file.size,
  });
  refresh();
  return { errorMessage: null, uploadedFileName: file.name };
};

export default uploadFile;
