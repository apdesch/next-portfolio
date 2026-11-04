"use server";

import { asc, eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { notFound } from "next/navigation";
import getDb from "@/db/client";
import videos from "@/db/tables/videos";
import findNeighbor, { type MoveDirection } from "@/lib/find-neighbor";
import isValidId from "@/lib/is-valid-id";
import requireAdminSession from "@/lib/require-admin-session";

// The list binds the video's ID and the direction. The two position updates run as one
// batch, which Neon applies as a single transaction: both happen or neither does.
const moveVideo = async (
  videoId: number,
  direction: MoveDirection,
): Promise<void> => {
  await requireAdminSession();
  if (!isValidId(videoId) || !["up", "down"].includes(direction)) notFound();

  const database = getDb();
  const orderedVideos = await database
    .select({ id: videos.id, position: videos.position })
    .from(videos)
    .orderBy(asc(videos.position));
  const video = orderedVideos.find(
    (orderedVideo) => orderedVideo.id === videoId,
  );
  const neighbor = findNeighbor(orderedVideos, videoId, direction);
  if (!video || !neighbor) return;

  await database.batch([
    database
      .update(videos)
      .set({ position: neighbor.position })
      .where(eq(videos.id, video.id)),
    database
      .update(videos)
      .set({ position: video.position })
      .where(eq(videos.id, neighbor.id)),
  ]);
  updateTag("videos");
};

export default moveVideo;
