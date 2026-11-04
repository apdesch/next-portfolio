import type { Metadata } from "next";
import Image from "next/image";
import type { FC } from "react";
import getAdminProjects from "@/db/admin/get-admin-projects";
import type { Project } from "@/db/tables/projects";

const projectCategoryLabels: Record<Project["category"], string> = {
  app: "App",
  logo: "Logo",
  branding: "Branding",
  design: "Design",
};

// Dates are stored as YYYY-MM-DD; UTC keeps the month from shifting in other time zones.
const formatProjectDate = (date: string): string =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

// Read-only for now: editing and "New project" arrive in the next step.
const AdminProjectsPage: FC = async () => {
  const projects = await getAdminProjects();

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6">
        <h1 className="m-0 text-2xl font-semibold">Projects</h1>
        <p className="m-0 text-sm opacity-70">{projects.length} projects</p>
      </div>
      <ul className="m-0 grid list-none gap-4 p-0 @xl:grid-cols-2 @4xl:grid-cols-3">
        {projects.map((project) => (
          <li
            key={project.id}
            className="overflow-hidden rounded-lg border border-admin-dark/10 bg-white/50 dark:border-admin-light/10 dark:bg-admin-light/5"
          >
            <Image
              src={project.imageSrc}
              alt=""
              width={project.imageWidth}
              height={project.imageHeight}
              sizes="(min-width: 54em) 20em, 100vw"
              className="aspect-3/2 w-full object-cover"
            />
            <div className="p-4">
              <h2 className="m-0 text-base font-semibold">{project.title}</h2>
              <p className="m-0 text-sm opacity-70">
                {projectCategoryLabels[project.category]} ·{" "}
                {formatProjectDate(project.date)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const metadata: Metadata = { title: "Projects" };

export default AdminProjectsPage;
