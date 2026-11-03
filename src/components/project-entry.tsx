import Image from "next/image";
import type { FC } from "react";
import Markdown from "react-markdown";
import SkillChips from "@/components/skill-chips";
import type { Project } from "@/db/tables/projects";

type ProjectEntryProps = { project: Project };

// Large screens: image on the right, text bottom-aligned on the left, as on the original site.
const ProjectEntry: FC<ProjectEntryProps> = ({ project }) => (
  <article className="mb-(--section-gap) grid items-end gap-[1em] last:mb-0 desktop:grid-cols-2">
    <Image
      src={project.imageSrc}
      alt={project.imageAlt}
      width={project.imageWidth}
      height={project.imageHeight}
      sizes="(min-width: 54em) 29em, 100vw"
      className="block h-auto w-full desktop:col-start-2 desktop:row-start-1"
    />
    <section className="desktop:col-start-1 desktop:row-start-1">
      {/* 2em keeps project titles below the 2.4em section title (typography hierarchy rule). */}
      <h2 className="text-[2em]">{project.title}</h2>
      <p className="mt-0 mb-[1em] text-[1.1em]">{project.description}</p>
      <SkillChips skills={project.skills} />
    </section>
    {/* react-markdown builds React elements and ignores raw HTML, so no sanitizer is needed. */}
    <section className="desktop:col-span-2">
      <Markdown>{project.body}</Markdown>
    </section>
  </article>
);

export default ProjectEntry;
