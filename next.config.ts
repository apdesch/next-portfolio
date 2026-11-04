import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  // Each admin section has its own address; the admin home is the projects list.
  redirects: async () => [
    { source: "/admin", destination: "/admin/projects", permanent: false },
  ],
  partialPrefetching: true,
  images: {
    remotePatterns: [
      // Video thumbnails in the admin's Videos section.
      new URL("https://i.ytimg.com/vi/**"),
      // Uploaded images, in the next-portfolio-blob store.
      new URL("https://5izkzsfudd7zkutj.public.blob.vercel-storage.com/**"),
      // Placeholder images only; remove once real project and gallery photos are added.
      new URL("https://placehold.co/**"),
    ],
  },
  // Loaded from node_modules rather than bundled: @napi-rs/canvas is a native module, and
  // PDF.js loads its worker and fonts from its own folder.
  serverExternalPackages: ["pdfjs-dist", "@napi-rs/canvas"],
  // Files read from disk at runtime, which Vercel's file tracing can't discover on its own.
  outputFileTracingIncludes: {
    "/admin/files": [
      "./src/assets/fonts/JetBrainsMono-Regular.ttf",
      "./node_modules/pdfjs-dist/standard_fonts/**",
    ],
  },
  experimental: {
    // Vercel caps a request at 4.5 MB; uploads stop at 4 MB (see maximum-upload-bytes.ts).
    serverActions: { bodySizeLimit: "4.5mb" },
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
