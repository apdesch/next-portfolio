"use client";

import Link from "next/link";
import {
  type FC,
  type FormEvent,
  startTransition,
  useActionState,
} from "react";
import ButtonLabel from "@/components/admin/button-label";
import ConfirmDeleteButton from "@/components/admin/confirm-delete-button";
import FormField from "@/components/admin/form-field";
import GalleryCategoryField from "@/components/admin/gallery-category-field";
import ImagePickerField from "@/components/admin/image-picker-field";
import type { GalleryPhoto } from "@/db/tables/gallery-photos";
import adminInputClassName from "@/lib/admin-input-class-name";
import checkImageFile from "@/lib/check-image-file";
import type { GalleryPhotoFormState } from "@/lib/gallery-photo-form-schema";
import getUploadedFile from "@/lib/get-uploaded-file";

type GalleryPhotoFormProps = {
  photo: GalleryPhoto;
  categories: string[];
  savePhoto: (
    previousState: GalleryPhotoFormState,
    formData: FormData,
  ) => Promise<GalleryPhotoFormState>;
  deletePhoto: () => Promise<void>;
};

const initialFormState: GalleryPhotoFormState = {
  fieldErrors: {},
  isSaved: false,
};

const GalleryPhotoForm: FC<GalleryPhotoFormProps> = ({
  photo,
  categories,
  savePhoto,
  deletePhoto,
}) => {
  const [state, submitPhoto, isPending] = useActionState(
    savePhoto,
    initialFormState,
  );
  const hasErrors = Object.keys(state.fieldErrors).length > 0;

  // Submits without the form `action` prop, so React doesn't reset the fields after saving.
  // The image picker already shows why a chosen image can't be used.
  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const imageFile = getUploadedFile(formData, "image");
    if (imageFile && checkImageFile(imageFile, false)) return;
    startTransition(() => submitPhoto(formData));
  };

  return (
    <div className="rounded-lg border border-admin-dark/10 bg-white/50 dark:border-admin-light/10 dark:bg-admin-light/5">
      <form
        id="gallery-photo-form"
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-5 p-6"
      >
        <ImagePickerField
          currentImageSrc={photo.src}
          serverErrorMessage={state.fieldErrors.image}
          isSaved={state.isSaved}
        />
        <FormField
          name="alt"
          label="Description (alt text)"
          errorMessage={state.fieldErrors.alt}
        >
          <input
            id="alt"
            name="alt"
            defaultValue={photo.alt}
            aria-invalid={state.fieldErrors.alt ? true : undefined}
            aria-describedby={state.fieldErrors.alt ? "alt-error" : undefined}
            className={adminInputClassName}
          />
        </FormField>
        <GalleryCategoryField
          categories={categories}
          defaultValue={photo.category}
          errorMessage={state.fieldErrors.category}
        />
      </form>
      <div className="flex items-center gap-3 border-t border-admin-dark/10 px-6 py-4 dark:border-admin-light/10">
        <ConfirmDeleteButton
          popoverId="delete-gallery-photo"
          title="Delete this photo?"
          confirmDelete={deletePhoto}
        >
          It comes off the home page and out of storage. It can&rsquo;t be
          undone.
        </ConfirmDeleteButton>
        <p
          role="status"
          className="m-0 ml-auto text-sm text-admin-dark/70 dark:text-admin-light/70"
        >
          {state.isSaved && !isPending && "Saved"}
          {hasErrors && !isPending && "Check the highlighted fields."}
        </p>
        <Link
          href="/admin/gallery"
          className="rounded-md px-4 py-2 text-sm hover:bg-admin-dark/5 dark:hover:bg-admin-light/10"
        >
          Cancel
        </Link>
        <button
          type="submit"
          form="gallery-photo-form"
          disabled={isPending}
          className="rounded-md bg-admin-accent px-4 py-2 text-sm font-medium text-white enabled:hover:bg-admin-accent/90 disabled:opacity-60 dark:bg-admin-accent-dark dark:text-admin-dark dark:enabled:hover:bg-admin-accent-dark/90"
        >
          <ButtonLabel isBusy={isPending} label="Save" busyLabel="Saving…" />
        </button>
      </div>
    </div>
  );
};

export default GalleryPhotoForm;
