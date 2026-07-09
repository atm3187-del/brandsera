import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, CheckCircle2, Flame, Zap, ShieldCheck, Copy } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { stores, allCoupons } from "@/lib/store-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Brands Era — The Smarter Way to Save Online" },
      { name: "description", content: "Find verified promo codes and exclusive discounts from 5,000+ top brands, updated daily." },
      { property: "og:title", content: "Brands Era — The Smarter Way to Save Online" },
      { property: "og:description", content: "Verified promo codes from 5,000+ top brands." },
    ],
  }),
  component: Index,
});

const stats = [
  { value: "5K+", label: "Verified Brands" },
  { value: "98%", label: "Success Rate" },
  { value: "$2M+", label: "Saved by Users" },
  { value: "100K+", label: "Happy Shoppers" },
];

const hotDeals = stores.flatMap((s) => s.coupons.slice(0, 2).map((c) => ({ ...c, store: s }))).slice(0, 6);
const premiumBrands = stores.filter((s) => s.premium);
const popularBrands = stores.filter((s) => s.popular);
const topCoupons = [...allCoupons].sort((a, b) => b.uses - a.uses).slice(0, 5);

function Index() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b-2 border-foreground">
        <div className="pointer-events-none absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="relative mx-auto max-w-5xl px-4 pt-20 pb-16 text-center md:pt-28 md:pb-24">
          <div className="inline-flex items-center gap-2 rounded-md border-2 border-foreground bg-card px-4 py-1.5 text-xs font-black uppercase tracking-widest">
            <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Verified · July 2026
          </div>
          <h1 className="mt-8 font-display text-5xl font-black tracking-tight md:text-8xl leading-[0.95] uppercase">
            Save Loud.
            <br />
            <span className="text-primary italic">Shop Smart.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-foreground/80 md:text-lg font-medium">
            5,000+ hand-verified codes. Zero fluff. Brands Era is the loud, honest coupon feed for people who refuse to pay full price.
          </p>

          <div className="mx-auto mt-10 flex max-w-2xl items-center gap-2 rounded-md border-2 border-foreground bg-card p-2" style={{ boxShadow: "var(--shadow-glow)" }}>
            <Search className="ml-4 h-5 w-5 text-muted-foreground" />
            <input placeholder="Search for a brand (e.g. Amazon, Nike)..." className="flex-1 bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground" />
            <Link to="/stores" className="rounded-md bg-primary px-6 py-3 text-sm font-black uppercase text-primary-foreground hover:opacity-90">Find Deals</Link>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm">
            <span className="text-muted-foreground font-semibold uppercase tracking-wide">Popular:</span>
            {popularBrands.slice(0, 4).map((b) => (
              <Link
                key={b.slug}
                to="/store/$slug"
                params={{ slug: b.slug }}
                className="rounded-md border-2 border-foreground bg-card px-4 py-1 font-bold hover:bg-accent"
              >
                {b.name}
              </Link>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-0 rounded-md border-2 border-foreground bg-card p-0 md:grid-cols-4 divide-x-2 divide-y-2 md:divide-y-0 divide-foreground overflow-hidden" style={{ boxShadow: "var(--shadow-glow)" }}>
            {stats.map((s) => (
              <div key={s.label} className="p-6 text-left">
                <div className="font-display text-4xl font-black text-primary md:text-5xl">{s.value}</div>
                <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hot Deals */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
        <div className="flex items-end justify-between flex-wrap gap-4 border-b-2 border-foreground pb-4">
          <h2 className="flex items-center gap-3 font-display text-3xl font-black md:text-5xl uppercase">
            <Flame className="h-8 w-8 text-primary" /> Hot Deals Right Now
          </h2>
          <p className="text-muted-foreground font-semibold uppercase text-xs tracking-widest">Updated Daily · 07/09/2026</p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {hotDeals.map((d) => (
            <div
              key={d.id}
              className="group rounded-md border-2 border-foreground bg-card p-6 transition hover:-translate-x-0.5 hover:-translate-y-0.5"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="flex items-start justify-between">
                <BrandLogo name={d.store.name} />
                <span className="inline-flex items-center gap-1 rounded-md border-2 border-foreground bg-primary px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-primary-foreground">
                  <CheckCircle2 className="h-3 w-3" /> {d.type}
                </span>
              </div>
              <div className="mt-4 text-xs font-bold uppercase tracking-widest text-primary">{d.store.name}</div>
              <h3 className="mt-1 font-display text-xl font-black leading-tight">{d.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d.description}</p>
              <div className="mt-5 flex items-center justify-between pt-4 border-t-2 border-dashed border-foreground/30">
                <Link
                  to="/store/$slug"
                  params={{ slug: d.store.slug }}
                  className="inline-flex items-center gap-2 rounded-md border-2 border-foreground bg-accent px-4 py-2 text-sm font-black uppercase text-accent-foreground hover:bg-primary hover:text-primary-foreground"
                >
                  {d.type === "Code" ? <><Copy className="h-4 w-4" /> Get Code</> : <>Get Deal →</>}
                </Link>
                <span className="text-xs font-bold uppercase text-muted-foreground">{d.expiryDays}d left</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            to="/stores"
            className="inline-flex items-center gap-2 rounded-md border-2 border-foreground bg-card px-6 py-3 text-sm font-black uppercase hover:bg-accent"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            View All Deals →
          </Link>
        </div>
      </section>

      {/* Premium Brands */}
      <section className="border-y-2 border-foreground bg-accent/40 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl font-black md:text-5xl uppercase">Premium Brands</h2>
              <p className="mt-2 text-foreground/80 font-medium">Hand-picked stores with the highest saving potential this week.</p>
            </div>
            <Link to="/featured-stores" className="text-sm font-black uppercase text-primary hover:underline">
              Explore All Stores →
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {premiumBrands.map((b) => (
              <Link
                key={b.slug}
                to="/store/$slug"
                params={{ slug: b.slug }}
                className="group flex flex-col items-center gap-3 rounded-md border-2 border-foreground bg-card p-6 text-center transition hover:-translate-x-0.5 hover:-translate-y-0.5"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <BrandLogo name={b.name} size="lg" />
                <div className="font-display font-black uppercase">{b.name}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-primary">Verified</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
        <div className="border-b-2 border-foreground pb-4">
          <h2 className="font-display text-3xl font-black md:text-5xl uppercase">Trending Now</h2>
          <p className="mt-2 text-muted-foreground font-medium">Most-clicked coupons this week.</p>
        </div>
        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <div>
            <h3 className="mb-5 font-display text-xl font-black uppercase tracking-wide">Top Used Coupons</h3>
            <div className="space-y-3">
              {topCoupons.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center gap-4 rounded-md border-2 border-foreground bg-card p-4 transition hover:-translate-x-0.5 hover:-translate-y-0.5"
                  style={{ boxShadow: "var(--shadow-card)" }}
                >
                  <BrandLogo name={c.store.name} />
                  <div className="flex-1 min-w-0">
                    <div className="font-display font-black truncate">{c.title}</div>
                    <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {c.store.name} · {c.uses.toLocaleString()} uses
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
            <h3 className="mb-5 font-display text-xl font-black uppercase tracking-wide">Popular Brands</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {popularBrands.map((b) => (
                <Link
                  key={b.slug}
                  to="/store/$slug"
                  params={{ slug: b.slug }}
                  className="flex flex-col items-center gap-2 rounded-md border-2 border-foreground bg-card p-5 text-center hover:bg-accent"
                  style={{ boxShadow: "var(--shadow-card)" }}
                >
                  <BrandLogo name={b.name} />
                  <div className="text-sm font-display font-black uppercase">{b.name}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="border-t-2 border-foreground bg-primary text-primary-foreground py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4 text-center md:px-6">
          <h2 className="font-display text-3xl font-black md:text-6xl uppercase">Why Brands Era?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-primary-foreground/80 font-medium">
            Join thousands of smart shoppers who save money every day with verified coupon codes.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { icon: ShieldCheck, title: "100% Verified", desc: "Every code is rigorously tested before publishing to ensure it works." },
              { icon: Zap, title: "Daily Updates", desc: "Fresh deals and exclusive discounts added every single day." },
              { icon: Copy, title: "Easy to Use", desc: "One-click copy and seamless redirection for instant checkout savings." },
            ].map((f) => (
              <div key={f.title} className="rounded-md border-2 border-foreground bg-card text-card-foreground p-8 text-left" style={{ boxShadow: "var(--shadow-card)" }}>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-md border-2 border-foreground bg-accent text-accent-foreground">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-xl font-black uppercase">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
