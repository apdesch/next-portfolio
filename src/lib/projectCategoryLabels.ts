import type { Project } from "@/db/tables/projects";

const projectCategoryLabels: Record<Project["category"], string> = {
  app: "App",
  logo: "Logo",
  branding: "Branding",
  design: "Design",
};

export default projectCategoryLabels;
