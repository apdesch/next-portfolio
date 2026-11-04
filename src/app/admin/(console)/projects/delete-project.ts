"use server";

import { eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { notFound, redirect } from "next/navigation";
import getDb from "@/db/client";
import projects from "@/db/tables/projects";
import deleteStoredFile from "@/lib/delete-stored-file";
import isValidId from "@/lib/is-valid-id";
import requireAdminSession from "@/lib/require-admin-session";

// The edit page binds the project's ID; the confirmation popover submits it.
const deleteProject = async (projectId: number): Promise<void> => {
  await requireAdminSession();
  if (!isValidId(projectId)) notFound();
  const [deletedProject] = await getDb()
    .delete(projects)
    .where(eq(projects.id, projectId))
    .returning({ imageSrc: projects.imageSrc });
  updateTag("projects");
  if (deletedProject) await deleteStoredFile(deletedProject.imageSrc);
  redirect("/admin/projects");
};

export default deleteProject;
