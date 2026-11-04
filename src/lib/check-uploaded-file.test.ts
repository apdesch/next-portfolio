import { describe, expect, it } from "vitest";
import checkUploadedFile from "@/lib/check-uploaded-file";

const encodeText = (text: string): Uint8Array => new TextEncoder().encode(text);

describe("checkUploadedFile", () => {
  it("accepts a real PDF", () => {
    expect(
      checkUploadedFile("White Paper.PDF", encodeText("%PDF-1.7\n...")),
    ).toEqual({
      isAllowed: true,
      kind: "pdf",
      extension: "pdf",
      contentType: "application/pdf",
    });
  });

  it("rejects a file named .pdf that isn't one", () => {
    expect(
      checkUploadedFile("fake.pdf", encodeText("<script>alert(1)</script>")),
    ).toEqual({
      isAllowed: false,
      errorMessage: "That file isn't a real PDF.",
    });
  });

  it.each(["notes.txt", "README.md", "app.ts", "script.js", "tool.py"])(
    "accepts %s as plain text",
    (fileName) => {
      expect(
        checkUploadedFile(fileName, encodeText("const café = 'ok';\n")),
      ).toMatchObject({
        isAllowed: true,
        kind: "text",
        contentType: "text/plain; charset=utf-8",
      });
    },
  );

  it.each([
    "page.html",
    "image.svg",
    "report.docx",
    "archive.zip",
    "noextension",
  ])("rejects %s", (fileName) => {
    expect(checkUploadedFile(fileName, encodeText("hello"))).toEqual({
      isAllowed: false,
      errorMessage: "Choose a PDF, .txt, .md, .ts, .js or .py file.",
    });
  });

  it("rejects binary content named like a text file", () => {
    const binaryBytes = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x00, 0x1a]);
    expect(checkUploadedFile("photo.txt", binaryBytes)).toEqual({
      isAllowed: false,
      errorMessage: "That file isn't plain text.",
    });
  });

  it("rejects invalid UTF-8", () => {
    expect(
      checkUploadedFile("broken.md", new Uint8Array([0x68, 0xc3, 0x28])),
    ).toMatchObject({ isAllowed: false });
  });

  it("rejects files over 4 MB", () => {
    const largeText = new Uint8Array(4 * 1024 * 1024 + 1).fill(0x61);
    expect(checkUploadedFile("big.txt", largeText)).toEqual({
      isAllowed: false,
      errorMessage: "Choose a file under 4 MB.",
    });
  });
});
