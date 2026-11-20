"use server";

import { and, eq } from "drizzle-orm";
import { refresh, updateTag } from "next/cache";
import { notFound } from "next/navigation";
import getDb from "@/db/client";
import files from "@/db/tables/files";
import isValidId from "@/lib/is-valid-id";
import requireAdminSession from "@/lib/require-admin-session";

// The Files page binds the file's ID and whether it should be the resume. Only PDFs
// qualify. Clearing the old resume and marking the new one run as one batch (a single
// transaction), and the database allows only one marked file.
const setResumeFile = async (
  fileId: number,
  isResume: boolean,
): Promise<void> => {
  await requireAdminSession();
  if (!isValidId(fileId) || typeof isResume !== "boolean") notFound();
  const database = getDb();

  if (isResume) {
    await database.batch([
      database
        .update(files)
        .set({ isResume: false })
        .where(eq(files.isResume, true)),
      database
        .update(files)
        .set({ isResume: true })
        .where(
          and(eq(files.id, fileId), eq(files.contentType, "application/pdf")),
        ),
    ]);
  } else {
    await database
      .update(files)
      .set({ isResume: false })
      .where(eq(files.id, fileId));
  }
  updateTag("resume-file");
  refresh();
};

export default setResumeFile;
