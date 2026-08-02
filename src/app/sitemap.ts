import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { loadFirmSlugsForSitemap } from "@/server/data/rankings";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const firmSlugs = await loadFirmSlugsForSitemap();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      lastModified,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/compare`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/rankings`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/methodology`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const firmRoutes: MetadataRoute.Sitemap = firmSlugs.map((slug) => ({
    url: `${siteConfig.url}/firms/${slug}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...firmRoutes];
}
