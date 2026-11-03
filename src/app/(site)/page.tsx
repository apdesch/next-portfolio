import type { Metadata } from "next";
import type { FC } from "react";
import PageContent from "@/components/page-content";
import PersonStructuredData from "@/components/person-structured-data";
import PhotoGallery from "@/components/photo-gallery";
import ProjectEntry from "@/components/project-entry";
import VideoEmbed from "@/components/video-embed";
import portfolio from "@/content/portfolio";
import getPageMetadata from "@/lib/page-metadata";

const Home: FC = () => (
  <PageContent>
    <PersonStructuredData />
    <article>
      <h1 className="uppercase">Videos</h1>
      {portfolio.videos.map((video) => (
        <VideoEmbed key={video.youtubeId} video={video} />
      ))}
    </article>
    <article>
      <h1 className="uppercase">Engineering Work</h1>
      {portfolio.projects.map((project) => (
        <ProjectEntry key={project.title} project={project} />
      ))}
    </article>
    {portfolio.galleries.map((gallery) => (
      <article key={gallery.category}>
        <h1 className="uppercase">{gallery.category}</h1>
        <PhotoGallery photos={gallery.photos} />
      </article>
    ))}
  </PageContent>
);

export const metadata: Metadata = getPageMetadata({
  pageName: null,
  description:
    "Portfolio of Adam Deschamp, software engineer in San Francisco: engineering work, videos and photography.",
  path: "/",
});

export default Home;
