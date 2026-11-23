"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import getDb from "@/db/getDb";
import projects from "@/db/tables/projects";
import checkImageFile from "@/lib/checkImageFile";
import getFailedFormState from "@/lib/getFailedFormState";
import getProjectImageColumns from "@/lib/getProjectImageColumns";
import getUploadedFile from "@/lib/getUploadedFile";
import parseProjectForm, {
  type ProjectFormState,
} from "@/lib/parseProjectForm";
import requireAdminSession from "@/lib/requireAdminSession";
import storeImage from "@/lib/storeImage";

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
