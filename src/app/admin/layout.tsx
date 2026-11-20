import type { Metadata } from "next";
import type { FC } from "react";

// The admin's own frame: its palette and the system font, independent of the public design.
// Tailwind's reset gives buttons the plain arrow cursor, so the admin sets it explicitly: a
// pointing hand on buttons you can click (including the file picker's), and "not allowed"
// on disabled ones.
const AdminLayout: FC<LayoutProps<"/admin">> = ({ children }) => (
  <div className="min-h-dvh bg-admin-light font-admin text-admin-dark dark:bg-admin-dark dark:text-admin-light dark:scheme-dark [&_button:disabled]:cursor-not-allowed [&_button:enabled]:cursor-pointer [&_input[type=file]]:file:cursor-pointer">
    {children}
  </div>
);

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin" },
  robots: { index: false, follow: false },
};

export default AdminLayout;
