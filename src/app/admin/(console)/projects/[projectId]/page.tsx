import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { type FC, Suspense } from "react";
import AdminPageLoading from "@/components/admin/admin-page-loading";
import deleteProject from "@/app/admin/(console)/projects/delete-project";
import updateProject from "@/app/admin/(console)/projects/update-project";
import ProjectForm from "@/components/admin/project-form";
import getAdminProject from "@/db/admin/get-admin-project";

const EditProjectContent: FC<
  PageProps<"/admin/projects/[projectId]">
> = async ({ params }) => {
  const { projectId } = await params;
  const project = await getAdminProject(Number(projectId));
  if (!project) notFound();

  return (
    <div className="mx-auto max-w-4xl p-6">
      <p className="m-0 text-sm opacity-70">
        <Link href="/admin/projects" className="hover:underline">
          Projects
        </Link>{" "}
        / {project.title}
      </p>
      <h1 className="mt-1 mb-6 text-2xl font-semibold">Edit project</h1>
      <ProjectForm
        project={project}
        saveProject={updateProject.bind(null, project.id)}
        deleteProject={deleteProject.bind(null, project.id)}
      />
    </div>
  );
};

// Its own Suspense boundary, so opening this page from anywhere in the admin shows the
// placeholder at once instead of waiting for its data (see admin-page-loading.tsx).
const EditProjectPage: FC<PageProps<"/admin/projects/[projectId]">> = (
  props,
) => (
  <Suspense fallback={<AdminPageLoading />}>
    <EditProjectContent {...props} />
  </Suspense>
);

export const metadata: Metadata = { title: "Edit project" };

export default EditProjectPage;
