"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import getDb from "@/db/client";
import projects from "@/db/tables/projects";
import checkImageFile from "@/lib/check-image-file";
import getFailedFormState from "@/lib/get-failed-form-state";
import getProjectImageColumns from "@/lib/get-project-image-columns";
import getUploadedFile from "@/lib/get-uploaded-file";
import parseProjectForm, {
  type ProjectFormState,
} from "@/lib/project-form-schema";
import requireAdminSession from "@/lib/require-admin-session";
import storeImage from "@/lib/store-image";

const createProject = async (
  _previousState: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> => {
  await requireAdminSession();
  const result = parseProjectForm(formData);
  const imageFile = getUploadedFile(formData, "image");
  const imageError = checkImageFile(imageFile, true);
  if (!result.isValid || imageError || !imageFile) {
    return getFailedFormState(result, imageError);
  }

  const storedImage = await storeImage(imageFile, "projects");
  if (!storedImage.isStored) {
    return { fieldErrors: { image: storedImage.errorMessage }, isSaved: false };
  }

  const [createdProject] = await getDb()
    .insert(projects)
    .values({ ...result.values, ...getProjectImageColumns(storedImage.image) })
    .returning({ id: projects.id });
  updateTag("projects");
  redirect(`/admin/projects/${createdProject.id}`);
};

export default createProject;
