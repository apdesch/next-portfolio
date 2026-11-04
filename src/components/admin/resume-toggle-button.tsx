"use client";

import type { FC } from "react";
import { useFormStatus } from "react-dom";
import ButtonLabel from "@/components/admin/button-label";

type SubmitButtonProps = { label: string };

// Inside the form, so it can show "Saving…" and ignore extra clicks while saving.
const SubmitButton: FC<SubmitButtonProps> = ({ label }) => {
  const { pending: isSaving } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={isSaving}
      className="text-sm font-medium text-admin-accent enabled:hover:underline disabled:opacity-60 dark:text-admin-accent-dark"
    >
      <ButtonLabel isBusy={isSaving} label={label} busyLabel="Saving…" />
    </button>
  );
};

type ResumeToggleButtonProps = {
  isResume: boolean;
  setResume: () => Promise<void>;
};

// Marks a PDF as the resume linked from the public Resume page, or unmarks it.
const ResumeToggleButton: FC<ResumeToggleButtonProps> = ({
  isResume,
  setResume,
}) => (
  <form action={setResume}>
    <SubmitButton label={isResume ? "Stop using as resume" : "Use as resume"} />
  </form>
);

export default ResumeToggleButton;
