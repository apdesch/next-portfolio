import type { Metadata } from "next";
import type { JSX } from "react";
import { Poppins } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: "Adam Deschamp",
  description: "Portfolio of Adam Deschamp, software engineer.",
};

export default function RootLayout({
  children,
}: LayoutProps<"/">): JSX.Element {
  return (
    <html lang="en" className={`${poppins.variable} antialiased`}>
      <body className="font-sans">
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 -z-10 hidden dark-backdrop dark:block"
        />
        <div className="flex min-h-screen w-full animate-fade-in flex-col items-center justify-around px-[1em] text-compact desktop:px-0 desktop:text-fluid">
          <SiteHeader />
          {children}
        </div>
      </body>
    </html>
  );
}
