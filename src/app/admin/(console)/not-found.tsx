import Link from "next/link";
import type { FC } from "react";

// Shown inside the admin frame (for example, a deleted project's old link) instead of the
// public 404 page.
const AdminNotFound: FC = () => (
  <div className="mx-auto max-w-4xl p-6">
    <h1 className="m-0 text-2xl font-semibold">Not found</h1>
    <p className="mt-1 mb-4 text-sm opacity-70">
      This page doesn&rsquo;t exist or was deleted.
    </p>
    <Link
      href="/admin/projects"
      className="text-sm font-medium text-admin-accent hover:underline dark:text-admin-accent-dark"
    >
      Back to projects
    </Link>
  </div>
);

export default AdminNotFound;
