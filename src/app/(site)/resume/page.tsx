import type { Metadata } from "next";
import type { FC } from "react";
import ContentCard from "@/components/content-card";
import PageContent from "@/components/page-content";
import resume, { type ResumeEntry, type YearMonth } from "@/content/resume";

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

const ResumeSection: FC<ResumeEntryProps> = ({ entry }) => (
  <section className="mb-[2em]">
    <h2>
      {entry.organization}
      {entry.isAcquired && (
        <span className="ml-[0.5em] inline-block rounded-[0.4em] bg-primary-light px-2.5 align-middle text-[11px] leading-loose text-primary-dark uppercase">
          Acquired
        </span>
      )}
    </h2>
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

const ResumePage: FC = () => (
  <PageContent>
    <article className="mb-[3em]">
      <h1 className="uppercase">Resume</h1>
      <ContentCard>
        {resume.experience.map((entry) => (
          <ResumeSection key={entry.organization} entry={entry} />
        ))}
        <h1 className="mt-[1em] uppercase">Education</h1>
        {resume.education.map((entry) => (
          <ResumeSection key={entry.organization} entry={entry} />
        ))}
      </ContentCard>
    </article>
  </PageContent>
);

export const metadata: Metadata = {
  title: "Resume",
};

export default ResumePage;
