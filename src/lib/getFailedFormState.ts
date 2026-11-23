type FieldErrors = Record<string, string | undefined>;

type ParseResult =
  { isValid: true } | { isValid: false; fieldErrors: FieldErrors };

type FailedFormState = {
  fieldErrors: FieldErrors;
  isSaved: false;
};

// What a form with an image shows when its save is rejected: the text fields' errors plus
// the image's, checked separately, in one set.
const getFailedFormState = (
  result: ParseResult,
  imageError: string | null,
): FailedFormState => ({
  fieldErrors: {
    ...(result.isValid ? {} : result.fieldErrors),
    ...(imageError ? { image: imageError } : {}),
  },
  isSaved: false,
});

export default getFailedFormState;
