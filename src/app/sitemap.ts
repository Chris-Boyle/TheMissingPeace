import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo/site";

const routes: Array<{
  path: string;
  changeFrequency: "weekly" | "monthly";
  priority: number;
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/services", changeFrequency: "monthly", priority: 0.9 },
  { path: "/consultation", changeFrequency: "weekly", priority: 0.95 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
  { path: "/quiz", changeFrequency: "monthly", priority: 0.75 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.65 },
  { path: "/birth-plan-builder", changeFrequency: "weekly", priority: 0.9 },
  { path: "/pregnancy-timeline", changeFrequency: "weekly", priority: 0.85 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const lastModified = new Date();

  return routes.map((route) => ({
    url: new URL(route.path, siteUrl).toString(),
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
