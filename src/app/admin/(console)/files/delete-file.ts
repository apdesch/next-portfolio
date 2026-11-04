"use server";

import { eq } from "drizzle-orm";
import { refresh } from "next/cache";
import { notFound } from "next/navigation";
import getDb from "@/db/client";
import files from "@/db/tables/files";
import deleteStoredFile from "@/lib/delete-stored-file";
import isValidId from "@/lib/is-valid-id";
import requireAdminSession from "@/lib/require-admin-session";

// The Files page binds the file's ID; its confirmation popover submits it.
const deleteFile = async (fileId: number): Promise<void> => {
  await requireAdminSession();
  if (!isValidId(fileId)) notFound();
  const [deletedFile] = await getDb()
    .delete(files)
    .where(eq(files.id, fileId))
    .returning({ url: files.url, thumbnailUrl: files.thumbnailUrl });
  if (deletedFile) {
    await Promise.all([
      deleteStoredFile(deletedFile.url),
      deleteStoredFile(deletedFile.thumbnailUrl),
    ]);
  }
  refresh();
};

export default deleteFile;
