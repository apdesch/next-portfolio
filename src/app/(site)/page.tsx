import type { FC } from "react";
import PageContent from "@/components/page-content";
import PhotoGallery from "@/components/photo-gallery";
import ProjectEntry from "@/components/project-entry";
import VideoEmbed from "@/components/video-embed";
import portfolio from "@/content/portfolio";

const Home: FC = () => (
  <PageContent>
    <article className="mb-[3em]">
      <h1 className="uppercase">Videos</h1>
      {portfolio.videos.map((video) => (
        <VideoEmbed key={video.youtubeId} video={video} />
      ))}
    </article>
    <article className="mb-[3em]">
      <h1 className="uppercase">Engineering Work</h1>
      {portfolio.projects.map((project) => (
        <ProjectEntry key={project.title} project={project} />
      ))}
    </article>
    {portfolio.galleries.map((gallery) => (
      <article key={gallery.category} className="mb-[3em]">
        <h1 className="uppercase">{gallery.category}</h1>
        <PhotoGallery photos={gallery.photos} />
      </article>
    ))}
  </PageContent>
);

export default Home;
