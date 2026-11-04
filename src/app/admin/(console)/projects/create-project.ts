"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import getDb from "@/db/client";
import projects from "@/db/tables/projects";
import parseProjectForm, {
  type ProjectFormState,
} from "@/lib/project-form-schema";
import requireAdminSession from "@/lib/require-admin-session";

// Until uploads arrive (step 3d), new projects start with this image.
const placeholderImage = {
  imageSrc: "https://placehold.co/1200x800/png",
  imageWidth: 1200,
  imageHeight: 800,
};

const createProject = async (
  _previousState: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> => {
  await requireAdminSession();
  const result = parseProjectForm(formData);
  if (!result.isValid) {
    return { fieldErrors: result.fieldErrors, isSaved: false };
  }

  const [createdProject] = await getDb()
    .insert(projects)
    .values({ ...result.values, ...placeholderImage })
    .returning({ id: projects.id });
  updateTag("projects");
  redirect(`/admin/projects/${createdProject.id}`);
};

export default createProject;
