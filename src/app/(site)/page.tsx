import type { Metadata } from "next";
import type { FC } from "react";
import PageContent from "@/components/PageContent";
import PersonStructuredData from "@/components/PersonStructuredData";
import PhotoGallery from "@/components/PhotoGallery";
import ProjectEntry from "@/components/ProjectEntry";
import VideoEmbed from "@/components/VideoEmbed";
import getGalleryPhotos from "@/db/getGalleryPhotos";
import getProjects from "@/db/getProjects";
import getVideos from "@/db/getVideos";
import groupPhotosByCategory from "@/lib/groupPhotosByCategory";
import getPageMetadata from "@/lib/getPageMetadata";

// Async Server Component: it awaits the cached queries before rendering.
const Home: FC = async () => {
  const [videos, projects, galleryPhotos] = await Promise.all([
    getVideos(),
    getProjects(),
    getGalleryPhotos(),
  ]);

  return (
    <PageContent>
      <PersonStructuredData />
      <article>
        <h1 className="uppercase">Videos</h1>
        {videos.map((video) => (
          <VideoEmbed key={video.id} video={video} />
        ))}
      </article>
      <article>
        <h1 className="uppercase">Engineering Work</h1>
        {projects.map((project) => (
          <ProjectEntry key={project.id} project={project} />
        ))}
      </article>
      {groupPhotosByCategory(galleryPhotos).map((gallery) => (
        <article key={gallery.category}>
          <h1 className="uppercase">{gallery.category}</h1>
          <PhotoGallery photos={gallery.photos} />
        </article>
      ))}
    </PageContent>
  );
};

export const metadata: Metadata = getPageMetadata({
  pageName: null,
  description:
    "Portfolio of Adam Deschamp, software engineer in San Francisco: engineering work, videos and photography.",
  path: "/",
});

export default Home;
