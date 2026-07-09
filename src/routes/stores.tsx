import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Store } from "lucide-react";
import { useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { stores } from "@/lib/store-data";

export const Route = createFileRoute("/stores")({
  head: () => ({
    meta: [
      { title: "All Stores — Brands Era" },
      { name: "description", content: "Browse every verified store on Brands Era. Find coupons, deals, and discounts from thousands of brands." },
      { property: "og:title", content: "All Stores — Brands Era" },
      { property: "og:description", content: "Browse every verified store and unlock the latest coupons." },
    ],
  }),
  component: AllStoresPage,
});

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function AllStoresPage() {
  const [query, setQuery] = useState("");
  const [activeLetter, setActiveLetter] = useState<string | null>(null);

  const filtered = stores.filter((s) => {
    const matchesQuery = s.name.toLowerCase().includes(query.toLowerCase());
    const matchesLetter = activeLetter ? s.name[0].toUpperCase() === activeLetter : true;
    return matchesQuery && matchesLetter;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-20">
      <div className="text-center">
        <h1 className="font-display text-4xl font-black md:text-6xl uppercase">Browse All Stores</h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground font-medium">
          Discover thousands of verified brands and unlock exclusive deals with working coupon codes.
        </p>
      </div>

      <div className="mx-auto mt-10 flex max-w-2xl items-center gap-2 rounded-md border-2 border-foreground bg-card p-2" style={{ boxShadow: "var(--shadow-card)" }}>
        <Store className="ml-4 h-5 w-5 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search stores..."
          className="flex-1 bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground"
        />
        <button className="rounded-md bg-primary px-6 py-3 text-sm font-black uppercase text-primary-foreground hover:opacity-90">
          <Search className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => setActiveLetter(null)}
          className={`rounded-md border-2 border-foreground px-3 py-1 text-sm font-bold uppercase ${activeLetter === null ? "bg-primary text-primary-foreground" : "bg-card hover:bg-accent"}`}
        >
          All
        </button>
        {letters.map((l) => (
          <button
            key={l}
            onClick={() => setActiveLetter(l === activeLetter ? null : l)}
            className={`rounded-md border-2 border-foreground px-3 py-1 text-sm font-bold uppercase ${activeLetter === l ? "bg-primary text-primary-foreground" : "bg-card hover:bg-accent"}`}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="mt-10 flex items-center justify-between border-b-2 border-foreground pb-4">
        <h2 className="font-display text-2xl font-black uppercase">{activeLetter ? `${activeLetter} Stores` : "All Stores"}</h2>
        <span className="text-sm font-bold text-muted-foreground">{filtered.length} Stores</span>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filtered.map((s) => (
          <Link
            key={s.slug}
            to="/store/$slug"
            params={{ slug: s.slug }}
            className="group flex items-center gap-4 rounded-md border-2 border-foreground bg-card p-4 transition hover:-translate-x-0.5 hover:-translate-y-0.5"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <BrandLogo name={s.name} />
            <div>
              <div className="font-display font-black uppercase">{s.name}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-primary">{s.coupons.length} Offers</div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-12 text-center text-muted-foreground font-medium">No stores match your search.</div>
      )}
    </div>
  );
}
