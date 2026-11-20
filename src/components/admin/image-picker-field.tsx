"use client";

import Image from "next/image";
import { type ChangeEvent, type FC, useEffect, useRef, useState } from "react";
import FormField from "@/components/admin/form-field";
import checkImageFile from "@/lib/check-image-file";

type ImagePickerFieldProps = {
  // The stored image, when editing; a new image replaces it only if one is chosen.
  currentImageSrc?: string;
  serverErrorMessage?: string;
  // True after a successful save, which empties the picker (see below).
  isSaved: boolean;
  className?: string;
};

// An "image" file input that checks the chosen image right away and previews it before
// it's uploaded. Forms re-check it on submit, because the server would reject the whole
// request for an oversized file.
const ImagePickerField: FC<ImagePickerFieldProps> = ({
  currentImageSrc,
  serverErrorMessage,
  isSaved,
  className,
}) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [browserError, setBrowserError] = useState<string | null>(null);
  const errorMessage = browserError ?? serverErrorMessage;
  const shownImageSrc = imagePreviewUrl ?? currentImageSrc ?? null;

  // After a save the image is stored, so the picker empties; saving again for a text edit
  // won't upload the same image twice. The preview keeps showing it.
  useEffect(() => {
    const imageInput = imageInputRef.current;
    if (isSaved && imageInput) imageInput.value = "";
  }, [isSaved]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const imageFile = event.currentTarget.files?.[0] ?? null;
    const imageError = checkImageFile(imageFile, false);
    setBrowserError(imageError);
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    setImagePreviewUrl(
      imageFile && !imageError ? URL.createObjectURL(imageFile) : null,
    );
  };

  return (
    <FormField
      name="image"
      label="Image"
      errorMessage={errorMessage}
      className={className}
    >
      <div className="flex items-center gap-4">
        {shownImageSrc && (
          <div className="relative aspect-3/2 w-32 shrink-0 overflow-hidden rounded-md">
            {/* A preview is a local blob: URL, which the image optimizer can't fetch. */}
            <Image
              src={shownImageSrc}
              alt=""
              fill
              sizes="8em"
              unoptimized={imagePreviewUrl !== null}
              className="object-cover"
            />
          </div>
        )}
        <div>
          <input
            ref={imageInputRef}
            id="image"
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={handleImageChange}
            aria-invalid={errorMessage ? true : undefined}
            aria-describedby={
              errorMessage ? "image-error image-hint" : "image-hint"
            }
            className="text-sm file:mr-3 file:rounded-md file:border file:border-admin-dark/20 file:bg-white file:px-3 file:py-2 dark:file:border-admin-light/20 dark:file:bg-admin-light/10 dark:file:text-admin-light"
          />
          <p id="image-hint" className="mt-1 mb-0 text-sm opacity-70">
            JPEG, PNG, WebP or AVIF, up to 4 MB.
            {currentImageSrc && " Leave empty to keep the current image."}
          </p>
        </div>
      </div>
    </FormField>
  );
};

export default ImagePickerField;
