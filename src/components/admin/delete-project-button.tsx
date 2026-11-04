import type { FC } from "react";

type DeleteProjectButtonProps = { deleteProject: () => Promise<void> };

// Delete opens a confirmation popover (no JavaScript needed); only its button deletes.
// The popover sits in the top layer, centered by the browser's default popover styles.
const DeleteProjectButton: FC<DeleteProjectButtonProps> = ({
  deleteProject,
}) => (
  <>
    <button
      type="button"
      popoverTarget="delete-project"
      className="text-sm text-red-700 hover:underline dark:text-red-400"
    >
      Delete
    </button>
    <div
      id="delete-project"
      popover="auto"
      role="alertdialog"
      aria-labelledby="delete-project-title"
      className="w-80 rounded-lg border border-admin-dark/15 bg-admin-light p-5 text-admin-dark shadow-lg backdrop:bg-black/40 dark:border-admin-light/15 dark:bg-admin-dark dark:text-admin-light"
    >
      <h2 id="delete-project-title" className="m-0 text-base font-semibold">
        Delete this project?
      </h2>
      <p className="mt-1 mb-4 text-sm opacity-80">It can&rsquo;t be undone.</p>
      <form action={deleteProject} className="flex justify-end gap-3">
        <button
          type="button"
          popoverTarget="delete-project"
          popoverTargetAction="hide"
          className="rounded-md px-4 py-2 text-sm hover:bg-admin-dark/5 dark:hover:bg-admin-light/10"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-700/90 dark:bg-red-500 dark:hover:bg-red-500/90"
        >
          Delete
        </button>
      </form>
    </div>
  </>
);

export default DeleteProjectButton;
