import { connection } from "next/server";
import getResumeFile from "@/db/get-resume-file";

// apdesch.com/resume.pdf always serves the current resume, so the link never goes stale
// when a new version is uploaded. It opens in the browser's PDF viewer under a readable
// name, and browsers check back each time so a new resume shows up right away.
// connection() makes this run on every request instead of being prerendered at build time,
// which would freeze whichever resume (or none) existed then.
export const GET = async (): Promise<Response> => {
  await connection();
  const resumeFile = await getResumeFile();
  if (!resumeFile) return new Response("No resume yet.", { status: 404 });

  const storedResume = await fetch(resumeFile.url);
  if (!storedResume.ok || !storedResume.body) {
    return new Response("The resume couldn't be loaded.", { status: 502 });
  }
  return new Response(storedResume.body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="Adam-Deschamp-Resume.pdf"',
      "Cache-Control": "no-cache",
    },
  });
};
