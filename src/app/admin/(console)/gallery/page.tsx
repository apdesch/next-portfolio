import type { Metadata } from "next";
import { type FC, Suspense } from "react";
import AdminPageLoading from "@/components/admin/admin-page-loading";
import deleteGalleryPhoto from "@/app/admin/(console)/gallery/delete-gallery-photo";
import moveGalleryPhoto from "@/app/admin/(console)/gallery/move-gallery-photo";
import uploadGalleryPhoto from "@/app/admin/(console)/gallery/upload-gallery-photo";
import GalleryCategoryField from "@/components/admin/gallery-category-field";
import GalleryPhotoGrid from "@/components/admin/gallery-photo-grid";
import MultiFileUploadForm from "@/components/admin/multi-file-upload-form";
import getAdminGalleryPhotos from "@/db/admin/get-admin-gallery-photos";
import groupPhotosByCategory from "@/lib/group-photos-by-category";

const AdminGalleryContent: FC = async () => {
  const photos = await getAdminGalleryPhotos();
  const galleries = groupPhotosByCategory(photos);
  const categories = galleries.map((gallery) => gallery.category);

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6">
        <h1 className="m-0 text-2xl font-semibold">Gallery</h1>
        <p className="m-0 text-sm opacity-70">
          {photos.length} photos in {galleries.length} galleries, in home page
          order
        </p>
      </div>
      <MultiFileUploadForm
        label="Upload photos"
        accept="image/jpeg,image/png,image/webp,image/avif"
        hint="JPEG, PNG, WebP or AVIF, up to 4 MB each."
        uploadOne={uploadGalleryPhoto}
      >
        <GalleryCategoryField categories={categories} className="@xl:w-56" />
      </MultiFileUploadForm>
      {galleries.map((gallery) => (
        <section key={gallery.category} className="mt-8">
          <h2 className="mt-0 mb-3 text-lg font-semibold">
            {gallery.category}{" "}
            <span className="text-sm font-normal opacity-60">
              ({gallery.photos.length})
            </span>
          </h2>
          <GalleryPhotoGrid
            photos={gallery.photos}
            movePhoto={moveGalleryPhoto}
            deletePhoto={deleteGalleryPhoto}
          />
        </section>
      ))}
    </div>
  );
};

// Its own Suspense boundary, so opening this page from anywhere in the admin shows the
// placeholder at once instead of waiting for its data (see admin-page-loading.tsx).
const AdminGalleryPage: FC = () => (
  <Suspense fallback={<AdminPageLoading />}>
    <AdminGalleryContent />
  </Suspense>
);

export const metadata: Metadata = { title: "Gallery" };

export default AdminGalleryPage;
