import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import getResumeFile from "@/db/getResumeFile";

// The current resume's bytes, fetched from storage once and cached until the admin changes
// the resume (updateTag("resume-file")), so /resume.pdf can be served as a static file
// instead of streaming the PDF through a server function on every view.
const getResumePdf = async (): Promise<Uint8Array<ArrayBuffer> | null> => {
  "use cache";
  cacheLife("max");
  cacheTag("resume-file");

  const resumeFile = await getResumeFile();
  if (!resumeFile) return null;
  const storedResume = await fetch(resumeFile.url);
  // A missing file mustn't fail the build (and so every deploy); /resume.pdf says there's
  // no resume until the admin marks one again, which refreshes this cache.
  if (!storedResume.ok) {
    console.error(
      `The resume at ${resumeFile.url} couldn't be loaded (${storedResume.status}).`,
    );
    return null;
  }
  return new Uint8Array(await storedResume.arrayBuffer());
};

export default getResumePdf;
