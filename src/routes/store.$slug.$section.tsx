import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Copy,
  ExternalLink,
  HelpCircle,
  Info,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { useStoresData, shopUrl, storesQueryOptions } from "@/lib/store-data";
import { useBrandSections, brandSectionsQueryOptions } from "@/lib/section-data";
import { getSectionContent, getSectionTopSearches } from "@/lib/brand-content";
import { useSectionBlogPosts, formatDate, sectionBlogPostsQueryOptions } from "@/lib/blog-data";
import { getSectionSeo, getStoreSlugRedirect } from "@/lib/seo.functions";
import { breadcrumbLd, collectionLd, seoHead, titleize } from "@/lib/seo";

export const Route = createFileRoute("/store/$slug/$section")({
  loader: async ({ params, context }) => {
    const prefetch = (async () => {
      try {
        const all = await context.queryClient.ensureQueryData(storesQueryOptions);
        const store = all.find((s) => s.slug === params.slug);
        if (!store) return;
        const secs = await context.queryClient.ensureQueryData(brandSectionsQueryOptions(store.id));
        const sec = secs.find((x) => x.slug === params.section);
        if (sec) await context.queryClient.ensureQueryData(sectionBlogPostsQueryOptions(sec.id));
      } catch (err) {
        console.error("[section] prefetch failed", err);
      }
    })();
    try {
      const [data] = await Promise.all([getSectionSeo({ data: { slug: params.slug, section: params.section } }), prefetch]);
      if (data) return data;
    } catch {
      return null;
    }
    const next = await getStoreSlugRedirect({ data: { slug: params.slug } }).catch(() => null);
    if (next) throw redirect({ to: "/store/$slug/$section", params: { slug: next, section: params.section }, statusCode: 301 });
    return null;
  },

  head: ({ params, loaderData }) => {
    const path = `/store/${params.slug}/${params.section}`;
    const brand = loaderData?.store.name ?? titleize(params.slug);
    const sec = loaderData?.section.name ?? titleize(params.section);
    const title = `${brand} ${sec} Coupons & Deals — Brands Era`;
    const description =
      loaderData?.section.description ||
      `${brand} ${sec.toLowerCase()} coupons, deals, guides and top searches at Brands Era.`;
    return seoHead({
      path,
      title,
      description,
      image: loaderData?.section.image_url ?? loaderData?.store.logo_url ?? null,
      noindex: loaderData === null,
      jsonLd: [
        collectionLd(title, description, path),
        breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Stores", path: "/stores" },
          { name: brand, path: `/store/${params.slug}` },
          { name: sec, path },
        ]),
      ],
    });
  },
  component: SectionPage,
});

function SectionPage() {
  const { slug, section: sectionSlug } = Route.useParams();
  const { stores, loading } = useStoresData();
  const store = stores.find((s) => s.slug === slug);
  const { data: sections = [], isLoading: sectionsLoading } = useBrandSections(store?.id);
  const section = sections.find((s) => s.slug === sectionSlug);
  const { data: posts = [] } = useSectionBlogPosts(section?.id);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (loading || sectionsLoading) {
    return <div className="mx-auto max-w-3xl px-4 py-20 text-center font-medium text-muted-foreground">Loading…</div>;
  }

  if (!store || !section) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-display text-4xl font-black uppercase">Section not found</h1>
        <p className="mt-4 text-muted-foreground">This brand section does not exist yet.</p>
        <Link
          to="/stores"
          className="mt-6 inline-flex items-center gap-2 rounded-md border-2 border-foreground bg-primary px-6 py-3 text-sm font-black uppercase text-primary-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Browse Stores
        </Link>
      </div>
    );
  }

  const offers = store.coupons.filter((c) => c.sectionId === section.id);
  const content = getSectionContent(store, section, offers.length);
  const topSearches = getSectionTopSearches(store, section);
  const sectionUrl = section.landingUrl || shopUrl(store);
  const siblings = sections.filter((s) => s.id !== section.id);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
        <Link to="/stores" className="hover:text-primary">Stores</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/store/$slug" params={{ slug: store.slug }} className="hover:text-primary">{store.name}</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{section.name}</span>
      </nav>

      <div className="rounded-md border-2 border-foreground bg-card p-8 md:p-12" style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
          {section.imageUrl ? (
            <img
              src={section.imageUrl}
              alt={`${store.name} ${section.name}`}
              className="h-24 w-24 rounded-md border-2 border-foreground object-cover"
              loading="lazy"
            />
          ) : (
            <BrandLogo name={store.name} src={store.logoUrl} size="lg" />
          )}
          <div className="flex-1">
            <div className="inline-flex items-center gap-1 rounded-md border-2 border-foreground bg-secondary px-2.5 py-1 text-[10px] font-black uppercase tracking-wide">
              {store.name} · {section.name}
            </div>
            <h1 className="mt-2 font-display text-4xl font-black uppercase md:text-5xl">
              {store.name} {section.name}
            </h1>
            <p className="mt-2 font-medium text-muted-foreground">
              {section.description || `${store.name} ${section.name.toLowerCase()} offers, guides and the searches shoppers run most.`}
            </p>
            <a
              href={sectionUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="mt-5 inline-flex items-center gap-2 rounded-md border-2 border-foreground bg-primary px-6 py-3 text-sm font-black uppercase text-primary-foreground hover:bg-accent hover:text-accent-foreground"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <ExternalLink className="h-4 w-4" /> Shop {section.name}
            </a>
          </div>
        </div>
      </div>

      <div className="mt-12 flex items-end justify-between border-b-2 border-foreground pb-4">
        <h2 className="font-display text-2xl font-black uppercase">{section.name} coupons & deals</h2>
        <span className="text-sm font-bold text-muted-foreground">{offers.length} offers</span>
      </div>

      <div className="mt-8 space-y-4">
        {offers.length === 0 ? (
          <div className="rounded-md border-2 border-dashed border-foreground/40 bg-card p-8 text-center text-sm font-bold text-muted-foreground">
            No offers tagged to {section.name} yet — check the{" "}
            <Link to="/store/$slug" params={{ slug: store.slug }} className="text-primary underline">
              main {store.name} page
            </Link>{" "}
            for sitewide codes.
          </div>
        ) : (
          offers.map((c) => (
            <div
              key={c.id}
              className="flex flex-col gap-5 rounded-md border-2 border-foreground bg-card p-5 transition hover:-translate-y-0.5 md:flex-row md:items-center md:gap-6 md:p-6"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="flex items-center gap-4 md:w-52 md:shrink-0 md:flex-col md:items-start md:gap-3 md:border-r-2 md:border-dashed md:border-foreground/25 md:pr-6">
                <BrandLogo name={store.name} src={section.imageUrl ?? store.logoUrl} />
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
                    href={c.landingUrl || sectionUrl}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    Shop {section.name} <ExternalLink className="h-3 w-3" />
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
                    href={c.landingUrl || sectionUrl}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-md border-2 border-foreground bg-primary px-4 py-3 text-sm font-black uppercase text-primary-foreground hover:opacity-90"
                  >
                    <ExternalLink className="h-4 w-4" /> Get Deal
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <section className="mt-12 rounded-md border-2 border-foreground bg-card p-6 md:p-8" style={{ boxShadow: "var(--shadow-card)" }}>
        <h2 className="flex items-center gap-2 font-display text-2xl font-black uppercase">
          <TrendingUp className="h-5 w-5" /> Top searches for {store.name} {section.name}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The queries shoppers run most on Google for this range. Tap any row to see live results.
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

      <div className="mt-12 grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <section className="rounded-md border-2 border-foreground bg-card p-6 md:p-8" style={{ boxShadow: "var(--shadow-card)" }}>
            <h2 className="flex items-center gap-2 font-display text-2xl font-black uppercase">
              <Info className="h-5 w-5" /> About {store.name} {section.name}
            </h2>
            <div className="mt-4 space-y-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
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
              <Sparkles className="h-5 w-5" /> How to use a {section.name} offer
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
              <BookOpen className="h-5 w-5" /> {section.name} guides &amp; blog
            </h2>
            {posts.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">
                No articles for this section yet — new guides land regularly.
              </p>
            ) : (
              <div className="mt-5 space-y-3">
                {posts.map((p) => (
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
          </section>

          <section className="rounded-md border-2 border-foreground bg-card p-6 md:p-8" style={{ boxShadow: "var(--shadow-card)" }}>
            <h2 className="flex items-center gap-2 font-display text-2xl font-black uppercase">
              <HelpCircle className="h-5 w-5" /> {section.name} FAQ
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
            <h2 className="font-display text-lg font-black uppercase">More {store.name} sections</h2>
            <div className="mt-4 space-y-2">
              {siblings.length === 0 ? (
                <p className="text-sm text-muted-foreground">This is the only section so far.</p>
              ) : (
                siblings.map((s) => (
                  <Link
                    key={s.id}
                    to="/store/$slug/$section"
                    params={{ slug: store.slug, section: s.slug }}
                    className="flex items-center justify-between rounded-md border-2 border-foreground bg-background px-4 py-2 text-sm font-black uppercase hover:bg-secondary"
                  >
                    {s.name} <ChevronRight className="h-4 w-4 text-primary" />
                  </Link>
                ))
              )}
            </div>
            <Link
              to="/store/$slug"
              params={{ slug: store.slug }}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md border-2 border-foreground bg-primary px-4 py-3 text-sm font-black uppercase text-primary-foreground"
            >
              All {store.name} deals
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
