import { describe, expect, it } from "vitest";
import checkImageFile from "@/lib/check-image-file";

const createFile = (type: string, sizeInBytes: number): File =>
  new File([new Uint8Array(sizeInBytes)], "photo", { type });

const fourMegabytes = 4 * 1024 * 1024;

describe("checkImageFile", () => {
  it("requires an image for new projects only", () => {
    expect(checkImageFile(null, true)).toBe("Choose an image.");
    expect(checkImageFile(null, false)).toBeNull();
  });

  it("treats an empty file input as no image", () => {
    expect(checkImageFile(createFile("", 0), true)).toBe("Choose an image.");
    expect(checkImageFile(createFile("", 0), false)).toBeNull();
  });

  it.each(["image/jpeg", "image/png", "image/webp", "image/avif"])(
    "accepts %s",
    (type) => {
      expect(checkImageFile(createFile(type, 1000), true)).toBeNull();
    },
  );

  it.each(["image/svg+xml", "image/gif", "application/pdf"])(
    "rejects %s",
    (type) => {
      expect(checkImageFile(createFile(type, 1000), true)).toBe(
        "Choose a JPEG, PNG, WebP or AVIF image.",
      );
    },
  );

  it("accepts exactly 4 MB and rejects anything larger", () => {
    expect(
      checkImageFile(createFile("image/png", fourMegabytes), true),
    ).toBeNull();
    expect(
      checkImageFile(createFile("image/png", fourMegabytes + 1), true),
    ).toBe("Choose an image under 4 MB, or resize it first.");
  });
});
