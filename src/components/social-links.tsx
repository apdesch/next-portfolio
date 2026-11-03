import type { FC } from "react";
import GithubIcon from "@/components/github-icon";
import InstagramIcon from "@/components/instagram-icon";
import WellfoundIcon from "@/components/wellfound-icon";
import socialProfiles, {
  type SocialProfileName,
} from "@/content/social-profiles";
import getStaggerDelayStyle from "@/lib/animation";

const iconsByProfileName: Record<SocialProfileName, FC> = {
  GitHub: GithubIcon,
  Wellfound: WellfoundIcon,
  Instagram: InstagramIcon,
};

const SocialLinks: FC = () => (
  <div className="flex w-full max-w-[10em] justify-evenly text-[2.2em]">
    {socialProfiles.map((socialProfile, index) => {
      const Icon = iconsByProfileName[socialProfile.name];

      return (
        <a
          key={socialProfile.name}
          href={socialProfile.url}
          target="_blank"
          rel="noopener noreferrer"
          title={socialProfile.name}
          aria-label={socialProfile.name}
          className="animate-pop-in"
          style={getStaggerDelayStyle(index)}
        >
          <Icon />
        </a>
      );
    })}
  </div>
);

export default SocialLinks;
