"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import getDb from "@/db/client";
import projects from "@/db/tables/projects";
import checkImageFile from "@/lib/check-image-file";
import getUploadedFile from "@/lib/get-uploaded-file";
import parseProjectForm, {
  type ProjectFormState,
} from "@/lib/project-form-schema";
import requireAdminSession from "@/lib/require-admin-session";
import storeProjectImage from "@/lib/store-project-image";

const createProject = async (
  _previousState: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> => {
  await requireAdminSession();
  const result = parseProjectForm(formData);
  const imageFile = getUploadedFile(formData, "image");
  const imageError = checkImageFile(imageFile, true);
  if (!result.isValid || imageError || !imageFile) {
    return {
      fieldErrors: {
        ...(result.isValid ? {} : result.fieldErrors),
        ...(imageError ? { image: imageError } : {}),
      },
      isSaved: false,
    };
  }

  const storedImage = await storeProjectImage(imageFile);
  if (!storedImage.isStored) {
    return { fieldErrors: { image: storedImage.errorMessage }, isSaved: false };
  }

  const [createdProject] = await getDb()
    .insert(projects)
    .values({ ...result.values, ...storedImage.image })
    .returning({ id: projects.id });
  updateTag("projects");
  redirect(`/admin/projects/${createdProject.id}`);
};

export default createProject;
