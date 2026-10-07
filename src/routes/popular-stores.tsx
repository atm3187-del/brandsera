import { createFileRoute, Link } from "@tanstack/react-router";
import { seoHead, collectionLd, breadcrumbLd } from "@/lib/seo";
import { TrendingUp } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { useStoresData, storesQueryOptions } from "@/lib/store-data";

const prefetchStores = (qc: import("@tanstack/react-query").QueryClient) => qc.ensureQueryData(storesQueryOptions).catch((err) => { console.error("[prefetch] stores failed", err); });

export const Route = createFileRoute("/popular-stores")({
  loader: async ({ context }) => { await prefetchStores(context.queryClient); },
  head: () =>
    seoHead({
    path: '/popular-stores',
    title: 'Popular Stores — Most-Used Coupons — Brands Era',
    description: 'The brands shoppers use most on Brands Era, ranked by coupon redemptions.',
    jsonLd: [collectionLd('Popular Stores — Most-Used Coupons — Brands Era', 'The brands shoppers use most on Brands Era, ranked by coupon redemptions.', '/popular-stores'), breadcrumbLd([{ name: "Home", path: "/" }, { name: 'Popular Stores', path: '/popular-stores' }])]
  }),
  component: PopularStoresPage,
});

function PopularStoresPage() {
  const { stores, allCoupons } = useStoresData();
  const popular = stores.filter((s) => s.popular);
  const topCoupons = [...allCoupons].sort((a, b) => b.uses - a.uses).slice(0, 10);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-20">
      <div className="text-center">
        <h1 className="flex items-center justify-center gap-3 font-display text-4xl font-black md:text-6xl uppercase">
          <TrendingUp className="h-8 w-8 text-primary" /> Popular Stores
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground font-medium">
          Discover the most used coupons and popular brands today.
        </p>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="mb-5 font-display text-2xl font-black uppercase tracking-wide">Top Used Coupons</h2>
          <div className="space-y-3">
            {topCoupons.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-4 rounded-md border-2 border-foreground bg-card p-4 transition hover:-translate-x-0.5 hover:-translate-y-0.5"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <BrandLogo name={c.store.name} src={c.store.logoUrl} />
                <div className="flex-1 min-w-0">
                  <div className="font-display font-black truncate">{c.title}</div>
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {c.store.name}
                  </div>
                </div>
                <Link
                  to="/store/$slug"
                  params={{ slug: c.store.slug }}
                  className="rounded-md border-2 border-foreground bg-primary px-4 py-2 text-xs font-black uppercase text-primary-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  Use
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-5 font-display text-2xl font-black uppercase tracking-wide">Popular Brands</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {popular.map((s) => (
              <Link
                key={s.slug}
                to="/store/$slug"
                params={{ slug: s.slug }}
                className="flex flex-col items-center gap-2 rounded-md border-2 border-foreground bg-card p-5 text-center hover:bg-accent"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <BrandLogo name={s.name} src={s.logoUrl} />
                <div className="text-sm font-display font-black uppercase">{s.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
