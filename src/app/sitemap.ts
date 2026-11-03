import type { MetadataRoute } from "next";
import siteUrl from "@/lib/site-url";

const publicPaths = ["/", "/resume", "/about"] as const;

const sitemap = (): MetadataRoute.Sitemap =>
  publicPaths.map((path) => ({ url: new URL(path, siteUrl).toString() }));

export default sitemap;
