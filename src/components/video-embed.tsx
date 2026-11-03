import type { FC } from "react";
import type { Video } from "@/content/portfolio";

type VideoEmbedProps = { video: Video };

const VideoEmbed: FC<VideoEmbedProps> = ({ video }) => (
  <section className="mb-[3em] flex flex-col">
    <div className="relative aspect-video w-full">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}`}
        title={video.title}
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute inset-0 size-full border-0 bg-primary-dark"
      />
    </div>
    <p className="mr-[1em] self-end text-justify text-[1.1em] desktop:max-w-[24em]">
      {video.caption}
    </p>
  </section>
);

export default VideoEmbed;
