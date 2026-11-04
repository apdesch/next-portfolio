import maximumUploadBytes from "@/lib/maximum-upload-bytes";

const acceptedImageTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

// A quick check before upload, run in the browser and again on the server. The server
// also decodes the image, which proves it really is one (the type here is self-reported).
const checkImageFile = (
  file: File | null,
  isRequired: boolean,
): string | null => {
  if (!file || file.size === 0) return isRequired ? "Choose an image." : null;
  if (!acceptedImageTypes.has(file.type)) {
    return "Choose a JPEG, PNG, WebP or AVIF image.";
  }
  if (file.size > maximumUploadBytes) {
    return "Choose an image under 4 MB, or resize it first.";
  }
  return null;
};

export default checkImageFile;
