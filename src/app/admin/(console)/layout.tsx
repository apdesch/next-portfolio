import { type FC, Suspense } from "react";
import AdminHeader from "@/components/admin/admin-header";
import AdminSidebar from "@/components/admin/admin-sidebar";
import ProfileMenu from "@/components/admin/profile-menu";
import requireAdminSession from "@/lib/require-admin-session";

const CurrentUserProfileMenu: FC = async () => {
  const session = await requireAdminSession();
  return <ProfileMenu name={session.user.name} />;
};

// Same size as the profile circle, so nothing shifts when the initial arrives.
const ProfileMenuPlaceholder: FC = () => (
  <span
    aria-hidden="true"
    className="size-8 rounded-full bg-admin-dark/10 dark:bg-admin-light/10"
  />
);

// The header and sidebar hold no private data, so they render instantly on every
// navigation. Only the profile menu and the page wait for the session. proxy.ts and the
// src/db/admin functions do the guarding, so this layout doesn't need to.
const ConsoleLayout: FC<LayoutProps<"/admin">> = ({ children }) => (
  <div className="grid h-dvh grid-rows-[auto_1fr]">
    <AdminHeader
      profileMenu={
        <Suspense fallback={<ProfileMenuPlaceholder />}>
          <CurrentUserProfileMenu />
        </Suspense>
      }
    />
    <div className="grid min-h-0 desktop:grid-cols-[auto_1fr]">
      <AdminSidebar />
      <main className="@container min-h-0 overflow-y-auto">
        <Suspense
          fallback={<p className="m-0 p-6 text-sm opacity-70">Loading…</p>}
        >
          {children}
        </Suspense>
      </main>
    </div>
  </div>
);

export default ConsoleLayout;
