"use server";

import { eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { notFound } from "next/navigation";
import getDb from "@/db/client";
import projects from "@/db/tables/projects";
import checkImageFile from "@/lib/check-image-file";
import deleteStoredFile from "@/lib/delete-stored-file";
import getUploadedFile from "@/lib/get-uploaded-file";
import isValidId from "@/lib/is-valid-id";
import parseProjectForm, {
  type ProjectFormState,
} from "@/lib/project-form-schema";
import requireAdminSession from "@/lib/require-admin-session";
import storeImage from "@/lib/store-image";

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
    return {
      fieldErrors: {
        ...(result.isValid ? {} : result.fieldErrors),
        ...(imageError ? { image: imageError } : {}),
      },
      isSaved: false,
    };
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
      ...(storedImage?.isStored && {
        imageSrc: storedImage.image.src,
        imageWidth: storedImage.image.width,
        imageHeight: storedImage.image.height,
      }),
    })
    .where(eq(projects.id, projectId));
  updateTag("projects");
  if (storedImage) await deleteStoredFile(existingProject.imageSrc);
  return { fieldErrors: {}, isSaved: true };
};

export default updateProject;
