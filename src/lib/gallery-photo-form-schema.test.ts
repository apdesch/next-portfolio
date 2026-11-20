import { describe, expect, it } from "vitest";
import parseGalleryPhotoForm from "@/lib/gallery-photo-form-schema";

const createFormData = (fields: Record<string, string>): FormData =>
  Object.entries(fields).reduce((formData, [name, value]) => {
    formData.append(name, value);
    return formData;
  }, new FormData());

describe("parseGalleryPhotoForm", () => {
  it("accepts alt text and a gallery, trimmed", () => {
    expect(
      parseGalleryPhotoForm(
        createFormData({ alt: " Golden Gate at dusk ", category: " Travel " }),
      ),
    ).toEqual({
      isValid: true,
      values: { alt: "Golden Gate at dusk", category: "Travel" },
    });
  });

  it("requires both fields", () => {
    const result = parseGalleryPhotoForm(
      createFormData({ alt: " ", category: "" }),
    );
    expect(result.isValid ? null : result.fieldErrors).toEqual({
      alt: "Describe the photo for screen readers.",
      category: "Choose a gallery or name a new one.",
    });
  });
});
