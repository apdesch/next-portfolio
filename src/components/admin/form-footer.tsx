import Link from "next/link";
import type { FC, ReactNode } from "react";
import ButtonLabel from "@/components/admin/button-label";
import adminButtonClassName from "@/lib/admin-button-class-name";

type FormFooterProps = {
  // The form's id: Save sits outside the form (below), so it submits it by id.
  formId: string;
  cancelHref: string;
  isPending: boolean;
  isSaved: boolean;
  hasErrors: boolean;
  // A delete confirmation, when editing an existing item.
  deleteButton?: ReactNode;
};

// The bar under an admin edit form: Delete, the save status, Cancel and Save. It sits
// outside the <form> so the delete confirmation's own form isn't nested inside it.
const FormFooter: FC<FormFooterProps> = ({
  formId,
  cancelHref,
  isPending,
  isSaved,
  hasErrors,
  deleteButton,
}) => (
  <div className="flex items-center gap-3 border-t border-admin-dark/10 px-6 py-4 dark:border-admin-light/10">
    {deleteButton}
    <p
      role="status"
      className="m-0 ml-auto text-sm text-admin-dark/70 dark:text-admin-light/70"
    >
      {isSaved && !isPending && "Saved"}
      {hasErrors && !isPending && "Check the highlighted fields."}
    </p>
    <Link
      href={cancelHref}
      className="rounded-md px-4 py-2 text-sm hover:bg-admin-dark/5 dark:hover:bg-admin-light/10"
    >
      Cancel
    </Link>
    <button
      type="submit"
      form={formId}
      disabled={isPending}
      className={adminButtonClassName}
    >
      <ButtonLabel isBusy={isPending} label="Save" busyLabel="Saving…" />
    </button>
  </div>
);

export default FormFooter;
