import { z } from "zod";
import getFirstFieldErrors from "@/lib/get-first-field-errors";

const galleryPhotoFormSchema = z.object({
  alt: z
    .string({ error: "Describe the photo for screen readers." })
    .trim()
    .min(1, "Describe the photo for screen readers."),
  // Each category is one gallery on the home page.
  category: z
    .string({ error: "Choose a gallery or name a new one." })
    .trim()
    .min(1, "Choose a gallery or name a new one."),
});

type GalleryPhotoFormValues = z.output<typeof galleryPhotoFormSchema>;

// The image is checked separately (see check-image-file.ts) but reports errors the same way.
type GalleryPhotoFormErrors = Partial<
  Record<keyof GalleryPhotoFormValues | "image", string>
>;

export type GalleryPhotoFormState = {
  fieldErrors: GalleryPhotoFormErrors;
  isSaved: boolean;
};

type GalleryPhotoFormResult =
  | { isValid: true; values: GalleryPhotoFormValues }
  | { isValid: false; fieldErrors: GalleryPhotoFormErrors };

const parseGalleryPhotoForm = (formData: FormData): GalleryPhotoFormResult => {
  const result = galleryPhotoFormSchema.safeParse({
    alt: formData.get("alt"),
    category: formData.get("category"),
  });
  if (result.success) return { isValid: true, values: result.data };
  return {
    isValid: false,
    fieldErrors: getFirstFieldErrors(z.flattenError(result.error).fieldErrors),
  };
};

export default parseGalleryPhotoForm;
