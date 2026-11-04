"use client";

import type { FC, ReactNode } from "react";
import { useFormStatus } from "react-dom";

type ConfirmDeleteButtonProps = {
  // Unique on the page, because a list can have one confirmation per item.
  popoverId: string;
  title: string;
  children: ReactNode;
  confirmDelete: () => Promise<void>;
};

// Inside the form, so it can read whether that form is still submitting. While it is, both
// buttons are disabled, so extra clicks can't send the delete again.
type ConfirmButtonsProps = { popoverId: string };

const ConfirmButtons: FC<ConfirmButtonsProps> = ({ popoverId }) => {
  const { pending: isDeleting } = useFormStatus();

  return (
    <>
      <button
        type="button"
        popoverTarget={popoverId}
        popoverTargetAction="hide"
        disabled={isDeleting}
        className="rounded-md px-4 py-2 text-sm hover:bg-admin-dark/5 disabled:opacity-60 dark:hover:bg-admin-light/10"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isDeleting}
        className="rounded-md bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-700/90 disabled:opacity-60 dark:bg-red-500 dark:hover:bg-red-500/90"
      >
        {isDeleting ? "Deleting…" : "Delete"}
      </button>
    </>
  );
};

// Delete opens a confirmation popover (no JavaScript needed); only its button deletes.
// The popover sits in the top layer; m-auto centers it (Tailwind's reset removes the
// browser's default centering margin).
const ConfirmDeleteButton: FC<ConfirmDeleteButtonProps> = ({
  popoverId,
  title,
  children,
  confirmDelete,
}) => (
  <>
    <button
      type="button"
      popoverTarget={popoverId}
      className="text-sm text-red-700 hover:underline dark:text-red-400"
    >
      Delete
    </button>
    <div
      id={popoverId}
      popover="auto"
      role="alertdialog"
      aria-labelledby={`${popoverId}-title`}
      className="m-auto w-80 rounded-lg border border-admin-dark/15 bg-admin-light p-5 text-admin-dark shadow-lg backdrop:bg-black/40 dark:border-admin-light/15 dark:bg-admin-dark dark:text-admin-light"
    >
      <h2 id={`${popoverId}-title`} className="m-0 text-base font-semibold">
        {title}
      </h2>
      <div className="mt-1 mb-4 text-sm opacity-80">{children}</div>
      <form action={confirmDelete} className="flex justify-end gap-3">
        <ConfirmButtons popoverId={popoverId} />
      </form>
    </div>
  </>
);

export default ConfirmDeleteButton;
