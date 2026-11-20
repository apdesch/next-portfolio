import type { FC } from "react";
import PublicFrame from "@/components/public-frame";
import SiteHeader from "@/components/site-header";

const SiteLayout: FC<LayoutProps<"/">> = ({ children }) => (
  <PublicFrame>
    <SiteHeader />
    {children}
  </PublicFrame>
);

export default SiteLayout;
