import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { stores } from "@/lib/store-data";

export const Route = createFileRoute("/featured-stores")({
  head: () => ({
    meta: [
      { title: "Featured Brands — Brands Era" },
      { name: "description", content: "Hand-picked premium brands with the highest saving potential this week on Brands Era." },
      { property: "og:title", content: "Featured Brands — Brands Era" },
      { property: "og:description", content: "Premium brands with verified coupons and big savings." },
    ],
  }),
  component: FeaturedStoresPage,
});

function FeaturedStoresPage() {
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

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((s) => (
          <Link
            key={s.slug}
            to="/store/$slug"
            params={{ slug: s.slug }}
            className="group rounded-md border-2 border-foreground bg-card p-6 transition hover:-translate-x-0.5 hover:-translate-y-0.5"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <div className="flex items-center gap-4">
              <BrandLogo name={s.name} size="lg" />
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
