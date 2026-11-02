import Link from "next/link";
import type { FC } from "react";
import HomeIntro from "@/components/home-intro";
import SocialLinks from "@/components/social-links";
import getStaggerDelayStyle from "@/lib/animation";

const navigationLinks = [
  { path: "/resume", label: "Resume" },
  { path: "/about", label: "About" },
] as const;

const SiteHeader: FC = () => (
  <header className="flex flex-col items-center justify-center">
    {/* Not an h1: each page has its own h1, and the title appears on every page. */}
    <div className="animate-peek-up py-[0.4em] text-[6em] leading-[1.3] font-semibold text-shadow-chromatic">
      <Link href="/" className="block origin-right animate-tilt">
        apdesch
      </Link>
    </div>
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
    <HomeIntro />
    <SocialLinks />
  </header>
);

export default SiteHeader;
