import type { Metadata } from "next";

export const SITE_NAME = "The Missing Peace";
export const DEFAULT_SITE_DESCRIPTION =
  "Warm doula care, childbirth education, and birth planning support for Kansas City families.";

export function getSiteUrl() {
  const configuredUrl =
    process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "http://localhost:3000";

  try {
    return new URL(configuredUrl);
  } catch {
    return new URL("http://localhost:3000");
  }
}

export function buildPageMetadata(params: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const siteUrl = getSiteUrl();
  const canonicalUrl = new URL(params.path, siteUrl).toString();

  return {
    title: params.title,
    description: params.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      title: params.title,
      description: params.description,
      url: canonicalUrl,
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title: params.title,
      description: params.description,
    },
  };
}
