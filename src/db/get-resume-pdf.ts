import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import getResumeFile from "@/db/get-resume-file";

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
  if (!storedResume.ok) {
    throw new Error(`The resume couldn't be loaded (${storedResume.status}).`);
  }
  return new Uint8Array(await storedResume.arrayBuffer());
};

export default getResumePdf;
