"use client";

import Link from "next/link";
import {
  type FC,
  type FormEvent,
  startTransition,
  useActionState,
} from "react";
import ButtonLabel from "@/components/admin/button-label";
import ConfirmDeleteButton from "@/components/admin/confirm-delete-button";
import FormField from "@/components/admin/form-field";
import ImagePickerField from "@/components/admin/image-picker-field";
import type { Project } from "@/db/tables/projects";
import adminInputClassName from "@/lib/admin-input-class-name";
import checkImageFile from "@/lib/check-image-file";
import getUploadedFile from "@/lib/get-uploaded-file";
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

type ProjectTextFieldName = Exclude<ProjectFieldName, "image">;

const initialFormState: ProjectFormState = {
  fieldErrors: {},
  isSaved: false,
};

const getProjectFieldValues = (
  project?: Project,
): Record<ProjectTextFieldName, string> => ({
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
  // A wrong or oversized image is stopped here: the server would reject the whole request.
  // The image picker already shows why a chosen image can't be used.
  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const imageFile = getUploadedFile(formData, "image");
    if (imageFile && checkImageFile(imageFile, false)) return;
    startTransition(() => submitProject(formData));
  };
  const hasErrors = Object.keys(state.fieldErrors).length > 0;

  // Each control gets its name, starting value and error wiring from one place.
  const getControlProps = (name: ProjectTextFieldName) => ({
    id: name,
    name,
    defaultValue: projectValues[name],
    "aria-invalid": state.fieldErrors[name] ? true : undefined,
    "aria-describedby": state.fieldErrors[name] ? `${name}-error` : undefined,
    className: adminInputClassName,
  });

  return (
    <div className="rounded-lg border border-admin-dark/10 bg-white/50 dark:border-admin-light/10 dark:bg-admin-light/5">
      <form
        id="project-form"
        onSubmit={handleSubmit}
        noValidate
        className="grid gap-5 p-6 @2xl:grid-cols-2"
      >
        <FormField
          name="title"
          label="Title"
          errorMessage={state.fieldErrors.title}
        >
          <input {...getControlProps("title")} />
        </FormField>
        <FormField
          name="company"
          label="Company (optional)"
          errorMessage={state.fieldErrors.company}
        >
          <input {...getControlProps("company")} />
        </FormField>
        <FormField
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
        </FormField>
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
        <FormField
          name="description"
          label="Description"
          errorMessage={state.fieldErrors.description}
          className="@2xl:col-span-2"
        >
          <input {...getControlProps("description")} />
        </FormField>
        <FormField
          name="skills"
          label="Skills (comma separated)"
          errorMessage={state.fieldErrors.skills}
          className="@2xl:col-span-2"
        >
          <input {...getControlProps("skills")} />
        </FormField>
        <FormField
          name="body"
          label="Body (Markdown)"
          errorMessage={state.fieldErrors.body}
          className="@2xl:col-span-2"
        >
          <textarea
            rows={10}
            {...getControlProps("body")}
            className={`${adminInputClassName} font-mono`}
          />
        </FormField>
        <ImagePickerField
          currentImageSrc={project?.imageSrc}
          serverErrorMessage={state.fieldErrors.image}
          isSaved={state.isSaved}
          className="@2xl:col-span-2"
        />
        <FormField
          name="imageAlt"
          label="Image description (alt text)"
          errorMessage={state.fieldErrors.imageAlt}
        >
          <input {...getControlProps("imageAlt")} />
        </FormField>
        <FormField
          name="url"
          label="Live link (optional)"
          errorMessage={state.fieldErrors.url}
        >
          <input type="url" {...getControlProps("url")} />
        </FormField>
      </form>
      {/* Outside the form, so the delete confirmation's own form isn't nested in it. */}
      <div className="flex items-center gap-3 border-t border-admin-dark/10 px-6 py-4 dark:border-admin-light/10">
        {deleteProject && (
          <ConfirmDeleteButton
            popoverId="delete-project"
            title="Delete this project?"
            confirmDelete={deleteProject}
          >
            It can&rsquo;t be undone.
          </ConfirmDeleteButton>
        )}
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
          className="rounded-md bg-admin-accent px-4 py-2 text-sm font-medium text-white enabled:hover:bg-admin-accent/90 disabled:opacity-60 dark:bg-admin-accent-dark dark:text-admin-dark dark:enabled:hover:bg-admin-accent-dark/90"
        >
          <ButtonLabel isBusy={isPending} label="Save" busyLabel="Saving…" />
        </button>
      </div>
    </div>
  );
};

export default ProjectForm;
