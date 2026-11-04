import { describe, expect, it } from "vitest";
import type { GalleryPhoto } from "@/db/tables/gallery-photos";
import groupPhotosByCategory from "@/lib/group-photos-by-category";

const createPhoto = (id: number, category: string): GalleryPhoto => ({
  id,
  src: `https://example.com/${id}.webp`,
  alt: `Photo ${id}`,
  width: 1200,
  height: 800,
  category,
  position: id,
  createdAt: new Date(0),
  updatedAt: new Date(0),
});

describe("groupPhotosByCategory", () => {
  it("orders galleries by their first photo and keeps photo order", () => {
    const galleries = groupPhotosByCategory([
      createPhoto(1, "Street"),
      createPhoto(2, "Travel"),
      createPhoto(3, "Street"),
    ]);
    expect(
      galleries.map((gallery) => ({
        category: gallery.category,
        photoIds: gallery.photos.map((photo) => photo.id),
      })),
    ).toEqual([
      { category: "Street", photoIds: [1, 3] },
      { category: "Travel", photoIds: [2] },
    ]);
  });

  it("returns no galleries for no photos", () => {
    expect(groupPhotosByCategory([])).toEqual([]);
  });
});
