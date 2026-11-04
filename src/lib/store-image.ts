import "server-only";
import { put } from "@vercel/blob";
import sharp, { type Metadata } from "sharp";
import getSafeFileName from "@/lib/get-safe-file-name";

const maximumImageEdgePixels = 2400;

type StoredImage = { src: string; width: number; height: number };

type StoreImageResult =
  | { isStored: true; image: StoredImage }
  | { isStored: false; errorMessage: string };

// Storage folders: project images and gallery photos.
type ImageFolder = "projects" | "gallery";

// sharp reports AVIF as "heif" with AV1 compression.
const isAcceptedImageFormat = (metadata: Metadata): boolean =>
  ["jpeg", "png", "webp"].includes(metadata.format ?? "") ||
  (metadata.format === "heif" && metadata.compression === "av1");

// Decoding proves the file really is an image. Re-saving as WebP drops all hidden data,
// including a phone photo's GPS location, turns it the right way up and caps its size.
const createWebpImage = async (fileBytes: Buffer) =>
  sharp(fileBytes)
    .rotate()
    .resize({
      width: maximumImageEdgePixels,
      height: maximumImageEdgePixels,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 85 })
    .toBuffer({ resolveWithObject: true });

const readImageMetadata = async (
  fileBytes: Buffer,
): Promise<Metadata | null> => {
  try {
    return await sharp(fileBytes).metadata();
  } catch {
    return null;
  }
};

const storeImage = async (
  file: File,
  folder: ImageFolder,
): Promise<StoreImageResult> => {
  const fileBytes = Buffer.from(await file.arrayBuffer());
  const metadata = await readImageMetadata(fileBytes);
  if (!metadata || !isAcceptedImageFormat(metadata)) {
    return {
      isStored: false,
      errorMessage: "That file isn't a JPEG, PNG, WebP or AVIF image.",
    };
  }

  const webpImage = await createWebpImage(fileBytes);
  const blob = await put(
    `${folder}/${getSafeFileName(file.name)}.webp`,
    webpImage.data,
    { access: "public", addRandomSuffix: true, contentType: "image/webp" },
  );
  return {
    isStored: true,
    image: {
      src: blob.url,
      width: webpImage.info.width,
      height: webpImage.info.height,
    },
  };
};

export default storeImage;
