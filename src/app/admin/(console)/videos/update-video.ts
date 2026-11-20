"use server";

import { eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { notFound } from "next/navigation";
import getDb from "@/db/client";
import videos from "@/db/tables/videos";
import isValidId from "@/lib/is-valid-id";
import requireAdminSession from "@/lib/require-admin-session";
import parseVideoForm, { type VideoFormState } from "@/lib/video-form-schema";

// The edit page binds the video's ID as the first argument.
const updateVideo = async (
  videoId: number,
  _previousState: VideoFormState,
  formData: FormData,
): Promise<VideoFormState> => {
  await requireAdminSession();
  if (!isValidId(videoId)) notFound();
  const result = parseVideoForm(formData);
  if (!result.isValid) {
    return { fieldErrors: result.fieldErrors, isSaved: false };
  }

  const [updatedVideo] = await getDb()
    .update(videos)
    .set(result.values)
    .where(eq(videos.id, videoId))
    .returning({ id: videos.id });
  if (!updatedVideo) notFound();
  updateTag("videos");
  return { fieldErrors: {}, isSaved: true };
};

export default updateVideo;
