export type SocialProfileName = "GitHub" | "Wellfound" | "Instagram";

type SocialProfile = {
  name: SocialProfileName;
  url: string;
};

const socialProfiles: readonly SocialProfile[] = [
  { name: "GitHub", url: "https://github.com/apdesch" },
  { name: "Wellfound", url: "https://wellfound.com/apdesch" },
  { name: "Instagram", url: "https://www.instagram.com/myroommatetotoro_/" },
];

export default socialProfiles;
