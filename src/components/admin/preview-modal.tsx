"use client";

import Link from "next/link";
import { type FC, type ReactNode, useEffect, useRef, useState } from "react";

type PreviewModalProps = {
  title: string;
  // The button that opens the modal: a label, or a thumbnail and caption in lists.
  trigger: ReactNode;
  triggerClassName: string;
  // Lists link from the preview to the edit form; the form itself has no need.
  editHref?: string;
  // Extra header buttons beside Close, such as Delete.
  headerActions?: ReactNode;
  // Mounted only while open, so a video player starts on open and stops on close.
  children: ReactNode;
};

// A modal for previewing an item (a video, a photo). Esc, Close or a click on the dimmed
// backdrop closes it; it's centered with m-auto because Tailwind's reset removes the
// browser's default dialog margin.
const PreviewModal: FC<PreviewModalProps> = ({
  title,
  trigger,
  triggerClassName,
  editHref,
  headerActions,
  children,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openPreview = (): void => {
    setIsOpen(true);
    dialogRef.current?.showModal();
  };

  const closePreview = (): void => dialogRef.current?.close();

  // Next.js keeps a page you navigate away from alive but hidden, so going back is instant.
  // Hiding it (or removing this item) runs this cleanup, so the modal closes instead of a
  // video playing on unseen and the modal staying pinned to the screen.
  useEffect(() => {
    const dialog = dialogRef.current;
    return () => dialog?.close();
  }, []);

  return (
    <>
      <button type="button" onClick={openPreview} className={triggerClassName}>
        {trigger}
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
            {headerActions}
            <button
              type="button"
              onClick={closePreview}
              className="rounded-md px-3 py-1 text-sm hover:bg-admin-light/10"
            >
              Close
            </button>
          </div>
        </div>
        {isOpen && children}
      </dialog>
    </>
  );
};

export default PreviewModal;
