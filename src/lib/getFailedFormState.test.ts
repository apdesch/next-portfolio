import { describe, expect, it } from "vitest";
import getFailedFormState from "@/lib/getFailedFormState";

describe("getFailedFormState", () => {
  it("combines the text fields' errors with the image's", () => {
    expect(
      getFailedFormState(
        { isValid: false, fieldErrors: { title: "Enter a title." } },
        "Choose an image.",
      ),
    ).toEqual({
      fieldErrors: { title: "Enter a title.", image: "Choose an image." },
      isSaved: false,
    });
  });

  it("reports only the image when the text fields are valid", () => {
    expect(getFailedFormState({ isValid: true }, "Choose an image.")).toEqual({
      fieldErrors: { image: "Choose an image." },
      isSaved: false,
    });
  });

  it("reports only the text fields when the image is fine", () => {
    expect(
      getFailedFormState(
        { isValid: false, fieldErrors: { title: "Enter a title." } },
        null,
      ),
    ).toEqual({ fieldErrors: { title: "Enter a title." }, isSaved: false });
  });
});
