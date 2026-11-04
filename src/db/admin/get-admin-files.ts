import "server-only";
import { desc } from "drizzle-orm";
import getDb from "@/db/client";
import files, { type StoredFile } from "@/db/tables/files";
import requireAdminSession from "@/lib/require-admin-session";

// Newest first, checked against the session like every admin read.
const getAdminFiles = async (): Promise<StoredFile[]> => {
  await requireAdminSession();
  return getDb().select().from(files).orderBy(desc(files.createdAt));
};

export default getAdminFiles;
