import { describe, expect, it } from "vitest";
import parseProjectForm from "@/lib/project-form-schema";

const validFields: Record<string, string> = {
  title: "Facebook",
  company: "Meta",
  category: "app",
  month: "03",
  year: "2026",
  description: "One-line description.",
  skills: "React, TypeScript",
  body: "What I built and why.",
  imageAlt: "The Facebook home page",
  url: "https://example.com/project",
};

const createFormData = (fields: Record<string, string>): FormData =>
  Object.entries(fields).reduce((formData, [name, value]) => {
    formData.append(name, value);
    return formData;
  }, new FormData());

const parseFields = (overrides: Record<string, string>) =>
  parseProjectForm(createFormData({ ...validFields, ...overrides }));

describe("parseProjectForm", () => {
  it("accepts a complete project", () => {
    expect(parseFields({})).toEqual({
      isValid: true,
      values: {
        title: "Facebook",
        company: "Meta",
        category: "app",
        date: "2026-03-01",
        description: "One-line description.",
        skills: ["React", "TypeScript"],
        body: "What I built and why.",
        imageAlt: "The Facebook home page",
        url: "https://example.com/project",
      },
    });
  });

  it("trims text and stores blank optional fields as null", () => {
    const result = parseFields({
      title: "  Facebook  ",
      company: " ",
      url: "",
    });
    expect(result).toMatchObject({
      isValid: true,
      values: { title: "Facebook", company: null, url: null },
    });
  });

  it("splits skills on commas, dropping blanks and duplicates", () => {
    const result = parseFields({ skills: " React,, TypeScript , React ," });
    expect(result).toMatchObject({
      isValid: true,
      values: { skills: ["React", "TypeScript"] },
    });
  });

  it("reports each missing required field", () => {
    const result = parseFields({ title: " ", skills: " , ", body: "" });
    // Exactly these three fields, so a valid field never shows an error.
    expect(result.isValid ? null : result.fieldErrors).toEqual({
      title: "Enter a title.",
      skills: "Add at least one skill.",
      body: "Write the project body.",
    });
  });

  it("rejects a category outside the allowed list", () => {
    expect(parseFields({ category: "video" })).toMatchObject({
      isValid: false,
      fieldErrors: { category: "Choose a category." },
    });
  });

  it("rejects a month outside 01 to 12 and a year that isn't four digits", () => {
    expect(parseFields({ month: "13", year: "26" })).toMatchObject({
      isValid: false,
      fieldErrors: {
        month: "Choose a month.",
        year: "Enter a four-digit year.",
      },
    });
  });

  it.each(["http://example.com", "javascript:alert(1)", "example.com"])(
    "rejects the live link %s",
    (url) => {
      expect(parseFields({ url })).toMatchObject({
        isValid: false,
        fieldErrors: { url: "Use a full https:// link." },
      });
    },
  );
});
