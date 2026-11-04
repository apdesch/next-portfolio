// Zod lists every problem per field; forms show only the first message for each.
const getFirstFieldErrors = <FieldName extends string>(
  fieldErrors: Partial<Record<FieldName, string[]>>,
): Partial<Record<FieldName, string>> =>
  Object.fromEntries(
    Object.entries<string[] | undefined>(fieldErrors).map(
      ([field, messages]) => [field, messages?.[0]],
    ),
  ) as Partial<Record<FieldName, string>>;

export default getFirstFieldErrors;
