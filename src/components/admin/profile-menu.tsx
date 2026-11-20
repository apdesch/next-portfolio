import type { FC } from "react";
import signOut from "@/app/admin/sign-out";

type ProfileMenuProps = { name: string };

const getInitial = (name: string): string => name.charAt(0).toUpperCase();

// A popover sits in the browser's top layer, so it's placed against the viewport: just
// below the header (h-14), aligned with its right padding.
const ProfileMenu: FC<ProfileMenuProps> = ({ name }) => (
  <>
    <button
      type="button"
      popoverTarget="profile-menu"
      aria-label={`Account menu for ${name}`}
      className="grid size-8 place-items-center rounded-full bg-admin-accent font-semibold text-white dark:bg-admin-accent-dark dark:text-admin-dark"
    >
      {getInitial(name)}
    </button>
    <div
      id="profile-menu"
      popover="auto"
      className="top-14 right-4 bottom-auto left-auto m-0 w-56 rounded-lg border border-admin-dark/15 bg-admin-light p-1 text-sm text-admin-dark shadow-lg dark:border-admin-light/15 dark:bg-admin-dark dark:text-admin-light"
    >
      <p className="m-0 border-b border-admin-dark/10 px-3 py-2 font-medium dark:border-admin-light/10">
        {name}
      </p>
      <form action={signOut}>
        <button
          type="submit"
          className="mt-1 block w-full rounded-md px-3 py-2 text-left hover:bg-admin-dark/5 dark:hover:bg-admin-light/10"
        >
          Sign out
        </button>
      </form>
    </div>
  </>
);

export default ProfileMenu;
