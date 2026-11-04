"use server";

import { eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { notFound } from "next/navigation";
import getDb from "@/db/client";
import projects from "@/db/tables/projects";
import isValidProjectId from "@/lib/is-valid-project-id";
import parseProjectForm, {
  type ProjectFormState,
} from "@/lib/project-form-schema";
import requireAdminSession from "@/lib/require-admin-session";

// The edit page binds the project's ID as the first argument.
const updateProject = async (
  projectId: number,
  _previousState: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> => {
  await requireAdminSession();
  if (!isValidProjectId(projectId)) notFound();
  const result = parseProjectForm(formData);
  if (!result.isValid) {
    return { fieldErrors: result.fieldErrors, isSaved: false };
  }

  const [updatedProject] = await getDb()
    .update(projects)
    .set(result.values)
    .where(eq(projects.id, projectId))
    .returning({ id: projects.id });
  if (!updatedProject) notFound();
  updateTag("projects");
  return { fieldErrors: {}, isSaved: true };
};

export default updateProject;
