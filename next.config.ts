import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  // Each admin section has its own address; the admin home is the projects list.
  redirects: async () => [
    { source: "/admin", destination: "/admin/projects", permanent: false },
  ],
  partialPrefetching: true,
  images: {
    // Placeholder images only; remove once real project and gallery photos are added.
    remotePatterns: [new URL("https://placehold.co/**")],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
