import type { MetadataRoute } from "next";
import siteUrl from "@/lib/siteUrl";

const publicPaths = ["/", "/resume", "/about"];

const sitemap = (): MetadataRoute.Sitemap =>
  publicPaths.map((path) => ({ url: new URL(path, siteUrl).toString() }));

export default sitemap;
