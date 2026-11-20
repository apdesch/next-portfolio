import type { Metadata } from "next";
import Link from "next/link";
import { type FC, Suspense } from "react";
import AdminPageLoading from "@/components/admin/admin-page-loading";
import moveVideo from "@/app/admin/(console)/videos/move-video";
import VideoList from "@/components/admin/video-list";
import getAdminVideos from "@/db/admin/get-admin-videos";
import adminButtonClassName from "@/lib/admin-button-class-name";

const AdminVideosContent: FC = async () => {
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
        <Link href="/admin/videos/new" className={adminButtonClassName}>
          New video
        </Link>
      </div>
      <VideoList videos={videos} moveVideo={moveVideo} />
    </div>
  );
};

// Its own Suspense boundary, so opening this page from anywhere in the admin shows the
// placeholder at once instead of waiting for its data (see admin-page-loading.tsx).
const AdminVideosPage: FC = () => (
  <Suspense fallback={<AdminPageLoading />}>
    <AdminVideosContent />
  </Suspense>
);

export const metadata: Metadata = { title: "Videos" };

export default AdminVideosPage;
