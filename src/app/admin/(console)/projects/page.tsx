import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { type FC, Suspense } from "react";
import AdminPageLoading from "@/components/admin/admin-page-loading";
import getAdminProjects from "@/db/admin/get-admin-projects";
import projectCategoryLabels from "@/lib/project-category-labels";

// Dates are stored as YYYY-MM-DD; UTC keeps the month from shifting in other time zones.
const formatProjectDate = (date: string): string =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

const AdminProjectsContent: FC = async () => {
  const projects = await getAdminProjects();

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="m-0 text-2xl font-semibold">Projects</h1>
          <p className="m-0 text-sm opacity-70">{projects.length} projects</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="rounded-md bg-admin-accent px-4 py-2 text-sm font-medium text-white hover:bg-admin-accent/90 dark:bg-admin-accent-dark dark:text-admin-dark dark:hover:bg-admin-accent-dark/90"
        >
          New project
        </Link>
      </div>
      <ul className="m-0 grid list-none gap-4 p-0 @xl:grid-cols-2 @4xl:grid-cols-3">
        {projects.map((project) => (
          <li key={project.id}>
            <Link
              href={`/admin/projects/${project.id}`}
              className="block overflow-hidden rounded-lg border border-admin-dark/10 bg-white/50 hover:border-admin-accent dark:border-admin-light/10 dark:bg-admin-light/5 dark:hover:border-admin-accent-dark"
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
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Its own Suspense boundary, so opening this page from anywhere in the admin shows the
// placeholder at once instead of waiting for its data (see admin-page-loading.tsx).
const AdminProjectsPage: FC = () => (
  <Suspense fallback={<AdminPageLoading />}>
    <AdminProjectsContent />
  </Suspense>
);

export const metadata: Metadata = { title: "Projects" };

export default AdminProjectsPage;
