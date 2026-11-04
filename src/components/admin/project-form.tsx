"use client";

import Image from "next/image";
import Link from "next/link";
import {
  type FC,
  type FormEvent,
  type ReactNode,
  startTransition,
  useActionState,
} from "react";
import DeleteProjectButton from "@/components/admin/delete-project-button";
import type { Project } from "@/db/tables/projects";
import projectCategoryLabels from "@/lib/project-category-labels";
import type {
  ProjectFormErrors,
  ProjectFormState,
} from "@/lib/project-form-schema";

type ProjectFormProps = {
  project?: Project;
  saveProject: (
    previousState: ProjectFormState,
    formData: FormData,
  ) => Promise<ProjectFormState>;
  deleteProject?: () => Promise<void>;
};

type ProjectFieldName = keyof ProjectFormErrors;

const initialFormState: ProjectFormState = {
  fieldErrors: {},
  isSaved: false,
};

const getProjectFieldValues = (
  project?: Project,
): Record<ProjectFieldName, string> => ({
  title: project?.title ?? "",
  company: project?.company ?? "",
  category: project?.category ?? "",
  // Stored as YYYY-MM-01; the form edits only the month and year.
  month: project?.date.slice(5, 7) ?? "",
  year: project?.date.slice(0, 4) ?? "",
  description: project?.description ?? "",
  skills: project?.skills.join(", ") ?? "",
  body: project?.body ?? "",
  imageAlt: project?.imageAlt ?? "",
  url: project?.url ?? "",
});

const formatMonthName = new Intl.DateTimeFormat("en-US", {
  month: "long",
  timeZone: "UTC",
}).format;

// "01" to "12", labeled January to December.
const monthOptions = Array.from({ length: 12 }, (_value, monthIndex) => ({
  value: String(monthIndex + 1).padStart(2, "0"),
  label: formatMonthName(new Date(Date.UTC(2000, monthIndex, 1))),
}));

const inputClassName =
  "w-full rounded-md border border-admin-dark/20 bg-white px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-admin-accent aria-invalid:border-red-700 dark:border-admin-light/20 dark:bg-admin-light/5 dark:focus-visible:outline-admin-accent-dark dark:aria-invalid:border-red-400";

type FieldProps = {
  name: ProjectFieldName;
  label: string;
  errorMessage?: string;
  isWide?: boolean;
  children: ReactNode;
};

const Field: FC<FieldProps> = ({
  name,
  label,
  errorMessage,
  isWide,
  children,
}) => (
  <div className={isWide ? "@2xl:col-span-2" : undefined}>
    <label htmlFor={name} className="mb-1 block text-sm font-medium">
      {label}
    </label>
    {children}
    {errorMessage && (
      <p
        id={`${name}-error`}
        className="mt-1 mb-0 text-sm text-red-700 dark:text-red-400"
      >
        {errorMessage}
      </p>
    )}
  </div>
);

const ProjectForm: FC<ProjectFormProps> = ({
  project,
  saveProject,
  deleteProject,
}) => {
  const [state, submitProject, isPending] = useActionState(
    saveProject,
    initialFormState,
  );
  const projectValues = getProjectFieldValues(project);

  // Submits without the form `action` prop, because React resets a form after its action
  // runs (and selects snap back to their first value). This keeps every field as typed.
  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => submitProject(formData));
  };
  const hasErrors = Object.keys(state.fieldErrors).length > 0;

  // Each control gets its name, starting value and error wiring from one place.
  const getControlProps = (name: ProjectFieldName) => ({
    id: name,
    name,
    defaultValue: projectValues[name],
    "aria-invalid": state.fieldErrors[name] ? true : undefined,
    "aria-describedby": state.fieldErrors[name] ? `${name}-error` : undefined,
    className: inputClassName,
  });

  return (
    <div className="rounded-lg border border-admin-dark/10 bg-white/50 dark:border-admin-light/10 dark:bg-admin-light/5">
      <form
        id="project-form"
        onSubmit={handleSubmit}
        noValidate
        className="grid gap-5 p-6 @2xl:grid-cols-2"
      >
        <Field
          name="title"
          label="Title"
          errorMessage={state.fieldErrors.title}
        >
          <input {...getControlProps("title")} />
        </Field>
        <Field
          name="company"
          label="Company (optional)"
          errorMessage={state.fieldErrors.company}
        >
          <input {...getControlProps("company")} />
        </Field>
        <Field
          name="category"
          label="Category"
          errorMessage={state.fieldErrors.category}
        >
          <select {...getControlProps("category")}>
            <option value="" disabled>
              Choose a category
            </option>
            {/* From the labels map, so Drizzle's table code stays out of the browser bundle. */}
            {Object.entries(projectCategoryLabels).map(([category, label]) => (
              <option key={category} value={category}>
                {label}
              </option>
            ))}
          </select>
        </Field>
        <fieldset className="m-0 min-w-0 border-0 p-0">
          <legend className="mb-1 p-0 text-sm font-medium">Date</legend>
          <div className="flex gap-2">
            <select aria-label="Month" {...getControlProps("month")}>
              <option value="" disabled>
                Month
              </option>
              {monthOptions.map((monthOption) => (
                <option key={monthOption.value} value={monthOption.value}>
                  {monthOption.label}
                </option>
              ))}
            </select>
            <div className="w-24 shrink-0">
              <input
                aria-label="Year"
                inputMode="numeric"
                maxLength={4}
                placeholder="Year"
                {...getControlProps("year")}
              />
            </div>
          </div>
          {(["month", "year"] as const).map(
            (name) =>
              state.fieldErrors[name] && (
                <p
                  key={name}
                  id={`${name}-error`}
                  className="mt-1 mb-0 text-sm text-red-700 dark:text-red-400"
                >
                  {state.fieldErrors[name]}
                </p>
              ),
          )}
        </fieldset>
        <Field
          name="description"
          label="Description"
          errorMessage={state.fieldErrors.description}
          isWide
        >
          <input {...getControlProps("description")} />
        </Field>
        <Field
          name="skills"
          label="Skills (comma separated)"
          errorMessage={state.fieldErrors.skills}
          isWide
        >
          <input {...getControlProps("skills")} />
        </Field>
        <Field
          name="body"
          label="Body (Markdown)"
          errorMessage={state.fieldErrors.body}
          isWide
        >
          <textarea
            rows={10}
            {...getControlProps("body")}
            className={`${inputClassName} font-mono`}
          />
        </Field>
        <div className="@2xl:col-span-2">
          <p className="mt-0 mb-1 text-sm font-medium">Image</p>
          <div className="flex items-center gap-4">
            {project && (
              <Image
                src={project.imageSrc}
                alt=""
                width={project.imageWidth}
                height={project.imageHeight}
                sizes="8em"
                className="aspect-3/2 w-32 rounded-md object-cover"
              />
            )}
            <p className="m-0 text-sm opacity-70">
              {project
                ? "Image upload arrives in the next step."
                : "New projects start with a placeholder image. Image upload arrives in the next step."}
            </p>
          </div>
        </div>
        <Field
          name="imageAlt"
          label="Image description (alt text)"
          errorMessage={state.fieldErrors.imageAlt}
        >
          <input {...getControlProps("imageAlt")} />
        </Field>
        <Field
          name="url"
          label="Live link (optional)"
          errorMessage={state.fieldErrors.url}
        >
          <input type="url" {...getControlProps("url")} />
        </Field>
      </form>
      {/* Outside the form, so the delete confirmation's own form isn't nested in it. */}
      <div className="flex items-center gap-3 border-t border-admin-dark/10 px-6 py-4 dark:border-admin-light/10">
        {deleteProject && <DeleteProjectButton deleteProject={deleteProject} />}
        <p
          role="status"
          className="m-0 ml-auto text-sm text-admin-dark/70 dark:text-admin-light/70"
        >
          {state.isSaved && !isPending && "Saved"}
          {hasErrors && !isPending && "Check the highlighted fields."}
        </p>
        <Link
          href="/admin/projects"
          className="rounded-md px-4 py-2 text-sm hover:bg-admin-dark/5 dark:hover:bg-admin-light/10"
        >
          Cancel
        </Link>
        <button
          type="submit"
          form="project-form"
          disabled={isPending}
          className="rounded-md bg-admin-accent px-4 py-2 text-sm font-medium text-white hover:bg-admin-accent/90 disabled:opacity-60 dark:bg-admin-accent-dark dark:text-admin-dark dark:hover:bg-admin-accent-dark/90"
        >
          {isPending ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
};

export default ProjectForm;
