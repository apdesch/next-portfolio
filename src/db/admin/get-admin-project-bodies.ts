import "server-only";
import getDb from "@/db/client";
import projects, { type Project } from "@/db/tables/projects";
import requireAdminSession from "@/lib/require-admin-session";

export type AdminProjectBody = Pick<Project, "title" | "body">;

// Project titles and Markdown bodies, so the Files page can warn before deleting a file
// that a project links to.
const getAdminProjectBodies = async (): Promise<AdminProjectBody[]> => {
  await requireAdminSession();
  return getDb()
    .select({ title: projects.title, body: projects.body })
    .from(projects);
};

export default getAdminProjectBodies;
