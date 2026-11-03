import type { Metadata } from "next";
import type { FC } from "react";
import PageContent from "@/components/page-content";
import PersonStructuredData from "@/components/person-structured-data";
import PhotoGallery from "@/components/photo-gallery";
import ProjectEntry from "@/components/project-entry";
import VideoEmbed from "@/components/video-embed";
import getGalleryPhotos from "@/db/get-gallery-photos";
import getProjects from "@/db/get-projects";
import getVideos from "@/db/get-videos";
import type { GalleryPhoto } from "@/db/tables/gallery-photos";
import getPageMetadata from "@/lib/page-metadata";

type Gallery = {
  category: string;
  photos: GalleryPhoto[];
};

// Photos arrive ordered by position, so galleries appear in the order of their first
// photo and each gallery keeps its photos in order.
const groupPhotosByCategory = (photos: readonly GalleryPhoto[]): Gallery[] =>
  photos.reduce<Gallery[]>((galleries, photo) => {
    const hasGallery = galleries.some(
      (gallery) => gallery.category === photo.category,
    );
    if (!hasGallery) {
      return [...galleries, { category: photo.category, photos: [photo] }];
    }
    return galleries.map((gallery) =>
      gallery.category === photo.category
        ? { ...gallery, photos: [...gallery.photos, photo] }
        : gallery,
    );
  }, []);

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
