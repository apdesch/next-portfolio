import type { JSX } from "react";
import {
  GithubIcon,
  InstagramIcon,
  WellfoundIcon,
} from "@/components/social-icons";
import { getStaggerDelayStyle } from "@/lib/animation";

const socialLinks = [
  { url: "https://github.com/apdesch", title: "GitHub", Icon: GithubIcon },
  {
    url: "https://wellfound.com/apdesch",
    title: "Wellfound",
    Icon: WellfoundIcon,
  },
  {
    url: "https://www.instagram.com/myroommatetotoro_/",
    title: "Instagram",
    Icon: InstagramIcon,
  },
] as const;

export function SocialLinks(): JSX.Element {
  return (
    <div className="flex w-full max-w-[10em] justify-evenly text-[2.2em]">
      {socialLinks.map((socialLink, index) => (
        <a
          key={socialLink.title}
          href={socialLink.url}
          target="_blank"
          rel="noopener noreferrer"
          title={socialLink.title}
          aria-label={socialLink.title}
          className="animate-pop-in"
          style={getStaggerDelayStyle(index)}
        >
          <socialLink.Icon />
        </a>
      ))}
    </div>
  );
}
