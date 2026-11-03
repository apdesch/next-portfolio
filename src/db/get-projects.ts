import "server-only";
import { desc } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import getDb from "@/db/client";
import projects, { type Project } from "@/db/tables/projects";

// Cached until the admin area calls updateTag("projects") after an edit (stage 3), so
// pages stay static and visitors never wait on the database.
const getProjects = async (): Promise<Project[]> => {
  "use cache";
  cacheLife("max");
  cacheTag("projects");

  return getDb().select().from(projects).orderBy(desc(projects.date));
};

export default getProjects;
