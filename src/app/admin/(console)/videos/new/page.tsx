import type { Metadata } from "next";
import Link from "next/link";
import type { FC } from "react";
import createVideo from "@/app/admin/(console)/videos/create-video";
import VideoForm from "@/components/admin/video-form";

const NewVideoPage: FC = () => (
  <div className="mx-auto max-w-2xl p-6">
    <p className="m-0 text-sm opacity-70">
      <Link href="/admin/videos" className="hover:underline">
        Videos
      </Link>{" "}
      / New video
    </p>
    <h1 className="mt-1 mb-6 text-2xl font-semibold">New video</h1>
    <VideoForm saveVideo={createVideo} />
  </div>
);

export const metadata: Metadata = { title: "New video" };

export default NewVideoPage;
