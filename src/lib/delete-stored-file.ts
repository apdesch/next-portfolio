import "server-only";
import { del } from "@vercel/blob";

// Only files in Vercel Blob are ours to delete; placeholder images live on placehold.co.
const isStoredFileUrl = (url: string): boolean =>
  URL.canParse(url) &&
  new URL(url).hostname.endsWith(".public.blob.vercel-storage.com");

// Runs after the database change, so a failed delete leaves an unused file behind rather
// than a project pointing at a missing image.
const deleteStoredFile = async (url: string): Promise<void> => {
  if (!isStoredFileUrl(url)) return;
  await del(url);
};

export default deleteStoredFile;
