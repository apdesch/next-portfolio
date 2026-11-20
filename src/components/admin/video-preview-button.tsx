import type { FC, ReactNode } from "react";
import PreviewModal from "@/components/admin/preview-modal";
import getYoutubeEmbedUrl from "@/lib/get-youtube-embed-url";

type VideoPreviewButtonProps = {
  videoId: string;
  title: string;
  className: string;
  children: ReactNode;
  editHref?: string;
};

// Plays the video in a preview modal. The player only exists while the modal is open, so
// it can start right away (the click allows sound) and stops when the modal closes.
const VideoPreviewButton: FC<VideoPreviewButtonProps> = ({
  videoId,
  title,
  className,
  children,
  editHref,
}) => (
  <PreviewModal
    title={title}
    trigger={children}
    triggerClassName={className}
    editHref={editHref}
  >
    <div className="relative aspect-video">
      <iframe
        src={`${getYoutubeEmbedUrl(videoId)}?autoplay=1`}
        title={title}
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        referrerPolicy="strict-origin-when-cross-origin"
        className="absolute inset-0 size-full border-0"
      />
    </div>
  </PreviewModal>
);

export default VideoPreviewButton;
