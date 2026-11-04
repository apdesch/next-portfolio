import type { FC } from "react";
import type { Video } from "@/db/tables/videos";
import getYoutubeEmbedUrl from "@/lib/get-youtube-embed-url";
import getYoutubeVideoId from "@/lib/get-youtube-video-id";

type VideoEmbedProps = { video: Video };

// A link that can't be read skips this video instead of breaking the page.
const VideoEmbed: FC<VideoEmbedProps> = ({ video }) => {
  const videoId = getYoutubeVideoId(video.youtubeUrl);

  if (videoId === null) return null;

  return (
    <section className="mb-(--section-gap) flex flex-col last:mb-0">
      <div className="relative aspect-video w-full">
        <iframe
          src={getYoutubeEmbedUrl(videoId)}
          title={video.description}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 size-full border-0 bg-primary-dark"
        />
      </div>
      <p className="mr-[1em] self-end text-justify text-[1.1em] desktop:max-w-[24em]">
        {video.description}
      </p>
    </section>
  );
};

export default VideoEmbed;
