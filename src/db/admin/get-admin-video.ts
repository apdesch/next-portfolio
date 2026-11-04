import "server-only";
import { eq } from "drizzle-orm";
import getDb from "@/db/client";
import videos, { type Video } from "@/db/tables/videos";
import isValidId from "@/lib/is-valid-id";
import requireAdminSession from "@/lib/require-admin-session";

const getAdminVideo = async (videoId: number): Promise<Video | null> => {
  await requireAdminSession();
  if (!isValidId(videoId)) return null;
  const [video] = await getDb()
    .select()
    .from(videos)
    .where(eq(videos.id, videoId));
  return video ?? null;
};

export default getAdminVideo;
