// Turns an uploaded file's name into a short, URL-safe name for storage, without its
// extension ("My Photo (1).JPG" becomes "my-photo-1"). Storage adds a random suffix.
const getSafeFileName = (fileName: string): string => {
  // The extension can't contain a slash, so "../etc/passwd" keeps its whole name.
  const baseName = fileName.replace(/\.[^./\\]*$/, "");
  const safeName = baseName
    // Splits "é" into "e" plus an accent mark, then drops the mark.
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/, "");
  return safeName === "" ? "file" : safeName;
};

export default getSafeFileName;
