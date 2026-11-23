import Link from "next/link";
import type { FC } from "react";
import HomeIntro from "@/components/HomeIntro";
import SiteTitle from "@/components/SiteTitle";
import SocialLinks from "@/components/SocialLinks";
import getStaggerDelayStyle from "@/lib/getStaggerDelayStyle";

const navigationLinks = [
  { path: "/resume", label: "Resume" },
  { path: "/about", label: "About" },
];

const SiteHeader: FC = () => (
  <header className="flex flex-col items-center justify-center">
    {/* The nav is sized to the title, so the home intro's width can't shift the links. */}
    <div className="flex w-fit flex-col items-center">
      {/* Not an h1: each page has its own h1, and the title appears on every page. */}
      <SiteTitle />
      <nav className="flex w-full justify-evenly pt-[3em] pb-[2em]">
        {navigationLinks.map((navigationLink, index) => (
          <Link
            key={navigationLink.path}
            href={navigationLink.path}
            className="mx-[1em] block animate-peek-down text-[1.8em] uppercase"
            style={getStaggerDelayStyle(index + 1)}
          >
            {navigationLink.label}
          </Link>
        ))}
      </nav>
    </div>
    <HomeIntro />
    <SocialLinks />
  </header>
);

export default SiteHeader;
