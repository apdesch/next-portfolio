"use client";

import { usePathname } from "next/navigation";
import type { FC } from "react";

const HomeIntro: FC = () => {
  const isHomePage = usePathname() === "/";

  if (!isHomePage) return null;

  return (
    <div className="relative animate-wipe-left self-center text-justify text-[1.1em] [&>p]:mx-[1em] desktop:[&>p]:max-w-[24em]">
      <p>
        Software engineer in San Francisco. A decade-plus of building React apps
        for startups, from video editing to healthcare.
      </p>
      <p>Open to new engineering roles. Get in touch.</p>
    </div>
  );
};

export default HomeIntro;
