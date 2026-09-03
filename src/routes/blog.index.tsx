import { createFileRoute, Link } from "@tanstack/react-router";
import { seoHead, collectionLd, breadcrumbLd } from "@/lib/seo";
import { BookOpen, ArrowRight } from "lucide-react";
import { useBlogPosts, formatDate } from "@/lib/blog-data";

export const Route = createFileRoute("/blog/")({
  head: () =>
    seoHead({
    path: '/blog',
    title: 'Blog — Savings Guides & Brand Insights — Brands Era',
    description: 'Savings guides, brand deep-dives and coupon tips from the Brands Era editorial team.',
    jsonLd: [collectionLd('Blog — Savings Guides & Brand Insights — Brands Era', 'Savings guides, brand deep-dives and coupon tips from the Brands Era editorial team.', '/blog'), breadcrumbLd([{ name: "Home", path: "/" }, { name: 'Blog', path: '/blog' }])]
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const { data: posts = [], isLoading } = useBlogPosts();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-20">
      <header className="border-b-2 border-foreground pb-6">
        <div className="inline-flex items-center gap-2 rounded-md border-2 border-foreground bg-secondary px-3 py-1 text-[10px] font-black uppercase tracking-widest">
          <BookOpen className="h-3.5 w-3.5 text-primary" /> Brands Era Journal
        </div>
        <h1 className="mt-4 font-display text-4xl font-black uppercase md:text-6xl">Blog</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground font-medium">
          Guides, brand deep-dives and honest advice on getting the lowest price.
        </p>
      </header>

      {isLoading ? (
        <p className="mt-10 text-sm text-muted-foreground">Loading…</p>
      ) : posts.length === 0 ? (
        <p className="mt-10 rounded-md border-2 border-dashed border-foreground/40 p-8 text-center text-sm font-bold uppercase text-muted-foreground">
          No posts published yet — check back soon.
        </p>
      ) : (
        <div className="mt-10 space-y-4">
          {posts.map((p) => (
            <Link
              key={p.id}
              to="/blog/$slug"
              params={{ slug: p.slug }}
              className="flex flex-col gap-4 rounded-md border-2 border-foreground bg-card p-6 transition hover:-translate-y-0.5 sm:flex-row sm:items-center"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-black uppercase tracking-widest text-primary">
                  {p.storeName ? `${p.storeName} · ` : ""}{formatDate(p.createdAt)}
                </div>
                <h2 className="mt-1 font-display text-2xl font-black leading-tight">{p.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-2 rounded-md border-2 border-foreground bg-secondary px-4 py-2 text-xs font-black uppercase">
                Read <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
