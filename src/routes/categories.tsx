import { createFileRoute, Link } from "@tanstack/react-router";
import { seoHead, collectionLd, breadcrumbLd, categorySlug } from "@/lib/seo";
import { Tag } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { categories, useStoresData, storesQueryOptions } from "@/lib/store-data";

const prefetchStores = (qc: import("@tanstack/react-query").QueryClient) => qc.ensureQueryData(storesQueryOptions).catch((err) => { console.error("[prefetch] stores failed", err); });

export const Route = createFileRoute("/categories")({
  loader: async ({ context }) => { await prefetchStores(context.queryClient); },
  head: () =>
    seoHead({
    path: '/categories',
    title: 'Coupons by Category — Brands Era',
    description: 'Explore verified deals by category: fashion, electronics, travel, health & beauty, gaming, software and more.',
    jsonLd: [collectionLd('Coupons by Category — Brands Era', 'Explore verified deals by category: fashion, electronics, travel, health & beauty, gaming, software and more.', '/categories'), breadcrumbLd([{ name: "Home", path: "/" }, { name: 'Coupons by Category', path: '/categories' }])]
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  const { stores } = useStoresData();
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-20">
      <div className="text-center">
        <h1 className="font-display text-4xl font-black md:text-6xl uppercase">Shop by Category</h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground font-medium">
          Find the right deal for every part of your life.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const count = stores.filter((s) => s.category === category).length;
          return (
            <div
              key={category}
              className="rounded-md border-2 border-foreground bg-card p-6"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-md border-2 border-foreground bg-accent text-accent-foreground">
                <Tag className="h-6 w-6" />
              </div>
              <h2 className="mt-5 font-display text-xl font-black uppercase">
                <Link to="/category/$slug" params={{ slug: categorySlug(category) }} className="hover:text-primary">{category}</Link>
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">{count} stores with active offers.</p>
              <div className="mt-4 space-y-2">
                {stores
                  .filter((s) => s.category === category)
                  .slice(0, 3)
                  .map((s) => (
                    <Link
                      key={s.slug}
                      to="/store/$slug"
                      params={{ slug: s.slug }}
                      className="flex items-center gap-3 rounded-md border-2 border-foreground bg-background p-2 hover:bg-accent"
                    >
                      <BrandLogo name={s.name} src={s.logoUrl} size="sm" />
                      <span className="text-sm font-bold">{s.name}</span>
                    </Link>
                  ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
