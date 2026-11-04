"use client";

import Image from "next/image";
import Link from "next/link";
import { type FC, startTransition, useOptimistic } from "react";
import MoveButtons from "@/components/admin/move-buttons";
import VideoPreviewButton from "@/components/admin/video-preview-button";
import type { Video } from "@/db/tables/videos";
import type { MoveDirection } from "@/lib/find-neighbor";
import getYoutubeThumbnailUrl from "@/lib/get-youtube-thumbnail-url";
import getYoutubeVideoId from "@/lib/get-youtube-video-id";
import moveItem from "@/lib/move-item";

type VideoRowSummaryProps = { video: Video; videoId: string | null };

// A link the home page can't play has no thumbnail or preview, only its caption.
const VideoRowSummary: FC<VideoRowSummaryProps> = ({ video, videoId }) => (
  <>
    <span className="relative hidden aspect-video w-24 shrink-0 overflow-hidden rounded-sm bg-admin-dark/10 @md:block dark:bg-admin-light/10">
      {videoId && (
        <Image
          src={getYoutubeThumbnailUrl(videoId)}
          alt=""
          fill
          sizes="6rem"
          className="object-cover"
        />
      )}
    </span>
    <span className="min-w-0">
      <span className="block truncate text-sm font-medium group-hover:underline">
        {video.description}
      </span>
      <span className="block truncate text-xs opacity-60">
        {video.youtubeUrl}
      </span>
    </span>
  </>
);

type VideoMove = { videoId: number; direction: MoveDirection };

type VideoListProps = {
  videos: Video[];
  moveVideo: (videoId: number, direction: MoveDirection) => Promise<void>;
};

// Moves show at once (useOptimistic) while the server saves them. When the save finishes,
// the page's fresh list replaces the optimistic one; if it failed, that's the old order.
const VideoList: FC<VideoListProps> = ({ videos, moveVideo }) => {
  const [orderedVideos, showMove] = useOptimistic(
    videos,
    (currentVideos: Video[], move: VideoMove) =>
      moveItem(currentVideos, move.videoId, move.direction),
  );

  const handleMove = (videoId: number, direction: MoveDirection): void =>
    startTransition(async () => {
      showMove({ videoId, direction });
      await moveVideo(videoId, direction);
    });

  return (
    // A numbered list, so the up and down buttons read as "move", not as votes.
    <ol className="m-0 list-none divide-y divide-admin-dark/10 overflow-hidden rounded-lg border border-admin-dark/10 bg-white/50 p-0 dark:divide-admin-light/10 dark:border-admin-light/10 dark:bg-admin-light/5">
      {orderedVideos.map((video, videoIndex) => {
        const videoId = getYoutubeVideoId(video.youtubeUrl);
        return (
          <li key={video.id} className="flex items-center gap-4 p-3">
            <span className="w-6 shrink-0 text-right text-sm tabular-nums opacity-70">
              {videoIndex + 1}
            </span>
            {/* The thumbnail and caption open the preview; Edit opens the form. */}
            {videoId ? (
              <VideoPreviewButton
                videoId={videoId}
                title={video.description}
                className="group flex min-w-0 flex-1 items-center gap-4 text-left"
                editHref={`/admin/videos/${video.id}`}
              >
                <VideoRowSummary video={video} videoId={videoId} />
              </VideoPreviewButton>
            ) : (
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <VideoRowSummary video={video} videoId={null} />
              </div>
            )}
            <Link
              href={`/admin/videos/${video.id}`}
              className="text-sm font-medium text-admin-accent hover:underline dark:text-admin-accent-dark"
            >
              Edit
            </Link>
            <MoveButtons
              orientation="vertical"
              itemName={video.description}
              isFirst={videoIndex === 0}
              isLast={videoIndex === orderedVideos.length - 1}
              onMoveUp={() => handleMove(video.id, "up")}
              onMoveDown={() => handleMove(video.id, "down")}
            />
          </li>
        );
      })}
    </ol>
  );
};

export default VideoList;
