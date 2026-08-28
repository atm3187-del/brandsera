import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { useStoresData } from "@/lib/store-data";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Search — Brands Era" },
      { name: "description", content: "Search for coupons, brands, and deals on Brands Era." },
      { property: "og:title", content: "Search — Brands Era" },
      { property: "og:description", content: "Find verified coupons and deals by brand or category." },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { stores, allCoupons } = useStoresData();
  const [query, setQuery] = useState("");

  const matchingStores = stores.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()));
  const matchingCoupons = allCoupons.filter(
    (c) =>
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.store.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-20">
      <div className="text-center">
        <h1 className="font-display text-4xl font-black md:text-6xl uppercase">Find Deals</h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground font-medium">
          Search for brands, coupons, and stores.
        </p>
      </div>

      <div className="mx-auto mt-10 flex max-w-2xl items-center gap-2 rounded-md border-2 border-foreground bg-card p-2" style={{ boxShadow: "var(--shadow-card)" }}>
        <Search className="ml-4 h-5 w-5 text-muted-foreground" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a brand or coupon..."
          className="flex-1 bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      {query && (
        <div className="mt-12">
          <h2 className="font-display text-2xl font-black uppercase">Stores</h2>
          {matchingStores.length === 0 ? (
            <p className="mt-4 text-muted-foreground">No stores match.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {matchingStores.map((s) => (
                <Link
                  key={s.slug}
                  to="/store/$slug"
                  params={{ slug: s.slug }}
                  className="flex items-center gap-4 rounded-md border-2 border-foreground bg-card p-4 hover:bg-accent"
                  style={{ boxShadow: "var(--shadow-card)" }}
                >
                  <BrandLogo name={s.name} />
                  <div className="font-display font-black uppercase">{s.name}</div>
                </Link>
              ))}
            </div>
          )}

          <h2 className="mt-12 font-display text-2xl font-black uppercase">Coupons</h2>
          {matchingCoupons.length === 0 ? (
            <p className="mt-4 text-muted-foreground">No coupons match.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {matchingCoupons.map((c) => (
                <Link
                  key={c.id}
                  to="/store/$slug"
                  params={{ slug: c.store.slug }}
                  className="rounded-md border-2 border-foreground bg-card p-5 hover:bg-accent"
                  style={{ boxShadow: "var(--shadow-card)" }}
                >
                  <div className="flex items-center gap-3">
                    <BrandLogo name={c.store.name} size="sm" />
                    <div className="font-display font-black uppercase">{c.store.name}</div>
                  </div>
                  <p className="mt-3 font-black">{c.title}</p>
                  <p className="text-xs text-muted-foreground uppercase">{c.type} · {c.uses.toLocaleString()} uses</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {!query && (
        <div className="mt-12 text-center text-muted-foreground font-medium">
          Type above to search stores and coupons.
        </div>
      )}
    </div>
  );
}
