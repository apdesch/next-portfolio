"use server";

import { eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { notFound } from "next/navigation";
import getDb from "@/db/getDb";
import projects from "@/db/tables/projects";
import checkImageFile from "@/lib/checkImageFile";
import deleteStoredFile from "@/lib/deleteStoredFile";
import getFailedFormState from "@/lib/getFailedFormState";
import getProjectImageColumns from "@/lib/getProjectImageColumns";
import getUploadedFile from "@/lib/getUploadedFile";
import isValidId from "@/lib/isValidId";
import parseProjectForm, {
  type ProjectFormState,
} from "@/lib/parseProjectForm";
import requireAdminSession from "@/lib/requireAdminSession";
import storeImage from "@/lib/storeImage";

// The edit page binds the project's ID as the first argument. Without a new image, the
// project keeps its current one.
const updateProject = async (
  projectId: number,
  _previousState: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> => {
  await requireAdminSession();
  if (!isValidId(projectId)) notFound();
  const result = parseProjectForm(formData);
  const imageFile = getUploadedFile(formData, "image");
  const imageError = checkImageFile(imageFile, false);
  if (!result.isValid || imageError) {
    return getFailedFormState(result, imageError);
  }

  const [existingProject] = await getDb()
    .select({ imageSrc: projects.imageSrc })
    .from(projects)
    .where(eq(projects.id, projectId));
  if (!existingProject) notFound();

  const storedImage = imageFile
    ? await storeImage(imageFile, "projects")
    : null;
  if (storedImage && !storedImage.isStored) {
    return { fieldErrors: { image: storedImage.errorMessage }, isSaved: false };
  }

  await getDb()
    .update(projects)
    .set({
      ...result.values,
      ...(storedImage?.isStored && getProjectImageColumns(storedImage.image)),
    })
    .where(eq(projects.id, projectId));
  updateTag("projects");
  if (storedImage) await deleteStoredFile(existingProject.imageSrc);
  return { fieldErrors: {}, isSaved: true };
};

export default updateProject;
