import "server-only";
import { desc } from "drizzle-orm";
import getDb from "@/db/client";
import projects, { type Project } from "@/db/tables/projects";
import requireAdminSession from "@/lib/require-admin-session";

// Admin reads check the session themselves: a page renders alongside its layout, so a
// layout's check can't stop a page's data from being sent. Uncached, so edits show at once.
const getAdminProjects = async (): Promise<Project[]> => {
  await requireAdminSession();
  return getDb().select().from(projects).orderBy(desc(projects.date));
};

export default getAdminProjects;
