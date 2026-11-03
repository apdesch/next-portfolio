import type { FC } from "react";

type SkillChipsProps = { skills: readonly string[] };

const SkillChips: FC<SkillChipsProps> = ({ skills }) => (
  <ul className="m-0 flex list-none flex-wrap gap-[0.5em] p-0 text-[0.9em] uppercase">
    {skills.map((skill) => (
      <li
        key={skill}
        className="animate-pop-in-on-view rounded-xs bg-foreground px-[0.4em] text-background"
      >
        {skill}
      </li>
    ))}
  </ul>
);

export default SkillChips;
