import { describe, expect, it } from "vitest";
import parseVideoForm from "@/lib/video-form-schema";

const createFormData = (fields: Record<string, string>): FormData =>
  Object.entries(fields).reduce((formData, [name, value]) => {
    formData.append(name, value);
    return formData;
  }, new FormData());

describe("parseVideoForm", () => {
  it("accepts a YouTube link and a caption, trimmed", () => {
    expect(
      parseVideoForm(
        createFormData({
          youtubeUrl: " https://youtu.be/4-ZZnb3-eOA ",
          description: " B-roll footage. ",
        }),
      ),
    ).toEqual({
      isValid: true,
      values: {
        youtubeUrl: "https://youtu.be/4-ZZnb3-eOA",
        description: "B-roll footage.",
      },
    });
  });

  it("rejects a link the home page couldn't play and a blank caption", () => {
    const result = parseVideoForm(
      createFormData({ youtubeUrl: "https://vimeo.com/1", description: " " }),
    );
    expect(result.isValid ? null : result.fieldErrors).toEqual({
      youtubeUrl: "Paste a YouTube video link, such as https://youtu.be/…",
      description: "Write a caption.",
    });
  });

  it("reports missing fields", () => {
    expect(parseVideoForm(new FormData())).toMatchObject({
      isValid: false,
      fieldErrors: {
        youtubeUrl: "Paste a YouTube video link.",
        description: "Write a caption.",
      },
    });
  });
});
