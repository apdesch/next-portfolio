import type { Metadata } from "next";
import Link from "next/link";
import type { FC } from "react";
import createProject from "@/app/admin/(console)/projects/create-project";
import ProjectForm from "@/components/admin/project-form";

const NewProjectPage: FC = () => (
  <div className="mx-auto max-w-4xl p-6">
    <p className="m-0 text-sm opacity-70">
      <Link href="/admin/projects" className="hover:underline">
        Projects
      </Link>{" "}
      / New project
    </p>
    <h1 className="mt-1 mb-6 text-2xl font-semibold">New project</h1>
    <ProjectForm saveProject={createProject} />
  </div>
);

export const metadata: Metadata = { title: "New project" };

export default NewProjectPage;
