import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { FC } from "react";
import deleteVideo from "@/app/admin/(console)/videos/delete-video";
import updateVideo from "@/app/admin/(console)/videos/update-video";
import VideoForm from "@/components/admin/video-form";
import getAdminVideo from "@/db/admin/get-admin-video";

const EditVideoPage: FC<PageProps<"/admin/videos/[videoId]">> = async ({
  params,
}) => {
  const { videoId } = await params;
  const video = await getAdminVideo(Number(videoId));
  if (!video) notFound();

  return (
    <div className="mx-auto max-w-2xl p-6">
      <p className="m-0 text-sm opacity-70">
        <Link href="/admin/videos" className="hover:underline">
          Videos
        </Link>{" "}
        / {video.description}
      </p>
      <h1 className="mt-1 mb-6 text-2xl font-semibold">Edit video</h1>
      <VideoForm
        video={video}
        saveVideo={updateVideo.bind(null, video.id)}
        deleteVideo={deleteVideo.bind(null, video.id)}
      />
    </div>
  );
};

export const metadata: Metadata = { title: "Edit video" };

export default EditVideoPage;
