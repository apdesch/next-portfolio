import type { FC } from "react";
import PublicFrame from "@/components/PublicFrame";
import SiteHeader from "@/components/SiteHeader";

const SiteLayout: FC<LayoutProps<"/">> = ({ children }) => (
  <PublicFrame>
    <SiteHeader />
    {children}
  </PublicFrame>
);

export default SiteLayout;
