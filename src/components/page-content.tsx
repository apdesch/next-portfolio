import type { FC, ReactNode } from "react";

type PageContentProps = { children: ReactNode };

const PageContent: FC<PageContentProps> = ({ children }) => (
  <main className="flex w-full max-w-[58em] flex-col py-[4em]">{children}</main>
);

export default PageContent;
