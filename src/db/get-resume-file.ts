import "server-only";
import { eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import getDb from "@/db/client";
import files from "@/db/tables/files";

type ResumeFile = { url: string };

// The PDF marked as the resume on the admin Files page, or null. Cached until the admin
// changes it (updateTag("resume-file")), so the Resume page stays static.
const getResumeFile = async (): Promise<ResumeFile | null> => {
  "use cache";
  cacheLife("max");
  cacheTag("resume-file");

  const [resumeFile] = await getDb()
    .select({ url: files.url })
    .from(files)
    .where(eq(files.isResume, true));
  return resumeFile ?? null;
};

export default getResumeFile;
