import type { GalleryPhoto } from "@/db/tables/gallery-photos";

type Gallery = {
  category: string;
  photos: GalleryPhoto[];
};

// Photos arrive ordered by position, so galleries appear in the order of their first
// photo and each gallery keeps its photos in order. Shared by the home page and the admin.
const groupPhotosByCategory = (photos: readonly GalleryPhoto[]): Gallery[] =>
  photos.reduce<Gallery[]>((galleries, photo) => {
    const hasGallery = galleries.some(
      (gallery) => gallery.category === photo.category,
    );
    if (!hasGallery) {
      return [...galleries, { category: photo.category, photos: [photo] }];
    }
    return galleries.map((gallery) =>
      gallery.category === photo.category
        ? { ...gallery, photos: [...gallery.photos, photo] }
        : gallery,
    );
  }, []);

export default groupPhotosByCategory;
