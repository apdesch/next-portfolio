import type { Metadata } from "next";
import type { FC } from "react";
import { Poppins } from "next/font/google";
import siteUrl from "@/lib/site-url";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "600"],
});

// Pages set full titles through getPageMetadata; the template covers the 404 page.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Adam Deschamp", template: "%s | Adam Deschamp" },
  description: "Portfolio of Adam Deschamp, software engineer.",
};

const RootLayout: FC<LayoutProps<"/">> = ({ children }) => (
  <html lang="en" className={`${poppins.variable} antialiased`}>
    <body>{children}</body>
  </html>
);

export default RootLayout;
