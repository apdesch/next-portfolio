"use client";

import { type FC, type FormEvent, useActionState, useState } from "react";
import uploadFile, {
  type UploadFileState,
} from "@/app/admin/(console)/files/upload-file";
import getUploadedFile from "@/lib/get-uploaded-file";
import maximumUploadBytes from "@/lib/maximum-upload-bytes";

const initialUploadState: UploadFileState = {
  errorMessage: null,
  uploadedFileName: null,
};

// The form's own action clears the file picker after each upload, which suits this form.
const FileUploadForm: FC = () => {
  const [state, submitUpload, isPending] = useActionState(
    uploadFile,
    initialUploadState,
  );
  const [browserError, setBrowserError] = useState<string | null>(null);
  const errorMessage = browserError ?? state.errorMessage;

  // An oversized file would make the server reject the whole request, so stop it here.
  const checkFileSize = (event: FormEvent<HTMLFormElement>): void => {
    const file = getUploadedFile(new FormData(event.currentTarget), "file");
    const isTooLarge = file !== null && file.size > maximumUploadBytes;
    setBrowserError(isTooLarge ? "Choose a file under 4 MB." : null);
    if (isTooLarge) event.preventDefault();
  };

  return (
    <form
      action={submitUpload}
      onSubmit={checkFileSize}
      className="flex flex-col gap-3 rounded-lg border border-admin-dark/10 bg-white/50 p-6 @xl:flex-row @xl:items-center dark:border-admin-light/10 dark:bg-admin-light/5"
    >
      <div className="min-w-0 flex-1">
        <label htmlFor="file" className="mb-1 block text-sm font-medium">
          Upload a file
        </label>
        <input
          id="file"
          name="file"
          type="file"
          accept=".pdf,.txt,.md,.ts,.js,.py"
          aria-invalid={errorMessage ? true : undefined}
          aria-describedby="file-hint file-status"
          className="w-full text-sm file:mr-3 file:rounded-md file:border file:border-admin-dark/20 file:bg-white file:px-3 file:py-2 dark:file:border-admin-light/20 dark:file:bg-admin-light/10 dark:file:text-admin-light"
        />
        <p id="file-hint" className="mt-1 mb-0 text-sm opacity-70">
          PDF, .txt, .md, .ts, .js or .py, up to 4 MB.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <p
          id="file-status"
          role="status"
          className={`m-0 text-sm ${errorMessage ? "text-red-700 dark:text-red-400" : "opacity-70"}`}
        >
          {!isPending && errorMessage}
          {!isPending &&
            !errorMessage &&
            state.uploadedFileName &&
            `Uploaded ${state.uploadedFileName}`}
        </p>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-admin-accent px-4 py-2 text-sm font-medium text-white hover:bg-admin-accent/90 disabled:opacity-60 dark:bg-admin-accent-dark dark:text-admin-dark dark:hover:bg-admin-accent-dark/90"
        >
          {isPending ? "Uploading…" : "Upload"}
        </button>
      </div>
    </form>
  );
};

export default FileUploadForm;
