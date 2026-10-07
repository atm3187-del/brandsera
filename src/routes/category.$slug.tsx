import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ChevronRight, Tag } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { categories, useStoresData, storesQueryOptions } from "@/lib/store-data";
import { breadcrumbLd, categorySlug, collectionLd, seoHead } from "@/lib/seo";

const prefetchStores = (qc: import("@tanstack/react-query").QueryClient) => qc.ensureQueryData(storesQueryOptions).catch((err) => { console.error("[prefetch] stores failed", err); });

export const Route = createFileRoute("/category/$slug")({
  loader: async ({ params, context }) => {
    await prefetchStores(context.queryClient);
    const name = categories.find((c) => categorySlug(c) === params.slug);
    if (!name) throw notFound();
    return { name };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Category not found — Brands Era" }, { name: "robots", content: "noindex" }] };
    const name = loaderData.name;
    const path = `/category/${params.slug}`;
    const title = `${name} Coupons & Promo Codes — Brands Era`;
    const description = `${name} coupons, promo codes and deals from popular brands on Brands Era.`;
    return seoHead({
      path,
      title,
      description,
      jsonLd: [
        collectionLd(title, description, path),
        breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Categories", path: "/categories" },
          { name, path },
        ]),
      ],
    });
  },
  notFoundComponent: CategoryNotFound,
  component: CategoryPage,
});

function CategoryNotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="font-display text-4xl font-black uppercase">Category not found</h1>
      <Link to="/categories" className="mt-6 inline-flex items-center gap-2 rounded-md border-2 border-foreground bg-primary px-6 py-3 text-sm font-black uppercase text-primary-foreground">
        <ArrowLeft className="h-4 w-4" /> All categories
      </Link>
    </div>
  );
}

function CategoryPage() {
  const { name } = Route.useLoaderData();
  const { stores, loading } = useStoresData();
  const list = stores.filter((s) => s.category === name);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-20">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
        <Link to="/categories" className="hover:text-primary">Categories</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{name}</span>
      </nav>
      <div className="mt-6 flex items-center gap-4">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-md border-2 border-foreground bg-accent text-accent-foreground">
          <Tag className="h-7 w-7" />
        </div>
        <div>
          <h1 className="font-display text-4xl font-black uppercase md:text-5xl">{name} Coupons</h1>
          <p className="mt-1 font-medium text-muted-foreground">
            {loading ? "Loading brands…" : `${list.length} ${name.toLowerCase()} brand${list.length === 1 ? "" : "s"} with current offers.`}
          </p>
        </div>
      </div>

      <div className="mt-10 space-y-3">
        {list.map((s) => (
          <Link
            key={s.slug}
            to="/store/$slug"
            params={{ slug: s.slug }}
            className="flex items-center gap-4 rounded-md border-2 border-foreground bg-card p-5 transition hover:-translate-y-0.5 hover:bg-secondary"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <BrandLogo name={s.name} src={s.logoUrl} />
            <div className="min-w-0 flex-1">
              <div className="font-display text-xl font-black uppercase leading-tight">{s.name}</div>
              <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{s.description}</p>
            </div>
            <span className="shrink-0 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              {s.coupons.length} offer{s.coupons.length === 1 ? "" : "s"}
            </span>
            <ChevronRight className="h-5 w-5 shrink-0 text-primary" />
          </Link>
        ))}
        {!loading && list.length === 0 && (
          <div className="rounded-md border-2 border-dashed border-foreground/40 p-10 text-center text-sm font-medium text-muted-foreground">
            No brands in this category yet.
          </div>
        )}
      </div>

      <section className="mt-14">
        <h2 className="font-display text-xl font-black uppercase">Other categories</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories
            .filter((c) => c !== name)
            .map((c) => (
              <Link
                key={c}
                to="/category/$slug"
                params={{ slug: categorySlug(c) }}
                className="rounded-md border-2 border-foreground bg-card px-3 py-1.5 text-xs font-black uppercase hover:bg-accent"
              >
                {c}
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
