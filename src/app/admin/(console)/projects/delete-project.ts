"use server";

import { eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { notFound, redirect } from "next/navigation";
import getDb from "@/db/client";
import projects from "@/db/tables/projects";
import isValidProjectId from "@/lib/is-valid-project-id";
import requireAdminSession from "@/lib/require-admin-session";

// The edit page binds the project's ID; the confirmation popover submits it.
const deleteProject = async (projectId: number): Promise<void> => {
  await requireAdminSession();
  if (!isValidProjectId(projectId)) notFound();
  await getDb().delete(projects).where(eq(projects.id, projectId));
  updateTag("projects");
  redirect("/admin/projects");
};

export default deleteProject;
