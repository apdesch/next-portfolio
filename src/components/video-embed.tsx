import type { FC } from "react";
import type { Video } from "@/db/tables/videos";

// YouTube video IDs are exactly 11 characters of letters, digits, "-" and "_". Checking
// the shape keeps anything unexpected in a stored link out of the embed URL.
const youtubeVideoIdPattern = /^[\w-]{11}$/;

const getVideoIdCandidate = (url: URL): string | null => {
  const hostname = url.hostname.replace(/^(www|m)\./, "");
  const isYoutubeHost =
    hostname === "youtube.com" || hostname === "youtube-nocookie.com";
  if (hostname === "youtu.be") return url.pathname.slice(1);
  if (!isYoutubeHost) return null;
  if (url.pathname.startsWith("/embed/")) return url.pathname.split("/")[2];
  return url.searchParams.get("v");
};

const getYoutubeVideoId = (youtubeUrl: string): string | null => {
  if (!URL.canParse(youtubeUrl)) return null;
  const candidate = getVideoIdCandidate(new URL(youtubeUrl));
  if (candidate === null || !youtubeVideoIdPattern.test(candidate)) return null;
  return candidate;
};

type VideoEmbedProps = { video: Video };

// A link that can't be read skips this video instead of breaking the page.
const VideoEmbed: FC<VideoEmbedProps> = ({ video }) => {
  const videoId = getYoutubeVideoId(video.youtubeUrl);

  if (videoId === null) return null;

  return (
    <section className="mb-(--section-gap) flex flex-col last:mb-0">
      <div className="relative aspect-video w-full">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}`}
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
