"use server";

import { put } from "@vercel/blob";
import type { UploadOneResult } from "@/components/admin/MultiFileUploadForm";
import getDb from "@/db/getDb";
import files from "@/db/tables/files";
import checkUploadedFile from "@/lib/checkUploadedFile";
import createFileThumbnail from "@/lib/createFileThumbnail";
import getSafeFileName from "@/lib/getSafeFileName";
import getUploadedFile from "@/lib/getUploadedFile";
import requireAdminSession from "@/lib/requireAdminSession";

const createThumbnailOrNull = async (
  kind: "pdf" | "text",
  bytes: Uint8Array,
): Promise<Buffer | null> => {
  try {
    return await createFileThumbnail(kind, bytes);
  } catch (error) {
    // The form only says the PDF couldn't be read; the server log keeps the real cause.
    console.error("Couldn't make a file thumbnail:", error);
    return null;
  }
};

// Stores one file; the shared upload form calls this once per chosen file.
const uploadFile = async (formData: FormData): Promise<UploadOneResult> => {
  await requireAdminSession();
  const file = getUploadedFile(formData, "file");
  if (!file) return { errorMessage: "Choose a file to upload." };

  const fileBytes = new Uint8Array(await file.arrayBuffer());
  const checkedFile = checkUploadedFile(file.name, fileBytes);
  if (!checkedFile.isAllowed) return { errorMessage: checkedFile.errorMessage };

  const thumbnail = await createThumbnailOrNull(checkedFile.kind, fileBytes);
  if (!thumbnail) return { errorMessage: "That PDF couldn't be read." };

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
  // No refresh here: the upload form refreshes the page once after the whole batch.
  return { errorMessage: null };
};

export default uploadFile;
