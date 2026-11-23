import "server-only";
import { del } from "@vercel/blob";
import isOwnStoredFile from "@/lib/isOwnStoredFile";

// Deletes a file only if it's in this deployment's own store (see isOwnStoredFile.ts).
// Runs after the database change, so a failed delete leaves an unused file behind rather
// than a project pointing at a missing image.
const deleteStoredFile = async (url: string): Promise<void> => {
  if (!isOwnStoredFile(url, process.env)) return;
  await del(url);
};

export default deleteStoredFile;
