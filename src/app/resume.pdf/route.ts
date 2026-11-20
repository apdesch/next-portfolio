import getResumePdf from "@/db/get-resume-pdf";

// apdesch.com/resume.pdf always serves the current resume, so the link never goes stale
// when a new version is uploaded. It opens in the browser's PDF viewer under a readable
// name. The response is prerendered and cached like a static file, and replaced whenever
// the admin changes the resume (the "resume-file" cache tag).
export const GET = async (): Promise<Response> => {
  const resumePdf = await getResumePdf();
  if (!resumePdf) return new Response("No resume yet.", { status: 404 });

  return new Response(resumePdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="Adam-Deschamp-Resume.pdf"',
    },
  });
};
