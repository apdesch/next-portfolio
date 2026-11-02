import type { Metadata } from "next";
import Link from "next/link";
import type { FC } from "react";
import SiteTitle from "@/components/site-title";

const NotFound: FC = () => (
  <main className="flex flex-col items-center text-center">
    {/* The title is 6em, so a 10px base renders it at 60px (Tailwind's text-6xl size). */}
    <div className="text-[10px]">
      <SiteTitle />
    </div>
    <p>The page you are looking for does not exist.</p>
    <Link href="/" className="text-[1.2em] uppercase">
      Back to home
    </Link>
  </main>
);

export const metadata: Metadata = {
  title: "Page not found",
};

export default NotFound;
