import type { FC, ReactNode } from "react";

type ContentCardProps = { children: ReactNode; className?: string };

// Frosted glass over the dark mode background photo. In light mode the card is invisible,
// so it has no padding and content lines up with the page title like on the home page.
const ContentCard: FC<ContentCardProps> = ({ children, className = "" }) => (
  <div
    className={`dark:bg-primary-dark/50 dark:p-[1.5em] dark:backdrop-blur-2xl ${className}`}
  >
    {children}
  </div>
);

export default ContentCard;
