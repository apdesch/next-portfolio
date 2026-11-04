"use client";

import Image from "next/image";
import Link from "next/link";
import {
  type FC,
  type FormEvent,
  startTransition,
  useActionState,
  useState,
} from "react";
import ConfirmDeleteButton from "@/components/admin/confirm-delete-button";
import FormField from "@/components/admin/form-field";
import VideoPreviewButton from "@/components/admin/video-preview-button";
import type { Video } from "@/db/tables/videos";
import adminInputClassName from "@/lib/admin-input-class-name";
import getYoutubeThumbnailUrl from "@/lib/get-youtube-thumbnail-url";
import getYoutubeVideoId from "@/lib/get-youtube-video-id";
import type { VideoFormErrors, VideoFormState } from "@/lib/video-form-schema";

type VideoFormProps = {
  video?: Video;
  saveVideo: (
    previousState: VideoFormState,
    formData: FormData,
  ) => Promise<VideoFormState>;
  deleteVideo?: () => Promise<void>;
};

const initialFormState: VideoFormState = { fieldErrors: {}, isSaved: false };

const VideoForm: FC<VideoFormProps> = ({ video, saveVideo, deleteVideo }) => {
  const [state, submitVideo, isPending] = useActionState(
    saveVideo,
    initialFormState,
  );
  const [previewVideoId, setPreviewVideoId] = useState(
    video ? getYoutubeVideoId(video.youtubeUrl) : null,
  );
  const hasErrors = Object.keys(state.fieldErrors).length > 0;

  // Submits without the form `action` prop, so React doesn't reset the fields after saving.
  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => submitVideo(formData));
  };

  const getErrorProps = (name: keyof VideoFormErrors) => ({
    "aria-invalid": state.fieldErrors[name] ? true : undefined,
    "aria-describedby": state.fieldErrors[name] ? `${name}-error` : undefined,
  });

  return (
    <div className="rounded-lg border border-admin-dark/10 bg-white/50 dark:border-admin-light/10 dark:bg-admin-light/5">
      <form
        id="video-form"
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-5 p-6"
      >
        <FormField
          name="youtubeUrl"
          label="YouTube link"
          errorMessage={state.fieldErrors.youtubeUrl}
        >
          <input
            id="youtubeUrl"
            name="youtubeUrl"
            type="url"
            defaultValue={video?.youtubeUrl}
            onChange={(event) =>
              setPreviewVideoId(
                getYoutubeVideoId(event.currentTarget.value.trim()),
              )
            }
            {...getErrorProps("youtubeUrl")}
            className={adminInputClassName}
          />
        </FormField>
        {previewVideoId && (
          <div className="flex items-center gap-4">
            <div className="relative aspect-video w-64 overflow-hidden rounded-md">
              <Image
                src={getYoutubeThumbnailUrl(previewVideoId)}
                alt=""
                fill
                sizes="16rem"
                className="object-cover"
              />
            </div>
            <VideoPreviewButton
              videoId={previewVideoId}
              title={video?.description ?? "New video"}
              className="text-sm font-medium text-admin-accent hover:underline dark:text-admin-accent-dark"
            >
              Preview
            </VideoPreviewButton>
          </div>
        )}
        <FormField
          name="description"
          label="Caption"
          errorMessage={state.fieldErrors.description}
        >
          <input
            id="description"
            name="description"
            defaultValue={video?.description}
            {...getErrorProps("description")}
            className={adminInputClassName}
          />
        </FormField>
      </form>
      <div className="flex items-center gap-3 border-t border-admin-dark/10 px-6 py-4 dark:border-admin-light/10">
        {deleteVideo && (
          <ConfirmDeleteButton
            popoverId="delete-video"
            title="Delete this video?"
            confirmDelete={deleteVideo}
          >
            It comes off the home page. The video stays on YouTube.
          </ConfirmDeleteButton>
        )}
        <p
          role="status"
          className="m-0 ml-auto text-sm text-admin-dark/70 dark:text-admin-light/70"
        >
          {state.isSaved && !isPending && "Saved"}
          {hasErrors && !isPending && "Check the highlighted fields."}
        </p>
        <Link
          href="/admin/videos"
          className="rounded-md px-4 py-2 text-sm hover:bg-admin-dark/5 dark:hover:bg-admin-light/10"
        >
          Cancel
        </Link>
        <button
          type="submit"
          form="video-form"
          disabled={isPending}
          className="rounded-md bg-admin-accent px-4 py-2 text-sm font-medium text-white enabled:hover:bg-admin-accent/90 disabled:opacity-60 dark:bg-admin-accent-dark dark:text-admin-dark dark:enabled:hover:bg-admin-accent-dark/90"
        >
          {isPending ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
};

export default VideoForm;
