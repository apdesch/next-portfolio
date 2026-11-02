import type { Metadata } from "next";
import Image from "next/image";
import type { FC } from "react";
import portrait from "@/assets/portrait.jpg";
import ContentCard from "@/components/content-card";
import PageContent from "@/components/page-content";
import about from "@/content/about";

const SkillChips: FC = () => (
  <section className="grid gap-[2em] desktop:col-span-2 desktop:grid-cols-2">
    {about.skillGroups.map((skillGroup) => (
      <div key={skillGroup.heading}>
        <h2 className="mb-[0.5em] uppercase">{skillGroup.heading}</h2>
        <ul className="m-0 flex list-none flex-wrap gap-[0.5em] p-0 text-[0.9em] uppercase">
          {skillGroup.skills.map((skill) => (
            <li
              key={skill}
              className="animate-pop-in-on-view rounded-xs bg-foreground px-[0.4em] text-background"
            >
              {skill}
            </li>
          ))}
        </ul>
      </div>
    ))}
  </section>
);

const AboutPage: FC = () => (
  <PageContent>
    <article className="mb-[3em]">
      <h1 className="uppercase">About</h1>
      <ContentCard className="grid gap-x-[2em] desktop:grid-cols-[1fr_2fr]">
        <Image
          src={portrait}
          alt="Portrait of Adam Deschamp"
          sizes="(min-width: 54em) 20em, 100vw"
          placeholder="blur"
          className="mx-auto block h-auto w-full max-w-[20em] desktop:max-w-none"
        />
        <section className="text-justify desktop:[&>p:first-child]:mt-0">
          {about.bio.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <ul>
            {about.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </section>
        <SkillChips />
      </ContentCard>
    </article>
  </PageContent>
);

export const metadata: Metadata = {
  title: "About",
};

export default AboutPage;
