type ParseResult<FieldErrors> =
  { isValid: true } | { isValid: false; fieldErrors: FieldErrors };

type FailedFormState<FieldErrors> = {
  fieldErrors: FieldErrors;
  isSaved: false;
};

// What a form with an image shows when its save is rejected: the text fields' errors plus
// the image's, checked separately, in one set.
const getFailedFormState = <FieldErrors extends { image?: string }>(
  result: ParseResult<FieldErrors>,
  imageError: string | null,
): FailedFormState<FieldErrors> => ({
  fieldErrors: {
    ...(result.isValid ? {} : result.fieldErrors),
    ...(imageError ? { image: imageError } : {}),
  } as FieldErrors,
  isSaved: false,
});

export default getFailedFormState;
