import Link from "next/link";
import type { FC } from "react";

// Projects is the only section so far; Videos, Gallery and Files join as they're built.
// Below the desktop breakpoint the sidebar is a popover drawer opened from the header.
const AdminSidebar: FC = () => (
  <nav
    id="admin-nav"
    popover="auto"
    aria-label="Admin sections"
    className="fixed inset-y-0 right-auto left-0 m-0 h-full w-64 border-0 border-r border-admin-dark/10 bg-admin-light p-4 text-admin-dark backdrop:bg-black/40 desktop:static desktop:block desktop:h-auto desktop:w-56 desktop:overflow-y-auto desktop:bg-transparent dark:border-admin-light/10 dark:bg-admin-dark dark:text-admin-light desktop:dark:bg-transparent"
  >
    <ul className="m-0 flex list-none flex-col gap-1 p-0">
      <li>
        <Link
          href="/admin"
          aria-current="page"
          className="block rounded-md px-3 py-2 text-sm hover:bg-admin-dark/5 aria-[current=page]:bg-admin-accent/10 aria-[current=page]:font-medium aria-[current=page]:text-admin-accent dark:hover:bg-admin-light/10 dark:aria-[current=page]:bg-admin-accent-dark/15 dark:aria-[current=page]:text-admin-accent-dark"
        >
          Projects
        </Link>
      </li>
    </ul>
  </nav>
);

export default AdminSidebar;
