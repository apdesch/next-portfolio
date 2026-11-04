import { describe, expect, it } from "vitest";
import getAltTextFromFileName from "@/lib/get-alt-text-from-file-name";

describe("getAltTextFromFileName", () => {
  it.each([
    ["golden-gate_at-dusk.jpg", "Golden gate at dusk"],
    ["IMG_1234.HEIC.jpg", "IMG 1234 HEIC"],
    ["palace of fine arts.png", "Palace of fine arts"],
    [".jpg", "Photo"],
  ])("turns %j into %j", (fileName, expected) => {
    expect(getAltTextFromFileName(fileName)).toBe(expected);
  });
});
