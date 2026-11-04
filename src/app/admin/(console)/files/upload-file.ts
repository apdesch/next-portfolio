"use server";

import { put } from "@vercel/blob";
import { refresh } from "next/cache";
import type { UploadOneResult } from "@/components/admin/multi-file-upload-form";
import getDb from "@/db/client";
import files from "@/db/tables/files";
import checkUploadedFile from "@/lib/check-uploaded-file";
import createFileThumbnail from "@/lib/create-file-thumbnail";
import getSafeFileName from "@/lib/get-safe-file-name";
import getUploadedFile from "@/lib/get-uploaded-file";
import requireAdminSession from "@/lib/require-admin-session";

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
  refresh();
  return { errorMessage: null };
};

export default uploadFile;
