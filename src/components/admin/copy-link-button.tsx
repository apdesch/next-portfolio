"use client";

import { type FC, useState } from "react";

type CopyLinkButtonProps = { url: string };

const copiedMessageMilliseconds = 2000;

// Copies the file's address, ready to paste into a project's Markdown body.
const CopyLinkButton: FC<CopyLinkButtonProps> = ({ url }) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyLink = async (): Promise<void> => {
    await navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), copiedMessageMilliseconds);
  };

  return (
    <button
      type="button"
      onClick={copyLink}
      className="text-sm font-medium text-admin-accent hover:underline dark:text-admin-accent-dark"
    >
      {/* Announced to screen readers when it changes to "Copied". */}
      <span aria-live="polite">{isCopied ? "Copied" : "Copy link"}</span>
    </button>
  );
};

export default CopyLinkButton;
