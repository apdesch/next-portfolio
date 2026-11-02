import type { FC, ReactNode } from "react";

type ContentCardProps = { children: ReactNode; className?: string };

// Frosted glass over the dark mode background photo; plain in light mode.
const ContentCard: FC<ContentCardProps> = ({ children, className = "" }) => (
  <div
    className={`p-[1.5em] dark:bg-primary-dark/50 dark:backdrop-blur-[40px] ${className}`}
  >
    {children}
  </div>
);

export default ContentCard;
