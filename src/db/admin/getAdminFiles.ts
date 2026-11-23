import "server-only";
import { desc } from "drizzle-orm";
import getDb from "@/db/getDb";
import files, { type StoredFile } from "@/db/tables/files";
import requireAdminSession from "@/lib/requireAdminSession";

// Newest first, checked against the session like every admin read.
const getAdminFiles = async (): Promise<StoredFile[]> => {
  await requireAdminSession();
  return getDb().select().from(files).orderBy(desc(files.createdAt));
};

export default getAdminFiles;
