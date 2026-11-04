import type { FC } from "react";
import getResumeFile from "@/db/get-resume-file";

type ResumePdfLinkProps = { label: string; className: string };

// Links to /resume.pdf, which always serves the current resume, in a new tab where the
// browser's PDF viewer opens it. Shows nothing until a PDF is marked as the resume.
const ResumePdfLink: FC<ResumePdfLinkProps> = async ({ label, className }) => {
  const resumeFile = await getResumeFile();
  if (!resumeFile) return null;

  return (
    <a href="/resume.pdf" target="_blank" rel="noopener" className={className}>
      {label}
    </a>
  );
};

export default ResumePdfLink;
