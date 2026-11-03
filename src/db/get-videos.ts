import "server-only";
import { asc } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import getDb from "@/db/client";
import videos, { type Video } from "@/db/tables/videos";

// Cached until the admin area calls updateTag("videos") after an edit (stage 3).
const getVideos = async (): Promise<Video[]> => {
  "use cache";
  cacheLife("max");
  cacheTag("videos");

  return getDb().select().from(videos).orderBy(asc(videos.position));
};

export default getVideos;
