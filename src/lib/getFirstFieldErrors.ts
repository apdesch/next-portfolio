type FieldErrors = Record<string, string | undefined>;

// Zod lists every problem per field; forms show only the first message for each.
const getFirstFieldErrors = (
  fieldErrors: Record<string, string[] | undefined>,
): FieldErrors =>
  Object.fromEntries(
    Object.entries(fieldErrors).map(([field, messages]) => [
      field,
      messages?.[0],
    ]),
  );

export default getFirstFieldErrors;
