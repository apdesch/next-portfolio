import { describe, expect, it } from "vitest";
import getFailedFormState from "@/lib/get-failed-form-state";

type TestErrors = { title?: string; image?: string };

describe("getFailedFormState", () => {
  it("combines the text fields' errors with the image's", () => {
    expect(
      getFailedFormState<TestErrors>(
        { isValid: false, fieldErrors: { title: "Enter a title." } },
        "Choose an image.",
      ),
    ).toEqual({
      fieldErrors: { title: "Enter a title.", image: "Choose an image." },
      isSaved: false,
    });
  });

  it("reports only the image when the text fields are valid", () => {
    expect(
      getFailedFormState<TestErrors>({ isValid: true }, "Choose an image."),
    ).toEqual({ fieldErrors: { image: "Choose an image." }, isSaved: false });
  });

  it("reports only the text fields when the image is fine", () => {
    expect(
      getFailedFormState<TestErrors>(
        { isValid: false, fieldErrors: { title: "Enter a title." } },
        null,
      ),
    ).toEqual({ fieldErrors: { title: "Enter a title." }, isSaved: false });
  });
});
