import { z } from "zod";
import projectCategory from "@/db/tables/project-category";

const requiredText = (message: string) =>
  z.string({ error: message }).trim().min(1, message);

// Blank optional fields are stored as null, not as empty strings.
const optionalText = z
  .string()
  .trim()
  .transform((value) => (value === "" ? null : value));

const parseSkills = (value: string): string[] => [
  ...new Set(
    value
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill !== ""),
  ),
];

// Projects are dated by month; the date column stores the 1st of that month.
const projectFormSchema = z
  .object({
    title: requiredText("Enter a title."),
    company: optionalText,
    category: z.enum(projectCategory.enumValues, {
      error: "Choose a category.",
    }),
    month: z
      .string({ error: "Choose a month." })
      .regex(/^(0[1-9]|1[0-2])$/, "Choose a month."),
    year: z
      .string({ error: "Enter a four-digit year." })
      .trim()
      .regex(/^\d{4}$/, "Enter a four-digit year."),
    description: requiredText("Enter a one-line description."),
    skills: z
      .string()
      .transform(parseSkills)
      .pipe(z.array(z.string()).min(1, "Add at least one skill.")),
    body: requiredText("Write the project body."),
    imageAlt: requiredText("Describe the image for screen readers."),
    // https only: blocks javascript: and other links that would run code when clicked.
    url: optionalText.pipe(
      z
        .url({ protocol: /^https$/, error: "Use a full https:// link." })
        .nullable(),
    ),
  })
  .transform(({ month, year, ...fields }) => ({
    ...fields,
    date: `${year}-${month}-01`,
  }));

type ProjectFormValues = z.output<typeof projectFormSchema>;

// The form's field names (month and year), not the stored columns (date).
type ProjectFormField = keyof z.input<typeof projectFormSchema>;

export type ProjectFormErrors = Partial<Record<ProjectFormField, string>>;

// What the form shows after a save attempt.
export type ProjectFormState = {
  fieldErrors: ProjectFormErrors;
  isSaved: boolean;
};

type ProjectFormResult =
  | { isValid: true; values: ProjectFormValues }
  | { isValid: false; fieldErrors: ProjectFormErrors };

// FormData values can also be files; the schema only reads text fields.
const getTextFieldValues = (formData: FormData): Record<string, string> =>
  Object.fromEntries(
    [...formData.entries()].filter(
      (entry): entry is [string, string] => typeof entry[1] === "string",
    ),
  );

// Keeps the first message per field, which is the one the form shows.
const getFirstFieldErrors = (
  fieldErrors: Partial<Record<ProjectFormField, string[]>>,
): ProjectFormErrors =>
  Object.fromEntries(
    Object.entries(fieldErrors).map(([field, messages]) => [
      field,
      messages?.[0],
    ]),
  );

const parseProjectForm = (formData: FormData): ProjectFormResult => {
  const result = projectFormSchema.safeParse(getTextFieldValues(formData));
  if (result.success) return { isValid: true, values: result.data };
  return {
    isValid: false,
    fieldErrors: getFirstFieldErrors(z.flattenError(result.error).fieldErrors),
  };
};

export default parseProjectForm;
