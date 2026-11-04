import "server-only";
import { eq } from "drizzle-orm";
import getDb from "@/db/client";
import projects, { type Project } from "@/db/tables/projects";
import isValidProjectId from "@/lib/is-valid-project-id";
import requireAdminSession from "@/lib/require-admin-session";

const getAdminProject = async (projectId: number): Promise<Project | null> => {
  await requireAdminSession();
  if (!isValidProjectId(projectId)) return null;
  const [project] = await getDb()
    .select()
    .from(projects)
    .where(eq(projects.id, projectId));
  return project ?? null;
};

export default getAdminProject;
