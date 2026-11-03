import type { MetadataRoute } from "next";
import siteUrl from "@/lib/site-url";

// Crawlers that collect AI training data. AI search crawlers (OAI-SearchBot,
// PerplexityBot) stay allowed so the site can still appear in AI search answers.
const aiTrainingCrawlers = [
  "GPTBot",
  "ClaudeBot",
  "anthropic-ai",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "Bytespider",
  "meta-externalagent",
];

const robots = (): MetadataRoute.Robots => ({
  rules: [
    { userAgent: "*", allow: "/" },
    { userAgent: aiTrainingCrawlers, disallow: "/" },
  ],
  sitemap: `${siteUrl}/sitemap.xml`,
});

export default robots;
