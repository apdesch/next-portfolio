"use client";

import Image from "next/image";
import {
  useRef,
  useState,
  type CSSProperties,
  type FC,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import type { Photo } from "@/content/portfolio";

type PhotoGalleryProps = { photos: readonly Photo[] };

const getAspectRatio = (photo: Photo): number => photo.width / photo.height;

// Each photo grows in proportion to its aspect ratio, so every row fills the width
// while keeping photo shapes intact (a "justified" layout).
const getJustifiedItemStyle = (photo: Photo): CSSProperties => ({
  flexGrow: getAspectRatio(photo),
  flexBasis: `calc(var(--gallery-row-height) * ${getAspectRatio(photo)})`,
});

const getWrappedIndex = (index: number, length: number): number =>
  (index + length) % length;

const lightboxButtonClassName =
  "absolute p-[0.5em] text-[2em] leading-none text-primary-light";

const PhotoGallery: FC<PhotoGalleryProps> = ({ photos }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [openPhotoIndex, setOpenPhotoIndex] = useState<number | null>(null);

  const openLightbox = (index: number): void => {
    setOpenPhotoIndex(index);
    dialogRef.current?.showModal();
  };

  const closeLightbox = (): void => dialogRef.current?.close();

  const showAdjacentPhoto = (offset: number): void =>
    setOpenPhotoIndex((currentIndex) =>
      getWrappedIndex((currentIndex ?? 0) + offset, photos.length),
    );

  const handleLightboxKeyDown = (event: KeyboardEvent): void => {
    if (event.key === "ArrowRight") showAdjacentPhoto(1);
    if (event.key === "ArrowLeft") showAdjacentPhoto(-1);
  };

  // A click that lands on the dialog itself, not its content, is a backdrop click.
  const handleLightboxClick = (event: MouseEvent<HTMLDialogElement>): void => {
    if (event.target === event.currentTarget) closeLightbox();
  };

  const visiblePhoto = openPhotoIndex === null ? null : photos[openPhotoIndex];

  return (
    <>
      <ul className="m-0 flex list-none flex-wrap gap-[4px] p-0 after:grow-[999] after:content-['']">
        {photos.map((photo, index) => (
          <li key={photo.alt} style={getJustifiedItemStyle(photo)}>
            <button
              type="button"
              onClick={() => openLightbox(index)}
              aria-label={`Open ${photo.alt}`}
              className="block w-full cursor-zoom-in"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                sizes="(min-width: 54em) 20em, 50vw"
                className="block h-auto w-full"
              />
            </button>
          </li>
        ))}
      </ul>
      <dialog
        ref={dialogRef}
        aria-label="Photo viewer"
        onClose={() => setOpenPhotoIndex(null)}
        onKeyDown={handleLightboxKeyDown}
        onClick={handleLightboxClick}
        className="m-auto size-full max-h-none max-w-none bg-transparent p-0 backdrop:bg-primary-dark/90"
      >
        {visiblePhoto !== null && (
          <figure className="flex size-full items-center justify-center p-[3em]">
            <Image
              src={visiblePhoto.src}
              alt={visiblePhoto.alt}
              width={visiblePhoto.width}
              height={visiblePhoto.height}
              sizes="100vw"
              className="max-h-full w-auto max-w-full object-contain"
            />
          </figure>
        )}
        <button
          type="button"
          onClick={closeLightbox}
          aria-label="Close"
          className={`${lightboxButtonClassName} top-0 right-0`}
        >
          ×
        </button>
        <button
          type="button"
          onClick={() => dialogRef.current?.requestFullscreen()}
          aria-label="Fullscreen"
          className={`${lightboxButtonClassName} top-0 left-0`}
        >
          ⛶
        </button>
        <button
          type="button"
          onClick={() => showAdjacentPhoto(-1)}
          aria-label="Previous photo"
          className={`${lightboxButtonClassName} top-1/2 left-0 -translate-y-1/2`}
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => showAdjacentPhoto(1)}
          aria-label="Next photo"
          className={`${lightboxButtonClassName} top-1/2 right-0 -translate-y-1/2`}
        >
          ›
        </button>
      </dialog>
    </>
  );
};

export default PhotoGallery;
