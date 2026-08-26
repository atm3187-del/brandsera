import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Tag } from "lucide-react";
import { useBlogPost, formatDate } from "@/lib/blog-data";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => {
    const title = params.slug.split("-").map((w) => (w[0]?.toUpperCase() ?? "") + w.slice(1)).join(" ");
    return {
      meta: [
        { title: `${title} — Brands Era Blog` },
        { name: "description", content: `${title} — savings guide and brand insight from Brands Era.` },
        { property: "og:title", content: `${title} — Brands Era Blog` },
        { property: "og:description", content: `${title} — savings guide from Brands Era.` },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: BlogPostPage,
});

function BlogPostPage() {
  const { slug } = Route.useParams();
  const { data: post, isLoading } = useBlogPost(slug);

  if (isLoading) {
    return <div className="mx-auto max-w-3xl px-4 py-20 text-center text-muted-foreground">Loading…</div>;
  }
  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-display text-4xl font-black uppercase">Post not found</h1>
        <Link to="/blog" className="mt-6 inline-flex items-center gap-2 rounded-md border-2 border-foreground bg-primary px-6 py-3 text-sm font-black uppercase text-primary-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to blog
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-20">
      <Link to="/blog" className="inline-flex items-center gap-2 text-xs font-black uppercase text-primary hover:underline">
        <ArrowLeft className="h-4 w-4" /> All posts
      </Link>
      <h1 className="mt-5 font-display text-4xl font-black uppercase leading-tight md:text-5xl">{post.title}</h1>
      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
        <span>{formatDate(post.createdAt)}</span>
        {post.storeSlug && (
          <Link to="/store/$slug" params={{ slug: post.storeSlug }} className="inline-flex items-center gap-1 text-primary hover:underline">
            <Tag className="h-3.5 w-3.5" /> {post.storeName}
          </Link>
        )}
      </div>
      {post.coverUrl && (
        <img src={post.coverUrl} alt={post.title} loading="lazy" className="mt-6 w-full rounded-md border-2 border-foreground object-cover" />
      )}
      {post.excerpt && <p className="mt-6 border-l-4 border-primary pl-4 text-lg font-medium">{post.excerpt}</p>}
      <div className="mt-8 space-y-4 text-base leading-relaxed text-foreground/90">
        {post.content.split(/\n{2,}/).map((para, i) => (
          <p key={i} className="whitespace-pre-line">{para}</p>
        ))}
      </div>
      {post.storeSlug && (
        <div className="mt-10 rounded-md border-2 border-foreground bg-secondary p-6" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="font-display text-lg font-black uppercase">See live {post.storeName} offers</div>
          <Link
            to="/store/$slug"
            params={{ slug: post.storeSlug }}
            className="mt-3 inline-flex items-center gap-2 rounded-md border-2 border-foreground bg-primary px-5 py-2.5 text-sm font-black uppercase text-primary-foreground"
          >
            View {post.storeName} coupons
          </Link>
        </div>
      )}
    </article>
  );
}
