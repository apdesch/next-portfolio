// An empty file input still submits a nameless, zero-byte File; that counts as no file.
const getUploadedFile = (
  formData: FormData,
  fieldName: string,
): File | null => {
  const value = formData.get(fieldName);
  return value instanceof File && value.size > 0 ? value : null;
};

export default getUploadedFile;
