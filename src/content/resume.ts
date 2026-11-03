export type YearMonth = {
  year: number;
  month: number;
};

export type ResumeEntry = {
  organization: string;
  role: string | null;
  isAcquired: boolean;
  startDate: YearMonth;
  endDate: YearMonth | null;
  highlights: readonly string[];
};

type Resume = {
  experience: readonly ResumeEntry[];
  education: readonly ResumeEntry[];
};

const experience: readonly ResumeEntry[] = [
  {
    organization: "Portfolio Rebuild",
    role: "Personal Project",
    isAcquired: false,
    startDate: { year: 2026, month: 11 },
    endDate: null,
    highlights: [
      "Rebuilding this site, my 2021 MERN portfolio, with Next.js 16, React 19, TypeScript and Tailwind CSS v4.",
      "Built with AI-assisted development (Claude Code), reviewing and approving every change.",
    ],
  },
  {
    organization: "Video Production",
    role: null,
    isAcquired: false,
    startDate: { year: 2021, month: 1 },
    endDate: null,
    highlights: ["Editing, cinematography, color grading and sound design."],
  },
  {
    organization: "RIMOWA",
    role: "Client Care Specialist",
    isAcquired: false,
    startDate: { year: 2023, month: 12 },
    endDate: { year: 2026, month: 11 },
    highlights: [
      "Consulted with the software product team to revamp proprietary repair management software.",
      "Repair luggage, manage and audit parts inventory, and answer repair and warranty questions.",
      "Assist with sales, email inquiries, warranty claim letters, and shipments.",
    ],
  },
  {
    organization: "Kapwing",
    role: "Software Engineer IV",
    isAcquired: false,
    startDate: { year: 2019, month: 10 },
    endDate: { year: 2021, month: 1 },
    highlights: [
      "Build core features for a web-based non-linear video editing application, including an image editor, undo stack, and AI-translated subtitles.",
      "Create end-to-end tests for common and complex user flows and interactions.",
      "Help improve user experience and application stability and reliability.",
    ],
  },
  {
    organization: "Total Brain",
    role: "Software Engineer – Front End Lead",
    isAcquired: true,
    startDate: { year: 2018, month: 3 },
    endDate: { year: 2019, month: 7 },
    highlights: [
      "Develop the flagship SaaS application for large scale companies.",
      "Create application features such as games, and video and audio players.",
      "Create component libraries, build systems, and unit tests.",
    ],
  },
  {
    organization: "Barn & Willow",
    role: "Front End Engineer & Designer",
    isAcquired: false,
    startDate: { year: 2017, month: 4 },
    endDate: { year: 2017, month: 10 },
    highlights: [
      "Redesign e-commerce site, blog, customization tool, and sizing calculator.",
      "Optimize site-wide performance and increase conversions.",
      "10x increase in monthly revenue.",
    ],
  },
  {
    organization: "Elation Health",
    role: "Software Engineer",
    isAcquired: false,
    startDate: { year: 2016, month: 3 },
    endDate: { year: 2016, month: 9 },
    highlights: [
      "Convert front end UI code to use a component based architecture.",
      "Develop and release multiple features for the flagship EHR application.",
      "Create complete wireframes and flows for future product features.",
    ],
  },
  {
    organization: "Mya Systems",
    role: "Front End Engineer",
    isAcquired: true,
    startDate: { year: 2012, month: 8 },
    endDate: { year: 2015, month: 11 },
    highlights: [
      "Develop and launch a robust job search and ATS application.",
      "Develop feature rich products using modern web technologies and frameworks.",
      "Create user flows and interactive wireframes for user experience testing.",
    ],
  },
  {
    organization: "Hot Shot Media Inc.",
    role: "Front End UI Engineer",
    isAcquired: false,
    startDate: { year: 2010, month: 2 },
    endDate: { year: 2012, month: 5 },
    highlights: [
      "Construct and develop functional designs for all products including mobile web.",
      "Design logo for flagship product and assist in user experience and design.",
    ],
  },
];

const education: readonly ResumeEntry[] = [
  {
    organization: "The Art Institute of California – San Francisco",
    role: "AS, Web Design and Interactive Media",
    isAcquired: false,
    startDate: { year: 2006, month: 10 },
    endDate: { year: 2009, month: 6 },
    highlights: [],
  },
];

const resume: Resume = { experience, education };

export default resume;
