import { describe, expect, it } from "vitest";
import isOwnStoredFile from "@/lib/isOwnStoredFile";

const ownFile =
  "https://abc123def.public.blob.vercel-storage.com/projects/photo-x1.webp";
const otherStoreFile =
  "https://zzz999yyy.public.blob.vercel-storage.com/projects/photo-x1.webp";
const keyEnvironment = {
  BLOB_READ_WRITE_TOKEN: "vercel_blob_rw_AbC123Def_secret",
};

describe("isOwnStoredFile", () => {
  it("recognizes files in the key's own store", () => {
    expect(isOwnStoredFile(ownFile, keyEnvironment)).toBe(true);
  });

  it("leaves files in another store alone", () => {
    expect(isOwnStoredFile(otherStoreFile, keyEnvironment)).toBe(false);
  });

  it("reads the store from BLOB_STORE_ID with Vercel's automatic sign-in", () => {
    expect(isOwnStoredFile(ownFile, { BLOB_STORE_ID: "store_AbC123Def" })).toBe(
      true,
    );
  });

  it("never treats placeholder images or bad URLs as stored files", () => {
    expect(
      isOwnStoredFile("https://placehold.co/1200x800/png", keyEnvironment),
    ).toBe(false);
    expect(isOwnStoredFile("not a url", keyEnvironment)).toBe(false);
  });

  it("deletes nothing without a key", () => {
    expect(isOwnStoredFile(ownFile, {})).toBe(false);
  });
});
