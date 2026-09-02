import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { SITE_URL, categorySlug } from "@/lib/seo";
import { categories } from "@/lib/store-data";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const MAX_URLS = 45_000;

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "daily", priority: "1.0" },
          { path: "/stores", changefreq: "daily", priority: "0.9" },
          { path: "/categories", changefreq: "weekly", priority: "0.8" },
          { path: "/featured-stores", changefreq: "daily", priority: "0.8" },
          { path: "/popular-stores", changefreq: "daily", priority: "0.8" },
          { path: "/blog", changefreq: "weekly", priority: "0.8" },
          { path: "/about", changefreq: "monthly", priority: "0.5" },
          { path: "/contact", changefreq: "monthly", priority: "0.4" },
          { path: "/careers", changefreq: "monthly", priority: "0.3" },
          { path: "/privacy", changefreq: "yearly", priority: "0.2" },
          { path: "/terms", changefreq: "yearly", priority: "0.2" },
          { path: "/cookie-policy", changefreq: "yearly", priority: "0.2" },
          { path: "/disclosure", changefreq: "yearly", priority: "0.2" },
          ...categories.map((c) => ({ path: `/category/${categorySlug(c)}`, changefreq: "weekly" as const, priority: "0.7" })),
        ];

        try {
          const { fetchSitemapData } = await import("@/lib/seo.server");
          const { stores, sections, posts } = await fetchSitemapData();
          for (const s of stores) {
            entries.push({ path: `/store/${encodeURIComponent(s.slug)}`, lastmod: s.updated_at, changefreq: "daily", priority: "0.8" });
          }
          for (const sec of sections) {
            if (!sec.stores?.slug) continue;
            entries.push({
              path: `/store/${encodeURIComponent(sec.stores.slug)}/${encodeURIComponent(sec.slug)}`,
              lastmod: sec.updated_at,
              changefreq: "weekly",
              priority: "0.7",
            });
          }
          for (const p of posts) {
            entries.push({ path: `/blog/${encodeURIComponent(p.slug)}`, lastmod: p.updated_at, changefreq: "monthly", priority: "0.6" });
          }
        } catch (err) {
          console.error("[sitemap] dynamic entries failed", err);
        }

        const urls = entries.slice(0, MAX_URLS).map((e) =>
          [
            `  <url>`,
            `    <loc>${esc(SITE_URL + e.path)}</loc>`,
            e.lastmod ? `    <lastmod>${new Date(e.lastmod).toISOString()}</lastmod>` : null,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [`<?xml version="1.0" encoding="UTF-8"?>`, `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`, ...urls, `</urlset>`].join("\n");

        return new Response(xml, {
          headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
