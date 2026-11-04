import Link from "next/link";
import type { FC, ReactNode } from "react";
import AdminWordmark from "@/components/admin/admin-wordmark";

// The profile menu comes in as a slot, so the header itself stays static.
type AdminHeaderProps = { profileMenu: ReactNode };

const AdminHeader: FC<AdminHeaderProps> = ({ profileMenu }) => (
  <header className="flex h-14 items-center gap-3 border-b border-admin-dark/10 bg-white/40 px-4 dark:border-admin-light/10 dark:bg-admin-light/5">
    {/* Phones only: opens the sidebar, which is a popover below the desktop breakpoint. */}
    <button
      type="button"
      popoverTarget="admin-nav"
      aria-label="Open navigation"
      className="grid size-9 place-items-center rounded-md hover:bg-current/10 desktop:hidden"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="size-5"
      >
        <path d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
    <Link href="/admin/projects">
      <AdminWordmark />
    </Link>
    <div className="ml-auto flex items-center gap-4">
      <Link href="/" className="text-sm hover:underline">
        View site
      </Link>
      {profileMenu}
    </div>
  </header>
);

export default AdminHeader;
