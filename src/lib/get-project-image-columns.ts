import type { Project } from "@/db/tables/projects";

type StoredImage = { src: string; width: number; height: number };

type ProjectImageColumns = Pick<
  Project,
  "imageSrc" | "imageWidth" | "imageHeight"
>;

// A stored image as the projects table's image columns.
const getProjectImageColumns = (image: StoredImage): ProjectImageColumns => ({
  imageSrc: image.src,
  imageWidth: image.width,
  imageHeight: image.height,
});

export default getProjectImageColumns;
