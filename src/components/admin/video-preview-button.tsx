"use client";

import Link from "next/link";
import { type FC, type ReactNode, useEffect, useRef, useState } from "react";
import getYoutubeEmbedUrl from "@/lib/get-youtube-embed-url";

type VideoPreviewButtonProps = {
  videoId: string;
  title: string;
  // What the button shows: a "Preview" label in the form, a thumbnail and title in lists.
  className: string;
  children: ReactNode;
  // Lists link from the preview to the edit form; the form itself has no need.
  editHref?: string;
};

// Opens the video in a modal and plays it. The player only exists while the modal is open,
// so it can start right away (the click allows sound) and stops when the modal closes.
const VideoPreviewButton: FC<VideoPreviewButtonProps> = ({
  videoId,
  title,
  className,
  children,
  editHref,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openPreview = (): void => {
    setIsOpen(true);
    dialogRef.current?.showModal();
  };

  const closePreview = (): void => dialogRef.current?.close();

  // Next.js keeps a page you navigate away from alive but hidden, so going back is instant.
  // Hiding it runs this cleanup: the modal closes and its player is removed, instead of
  // the video playing on unseen and the modal staying pinned to the screen.
  useEffect(() => {
    const dialog = dialogRef.current;
    return () => dialog?.close();
  }, []);

  return (
    <>
      <button type="button" onClick={openPreview} className={className}>
        {children}
      </button>
      {/* A click on the dimmed backdrop lands on the dialog itself, which closes it. */}
      <dialog
        ref={dialogRef}
        aria-label={`Preview of ${title}`}
        onClose={() => setIsOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) closePreview();
        }}
        className="m-auto w-11/12 max-w-3xl rounded-lg bg-admin-dark p-0 text-admin-light shadow-xl backdrop:bg-black/70"
      >
        <div className="flex items-center justify-between gap-4 px-4 py-2">
          <p className="m-0 truncate text-sm">{title}</p>
          <div className="flex shrink-0 items-center gap-1">
            {editHref && (
              <Link
                href={editHref}
                onClick={closePreview}
                className="rounded-md px-3 py-1 text-sm text-admin-accent-dark hover:bg-admin-light/10"
              >
                Edit
              </Link>
            )}
            <button
              type="button"
              onClick={closePreview}
              className="rounded-md px-3 py-1 text-sm hover:bg-admin-light/10"
            >
              Close
            </button>
          </div>
        </div>
        <div className="relative aspect-video">
          {isOpen && (
            <iframe
              src={`${getYoutubeEmbedUrl(videoId)}?autoplay=1`}
              title={title}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              referrerPolicy="strict-origin-when-cross-origin"
              className="absolute inset-0 size-full border-0"
            />
          )}
        </div>
      </dialog>
    </>
  );
};

export default VideoPreviewButton;
