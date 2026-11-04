"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type FC, Suspense, useRef } from "react";

const adminSections = [
  { label: "Projects", href: "/admin/projects" },
  { label: "Videos", href: "/admin/videos" },
  { label: "Gallery", href: "/admin/gallery" },
  { label: "Files", href: "/admin/files" },
];

type SectionLinksProps = {
  currentPathname: string | null;
  onNavigate: () => void;
};

const SectionLinks: FC<SectionLinksProps> = ({
  currentPathname,
  onNavigate,
}) => (
  <ul className="m-0 flex list-none flex-col gap-1 p-0">
    {adminSections.map((section) => (
      <li key={section.href}>
        <Link
          href={section.href}
          onClick={onNavigate}
          aria-current={
            currentPathname?.startsWith(section.href) ? "page" : undefined
          }
          className="block rounded-md px-3 py-2 text-sm hover:bg-admin-dark/5 aria-[current=page]:bg-admin-accent/10 aria-[current=page]:font-medium aria-[current=page]:text-admin-accent dark:hover:bg-admin-light/10 dark:aria-[current=page]:bg-admin-accent-dark/15 dark:aria-[current=page]:text-admin-accent-dark"
        >
          {section.label}
        </Link>
      </li>
    ))}
  </ul>
);

type CurrentSectionLinksProps = { onNavigate: () => void };

const CurrentSectionLinks: FC<CurrentSectionLinksProps> = ({ onNavigate }) => (
  <SectionLinks currentPathname={usePathname()} onNavigate={onNavigate} />
);

// Below the desktop breakpoint the sidebar is a popover drawer opened from the header.
const AdminSidebar: FC = () => {
  const navigationRef = useRef<HTMLElement>(null);

  // On phones the drawer is an open popover; close it once a section is chosen.
  const closeDrawer = (): void => {
    const navigation = navigationRef.current;
    if (navigation?.matches(":popover-open")) navigation.hidePopover();
  };

  return (
    <nav
      ref={navigationRef}
      id="admin-nav"
      popover="auto"
      aria-label="Admin sections"
      className="fixed inset-y-0 right-auto left-0 m-0 h-full w-64 border-0 border-r border-admin-dark/10 bg-admin-light p-4 text-admin-dark backdrop:bg-black/40 desktop:static desktop:block desktop:h-auto desktop:w-56 desktop:overflow-y-auto desktop:bg-transparent dark:border-admin-light/10 dark:bg-admin-dark dark:text-admin-light desktop:dark:bg-transparent"
    >
      {/* With Cache Components, reading the URL must sit inside Suspense. The links render
          instantly without a highlight, which appears once the path is known. */}
      <Suspense
        fallback={
          <SectionLinks currentPathname={null} onNavigate={closeDrawer} />
        }
      >
        <CurrentSectionLinks onNavigate={closeDrawer} />
      </Suspense>
    </nav>
  );
};

export default AdminSidebar;
