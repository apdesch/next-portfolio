type SkillGroup = {
  heading: string;
  skills: readonly string[];
};

type About = {
  bio: readonly string[];
  highlights: readonly string[];
  skillGroups: readonly SkillGroup[];
};

const about: About = {
  bio: [
    "I'm a software engineer from San Francisco with over a decade of experience building web applications across social media, photography, content creation, e-commerce, healthcare and gaming. I have a degree in Web Design and Interactive Media from The Art Institute of California – San Francisco.",
    "I also work in video production: editing, cinematography, colour grading and sound design.",
    "I'm now looking for my next engineering role.",
  ],
  highlights: [
    "Built the foundation of a video editor with 100,000 daily active users.",
    "Helped grow two companies to acquisition.",
  ],
  skillGroups: [
    {
      heading: "Engineering Skills",
      skills: [
        "TypeScript",
        "JavaScript",
        "React",
        "Redux",
        "Sass/Less",
        "Webpack",
        "Cypress",
        "FFmpeg",
        "Python",
        "Next.js",
        "Tailwind CSS",
        "Playwright",
        "AI-assisted development (Claude Code)",
      ],
    },
    {
      heading: "Video Production",
      skills: ["Editing", "Cinematography", "Colour Grading", "Sound Design"],
    },
  ],
};

export default about;
