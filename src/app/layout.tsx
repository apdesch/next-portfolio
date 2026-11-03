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
    <body className="font-sans">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 hidden dark-backdrop dark:block"
      />
      <div className="flex min-h-screen w-full animate-fade-in flex-col items-center justify-around px-[1em] text-compact desktop:px-0 desktop:text-fluid">
        {children}
      </div>
    </body>
  </html>
);

export default RootLayout;
