import type { Metadata } from "next";
import type { FC } from "react";

// The admin's own frame: its palette and the system font, independent of the public design.
const AdminLayout: FC<LayoutProps<"/admin">> = ({ children }) => (
  <div className="min-h-dvh bg-admin-light font-admin text-admin-dark dark:bg-admin-dark dark:text-admin-light dark:scheme-dark">
    {children}
  </div>
);

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin" },
  robots: { index: false, follow: false },
};

export default AdminLayout;
