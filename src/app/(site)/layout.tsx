import type { FC } from "react";
import SiteHeader from "@/components/site-header";

const SiteLayout: FC<LayoutProps<"/">> = ({ children }) => (
  <>
    <SiteHeader />
    {children}
  </>
);

export default SiteLayout;
