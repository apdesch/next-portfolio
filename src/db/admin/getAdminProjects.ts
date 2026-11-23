import "server-only";
import { desc } from "drizzle-orm";
import getDb from "@/db/getDb";
import projects, { type Project } from "@/db/tables/projects";
import requireAdminSession from "@/lib/requireAdminSession";

type AdminProjectCard = Pick<
  Project,
  | "id"
  | "title"
  | "category"
  | "date"
  | "imageSrc"
  | "imageWidth"
  | "imageHeight"
>;

// Only what the project cards show, not Markdown bodies. Admin reads check the session
// themselves: a page renders alongside its layout, so a layout's check can't stop a page's
// data from being sent. Uncached, so edits show at once.
const getAdminProjects = async (): Promise<AdminProjectCard[]> => {
  await requireAdminSession();
  return getDb()
    .select({
      id: projects.id,
      title: projects.title,
      category: projects.category,
      date: projects.date,
      imageSrc: projects.imageSrc,
      imageWidth: projects.imageWidth,
      imageHeight: projects.imageHeight,
    })
    .from(projects)
    .orderBy(desc(projects.date));
};

export default getAdminProjects;
