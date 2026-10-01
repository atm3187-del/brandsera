import { createFileRoute, Link } from "@tanstack/react-router";
import { seoHead, collectionLd, breadcrumbLd } from "@/lib/seo";
import { Sparkles } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { useStoresData, storesQueryOptions } from "@/lib/store-data";

const prefetchStores = (qc: import("@tanstack/react-query").QueryClient) => qc.ensureQueryData(storesQueryOptions).catch((err) => { console.error("[prefetch] stores failed", err); });

export const Route = createFileRoute("/featured-stores")({
  loader: async ({ context }) => { await prefetchStores(context.queryClient); },
  head: () =>
    seoHead({
    path: '/featured-stores',
    title: 'Featured Stores — Hand-Picked Brand Deals — Brands Era',
    description: 'Hand-picked brands with the strongest verified coupons and deals right now on Brands Era.',
    jsonLd: [collectionLd('Featured Stores — Hand-Picked Brand Deals — Brands Era', 'Hand-picked brands with the strongest verified coupons and deals right now on Brands Era.', '/featured-stores'), breadcrumbLd([{ name: "Home", path: "/" }, { name: 'Featured Stores', path: '/featured-stores' }])]
  }),
  component: FeaturedStoresPage,
});

function FeaturedStoresPage() {
  const { stores } = useStoresData();
  const featured = stores.filter((s) => s.featured || s.premium);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-20">
      <div className="text-center">
        <h1 className="flex items-center justify-center gap-3 font-display text-4xl font-black md:text-6xl uppercase">
          <Sparkles className="h-8 w-8 text-primary" /> Featured Brands
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground font-medium">
          Hand-picked stores with the highest saving potential this week.
        </p>
      </div>

      <div className="mt-12 space-y-4">
        {featured.map((s) => (
          <Link
            key={s.slug}
            to="/store/$slug"
            params={{ slug: s.slug }}
            className="group rounded-md border-2 border-foreground bg-card p-6 transition hover:-translate-x-0.5 hover:-translate-y-0.5"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <div className="flex items-center gap-4">
              <BrandLogo name={s.name} src={s.logoUrl} size="lg" />
              <div>
                <div className="font-display text-xl font-black uppercase">{s.name}</div>
                <div className="text-sm text-muted-foreground">{s.category}</div>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{s.description}</p>
            <div className="mt-5 flex items-center justify-between border-t-2 border-dashed border-foreground/30 pt-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">{s.coupons.length} Verified Offers</span>
              <span className="text-sm font-black text-primary">View Deals →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
