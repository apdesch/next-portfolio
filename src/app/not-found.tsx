import type { Metadata } from "next";
import type { FC } from "react";

const NotFound: FC = () => (
  <main className="py-[4em]">
    <p>The page you are looking for does not exist.</p>
  </main>
);

export const metadata: Metadata = {
  title: "Page not found",
};

export default NotFound;
