import maximumUploadBytes from "@/lib/maximum-upload-bytes";

const textExtensions = new Set(["txt", "md", "ts", "js", "py"]);

type UploadedFileKind = "pdf" | "text";

type CheckedFile =
  | {
      isAllowed: true;
      kind: UploadedFileKind;
      extension: string;
      contentType: string;
    }
  | { isAllowed: false; errorMessage: string };

const getExtension = (fileName: string): string =>
  fileName.includes(".") ? (fileName.split(".").pop() ?? "").toLowerCase() : "";

// Every PDF starts with "%PDF-".
const hasPdfSignature = (bytes: Uint8Array): boolean =>
  new TextDecoder("latin1").decode(bytes.subarray(0, 5)) === "%PDF-";

// Readable text: valid UTF-8 with no NUL bytes (which only binary files contain).
const isReadableText = (bytes: Uint8Array): boolean => {
  if (bytes.includes(0)) return false;
  try {
    new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    return true;
  } catch {
    return false;
  }
};

// Judges a file by its contents, not just its name. Text files are always served as plain
// text, so a .js or .py file opens as readable code instead of running or downloading.
const checkUploadedFile = (
  fileName: string,
  bytes: Uint8Array,
): CheckedFile => {
  const extension = getExtension(fileName);
  if (bytes.length > maximumUploadBytes) {
    return { isAllowed: false, errorMessage: "Choose a file under 4 MB." };
  }
  if (extension === "pdf") {
    if (!hasPdfSignature(bytes)) {
      return { isAllowed: false, errorMessage: "That file isn't a real PDF." };
    }
    return {
      isAllowed: true,
      kind: "pdf",
      extension,
      contentType: "application/pdf",
    };
  }
  if (!textExtensions.has(extension)) {
    return {
      isAllowed: false,
      errorMessage: "Choose a PDF, .txt, .md, .ts, .js or .py file.",
    };
  }
  if (!isReadableText(bytes)) {
    return {
      isAllowed: false,
      errorMessage: "That file isn't plain text.",
    };
  }
  return {
    isAllowed: true,
    kind: "text",
    extension,
    contentType: "text/plain; charset=utf-8",
  };
};

export default checkUploadedFile;
