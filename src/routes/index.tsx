import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { seoHead, SITE_NAME, SITE_URL, categorySlug } from "@/lib/seo";
import { Search, CheckCircle2, Flame, Zap, ShieldCheck, Copy, ChevronLeft, ChevronRight, ArrowRight, Tag, Sparkles } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { CouponCard } from "@/components/CouponCard";
import { useStoresData, categories, type Coupon, type Store, storesQueryOptions } from "@/lib/store-data";
import { useBlogPosts, formatDate } from "@/lib/blog-data";

const prefetchStores = (qc: import("@tanstack/react-query").QueryClient) => qc.ensureQueryData(storesQueryOptions).catch((err) => { console.error("[prefetch] stores failed", err); });

export const Route = createFileRoute("/")({
  loader: async ({ context }) => { await prefetchStores(context.queryClient); },
  head: () =>
    seoHead({
      path: "/",
      title: "Brands Era — Verified Coupons, Promo Codes & Deals",
      description: "Find verified promo codes and exclusive discounts from top brands, tested daily by Brands Era editors. Save loudly.",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          url: SITE_URL,
          potentialAction: { "@type": "SearchAction", target: `${SITE_URL}/search?q={search_term_string}`, "query-input": "required name=search_term_string" },
        },
        { "@context": "https://schema.org", "@type": "Organization", name: SITE_NAME, url: SITE_URL, logo: `${SITE_URL}/favicon.png` },
      ],
    }),
  component: Index,
});

const rotatingWords = ["fashion", "tech", "travel", "beauty", "everything"];

const stats = [
  { value: "5K+", label: "Verified Brands" },
  { value: "98%", label: "Success Rate" },
  { value: "$2M+", label: "Saved by Users" },
  { value: "100K+", label: "Happy Shoppers" },
];

type DealItem = Coupon & { store: Store };

function Index() {
  const { stores, allCoupons } = useStoresData();
  const { data: posts = [] } = useBlogPosts();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<string>("All");
  const [word, setWord] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setWord((w) => (w + 1) % rotatingWords.length), 2400);
    return () => clearInterval(id);
  }, []);

  const topDeals = useMemo<DealItem[]>(() => [...allCoupons].sort((a, b) => b.uses - a.uses).slice(0, 10), [allCoupons]);
  const popularBrands = stores.filter((s) => s.popular);
  const premiumBrands = stores.filter((s) => s.premium);
  const marqueeBrands = stores.slice(0, 16);

  const tabs = ["All", ...categories.filter((c) => stores.some((s) => s.category === c))];
  const tabDeals = useMemo<DealItem[]>(() => {
    const list = tab === "All" ? allCoupons : allCoupons.filter((c) => c.store.category === tab);
    return [...list].sort((a, b) => b.uses - a.uses).slice(0, 6);
  }, [allCoupons, tab]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/search", search: { q: query || undefined } });
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b-2 border-foreground">
        <div className="pointer-events-none absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="relative mx-auto max-w-5xl px-4 pt-16 pb-14 text-center md:pt-24 md:pb-20">
          <div className="animate-rise inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-xs font-black uppercase tracking-widest text-accent-foreground">
            <Sparkles className="h-3.5 w-3.5" /> Verified today
          </div>
          <h1 className="animate-rise delay-100 mt-6 font-display text-4xl font-black leading-[1.02] tracking-tight md:text-7xl">
            The best coupon codes
            <br />
            for{" "}
            <span className="relative inline-block h-[1.1em] w-[5.2em] overflow-hidden align-bottom text-left">
              {rotatingWords.map((w, i) => (
                <span
                  key={w}
                  className={`absolute inset-0 text-primary transition-all duration-500 ${i === word ? "translate-y-0 opacity-100" : i < word ? "-translate-y-full opacity-0" : "translate-y-full opacity-0"}`}
                >
                  {w}.
                </span>
              ))}
            </span>
          </h1>
          <p className="animate-rise delay-200 mx-auto mt-5 max-w-2xl text-base text-muted-foreground md:text-lg">
            Thousands of hand-tested promo codes and deals from the brands you love — updated every day.
          </p>

          <form
            onSubmit={submitSearch}
            className="animate-rise delay-300 mx-auto mt-8 flex max-w-2xl items-center gap-2 rounded-full border-2 border-foreground bg-card p-1.5 pl-4"
            style={{ boxShadow: "var(--shadow-glow)" }}
          >
            <Search className="h-5 w-5 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search a brand, e.g. Adidas, Amazon…"
              className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground"
              aria-label="Search brands"
            />
            <button type="submit" className="rounded-full bg-primary px-5 py-2.5 text-sm font-black uppercase text-primary-foreground transition hover:-translate-y-0.5">
              Search
            </button>
          </form>

          <div className="animate-rise delay-400 mt-5 flex flex-wrap items-center justify-center gap-2 text-sm">
            <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Trending:</span>
            {popularBrands.slice(0, 5).map((b) => (
              <Link key={b.slug} to="/store/$slug" params={{ slug: b.slug }} className="rounded-full border-2 border-foreground bg-card px-3 py-1 text-xs font-bold transition hover:bg-accent">
                {b.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Brand marquee */}
        {marqueeBrands.length > 0 && (
          <div className="relative border-t-2 border-foreground bg-card py-4">
            <div className="flex w-max animate-marquee gap-10 px-5">
              {[...marqueeBrands, ...marqueeBrands].map((b, i) => (
                <Link key={`${b.slug}-${i}`} to="/store/$slug" params={{ slug: b.slug }} className="flex items-center gap-2 font-display text-sm font-black uppercase tracking-wide hover:text-primary">
                  <BrandLogo name={b.name} src={b.logoUrl} size="sm" /> {b.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Today's top deals — slider */}
      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
        <SectionHeader icon={Flame} title="Today's Top Deals" sub="Most-used offers right now" link={{ to: "/stores", label: "See all" }} />
        <DealSlider deals={topDeals} />
      </section>

      {/* Category tabs */}
      <section className="border-y-2 border-foreground bg-secondary/60 py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <SectionHeader icon={Tag} title="Shop by Category" sub="Pick a tab to see the best deals in it" link={{ to: "/categories", label: "All categories" }} />
          <div className="-mx-4 mt-8 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`shrink-0 rounded-full border-2 border-foreground px-4 py-2 text-xs font-black uppercase tracking-wide transition ${
                  tab === t ? "bg-accent text-accent-foreground -translate-y-0.5" : "bg-card hover:bg-accent/50"
                }`}
                style={tab === t ? { boxShadow: "var(--shadow-card)" } : undefined}
              >
                {t}
              </button>
            ))}
          </div>
          <div key={tab} className="mt-6 space-y-4">
            {tabDeals.length === 0 ? (
              <p className="rounded-md border-2 border-dashed border-foreground/40 p-8 text-center text-sm text-muted-foreground">No deals in this category yet.</p>
            ) : (
              tabDeals.map((d, i) => (
                <div key={d.id} className="animate-rise" style={{ animationDelay: `${i * 60}ms` }}>
                  <CouponCard coupon={d} store={d.store} />
                </div>
              ))
            )}
          </div>
          {tab !== "All" && (
            <div className="mt-8 text-center">
              <Link to="/category/$slug" params={{ slug: categorySlug(tab) }} className="inline-flex items-center gap-2 rounded-full border-2 border-foreground bg-card px-6 py-3 text-sm font-black uppercase hover:bg-accent">
                All {tab} deals <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Popular stores */}
      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
        <SectionHeader icon={Zap} title="Popular Stores" sub="Shoppers' favourite brands this week" link={{ to: "/popular-stores", label: "See all" }} />
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {(popularBrands.length ? popularBrands : stores).slice(0, 12).map((b, i) => (
            <Link
              key={b.slug}
              to="/store/$slug"
              params={{ slug: b.slug }}
              className="animate-rise group flex flex-col items-center gap-3 rounded-md border-2 border-foreground bg-card p-5 text-center transition hover:-translate-y-1 hover:bg-accent/40"
              style={{ boxShadow: "var(--shadow-card)", animationDelay: `${i * 40}ms` }}
            >
              <div className="transition group-hover:animate-wiggle">
                <BrandLogo name={b.name} src={b.logoUrl} />
              </div>
              <div className="font-display text-sm font-black uppercase">{b.name}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-primary">{b.coupons.length} offers</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured brands strip */}
      {premiumBrands.length > 0 && (
        <section className="border-y-2 border-foreground bg-accent py-14 md:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <SectionHeader icon={Sparkles} title="Featured Brands" sub="Hand-picked stores with the biggest savings" link={{ to: "/featured-stores", label: "See all" }} />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {premiumBrands.slice(0, 4).map((b) => (
                <Link key={b.slug} to="/store/$slug" params={{ slug: b.slug }} className="group rounded-md border-2 border-foreground bg-card p-6 transition hover:-translate-y-1" style={{ boxShadow: "var(--shadow-card)" }}>
                  <div className="flex items-center justify-between">
                    <BrandLogo name={b.name} src={b.logoUrl} size="lg" />
                    <span className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-black uppercase text-primary-foreground">Featured</span>
                  </div>
                  <h3 className="mt-4 font-display text-xl font-black uppercase">{b.name}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{b.description}</p>
                  <div className="mt-4 inline-flex items-center gap-1 text-sm font-black uppercase text-primary">
                    View offers <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stats + why */}
      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
        <div className="grid grid-cols-2 divide-x-2 divide-y-2 divide-foreground overflow-hidden rounded-md border-2 border-foreground bg-card md:grid-cols-4 md:divide-y-0" style={{ boxShadow: "var(--shadow-glow)" }}>
          {stats.map((s) => (
            <div key={s.label} className="p-6">
              <div className="font-display text-3xl font-black text-primary md:text-5xl">{s.value}</div>
              <div className="mt-1 text-[10px] font-bold uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            { icon: ShieldCheck, title: "100% Verified", desc: "Every code is tested before it goes live so it works at checkout." },
            { icon: Zap, title: "Updated Daily", desc: "Fresh deals and exclusive discounts land every single day." },
            { icon: Copy, title: "One-click Copy", desc: "Copy the code and jump straight to the brand's site." },
          ].map((f) => (
            <div key={f.title} className="flex gap-4 rounded-md border-2 border-foreground bg-card p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-accent">
                <f.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display text-lg font-black uppercase">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Blog teaser */}
      {posts.length > 0 && (
        <section className="border-t-2 border-foreground bg-secondary/60 py-14 md:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <SectionHeader icon={CheckCircle2} title="From the Blog" sub="Savings guides and brand deep-dives" link={{ to: "/blog", label: "All posts" }} />
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {posts.slice(0, 3).map((p) => (
                <Link key={p.slug} to="/blog/$slug" params={{ slug: p.slug }} className="group overflow-hidden rounded-md border-2 border-foreground bg-card transition hover:-translate-y-1" style={{ boxShadow: "var(--shadow-card)" }}>
                  {p.coverUrl && <img src={p.coverUrl} alt={p.title} loading="lazy" className="h-40 w-full object-cover" />}
                  <div className="p-5">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-primary">{formatDate(p.createdAt)}</div>
                    <h3 className="mt-1 font-display text-lg font-black leading-tight group-hover:underline">{p.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function SectionHeader({ icon: Icon, title, sub, link }: { icon: typeof Flame; title: string; sub: string; link: { to: string; label: string } }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="flex items-center gap-3 font-display text-2xl font-black uppercase md:text-4xl">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-accent"><Icon className="h-5 w-5" /></span>
          {title}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{sub}</p>
      </div>
      <Link to={link.to} className="inline-flex items-center gap-1 text-sm font-black uppercase text-primary hover:underline">
        {link.label} <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function DealSlider({ deals }: { deals: DealItem[] }) {
  const [ref, api] = useEmblaCarousel({ align: "start", loop: deals.length > 3, dragFree: true });
  const prev = useCallback(() => api?.scrollPrev(), [api]);
  const next = useCallback(() => api?.scrollNext(), [api]);

  useEffect(() => {
    if (!api || deals.length <= 3) return;
    const id = setInterval(() => api.scrollNext(), 4500);
    return () => clearInterval(id);
  }, [api, deals.length]);

  if (deals.length === 0) return <p className="mt-8 text-sm text-muted-foreground">Deals are loading…</p>;

  return (
    <div className="relative mt-8">
      <div ref={ref} className="overflow-hidden">
        <div className="flex gap-4">
          {deals.map((d) => (
            <div key={d.id} className="min-w-0 flex-[0_0_85%] sm:flex-[0_0_48%] lg:flex-[0_0_32%]">
              <div className="flex h-full flex-col rounded-md border-2 border-foreground bg-card p-5 transition hover:-translate-y-1" style={{ boxShadow: "var(--shadow-card)" }}>
                <div className="flex items-start justify-between">
                  <BrandLogo name={d.store.name} src={d.store.logoUrl} />
                  <span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-black uppercase tracking-wide">{d.type}</span>
                </div>
                <Link to="/store/$slug" params={{ slug: d.store.slug }} className="mt-4 text-xs font-bold uppercase tracking-widest text-primary hover:underline">
                  {d.store.name}
                </Link>
                <h3 className="mt-1 font-display text-lg font-black leading-tight">{d.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{d.description}</p>
                <div className="mt-auto flex items-center justify-between border-t-2 border-dashed border-foreground/30 pt-4">
                  <Link to="/store/$slug" params={{ slug: d.store.slug }} className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-black uppercase text-primary-foreground hover:opacity-90">
                    {d.type === "Code" ? <><Copy className="h-3.5 w-3.5" /> Get Code</> : <>Get Deal <ArrowRight className="h-3.5 w-3.5" /></>}
                  </Link>
                  <span className="text-[10px] font-bold uppercase text-muted-foreground">{d.uses} used</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button onClick={prev} aria-label="Previous deals" className="rounded-full border-2 border-foreground bg-card p-2 hover:bg-accent"><ChevronLeft className="h-4 w-4" /></button>
        <button onClick={next} aria-label="Next deals" className="rounded-full border-2 border-foreground bg-card p-2 hover:bg-accent"><ChevronRight className="h-4 w-4" /></button>
      </div>
    </div>
  );
}
