"use server";

import { eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { notFound, redirect } from "next/navigation";
import getDb from "@/db/client";
import videos from "@/db/tables/videos";
import isValidId from "@/lib/is-valid-id";
import requireAdminSession from "@/lib/require-admin-session";

// The edit page binds the video's ID; the confirmation popover submits it.
const deleteVideo = async (videoId: number): Promise<void> => {
  await requireAdminSession();
  if (!isValidId(videoId)) notFound();
  await getDb().delete(videos).where(eq(videos.id, videoId));
  updateTag("videos");
  redirect("/admin/videos");
};

export default deleteVideo;
