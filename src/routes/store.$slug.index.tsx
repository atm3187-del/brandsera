import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Copy, ArrowLeft, ExternalLink, BookOpen, HelpCircle, Info, Sparkles, TrendingUp, LayoutGrid, ChevronRight } from "lucide-react";
import { useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { useStoresData, shopUrl } from "@/lib/store-data";
import { getBrandContent, getTopSearches } from "@/lib/brand-content";
import { useStoreBlogPosts, formatDate } from "@/lib/blog-data";
import { useBrandSections } from "@/lib/section-data";



export const Route = createFileRoute("/store/$slug/")({
  head: ({ params }) => {
    const name = params.slug.split("-").map((w) => (w[0]?.toUpperCase() ?? "") + w.slice(1)).join(" ");
    return {
      meta: [
        { title: `${name} Coupons & Deals — Brands Era` },
        { name: "description", content: `Verified ${name} coupons and deals at Brands Era.` },
        { property: "og:title", content: `${name} Coupons — Brands Era` },
        { property: "og:description", content: `Verified coupons for ${name}.` },
      ],
    };
  },
  component: StorePage,
});

function StorePage() {
  const { slug } = Route.useParams();
  const { stores, loading } = useStoresData();
  const store = stores.find((s) => s.slug === slug);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { data: brandPosts = [] } = useStoreBlogPosts(store?.id);
  const { data: sections = [] } = useBrandSections(store?.id);



  if (loading) {
    return <div className="mx-auto max-w-3xl px-4 py-20 text-center text-muted-foreground font-medium">Loading…</div>;
  }
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

  const brandUrl = shopUrl(store);
  const content = getBrandContent(store);
  const topSearches = getTopSearches(store);


  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-20">
      <div className="rounded-md border-2 border-foreground bg-card p-8 md:p-12" style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
          <BrandLogo name={store.name} size="lg" />
          <div className="flex-1">
            <div className="inline-flex items-center gap-1 rounded-md border-2 border-foreground bg-primary px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-primary-foreground">
              <CheckCircle2 className="h-3 w-3" /> Verified
            </div>
            <h1 className="mt-2 font-display text-4xl font-black uppercase md:text-6xl">{store.name}</h1>
            <p className="mt-2 text-muted-foreground font-medium">{store.description}</p>
            <a
              href={brandUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-md border-2 border-foreground bg-primary px-6 py-3 text-sm font-black uppercase text-primary-foreground hover:bg-accent hover:text-accent-foreground"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <ExternalLink className="h-4 w-4" /> Visit {store.name}
            </a>
          </div>
        </div>
      </div>

      <div className="mt-12 flex items-end justify-between border-b-2 border-foreground pb-4">
      {sections.length > 0 && (
        <section className="mt-12">
          <div className="flex items-end justify-between border-b-2 border-foreground pb-4">
            <h2 className="flex items-center gap-2 font-display text-2xl font-black uppercase">
              <LayoutGrid className="h-5 w-5" /> {store.name} categories
            </h2>
            <span className="text-sm font-bold text-muted-foreground">{sections.length} sections</span>
          </div>
          <div className="mt-6 space-y-3">
            {sections.map((sec) => {
              const count = store.coupons.filter((c) => c.sectionId === sec.id).length;
              return (
                <Link
                  key={sec.id}
                  to="/store/$slug/$section"
                  params={{ slug: store.slug, section: sec.slug }}
                  className="flex items-center gap-4 rounded-md border-2 border-foreground bg-card p-5 transition hover:-translate-y-0.5 hover:bg-secondary"
                  style={{ boxShadow: "var(--shadow-card)" }}
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-display text-xl font-black uppercase leading-tight">{sec.name}</div>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {sec.description || `${store.name} ${sec.name.toLowerCase()} deals, guides and top searches.`}
                    </p>
                  </div>
                  <span className="shrink-0 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    {count} offer{count === 1 ? "" : "s"}
                  </span>
                  <ChevronRight className="h-5 w-5 shrink-0 text-primary" />
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <div className="mt-12 flex items-end justify-between border-b-2 border-foreground pb-4">
        <h2 className="font-display text-2xl font-black uppercase">Active Coupons & Deals</h2>

        <span className="text-sm font-bold text-muted-foreground">{store.coupons.length} offers</span>
      </div>

      <div className="mt-8 space-y-4">
        {store.coupons.map((c) => (
          <div
            key={c.id}
            className="flex flex-col gap-5 rounded-md border-2 border-foreground bg-card p-5 transition hover:-translate-y-0.5 md:flex-row md:items-center md:gap-6 md:p-6"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <div className="flex items-center gap-4 md:w-52 md:shrink-0 md:flex-col md:items-start md:gap-3 md:border-r-2 md:border-dashed md:border-foreground/25 md:pr-6">
              <BrandLogo name={store.name} />
              <span className="inline-flex items-center gap-1 rounded-md border-2 border-foreground bg-secondary px-2 py-0.5 text-[10px] font-black uppercase tracking-wide">
                <CheckCircle2 className="h-3 w-3 text-primary" /> {c.type}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-xl font-black leading-tight md:text-2xl">{c.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-bold uppercase text-muted-foreground">
                <span>{c.expiryDays}d left</span>
                <a
                  href={shopUrl(store, c)}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="inline-flex items-center gap-1 text-primary hover:underline"
                >
                  Shop {store.name} <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
            <div className="md:w-56 md:shrink-0">
              {c.type === "Code" && c.code ? (
                <button
                  onClick={() => copyCode(c.code!, c.id)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md border-2 border-dashed border-foreground bg-primary px-4 py-3 text-sm font-black uppercase text-primary-foreground hover:opacity-90"
                >
                  <Copy className="h-4 w-4" />
                  {copiedId === c.id ? "Copied!" : c.code}
                </button>
              ) : (
                <a
                  href={shopUrl(store, c)}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md border-2 border-foreground bg-primary px-4 py-3 text-sm font-black uppercase text-primary-foreground hover:opacity-90"
                >
                  <ExternalLink className="h-4 w-4" /> Get Deal
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Top searches on Google for this brand */}
      <section className="mt-12 rounded-md border-2 border-foreground bg-card p-6 md:p-8" style={{ boxShadow: "var(--shadow-card)" }}>
        <h2 className="flex items-center gap-2 font-display text-2xl font-black uppercase">
          <TrendingUp className="h-5 w-5" /> Top searches for {store.name}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The {store.name} coupon, deal and discount queries shoppers search most on Google. Tap any row to see live results.
        </p>
        <div className="mt-5 divide-y-2 divide-dashed divide-foreground/25 border-y-2 border-foreground/25">
          {topSearches.map((t, i) => (
            <a
              key={t.term}
              href={t.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 py-3 hover:bg-secondary"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border-2 border-foreground bg-secondary text-xs font-black">
                {i + 1}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-bold">{t.term}</span>
              <span className="shrink-0 text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t.volume}</span>
              <ExternalLink className="h-3.5 w-3.5 shrink-0 text-primary" />
            </a>
          ))}
        </div>
      </section>


      <div className="mt-16 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <section className="rounded-md border-2 border-foreground bg-card p-6 md:p-8" style={{ boxShadow: "var(--shadow-card)" }}>
            <h2 className="flex items-center gap-2 font-display text-2xl font-black uppercase">
              <Info className="h-5 w-5" /> About {store.name}
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
              {content.about.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {content.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-sm font-bold">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {h}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-md border-2 border-foreground bg-card p-6 md:p-8" style={{ boxShadow: "var(--shadow-card)" }}>
            <h2 className="flex items-center gap-2 font-display text-2xl font-black uppercase">
              <Sparkles className="h-5 w-5" /> How to use a {store.name} coupon
            </h2>
            <ol className="mt-4 space-y-3">
              {content.howTo.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 border-foreground bg-accent text-xs font-black text-accent-foreground">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="rounded-md border-2 border-foreground bg-card p-6 md:p-8" style={{ boxShadow: "var(--shadow-card)" }}>
            <h2 className="flex items-center gap-2 font-display text-2xl font-black uppercase">
              <BookOpen className="h-5 w-5" /> {store.name} guides &amp; blog
            </h2>
            {brandPosts.length > 0 && (
              <div className="mt-5 space-y-3">
                {brandPosts.map((p) => (
                  <Link
                    key={p.id}
                    to="/blog/$slug"
                    params={{ slug: p.slug }}
                    className="flex flex-col gap-2 rounded-md border-2 border-foreground bg-background p-4 hover:bg-secondary sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span className="min-w-0">
                      <span className="block font-display text-base font-black leading-tight">{p.title}</span>
                      <span className="mt-1 block text-sm text-muted-foreground">{p.excerpt}</span>
                    </span>
                    <span className="shrink-0 text-[10px] font-black uppercase tracking-widest text-primary">
                      {formatDate(p.createdAt)}
                    </span>
                  </Link>
                ))}
              </div>
            )}
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {content.articles.map((a) => (
                <article key={a.title} className="rounded-md border-2 border-foreground bg-background p-4">
                  <h3 className="font-display text-base font-black leading-tight">{a.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{a.excerpt}</p>
                  <div className="mt-3 text-[10px] font-black uppercase tracking-widest text-primary">{a.readMinutes} min read</div>
                </article>
              ))}
            </div>

          </section>

          <section className="rounded-md border-2 border-foreground bg-card p-6 md:p-8" style={{ boxShadow: "var(--shadow-card)" }}>
            <h2 className="flex items-center gap-2 font-display text-2xl font-black uppercase">
              <HelpCircle className="h-5 w-5" /> {store.name} FAQ
            </h2>
            <dl className="mt-4 divide-y-2 divide-dashed divide-foreground/30">
              {content.faqs.map((f) => (
                <div key={f.q} className="py-4 first:pt-0 last:pb-0">
                  <dt className="font-display text-base font-black">{f.q}</dt>
                  <dd className="mt-1 text-sm text-muted-foreground">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        <aside className="space-y-6">
          <div className="rounded-md border-2 border-foreground bg-card p-6" style={{ boxShadow: "var(--shadow-card)" }}>
            <h2 className="font-display text-lg font-black uppercase">{store.name} at a glance</h2>
            <dl className="mt-4 space-y-3">
              {content.facts.map((f) => (
                <div key={f.label} className="flex items-center justify-between border-b-2 border-dashed border-foreground/30 pb-2 last:border-0 last:pb-0">
                  <dt className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{f.label}</dt>
                  <dd className="font-display text-lg font-black">{f.value}</dd>
                </div>
              ))}
            </dl>
            <a
              href={brandUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md border-2 border-foreground bg-primary px-4 py-3 text-sm font-black uppercase text-primary-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <ExternalLink className="h-4 w-4" /> Visit {store.name}
            </a>
          </div>
          <div className="rounded-md border-2 border-foreground bg-accent p-6 text-accent-foreground" style={{ boxShadow: "var(--shadow-card)" }}>
            <h2 className="font-display text-lg font-black uppercase">Never miss a drop</h2>
            <p className="mt-2 text-sm font-medium">
              Save any {store.name} coupon to your favourites and we&apos;ll alert you whenever a new offer is added.
            </p>
            <Link to="/dashboard/saved" className="mt-4 inline-flex items-center gap-2 rounded-md border-2 border-foreground bg-card px-4 py-2 text-xs font-black uppercase text-foreground">
              View saved coupons
            </Link>
          </div>
        </aside>
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
