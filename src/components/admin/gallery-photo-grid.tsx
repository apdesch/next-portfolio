"use client";

import Image from "next/image";
import Link from "next/link";
import { type FC, startTransition, useOptimistic } from "react";
import ConfirmDeleteButton from "@/components/admin/confirm-delete-button";
import MoveButtons from "@/components/admin/move-buttons";
import PreviewModal from "@/components/admin/preview-modal";
import type { GalleryPhoto } from "@/db/tables/gallery-photos";
import type { MoveDirection } from "@/lib/find-neighbor";
import moveItem from "@/lib/move-item";

type PhotoMove = { photoId: number; direction: MoveDirection };

type GalleryPhotoGridProps = {
  photos: GalleryPhoto[];
  movePhoto: (photoId: number, direction: MoveDirection) => Promise<void>;
  deletePhoto: (photoId: number) => Promise<void>;
};

type DeletePhotoButtonProps = {
  photo: GalleryPhoto;
  // Unique per photo and per place (card or preview), since popover IDs must be unique.
  popoverId: string;
  deletePhoto: (photoId: number) => Promise<void>;
  triggerClassName?: string;
};

const DeletePhotoButton: FC<DeletePhotoButtonProps> = ({
  photo,
  popoverId,
  deletePhoto,
  triggerClassName,
}) => (
  <ConfirmDeleteButton
    popoverId={popoverId}
    title="Delete this photo?"
    confirmDelete={() => deletePhoto(photo.id)}
    triggerClassName={triggerClassName}
  >
    It comes off the home page and out of storage. It can&rsquo;t be undone.
  </ConfirmDeleteButton>
);

// One gallery's photos, read left to right. Moves show at once (useOptimistic) while the
// server saves them, as in the video list.
const GalleryPhotoGrid: FC<GalleryPhotoGridProps> = ({
  photos,
  movePhoto,
  deletePhoto,
}) => {
  const [orderedPhotos, showMove] = useOptimistic(
    photos,
    (currentPhotos: GalleryPhoto[], move: PhotoMove) =>
      moveItem(currentPhotos, move.photoId, move.direction),
  );

  const handleMove = (photoId: number, direction: MoveDirection): void =>
    startTransition(async () => {
      showMove({ photoId, direction });
      await movePhoto(photoId, direction);
    });

  return (
    <ol className="m-0 grid list-none grid-cols-2 gap-3 p-0 @xl:grid-cols-3 @4xl:grid-cols-5">
      {orderedPhotos.map((photo, photoIndex) => (
        <li
          key={photo.id}
          className="overflow-hidden rounded-lg border border-admin-dark/10 bg-white/50 dark:border-admin-light/10 dark:bg-admin-light/5"
        >
          {/* The photo and its description open a preview; Edit opens the form. */}
          <PreviewModal
            title={photo.alt}
            triggerClassName="group block w-full text-left"
            editHref={`/admin/gallery/${photo.id}`}
            headerActions={
              <DeletePhotoButton
                photo={photo}
                popoverId={`delete-photo-preview-${photo.id}`}
                deletePhoto={deletePhoto}
                triggerClassName="rounded-md px-3 py-1 text-sm text-red-400 hover:bg-admin-light/10"
              />
            }
            trigger={
              <>
                <span className="relative block aspect-square bg-admin-dark/10 dark:bg-admin-light/10">
                  <Image
                    src={photo.src}
                    alt=""
                    fill
                    sizes="(min-width: 54em) 12em, 45vw"
                    className="object-cover"
                  />
                </span>
                {/* Shown so batch uploads' starting descriptions get noticed. */}
                <span
                  className="block truncate px-3 pt-2 text-xs group-hover:underline"
                  title={photo.alt}
                >
                  {photo.alt}
                </span>
              </>
            }
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="(min-width: 54em) 48rem, 92vw"
              className="mx-auto block h-auto max-h-[80dvh] w-auto max-w-full"
            />
          </PreviewModal>
          <div className="flex items-center justify-between gap-2 p-3 pt-2">
            <div className="flex items-center gap-3">
              <Link
                href={`/admin/gallery/${photo.id}`}
                className="text-sm font-medium text-admin-accent hover:underline dark:text-admin-accent-dark"
              >
                Edit
              </Link>
              <DeletePhotoButton
                photo={photo}
                popoverId={`delete-photo-${photo.id}`}
                deletePhoto={deletePhoto}
              />
            </div>
            <MoveButtons
              orientation="horizontal"
              itemName={photo.alt}
              isFirst={photoIndex === 0}
              isLast={photoIndex === orderedPhotos.length - 1}
              onMoveUp={() => handleMove(photo.id, "up")}
              onMoveDown={() => handleMove(photo.id, "down")}
            />
          </div>
        </li>
      ))}
    </ol>
  );
};

export default GalleryPhotoGrid;
