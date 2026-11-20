import type { FC, ReactNode } from "react";

type PublicFrameProps = { children: ReactNode };

// The public site's frame: the dark-mode photo backdrop and the centered, fluid-type column.
// "public-site" scopes the public typography in globals.css, so the admin doesn't inherit it.
const PublicFrame: FC<PublicFrameProps> = ({ children }) => (
  <>
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 hidden dark-backdrop dark:block"
    />
    <div className="public-site flex min-h-screen w-full animate-fade-in flex-col items-center justify-around px-[1em] font-sans text-compact desktop:px-0 desktop:text-fluid">
      {children}
    </div>
  </>
);

export default PublicFrame;
