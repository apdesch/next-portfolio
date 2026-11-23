import type { FC, ReactNode } from "react";

type PageContentProps = { children: ReactNode };

const PageContent: FC<PageContentProps> = ({ children }) => (
  <main className="flex w-full max-w-[58em] flex-col gap-(--section-gap) py-[4em]">
    {children}
  </main>
);

export default PageContent;
