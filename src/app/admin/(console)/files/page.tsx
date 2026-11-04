import type { Metadata } from "next";
import Image from "next/image";
import { type FC, Suspense } from "react";
import AdminPageLoading from "@/components/admin/admin-page-loading";
import deleteFile from "@/app/admin/(console)/files/delete-file";
import setResumeFile from "@/app/admin/(console)/files/set-resume-file";
import uploadFile from "@/app/admin/(console)/files/upload-file";
import ConfirmDeleteButton from "@/components/admin/confirm-delete-button";
import CopyLinkButton from "@/components/admin/copy-link-button";
import MultiFileUploadForm from "@/components/admin/multi-file-upload-form";
import ResumeToggleButton from "@/components/admin/resume-toggle-button";
import getAdminFiles from "@/db/admin/get-admin-files";
import getAdminProjects from "@/db/admin/get-admin-projects";
import type { Project } from "@/db/tables/projects";

const bytesPerKilobyte = 1024;

const formatFileSize = (sizeInBytes: number): string => {
  const kilobytes = sizeInBytes / bytesPerKilobyte;
  const roundedKilobytes = Math.max(1, Math.round(kilobytes));
  if (kilobytes < bytesPerKilobyte) return `${roundedKilobytes} KB`;
  return `${(kilobytes / bytesPerKilobyte).toFixed(1)} MB`;
};

// "White Paper.PDF" shows as "PDF"; text files are all stored as plain text.
const getFileTypeLabel = (fileName: string): string =>
  (fileName.split(".").pop() ?? "").toUpperCase();

const formatUploadDate = (uploadedAt: Date): string =>
  uploadedAt.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

// Projects whose body links to the file, so deleting it warns about broken links.
const getLinkingProjectTitles = (
  projects: Project[],
  fileUrl: string,
): string[] =>
  projects
    .filter((project) => project.body.includes(fileUrl))
    .map((project) => project.title);

const AdminFilesContent: FC = async () => {
  const [files, projects] = await Promise.all([
    getAdminFiles(),
    getAdminProjects(),
  ]);

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6">
        <h1 className="m-0 text-2xl font-semibold">Files</h1>
        <p className="m-0 text-sm opacity-70">{files.length} files</p>
      </div>
      <MultiFileUploadForm
        label="Upload files"
        accept=".pdf,.txt,.md,.ts,.js,.py"
        hint="PDF, .txt, .md, .ts, .js or .py, up to 4 MB each."
        uploadOne={uploadFile}
      />
      <ul className="m-0 mt-6 grid list-none gap-4 p-0 @xl:grid-cols-3 @4xl:grid-cols-4">
        {files.map((file) => {
          const linkingProjectTitles = getLinkingProjectTitles(
            projects,
            file.url,
          );
          return (
            <li
              key={file.id}
              className="overflow-hidden rounded-lg border border-admin-dark/10 bg-white/50 dark:border-admin-light/10 dark:bg-admin-light/5"
            >
              {/* A page-shaped box; previews of shorter pages show their top. */}
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative block aspect-[8.5/11] border-b border-admin-dark/10 bg-white dark:border-admin-light/10"
              >
                <Image
                  src={file.thumbnailUrl}
                  alt={`Preview of ${file.name}`}
                  fill
                  sizes="(min-width: 54em) 15em, 50vw"
                  className="object-cover object-top"
                />
              </a>
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <h2
                    className="m-0 truncate text-base font-semibold"
                    title={file.name}
                  >
                    {file.name}
                  </h2>
                  {file.isResume && (
                    <span className="shrink-0 rounded-sm bg-admin-accent px-1.5 text-xs font-medium text-white dark:bg-admin-accent-dark dark:text-admin-dark">
                      Resume
                    </span>
                  )}
                </div>
                <p className="m-0 text-sm opacity-70">
                  {getFileTypeLabel(file.name)} ·{" "}
                  {formatFileSize(file.sizeInBytes)} ·{" "}
                  {formatUploadDate(file.createdAt)}
                </p>
                <div className="mt-3 flex items-center gap-4">
                  <CopyLinkButton url={file.url} />
                  <ConfirmDeleteButton
                    popoverId={`delete-file-${file.id}`}
                    title={`Delete ${file.name}?`}
                    confirmDelete={deleteFile.bind(null, file.id)}
                  >
                    {linkingProjectTitles.length > 0 && (
                      <p className="mt-0 mb-2">
                        Linked from {linkingProjectTitles.join(", ")}. Those
                        links will stop working.
                      </p>
                    )}
                    {file.isResume && (
                      <p className="mt-0 mb-2">
                        It&rsquo;s your resume, so the Resume page link goes
                        away too.
                      </p>
                    )}
                    <p className="m-0">It can&rsquo;t be undone.</p>
                  </ConfirmDeleteButton>
                </div>
                {/* Only PDFs can be the resume linked from the public Resume page. */}
                {file.contentType === "application/pdf" && (
                  <div className="mt-2">
                    <ResumeToggleButton
                      isResume={file.isResume}
                      setResume={setResumeFile.bind(
                        null,
                        file.id,
                        !file.isResume,
                      )}
                    />
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

// Its own Suspense boundary, so opening this page from anywhere in the admin shows the
// placeholder at once instead of waiting for its data (see admin-page-loading.tsx).
const AdminFilesPage: FC = () => (
  <Suspense fallback={<AdminPageLoading />}>
    <AdminFilesContent />
  </Suspense>
);

export const metadata: Metadata = { title: "Files" };

export default AdminFilesPage;
