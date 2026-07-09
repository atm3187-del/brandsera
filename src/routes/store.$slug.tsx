import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Copy, ArrowLeft, ExternalLink } from "lucide-react";
import { useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { stores, allCoupons } from "@/lib/store-data";

export const Route = createFileRoute("/store/$slug")({
  head: ({ params }) => {
    const store = stores.find((s) => s.slug === params.slug);
    return {
      meta: [
        { title: store ? `${store.name} Coupons & Deals — Brands Era` : "Store — Brands Era" },
        { name: "description", content: store ? `Verified ${store.name} coupons and deals at Brands Era.` : "Store details." },
        { property: "og:title", content: store ? `${store.name} Coupons — Brands Era` : "Store" },
        { property: "og:description", content: store ? `Verified coupons for ${store.name}.` : "Store details." },
      ],
    };
  },
  component: StorePage,
});

function StorePage() {
  const { slug } = Route.useParams();
  const store = stores.find((s) => s.slug === slug);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!store) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-display text-4xl font-black uppercase">Store Not Found</h1>
        <p className="mt-4 text-muted-foreground">We could not find that store. Check the name or browse all stores.</p>
        <Link to="/stores" className="mt-6 inline-flex items-center gap-2 rounded-md border-2 border-foreground bg-primary px-6 py-3 text-sm font-black uppercase text-primary-foreground">
          <ArrowLeft className="h-4 w-4" /> Browse Stores
        </Link>
      </div>
    );
  }

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const related = stores.filter((s) => s.category === store.category && s.slug !== store.slug).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-20">
      <div className="rounded-md border-2 border-foreground bg-card p-8 md:p-12" style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
          <BrandLogo name={store.name} size="lg" />
          <div>
            <div className="inline-flex items-center gap-1 rounded-md border-2 border-foreground bg-primary px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-primary-foreground">
              <CheckCircle2 className="h-3 w-3" /> Verified
            </div>
            <h1 className="mt-2 font-display text-4xl font-black uppercase md:text-6xl">{store.name}</h1>
            <p className="mt-2 text-muted-foreground font-medium">{store.description}</p>
          </div>
        </div>
      </div>

      <div className="mt-12 flex items-end justify-between border-b-2 border-foreground pb-4">
        <h2 className="font-display text-2xl font-black uppercase">Active Coupons & Deals</h2>
        <span className="text-sm font-bold text-muted-foreground">{store.coupons.length} offers</span>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {store.coupons.map((c) => (
          <div key={c.id} className="rounded-md border-2 border-foreground bg-card p-6" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="flex items-start justify-between">
              <BrandLogo name={store.name} />
              <span className="inline-flex items-center gap-1 rounded-md border-2 border-foreground bg-primary px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-primary-foreground">
                <CheckCircle2 className="h-3 w-3" /> {c.type}
              </span>
            </div>
            <h3 className="mt-4 font-display text-xl font-black leading-tight">{c.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{c.description}</p>
            <div className="mt-5 flex items-center justify-between border-t-2 border-dashed border-foreground/30 pt-4">
              {c.type === "Code" && c.code ? (
                <button
                  onClick={() => copyCode(c.code!, c.id)}
                  className="inline-flex items-center gap-2 rounded-md border-2 border-foreground bg-accent px-4 py-2 text-sm font-black uppercase text-accent-foreground hover:bg-primary hover:text-primary-foreground"
                >
                  <Copy className="h-4 w-4" />
                  {copiedId === c.id ? "Copied!" : c.code}
                </button>
              ) : (
                <a
                  href="#"
                  className="inline-flex items-center gap-2 rounded-md border-2 border-foreground bg-accent px-4 py-2 text-sm font-black uppercase text-accent-foreground hover:bg-primary hover:text-primary-foreground"
                >
                  <ExternalLink className="h-4 w-4" /> Get Deal
                </a>
              )}
              <span className="text-xs font-bold uppercase text-muted-foreground">{c.expiryDays}d left</span>
            </div>
          </div>
        ))}
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="font-display text-2xl font-black uppercase">More in {store.category}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {related.map((s) => (
              <Link
                key={s.slug}
                to="/store/$slug"
                params={{ slug: s.slug }}
                className="flex items-center gap-3 rounded-md border-2 border-foreground bg-card p-4 hover:bg-accent"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <BrandLogo name={s.name} size="sm" />
                <span className="font-display font-black uppercase text-sm">{s.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
