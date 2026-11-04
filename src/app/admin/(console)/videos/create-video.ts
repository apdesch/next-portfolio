"use server";

import { max } from "drizzle-orm";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import getDb from "@/db/client";
import videos from "@/db/tables/videos";
import requireAdminSession from "@/lib/require-admin-session";
import parseVideoForm, { type VideoFormState } from "@/lib/video-form-schema";

// New videos go to the end of the list.
const createVideo = async (
  _previousState: VideoFormState,
  formData: FormData,
): Promise<VideoFormState> => {
  await requireAdminSession();
  const result = parseVideoForm(formData);
  if (!result.isValid) {
    return { fieldErrors: result.fieldErrors, isSaved: false };
  }

  const [{ lastPosition }] = await getDb()
    .select({ lastPosition: max(videos.position) })
    .from(videos);
  await getDb()
    .insert(videos)
    .values({ ...result.values, position: (lastPosition ?? 0) + 1 });
  updateTag("videos");
  redirect("/admin/videos");
};

export default createVideo;
