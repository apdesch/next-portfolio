import { describe, expect, it } from "vitest";
import getSafeFileName from "@/lib/get-safe-file-name";

describe("getSafeFileName", () => {
  it.each([
    ["My Photo (1).JPG", "my-photo-1"],
    ["café-résumé.pdf", "cafe-resume"],
    ["../../etc/passwd", "etc-passwd"],
    ["archive.tar.gz", "archive-tar"],
    ["###.png", "file"],
    ["", "file"],
  ])("turns %j into %j", (fileName, expected) => {
    expect(getSafeFileName(fileName)).toBe(expected);
  });

  it("keeps names to 60 characters without a trailing dash", () => {
    const safeName = getSafeFileName(`${"a".repeat(59)} b.png`);
    expect(safeName).toBe("a".repeat(59));
  });
});
