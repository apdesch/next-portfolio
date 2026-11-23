"use client";

import {
  type FC,
  type SubmitEvent,
  startTransition,
  useActionState,
} from "react";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import FormField from "@/components/admin/FormField";
import FormFooter from "@/components/admin/FormFooter";
import GalleryCategoryField from "@/components/admin/GalleryCategoryField";
import ImagePickerField from "@/components/admin/ImagePickerField";
import type { GalleryPhoto } from "@/db/tables/galleryPhotos";
import adminCardClassName from "@/lib/adminCardClassName";
import adminInputClassName from "@/lib/adminInputClassName";
import checkImageFile from "@/lib/checkImageFile";
import type { GalleryPhotoFormState } from "@/lib/parseGalleryPhotoForm";
import getUploadedFile from "@/lib/getUploadedFile";

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
  const handleSubmit = (event: SubmitEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const imageFile = getUploadedFile(formData, "image");
    if (imageFile && checkImageFile(imageFile, false)) return;
    startTransition(() => submitPhoto(formData));
  };

  return (
    <div className={adminCardClassName}>
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
      <FormFooter
        formId="gallery-photo-form"
        cancelHref="/admin/gallery"
        isPending={isPending}
        isSaved={state.isSaved}
        hasErrors={hasErrors}
        deleteButton={
          <ConfirmDeleteButton
            popoverId="delete-gallery-photo"
            title="Delete this photo?"
            confirmDelete={deletePhoto}
          >
            It comes off the home page and out of storage. It can&rsquo;t be
            undone.
          </ConfirmDeleteButton>
        }
      />
    </div>
  );
};

export default GalleryPhotoForm;
