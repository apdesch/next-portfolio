import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { type FC, Suspense } from "react";
import AdminPageLoading from "@/components/admin/admin-page-loading";
import deleteGalleryPhoto from "@/app/admin/(console)/gallery/delete-gallery-photo";
import updateGalleryPhoto from "@/app/admin/(console)/gallery/update-gallery-photo";
import GalleryPhotoForm from "@/components/admin/gallery-photo-form";
import getAdminGalleryCategories from "@/db/admin/get-admin-gallery-categories";
import getAdminGalleryPhoto from "@/db/admin/get-admin-gallery-photo";

const EditGalleryPhotoContent: FC<
  PageProps<"/admin/gallery/[photoId]">
> = async ({ params }) => {
  const { photoId } = await params;
  const [photo, categories] = await Promise.all([
    getAdminGalleryPhoto(Number(photoId)),
    getAdminGalleryCategories(),
  ]);
  if (!photo) notFound();

  return (
    <div className="mx-auto max-w-2xl p-6">
      <p className="m-0 text-sm opacity-70">
        <Link href="/admin/gallery" className="hover:underline">
          Gallery
        </Link>{" "}
        / {photo.category}
      </p>
      <h1 className="mt-1 mb-6 text-2xl font-semibold">Edit photo</h1>
      <GalleryPhotoForm
        photo={photo}
        categories={categories}
        savePhoto={updateGalleryPhoto.bind(null, photo.id)}
        deletePhoto={deleteGalleryPhoto.bind(null, photo.id)}
      />
    </div>
  );
};

// Its own Suspense boundary, so opening this page from anywhere in the admin shows the
// placeholder at once instead of waiting for its data (see admin-page-loading.tsx).
const EditGalleryPhotoPage: FC<PageProps<"/admin/gallery/[photoId]">> = (
  props,
) => (
  <Suspense fallback={<AdminPageLoading />}>
    <EditGalleryPhotoContent {...props} />
  </Suspense>
);

export const metadata: Metadata = { title: "Edit photo" };

export default EditGalleryPhotoPage;
