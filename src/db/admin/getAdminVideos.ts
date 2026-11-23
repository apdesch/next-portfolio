import "server-only";
import { asc } from "drizzle-orm";
import getDb from "@/db/getDb";
import videos, { type Video } from "@/db/tables/videos";
import requireAdminSession from "@/lib/requireAdminSession";

// In home page order, checked against the session like every admin read.
const getAdminVideos = async (): Promise<Video[]> => {
  await requireAdminSession();
  return getDb().select().from(videos).orderBy(asc(videos.position));
};

export default getAdminVideos;
