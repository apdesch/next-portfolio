import "server-only";
import { eq } from "drizzle-orm";
import getDb from "@/db/getDb";
import projects, { type Project } from "@/db/tables/projects";
import isValidId from "@/lib/isValidId";
import requireAdminSession from "@/lib/requireAdminSession";

const getAdminProject = async (projectId: number): Promise<Project | null> => {
  await requireAdminSession();
  if (!isValidId(projectId)) return null;
  const [project] = await getDb()
    .select()
    .from(projects)
    .where(eq(projects.id, projectId));
  return project ?? null;
};

export default getAdminProject;
