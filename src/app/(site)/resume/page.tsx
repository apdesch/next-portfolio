import type { Metadata } from "next";
import type { FC } from "react";
import ContentCard from "@/components/content-card";
import PageContent from "@/components/page-content";
import ResumePdfLink from "@/components/resume-pdf-link";
import resume, { type ResumeEntry, type YearMonth } from "@/content/resume";
import getPageMetadata from "@/lib/page-metadata";

const monthYearFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

const formatYearMonth = (yearMonth: YearMonth): string =>
  monthYearFormat.format(Date.UTC(yearMonth.year, yearMonth.month - 1));

const formatMachineYearMonth = (yearMonth: YearMonth): string =>
  `${yearMonth.year}-${String(yearMonth.month).padStart(2, "0")}`;

type ResumeEntryProps = { entry: ResumeEntry };

const ResumeDates: FC<ResumeEntryProps> = ({ entry }) => (
  <span className="whitespace-nowrap tabular-nums">
    <time dateTime={formatMachineYearMonth(entry.startDate)}>
      {formatYearMonth(entry.startDate)}
    </time>
    {" – "}
    {entry.endDate === null ? (
      "Present"
    ) : (
      <time dateTime={formatMachineYearMonth(entry.endDate)}>
        {formatYearMonth(entry.endDate)}
      </time>
    )}
  </span>
);

const ResumeEntryItem: FC<ResumeEntryProps> = ({ entry }) => (
  <section className="mb-(--section-gap) last:mb-0">
    <h3 className="text-[1.5em]">
      {entry.organization}
      {entry.isAcquired && (
        <span className="ml-[0.5em] inline-block rounded-[0.4em] bg-primary-light px-2.5 align-middle text-[11px] leading-loose text-primary-dark uppercase">
          Acquired
        </span>
      )}
    </h3>
    <div className="flex flex-wrap justify-between gap-x-[1em]">
      <span>{entry.role}</span>
      <ResumeDates entry={entry} />
    </div>
    {entry.highlights.length > 0 && (
      <ul>
        {entry.highlights.map((highlight) => (
          <li key={highlight}>{highlight}</li>
        ))}
      </ul>
    )}
  </section>
);

type ResumeGroupProps = {
  heading: string;
  entries: readonly ResumeEntry[];
};

// 1.8em sits between the 2.4em page title and the 1.5em company names (hierarchy rule).
const ResumeGroup: FC<ResumeGroupProps> = ({ heading, entries }) => (
  <section>
    <h2 className="mb-[0.5em] text-[1.8em] uppercase">{heading}</h2>
    {entries.map((entry) => (
      <ResumeEntryItem key={entry.organization} entry={entry} />
    ))}
  </section>
);

const ResumePage: FC = () => (
  <PageContent>
    <article>
      {/* The title's bottom margin moves to the row, so the link lines up with its text.
          1.2em here equals the title's own 0.5em at its 2.4em size. */}
      <div className="mb-[1.2em] flex flex-wrap items-baseline justify-between gap-x-[1em]">
        <h1 className="mb-0 uppercase">Resume</h1>
        {/* A small button, dark with light text. In dark mode it's frosted glass like the
            resume card below it; in light mode (where the card is invisible) it's solid. */}
        <ResumePdfLink
          label="View PDF"
          className="bg-primary-dark px-[0.9em] py-[0.3em] text-primary-light uppercase dark:bg-primary-dark/50 dark:backdrop-blur-2xl"
        />
      </div>
      <ContentCard className="flex flex-col gap-(--section-gap)">
        <ResumeGroup heading="Experience" entries={resume.experience} />
        <ResumeGroup heading="Education" entries={resume.education} />
        <ResumePdfLink
          label="View this resume as a PDF"
          className="self-end text-[1.2em] uppercase"
        />
      </ContentCard>
    </article>
  </PageContent>
);

export const metadata: Metadata = getPageMetadata({
  pageName: "Resume",
  description:
    "Resume of Adam Deschamp: front end and software engineering roles at Kapwing, Total Brain, Barn & Willow, Elation Health and Mya Systems.",
  path: "/resume",
});

export default ResumePage;
