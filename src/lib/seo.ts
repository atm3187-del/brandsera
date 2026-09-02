export const SITE_URL = "https://brandsera.lovable.app";
export const SITE_NAME = "Brands Era";

export function absUrl(path: string) {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function categorySlug(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function titleize(slug: string) {
  return slug
    .split("-")
    .map((w) => (w[0]?.toUpperCase() ?? "") + w.slice(1))
    .join(" ");
}

type JsonLd = Record<string, unknown>;

interface SeoOptions {
  path: string;
  title: string;
  description: string;
  type?: "website" | "article";
  image?: string | null;
  noindex?: boolean;
  jsonLd?: JsonLd | JsonLd[];
}

/** Builds a complete `head()` return for a route: title, description, canonical, OG, Twitter, JSON-LD. */
export function seoHead({ path, title, description, type = "website", image, noindex, jsonLd }: SeoOptions) {
  const url = absUrl(path);
  const desc = description.length > 158 ? `${description.slice(0, 155).trimEnd()}…` : description;
  const meta: Array<Record<string, string>> = [
    { title },
    { name: "description", content: desc },
    { property: "og:title", content: title },
    { property: "og:description", content: desc },
    { property: "og:url", content: url },
    { property: "og:type", content: type },
    { property: "og:site_name", content: SITE_NAME },
    { name: "twitter:card", content: image ? "summary_large_image" : "summary" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: desc },
  ];
  if (image) {
    meta.push({ property: "og:image", content: image }, { name: "twitter:image", content: image });
  }
  meta.push({ name: "robots", content: noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large" });

  const scripts = jsonLd
    ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]).map((data) => ({
        type: "application/ld+json",
        children: JSON.stringify(data),
      }))
    : undefined;

  return {
    meta,
    links: noindex ? [] : [{ rel: "canonical", href: url }],
    ...(scripts ? { scripts } : {}),
  };
}

export function breadcrumbLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absUrl(it.path),
    })),
  };
}

export function collectionLd(name: string, description: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: absUrl(path),
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
  };
}
