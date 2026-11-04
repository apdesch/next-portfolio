import type { Metadata } from "next";
import Link from "next/link";
import type { FC } from "react";
import moveVideo from "@/app/admin/(console)/videos/move-video";
import VideoList from "@/components/admin/video-list";
import getAdminVideos from "@/db/admin/get-admin-videos";

const AdminVideosPage: FC = async () => {
  const videos = await getAdminVideos();

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="m-0 text-2xl font-semibold">Videos</h1>
          <p className="m-0 text-sm opacity-70">
            {videos.length} videos, in home page order
          </p>
        </div>
        <Link
          href="/admin/videos/new"
          className="rounded-md bg-admin-accent px-4 py-2 text-sm font-medium text-white hover:bg-admin-accent/90 dark:bg-admin-accent-dark dark:text-admin-dark dark:hover:bg-admin-accent-dark/90"
        >
          New video
        </Link>
      </div>
      <VideoList videos={videos} moveVideo={moveVideo} />
    </div>
  );
};

export const metadata: Metadata = { title: "Videos" };

export default AdminVideosPage;
