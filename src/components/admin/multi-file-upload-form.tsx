"use client";

import {
  type ChangeEvent,
  type FC,
  type FormEvent,
  type ReactNode,
  useRef,
  useState,
  useTransition,
} from "react";
import maximumUploadBytes from "@/lib/maximum-upload-bytes";

export type UploadOneResult = { errorMessage: string | null };

type FailedUpload = { fileName: string; errorMessage: string };

type UploadSummary = { uploadedCount: number; failedUploads: FailedUpload[] };

type UploadProgress = { currentNumber: number; totalCount: number };

type MultiFileUploadFormProps = {
  label: string;
  accept: string;
  hint: string;
  // A Server Action that stores one file, sent as "file" with any extra fields.
  uploadOne: (formData: FormData) => Promise<UploadOneResult>;
  // Extra fields sent with every file, such as the gallery's category.
  children?: ReactNode;
};

const getPlural = (count: number, noun: string): string =>
  `${count} ${noun}${count === 1 ? "" : "s"}`;

// Each file goes in its own request, one after another, which keeps every request under
// Vercel's 4.5 MB limit. Oversized files are stopped here, since the server would reject
// the whole request.
const MultiFileUploadForm: FC<MultiFileUploadFormProps> = ({
  label,
  accept,
  hint,
  uploadOne,
  children,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFileCount, setSelectedFileCount] = useState(0);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [summary, setSummary] = useState<UploadSummary | null>(null);
  const [isUploading, startUpload] = useTransition();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSelectedFileCount(event.currentTarget.files?.length ?? 0);
    setSummary(null);
  };

  const uploadFile = async (
    file: File,
    extraFields: [string, FormDataEntryValue][],
  ): Promise<FailedUpload | null> => {
    if (file.size > maximumUploadBytes) {
      return { fileName: file.name, errorMessage: "It's over 4 MB." };
    }
    const formData = new FormData();
    extraFields.forEach(([name, value]) => formData.append(name, value));
    formData.append("file", file);
    const { errorMessage } = await uploadOne(formData);
    return errorMessage ? { fileName: file.name, errorMessage } : null;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const files = [...(fileInputRef.current?.files ?? [])];
    const extraFields = [...new FormData(event.currentTarget)].filter(
      ([name]) => name !== "file",
    );
    startUpload(async () => {
      const failedUploads = await files.reduce<Promise<FailedUpload[]>>(
        async (previousFailures, file, fileIndex) => {
          const failures = await previousFailures;
          setProgress({
            currentNumber: fileIndex + 1,
            totalCount: files.length,
          });
          const failedUpload = await uploadFile(file, extraFields);
          return failedUpload ? [...failures, failedUpload] : failures;
        },
        Promise.resolve([]),
      );
      setProgress(null);
      setSummary({
        uploadedCount: files.length - failedUploads.length,
        failedUploads,
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
      setSelectedFileCount(0);
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-lg border border-admin-dark/10 bg-white/50 p-6 dark:border-admin-light/10 dark:bg-admin-light/5"
    >
      <div className="flex flex-col gap-3 @xl:flex-row @xl:items-end">
        <div className="min-w-0 flex-1">
          <label htmlFor="file" className="mb-1 block text-sm font-medium">
            {label}
          </label>
          <input
            ref={fileInputRef}
            id="file"
            name="file"
            type="file"
            multiple
            accept={accept}
            onChange={handleFileChange}
            aria-describedby="file-hint upload-status"
            className="w-full text-sm file:mr-3 file:rounded-md file:border file:border-admin-dark/20 file:bg-white file:px-3 file:py-2 dark:file:border-admin-light/20 dark:file:bg-admin-light/10 dark:file:text-admin-light"
          />
          <p id="file-hint" className="mt-1 mb-0 text-sm opacity-70">
            {hint}
          </p>
        </div>
        {children}
        <button
          type="submit"
          disabled={selectedFileCount === 0 || isUploading}
          className="rounded-md bg-admin-accent px-4 py-2 text-sm font-medium text-white enabled:hover:bg-admin-accent/90 disabled:opacity-60 dark:bg-admin-accent-dark dark:text-admin-dark dark:enabled:hover:bg-admin-accent-dark/90"
        >
          {isUploading ? "Uploading…" : "Upload"}
        </button>
      </div>
      <div id="upload-status" role="status" className="text-sm">
        {progress && (
          <p className="m-0 opacity-70">
            Uploading {progress.currentNumber} of {progress.totalCount}…
          </p>
        )}
        {summary && summary.uploadedCount > 0 && (
          <p className="m-0 opacity-70">
            Uploaded {getPlural(summary.uploadedCount, "file")}.
          </p>
        )}
        {summary && summary.failedUploads.length > 0 && (
          <ul className="m-0 list-none p-0 text-red-700 dark:text-red-400">
            {summary.failedUploads.map((failedUpload) => (
              <li key={failedUpload.fileName}>
                {failedUpload.fileName} wasn&rsquo;t uploaded:{" "}
                {failedUpload.errorMessage}
              </li>
            ))}
          </ul>
        )}
      </div>
    </form>
  );
};

export default MultiFileUploadForm;
